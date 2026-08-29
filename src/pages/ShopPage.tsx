import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, FilterState } from '../types';
import { getProducts } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { categories } from '../data/products';

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under Rp100K', value: 'under100' },
  { label: 'Rp100K–250K', value: '100-250' },
  { label: 'Rp250K–500K', value: '250-500' },
  { label: 'Above Rp500K', value: 'above500' },
];

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 'all' },
  { label: '4+ Stars', value: '4' },
  { label: '4.5+ Stars', value: '4.5' },
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-low' },
  { label: 'Price: High → Low', value: 'price-high' },
  { label: 'Rating', value: 'rating' },
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

  const filters = useMemo<FilterState>(() => ({
    category: searchParams.get('category') ?? 'All',
    priceRange: searchParams.get('price') ?? 'all',
    rating: searchParams.get('rating') ?? 'all',
    sort: searchParams.get('sort') ?? 'featured',
    search: searchParams.get('search') ?? '',
  }), [searchParams]);

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
    !!filters.search;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-1">Shop</h1>
        <p className="text-2xl font-bold text-stone-900">
          {filters.search ? `"${filters.search}"` : filters.category !== 'All' ? filters.category : 'All Products'}
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {/* Category */}
        <div className="flex items-center gap-1 flex-wrap">
          {(categories as readonly string[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={`px-3 py-1 text-xs font-medium border transition-colors ${
                filters.category === cat
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 text-stone-600 hover:border-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selects */}
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          <select
            value={filters.priceRange}
            onChange={(e) => setFilter('price', e.target.value)}
            aria-label="Price filter"
            className="h-8 border border-stone-200 px-2 text-xs text-stone-700 focus:outline-none focus:border-stone-900 bg-white"
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilter('rating', e.target.value)}
            aria-label="Rating filter"
            className="h-8 border border-stone-200 px-2 text-xs text-stone-700 focus:outline-none focus:border-stone-900 bg-white"
          >
            {RATING_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            aria-label="Sort order"
            className="h-8 border border-stone-200 px-2 text-xs text-stone-700 focus:outline-none focus:border-stone-900 bg-white"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-8 px-3 text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="mb-6 text-xs text-stone-500">
          {filtered.length === 0 ? '0 products found' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Error */}
      {error && (
        <EmptyState
          type="error"
          message="We couldn't load the products."
          action={{ label: 'Try Again', onClick: () => window.location.reload() }}
        />
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          type={filters.search ? 'search' : 'filter'}
          action={{ label: 'Clear Filters', onClick: clearFilters }}
        />
      )}

      {/* Grid */}
      {!error && (
        <ProductGrid products={filtered} loading={loading} skeletonCount={8} />
      )}
    </div>
  );
}

