import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import type { Product, FilterState } from '../types';
import { getProducts } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { categories } from '../data/products';

const PRICE_RANGES = [
  { label: 'All Price Tiers', value: 'all' },
  { label: 'Under Rp 100.000', value: 'under100' },
  { label: 'Rp 100.000 – Rp 250.000', value: '100-250' },
  { label: 'Rp 250.000 – Rp 500.000', value: '250-500' },
  { label: 'Above Rp 500.000', value: 'above500' },
];

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 'all' },
  { label: '★ 4.0 & Above', value: '4' },
  { label: '★ 4.5 & Above', value: '4.5' },
];

const SORT_OPTIONS = [
  { label: 'Featured Curations', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
];

function filterProducts(products: Product[], filters: FilterState): Product[] {
  let result = [...products];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Category
  if (filters.category && filters.category !== 'All') {
    result = result.filter((p) => p.category === filters.category);
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

  const filters = useMemo<FilterState>(
    () => ({
      category: searchParams.get('category') ?? 'All',
      priceRange: searchParams.get('price') ?? 'all',
      rating: searchParams.get('rating') ?? 'all',
      sort: searchParams.get('sort') ?? 'featured',
      search: searchParams.get('search') ?? '',
    }),
    [searchParams]
  );

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setAllProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => filterProducts(allProducts, filters), [allProducts, filters]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'all' || value === 'featured' || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.priceRange !== 'all' ||
    filters.rating !== 'all' ||
    filters.sort !== 'featured' ||
    Boolean(filters.search);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            NusaMarket Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-950 mt-1">
            {filters.search
              ? `Results for "${filters.search}"`
              : filters.category !== 'All'
              ? filters.category
              : 'All Garments & Goods'}
          </h1>
        </div>

        {!loading && !error && (
          <span className="text-xs font-medium text-stone-500">
            Showing <strong className="text-stone-950 font-semibold">{filtered.length}</strong> {filtered.length === 1 ? 'piece' : 'pieces'}
          </span>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {(categories as readonly string[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-all cursor-pointer ${
                filters.category === cat
                  ? 'bg-stone-950 text-stone-50 shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/90 hover:border-stone-400 hover:text-stone-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mr-1 hidden sm:flex">
              <SlidersHorizontal size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Refine:</span>
            </div>

            {/* Price Filter */}
            <select
              value={filters.priceRange}
              onChange={(e) => setFilter('price', e.target.value)}
              aria-label="Filter by price"
              className="h-9 border border-stone-300/90 bg-white px-3 text-xs text-stone-800 font-medium focus:outline-none focus:border-stone-950 cursor-pointer shadow-2xs"
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={filters.rating}
              onChange={(e) => setFilter('rating', e.target.value)}
              aria-label="Filter by rating"
              className="h-9 border border-stone-300/90 bg-white px-3 text-xs text-stone-800 font-medium focus:outline-none focus:border-stone-950 cursor-pointer shadow-2xs"
            >
              {RATING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-stone-400 hidden sm:flex">
              <ArrowUpDown size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Sort:</span>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              aria-label="Sort products"
              className="h-9 border border-stone-300/90 bg-white px-3 text-xs text-stone-800 font-medium focus:outline-none focus:border-stone-950 cursor-pointer shadow-2xs"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters pill list */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60 text-xs">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Active:</span>
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                {filters.category}
                <button
                  onClick={() => setFilter('category', 'All')}
                  className="text-stone-400 hover:text-stone-900 cursor-pointer"
                  aria-label={`Remove category filter ${filters.category}`}
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
                  className="text-stone-400 hover:text-stone-900 cursor-pointer"
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
                  className="text-stone-400 hover:text-stone-900 cursor-pointer"
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
                  className="text-stone-400 hover:text-stone-900 cursor-pointer"
                  aria-label="Clear search term"
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
          action={{ label: 'Try Again', onClick: () => window.location.reload() }}
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
