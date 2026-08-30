import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { filterBySearch } from '../../services/productService';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SearchChip } from './SearchChip';
import { SearchResultRow } from './SearchResultRow';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** Every term here is checked against the catalog - a chip that leads to an
    empty result page is worse than no chip at all. */
const TRENDING_SEARCHES = [
  'Heavyweight Tee',
  'Classic Tee',
  'LOKAL',
  'Boxy Tee',
];

const DISCOVERY_CATEGORIES = ['T-Shirts'];

const MAX_RESULTS = 6;
/** Keep in sync with the surface/backdrop transition duration below. */
const EXIT_DURATION = 200;

const LISTBOX_ID = 'nm-search-listbox';
const optionId = (index: number) => `nm-search-option-${index}`;

const LABEL = 'text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500';

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeSearch = searchParams.get('search') ?? '';

  const [announcement, setAnnouncement] = useState('');

  const trimmed = query.trim();

  const matches = useMemo(() => (trimmed ? filterBySearch(products, trimmed) : []), [trimmed]);
  const visibleResults = matches.slice(0, MAX_RESULTS);
  const expanded = visibleResults.length > 0;

  // The surface stays mounted so open/close is a pure CSS transition; `inert`
  // (below) keeps it out of the tab order and the a11y tree while closed.
  useScrollLock(isOpen);
  useFocusTrap(isOpen, surfaceRef, inputRef);

  /* Escape closes from anywhere while the overlay is open. */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  /* Opening the panel from a results page starts from the term that produced
     those results, pre-selected so the first keystroke replaces it. */
  useEffect(() => {
    if (!isOpen || !activeSearch) return;
    let frame = 0;
    // Runs after the focus trap has taken the input (40ms), and the selection
    // needs a frame after the seeded value commits to have anything to select.
    const timer = setTimeout(() => {
      setQuery(activeSearch);
      setActiveIndex(-1);
      frame = requestAnimationFrame(() => inputRef.current?.select());
    }, 60);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [isOpen, activeSearch]);

  /* Reset only after the exit transition, so the panel does not flash mid-close. */
  useEffect(() => {
    if (isOpen) return;
    const timer = setTimeout(() => {
      setQuery('');
      setActiveIndex(-1);
    }, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [isOpen]);

  /* A live region that updates on every keystroke turns into a running
     commentary, so only the settled result count is announced. */
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement(
        trimmed
          ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for ${trimmed}`
          : ''
      );
    }, 450);
    return () => clearTimeout(timer);
  }, [trimmed, matches.length]);

  /* Keep the keyboard-highlighted row inside the scroll viewport. */
  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const goToSearch = useCallback(
    (term: string) => {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(term)}`);
    },
    [navigate, onClose]
  );

  const goToCategory = useCallback(
    (category: string) => {
      onClose();
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    },
    [navigate, onClose]
  );

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const highlighted = activeIndex >= 0 ? visibleResults[activeIndex] : undefined;
    if (highlighted) {
      onClose();
      navigate(`/product/${highlighted.slug}`);
      return;
    }
    if (!trimmed) return;
    goToSearch(trimmed);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!visibleResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % visibleResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? visibleResults.length - 1 : i - 1));
    }
    // Home and End deliberately fall through to the input: inside a text field
    // they belong to the caret, not to the result list.
  }

  return (
    <div
      data-print-hide
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={[
        'fixed inset-0 z-50 flex items-start justify-center',
        'px-4 pb-6 pt-[calc(var(--nm-header-h)+1rem)] sm:px-6 sm:pt-[calc(var(--nm-header-h)+1.5rem)]',
        isOpen ? '' : 'pointer-events-none',
      ].join(' ')}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-stone-950/40 backdrop-blur-[3px] transition-opacity duration-200 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Search surface */}
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search NusaMarket"
        tabIndex={-1}
        className={[
          'relative flex max-h-full w-full max-w-[620px] flex-col overflow-hidden rounded-xs lg:max-w-[700px]',
          'border border-stone-200/70 bg-white shadow-[0_24px_64px_-32px_rgba(20,20,19,0.38)]',
          'transition-[opacity,transform] duration-200 ease-out focus:outline-none',
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0',
        ].join(' ')}
      >
        {/* Field — integrated, no boxed form */}
        <form onSubmit={handleSubmit} className="shrink-0" role="search">
          <div className="group flex h-[62px] items-center gap-3 border-b border-stone-200/80 px-5 transition-colors duration-150 focus-within:border-stone-900 sm:h-[76px] sm:gap-4 sm:px-8">
            <Search
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 text-stone-500 transition-colors duration-150 group-focus-within:text-stone-700"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search collection, brands, categories..."
              aria-label="Search collection, brands and categories"
              role="combobox"
              aria-expanded={expanded}
              aria-controls={expanded ? LISTBOX_ID : undefined}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full border-0 bg-transparent p-0 text-[17px] font-normal tracking-tight text-stone-950 shadow-none outline-none placeholder:tracking-normal placeholder:text-stone-500 focus:outline-none focus:ring-0 sm:text-[22px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
                className="-my-1 shrink-0 cursor-pointer rounded-xs px-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-stone-500 transition-colors duration-150 hover:text-stone-900"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="-mr-1.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xs text-stone-500 transition-all duration-150 hover:bg-stone-100 hover:text-stone-900 active:scale-95"
            >
              <X size={17} strokeWidth={1.5} />
            </button>
          </div>
        </form>

        {/* Discovery / results */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
          {/* Result count announced politely for screen reader users */}
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {!trimmed && (
            /* Keyed on `isOpen`: the surface never unmounts, so without this the
               entrance animation would only ever run once, on page load. */
            <div
              key={isOpen ? 'discovery-open' : 'discovery-closed'}
              className="animate-fade-rise flex flex-col gap-6"
            >
              <section>
                <p className={LABEL}>Trending Searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <SearchChip key={term} label={term} onClick={() => goToSearch(term)} />
                  ))}
                </div>
              </section>

              <section className="border-t border-stone-100 pt-6">
                <p className={LABEL}>Explore Silhouettes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DISCOVERY_CATEGORIES.map((category) => (
                    <SearchChip
                      key={category}
                      label={category}
                      variant="fill"
                      onClick={() => goToCategory(category)}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {trimmed && visibleResults.length > 0 && (
            <div key="results">
              <div className="flex items-baseline justify-between gap-3">
                <p className={LABEL}>{matches.length === 1 ? 'Search Result' : 'Search Results'}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-500">
                  {matches.length} {matches.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div
                id={LISTBOX_ID}
                role="listbox"
                aria-label="Search results"
                className="mt-3 flex flex-col gap-1"
              >
                {visibleResults.map((product, i) => (
                  <SearchResultRow
                    key={product.id}
                    id={optionId(i)}
                    product={product}
                    index={i}
                    active={i === activeIndex}
                    onSelect={onClose}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToSearch(trimmed)}
                className="group mt-4 flex w-full cursor-pointer items-center justify-between border-t border-stone-100 pt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500 transition-colors duration-150 hover:text-stone-950"
              >
                <span>View all {matches.length} results</span>
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          )}

          {trimmed && visibleResults.length === 0 && (
            <div key="empty" className="animate-fade-rise flex flex-col gap-5">
              <div>
                <p className="text-sm tracking-tight text-stone-900">
                  No results for <span className="font-semibold">&ldquo;{trimmed}&rdquo;</span>
                </p>
                <p className="mt-1.5 text-xs text-stone-500">Try another search or explore:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {DISCOVERY_CATEGORIES.map((category) => (
                  <SearchChip key={category} label={category} onClick={() => goToCategory(category)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
