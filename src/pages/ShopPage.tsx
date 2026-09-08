import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import type { Product, FilterState } from '../types';
import { REGIONS } from '../types';
import { getProducts, filterBySearch } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { Dropdown } from '../components/ui/Dropdown';
import { categories } from '../data/products';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type Option = { label: string; value: string };

const PRICE_RANGES: Option[] = [
  { label: 'All Price Tiers', value: 'all' },
  { label: 'Under Rp 100.000', value: 'under100' },
  { label: 'Rp 100.000 – Rp 250.000', value: '100-250' },
  { label: 'Rp 250.000 – Rp 500.000', value: '250-500' },
  { label: 'Above Rp 500.000', value: 'above500' },
];

const RATING_OPTIONS: Option[] = [
  { label: 'All Ratings', value: 'all' },
  { label: '★ 4.0 & Above', value: '4' },
  { label: '★ 4.5 & Above', value: '4.5' },
];

const SORT_OPTIONS: Option[] = [
  { label: 'Featured Curations', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
];

const REGION_OPTIONS: Option[] = [
  { label: 'All Regions', value: 'all' },
  ...REGIONS.map((r) => ({ label: r, value: r })),
];

function filterProducts(products: Product[], filters: FilterState): Product[] {
  let result = [...products];

  // Search (shared matcher — see services/productService)
  if (filters.search) {
    result = filterBySearch(result, filters.search);
  }

  // Category
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    result = result.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
  }

  // Region (archipelago filter)
  if (filters.region && filters.region.toLowerCase() !== 'all') {
    result = result.filter((p) => p.region.toLowerCase() === filters.region.toLowerCase());
  }

  // Price
  if (filters.priceRange && filters.priceRange !== 'all') {
    result = result.filter((p) => {
      if (filters.priceRange === 'under100') return p.price < 100000;
      if (filters.priceRange === '100-250') return p.price >= 100000 && p.price <= 250000;
      if (filters.priceRange === '250-500') return p.price > 250000 && p.price <= 500000;
      if (filters.priceRange === 'above500') return p.price > 500000;
      return true;
    });
  }

  // Rating
  if (filters.rating && filters.rating !== 'all') {
    const minRating = parseFloat(filters.rating);
    result = result.filter((p) => p.rating >= minRating);
  }

  // Sort
  if (filters.sort) {
    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // The URL is user-editable and shareable. A value outside the offered set
  // would filter nothing while still counting as active.
  const filters = useMemo<FilterState>(() => {
    const fromOptions = (param: string, options: Option[], fallback: string) => {
      const raw = searchParams.get(param);
      return raw && options.some((option) => option.value === raw) ? raw : fallback;
    };
    return {
      category: searchParams.get('category') ?? 'All',
      priceRange: fromOptions('price', PRICE_RANGES, 'all'),
      rating: fromOptions('rating', RATING_OPTIONS, 'all'),
      sort: fromOptions('sort', SORT_OPTIONS, 'featured'),
      search: searchParams.get('search') ?? '',
      region: fromOptions('region', REGION_OPTIONS, 'all'),
    };
  }, [searchParams]);

  const fetchCatalog = useCallback(() => {
    getProducts()
      .then((data) => {
        setAllProducts(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Retry re-runs the service call rather than reloading the document.
  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchCatalog();
  }, [fetchCatalog]);

  const filtered = useMemo(() => filterProducts(allProducts, filters), [allProducts, filters]);

  // Canonical labels for headings and pills.
  const activeCategory =
    (categories as readonly string[]).find(
      (c) => c.toLowerCase() === filters.category.toLowerCase()
    ) ?? filters.category;
  const categoryIsAll = activeCategory.toLowerCase() === 'all' || activeCategory === '';
  const activeRegion = filters.region;

  useDocumentTitle(
    filters.search
      ? `Results for "${filters.search}" — NusaMarket`
      : !categoryIsAll
      ? `${activeCategory} — NusaMarket`
      : activeRegion !== 'all'
      ? `${activeRegion} — NusaMarket`
      : 'Catalog — NusaMarket'
  );

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'all' || value === 'featured' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (next.toString() === searchParams.toString()) return;
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const hasActiveFilters =
    (filters.category.toLowerCase() !== 'all' && filters.category !== '') ||
    filters.priceRange !== 'all' ||
    filters.rating !== 'all' ||
    filters.sort !== 'featured' ||
    filters.region !== 'all' ||
    Boolean(filters.search);

  const heading = filters.search
    ? `Results for "${filters.search}"`
    : !categoryIsAll
    ? activeCategory
    : activeRegion !== 'all'
    ? `Made in ${activeRegion}`
    : 'All Garments & Goods';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            NusaMarket Catalog
          </span>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h1>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {error
            ? 'The catalog could not be loaded.'
            : loading
            ? 'Loading catalog.'
            : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'} found.`}
        </p>

        {!loading && !error && (
          <span className="text-xs font-medium text-stone-500">
            Showing <strong className="font-semibold text-ink">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'piece' : 'pieces'}
            {!categoryIsAll && !filters.search ? ` in ${activeCategory}` : ''}
            {activeRegion !== 'all' && !filters.search ? ` from ${activeRegion}` : ''}
          </span>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Category Pills */}
        <div
          role="group"
          aria-label="Filter by category"
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none"
        >
          {(categories as readonly string[]).map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setFilter('category', cat)}
                aria-pressed={active}
                className={`cursor-pointer whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-150 ${
                  active
                    ? 'bg-ink text-canvas shadow-xs'
                    : 'border border-stone-200/90 bg-white text-stone-600 hover:border-stone-400 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Region pills — the archipelago filter */}
        <div
          role="group"
          aria-label="Filter by region"
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none"
        >
          <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 sm:inline">
            Origin:
          </span>
          {REGION_OPTIONS.map((r) => {
            const active = r.value === activeRegion;
            return (
              <button
                key={r.value}
                onClick={() => setFilter('region', r.value)}
                aria-pressed={active}
                className={`flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-clay-500 text-white shadow-xs'
                    : 'border border-clay-200 bg-clay-50/50 text-clay-700 hover:border-clay-400'
                }`}
              >
                {r.value === 'all' ? 'Every Island' : r.label}
              </button>
            );
          })}
        </div>

        {/* Dropdown controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 hidden items-center gap-1.5 text-xs text-stone-500 sm:flex">
              <SlidersHorizontal size={14} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Refine:</span>
            </div>

            <Dropdown
              options={PRICE_RANGES}
              value={filters.priceRange}
              onChange={(val) => setFilter('price', val)}
              ariaLabel="Filter by price tier"
              className="min-w-[155px]"
            />

            <Dropdown
              options={RATING_OPTIONS}
              value={filters.rating}
              onChange={(val) => setFilter('rating', val)}
              ariaLabel="Filter by rating"
              className="min-w-[130px]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 text-xs text-stone-500 sm:flex">
              <ArrowUpDown size={14} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Sort:</span>
            </div>
            <Dropdown
              options={SORT_OPTIONS}
              value={filters.sort}
              onChange={(val) => setFilter('sort', val)}
              ariaLabel="Sort products"
              align="right"
              className="min-w-[170px]"
            />
          </div>
        </div>

        {/* Active filters pill list */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 border-t border-stone-200/60 pt-2 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Active:</span>
            {!categoryIsAll && (
              <FilterPill
                label={activeCategory}
                onRemove={() => setFilter('category', 'All')}
                ariaLabel={`Remove category filter ${activeCategory}`}
              />
            )}
            {activeRegion !== 'all' && (
              <FilterPill
                label={activeRegion}
                onRemove={() => setFilter('region', 'all')}
                ariaLabel={`Remove region filter ${activeRegion}`}
              />
            )}
            {filters.priceRange !== 'all' && (
              <FilterPill
                label={PRICE_RANGES.find((r) => r.value === filters.priceRange)?.label ?? ''}
                onRemove={() => setFilter('price', 'all')}
                ariaLabel="Remove price filter"
              />
            )}
            {filters.rating !== 'all' && (
              <FilterPill
                label={`★ ${filters.rating}+ Stars`}
                onRemove={() => setFilter('rating', 'all')}
                ariaLabel="Remove rating filter"
              />
            )}
            {filters.search && (
              <FilterPill
                label={`"${filters.search}"`}
                onRemove={() => setFilter('search', '')}
                ariaLabel="Clear search term"
              />
            )}
            {filters.sort !== 'featured' && (
              <FilterPill
                label={SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? ''}
                onRemove={() => setFilter('sort', 'featured')}
                ariaLabel="Reset sorting"
              />
            )}
            <button
              onClick={clearFilters}
              className="ml-1 cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-stone-500 underline underline-offset-4 transition-colors duration-150 hover:text-ink"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <EmptyState
          type="error"
          message="We couldn't load the catalog."
          action={{ label: 'Try Again', onClick: retry }}
        />
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          type={filters.search ? 'search' : 'filter'}
          action={{ label: 'Reset All Filters', onClick: clearFilters }}
        />
      )}

      {/* Product Grid */}
      {!error && (
        <ProductGrid products={filtered} loading={loading} skeletonCount={8} />
      )}
    </div>
  );
}

function FilterPill({
  label,
  onRemove,
  ariaLabel,
}: {
  label: string;
  onRemove: () => void;
  ariaLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 border border-stone-200 bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-800">
      {label}
      <button
        onClick={onRemove}
        className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 transition-colors duration-150 hover:text-stone-900"
        aria-label={ariaLabel}
      >
        <X size={12} aria-hidden="true" />
      </button>
    </span>
  );
}
