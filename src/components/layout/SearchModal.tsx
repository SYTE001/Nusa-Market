import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { formatRupiah } from '../../utils';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const POPULAR_SEARCHES = [
  'Heavyweight Hoodie',
  'Utility Cargo',
  'Canvas Tote',
  'Batik Shirt',
  'Oversized Tee',
];

const DISCOVERY_CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Bags', 'Accessories'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  }

  function handleTagClick(tag: string) {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
    setQuery('');
  }

  function handleCategoryClick(cat: string) {
    onClose();
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
    setQuery('');
  }

  // Live filtered suggestions
  const liveResults =
    query.trim().length > 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.brand.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
      : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-14 sm:pt-20 px-4 sm:px-6 transition-opacity duration-150 overflow-y-auto pb-10"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-[#faf9f7] shadow-2xl border border-stone-200/90 overflow-hidden animate-dropdown-enter my-auto sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Field Header */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 bg-white border-b border-stone-200/80">
          <div className="flex items-center gap-3.5 pb-3 border-b border-stone-200 focus-within:border-stone-950 transition-colors duration-150">
            <Search size={22} strokeWidth={1.5} className="text-stone-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collection, brands, categories..."
              className="w-full text-base sm:text-xl font-normal text-stone-950 placeholder:text-stone-400 bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 tracking-tight"
              aria-label="Search collection"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors px-1.5 py-0.5 cursor-pointer active:scale-95 shrink-0"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer active:scale-95 shrink-0"
              aria-label="Close search"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </form>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[62vh] overflow-y-auto">
          {/* Trending Searches state */}
          {!query && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400 mb-3">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3.5 py-1.5 text-xs font-medium bg-white text-stone-700 border border-stone-200/90 hover:border-stone-900 hover:bg-stone-950 hover:text-white transition-all duration-150 shadow-2xs cursor-pointer active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/60">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400 mb-3">
                  Explore Silhouettes
                </p>
                <div className="flex flex-wrap gap-2">
                  {DISCOVERY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="px-3 py-1 text-[11px] font-semibold text-stone-600 bg-stone-100/80 hover:bg-stone-200/80 hover:text-stone-950 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live matches state */}
          {query && liveResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
                  Instant Matches ({liveResults.length})
                </p>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                  Press Enter to view all
                </span>
              </div>

              <div className="flex flex-col divide-y divide-stone-100 bg-white border border-stone-200/80 shadow-2xs">
                {liveResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-stone-50/90 transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-14 w-11 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                        {product.brand}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-stone-900 truncate group-hover:text-stone-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-stone-950 pt-0.5">
                        {formatRupiah(product.price)}
                      </p>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-stone-300 group-hover:text-stone-950 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </Link>
                ))}
              </div>

              <button
                onClick={() => handleSubmit()}
                className="mt-4 w-full py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-center text-stone-900 bg-white border border-stone-300 hover:border-stone-950 hover:bg-stone-950 hover:text-white active:scale-[0.99] transition-all cursor-pointer shadow-2xs"
              >
                View Full Catalog Results for "{query}"
              </button>
            </div>
          )}

          {/* Empty state */}
          {query && liveResults.length === 0 && (
            <div className="py-8 px-4 text-center flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-stone-900">
                No products found matching <span className="font-bold">"{query}"</span>
              </p>
              <p className="text-xs text-stone-500 max-w-sm">
                Try searching with broader terms or explore one of our curated silhouettes below:
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {DISCOVERY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="px-3 py-1.5 text-xs font-medium bg-white text-stone-800 border border-stone-200/90 hover:border-stone-900 hover:bg-stone-950 hover:text-white transition-all shadow-2xs cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
