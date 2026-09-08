import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { searchProducts } from '../../services/productService';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SearchChip } from './SearchChip';
import { SearchResultRow } from './SearchResultRow';
import { categories } from '../../data/products';

const TRENDING = ['batik', 'heavyweight', 'tenun', 'cargo', 'linen', 'tote'];
const LISTBOX_ID = 'search-results-listbox';
const rowId = (i: number) => `search-result-${i}`;

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Search behaves like a combobox, not a form: frameless oversized input,
 * listbox results navigated with arrow keys, aria-activedescendant tracking
 * the highlighted row, Enter opens, Escape closes, count announced politely.
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useScrollLock(isOpen);
  useFocusTrap(isOpen, useRef<HTMLDivElement>(null));

  // Focus the input whenever the overlay opens.
  useEffect(() => {
    if (isOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
    setQuery('');
    setResults([]);
    setActiveIndex(0);
  }, [isOpen]);

  // Debounced search.
  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => {
      searchProducts(query)
        .then((r) => {
          setResults(r.slice(0, 8));
          setActiveIndex(0);
        })
        .finally(() => setLoading(false));
    }, 120);
    return () => window.clearTimeout(t);
  }, [query, isOpen]);

  const go = useCallback(
    (product: Product) => {
      onClose();
      navigate(`/product/${product.slug}`);
    },
    [navigate, onClose]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const p = results[activeIndex];
      if (p) go(p);
    }
  }

  const statusMessage = useMemo(() => {
    if (loading) return 'Searching.';
    if (!query.trim()) return '';
    return results.length === 1 ? '1 item found.' : `${results.length} items found.`;
  }, [loading, query, results]);

  return (
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={[
        'fixed inset-0 z-40 bg-canvas transition-opacity duration-200 ease-out',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col px-5 pt-[calc(var(--nm-header-h)+2.5rem)] sm:px-8">
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-stone-300 pb-4">
          <Search size={22} strokeWidth={1.5} className="shrink-0 text-stone-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={LISTBOX_ID}
            aria-activedescendant={results.length > 0 ? rowId(activeIndex) : undefined}
            aria-label="Search products"
            aria-autocomplete="list"
            placeholder="Search the archipelago…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-11 w-full flex-1 border-none bg-transparent text-lg sm:text-xl font-medium text-ink placeholder:text-stone-400 outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="-mr-1.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xs text-stone-500 transition-all duration-150 hover:bg-stone-100 hover:text-ink active:scale-95"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
          <p role="status" aria-live="polite" className="sr-only">
            {statusMessage}
          </p>

          {!query && (
            <div className="animate-fade-rise flex flex-col gap-6">
              <section>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  Trending Searches
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRENDING.map((term) => (
                    <SearchChip key={term} label={term} onClick={() => setQuery(term)} />
                  ))}
                </div>
              </section>
              <section className="border-t border-stone-100 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  Explore Silhouettes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(categories as readonly string[])
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <SearchChip
                        key={c}
                        label={c}
                        variant="fill"
                        onClick={() => {
                          onClose();
                          navigate(`/shop?category=${encodeURIComponent(c)}`);
                        }}
                      />
                    ))}
                </div>
              </section>
            </div>
          )}

          {query && !loading && results.length === 0 && (
            <div className="animate-fade-rise py-10 text-center">
              <p className="text-sm font-medium text-ink">No pieces match “{query}”.</p>
              <p className="mt-1.5 text-xs text-stone-500">
                Try a craft (batik), a fabric (linen), or an atelier name.
              </p>
            </div>
          )}

          {query && results.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  {results.length === 1 ? 'Search Result' : 'Search Results'}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-500">
                  {results.length} {results.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div
                id={LISTBOX_ID}
                role="listbox"
                aria-label="Search results"
                className="mt-3 flex flex-col gap-1"
              >
                {results.map((product, i) => (
                  <SearchResultRow
                    key={product.id}
                    id={rowId(i)}
                    product={product}
                    active={i === activeIndex}
                    onSelect={go}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/shop?search=${encodeURIComponent(query)}`);
                }}
                className="group mt-4 flex w-full cursor-pointer items-center justify-between border-t border-stone-100 pt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 transition-colors duration-150 hover:text-ink"
              >
                <span>
                  View all results for “{query}”
                </span>
                <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
