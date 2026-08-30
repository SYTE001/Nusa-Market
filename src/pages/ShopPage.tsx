import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import type { Product, FilterState } from '../types';
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
  // would filter nothing while still counting as active, leaving a pill with an
  // empty label and a "Reset All" that appears to do nothing.
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

  // On mount the initial state already is the loading state, so there is
  // nothing for the effect to set before the request goes out.
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Retry re-runs the service call rather than reloading the document, so the
  // user keeps their filters, scroll position and cart drawer state. Unlike the
  // first load it has to put the skeletons back itself.
  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchCatalog();
  }, [fetchCatalog]);

  const filtered = useMemo(() => filterProducts(allProducts, filters), [allProducts, filters]);

  // The URL is user-editable, so resolve whatever casing arrives back to the
  // canonical catalog label before it reaches a heading or a pill.
  const activeCategory =
    (categories as readonly string[]).find(
      (c) => c.toLowerCase() === filters.category.toLowerCase()
    ) ?? filters.category;
  const categoryIsAll = activeCategory.toLowerCase() === 'all' || activeCategory === '';

  // Mirrors the heading, so a tab parked on a filtered catalog still says what
  // it is holding.
  useDocumentTitle(
    filters.search
      ? `Results for "${filters.search}" — NusaMarket`
      : categoryIsAll
      ? 'Catalog — NusaMarket'
      : `${activeCategory} — NusaMarket`
  );

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'all' || value === 'featured' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Re-picking the value that is already applied would otherwise push an
    // identical history entry the user has to press Back through.
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
    Boolean(filters.search);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            NusaMarket Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-950 mt-1">
            {filters.search
              ? `Results for "${filters.search}"`
              : categoryIsAll
              ? 'All Garments & Goods'
              : activeCategory}
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
            Showing <strong className="font-semibold text-stone-950">{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'piece' : 'pieces'}
            {!categoryIsAll && !filters.search ? ` in ${activeCategory}` : ''}
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
                    ? 'bg-stone-950 text-stone-50 shadow-xs'
                    : 'border border-stone-200/90 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-950'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dropdown controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 hidden items-center gap-1.5 text-xs text-stone-500 sm:flex">
              <SlidersHorizontal size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Refine:</span>
            </div>

            {/* Price Filter Dropdown */}
            <Dropdown
              options={PRICE_RANGES}
              value={filters.priceRange}
              onChange={(val) => setFilter('price', val)}
              ariaLabel="Filter by price tier"
              className="min-w-[155px]"
            />

            {/* Rating Filter Dropdown */}
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
              <ArrowUpDown size={14} />
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
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Active:</span>
            {!categoryIsAll && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                {activeCategory}
                <button
                  onClick={() => setFilter('category', 'All')}
                  className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 hover:text-stone-900"
                  aria-label={`Remove category filter ${activeCategory}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                {PRICE_RANGES.find((r) => r.value === filters.priceRange)?.label}
                <button
                  onClick={() => setFilter('price', 'all')}
                  className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 hover:text-stone-900"
                  aria-label="Remove price filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.rating !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                ★ {filters.rating}+ Stars
                <button
                  onClick={() => setFilter('rating', 'all')}
                  className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 hover:text-stone-900"
                  aria-label="Remove rating filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                "{filters.search}"
                <button
                  onClick={() => setFilter('search', '')}
                  className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 hover:text-stone-900"
                  aria-label="Clear search term"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.sort !== 'featured' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                {SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}
                <button
                  onClick={() => setFilter('sort', 'featured')}
                  className="-my-1 -mr-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs text-stone-500 hover:text-stone-900"
                  aria-label="Reset sorting"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-950 underline underline-offset-4 ml-1 cursor-pointer"
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
