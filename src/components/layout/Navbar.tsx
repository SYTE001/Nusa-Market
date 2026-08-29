import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUIStore } from '../../stores/uiStore';
import { products } from '../../data/products';
import { formatRupiah } from '../../utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const {
    openCartDrawer,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    searchOverlayOpen,
    openSearchOverlay,
    closeSearchOverlay,
  } = useUIStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchOverlayOpen) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [searchOverlayOpen]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    closeSearchOverlay();
    closeMobileMenu();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  }

  function handleTagClick(tag: string) {
    closeSearchOverlay();
    closeMobileMenu();
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  }

  // Live search preview matches
  const liveResults = query.trim().length > 1
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
      isActive ? 'text-stone-950 underline underline-offset-8 decoration-stone-950' : 'text-stone-500 hover:text-stone-950'
    }`;

  const POPULAR_SEARCHES = ['Heavyweight Hoodie', 'Utility Cargo', 'Canvas Tote', 'Batik Shirt', 'Oversized Tee'];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          scrolled ? 'border-b border-stone-200/80 shadow-xs' : 'border-b border-stone-200/40'
        }`}
      >
        {/* Micro announcement bar */}
        <div className="bg-stone-950 text-stone-200 text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase py-1.5 px-4 text-center select-none border-b border-stone-800">
          Complimentary shipping on all national orders above Rp 500.000
        </div>

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="flex h-9 w-9 items-center justify-center text-stone-700 hover:text-stone-950 lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-stone-950 transition-opacity hover:opacity-85"
            onClick={closeMobileMenu}
          >
            NusaMarket
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/shop?sort=newest" className={navLinkClass}>
              New Arrivals
            </NavLink>
            <NavLink to="/shop?category=all" className={navLinkClass}>
              Collections
            </NavLink>
            <NavLink to="/#about" className={navLinkClass}>
              Ethos
            </NavLink>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={openSearchOverlay}
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <Heart size={18} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-950 px-1 text-[9px] font-bold text-white shadow-xs">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCartDrawer}
              aria-label={`Shopping bag (${totalItems} items)`}
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-950 px-1 text-[9px] font-bold text-white shadow-xs">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-white pt-24 pb-8 px-6 flex flex-col justify-between lg:hidden overflow-y-auto">
          <div>
            <nav className="flex flex-col gap-6 pt-4">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/shop?sort=newest', label: 'New Arrivals' },
                { to: '/shop?category=T-Shirts', label: 'T-Shirts' },
                { to: '/shop?category=Hoodies', label: 'Hoodies' },
                { to: '/shop?category=Jackets', label: 'Outerwear' },
                { to: '/shop?category=Bags', label: 'Bags & Accessories' },
                { to: '/wishlist', label: 'Curated Wishlist' },
                { to: '/cart', label: 'Shopping Bag' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="text-lg font-medium text-stone-900 tracking-tight hover:text-stone-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-stone-200/80 pt-6 mt-6">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
              NusaMarket Editorial
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Discover thoughtfully crafted essentials from independent Indonesian creators.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Command-Style Search Modal */}
      {searchOverlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 px-4"
          onClick={closeSearchOverlay}
        >
          <div
            className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Header */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border-b border-stone-200 px-5 py-4 bg-[#fcfbfa]"
            >
              <Search size={20} className="text-stone-400 shrink-0 mr-3" strokeWidth={1.75} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collection, brands, categories..."
                className="w-full text-base text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
                aria-label="Search collection"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs font-medium text-stone-400 hover:text-stone-900 px-2 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={closeSearchOverlay}
                className="ml-2 text-stone-400 hover:text-stone-900 p-1 cursor-pointer"
                aria-label="Close search"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </form>

            {/* Content Area */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Popular tags */}
              {!query && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">
                    Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className="px-3 py-1.5 text-xs font-medium bg-stone-100/80 text-stone-700 hover:bg-stone-950 hover:text-white transition-all cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live matching results */}
              {query && liveResults.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">
                    Instant Suggestions ({liveResults.length})
                  </p>
                  <div className="divide-y divide-stone-100">
                    {liveResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={closeSearchOverlay}
                        className="flex items-center gap-4 py-3 hover:bg-stone-50/80 px-2 transition-colors group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-9 object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                            {product.brand}
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-stone-900 truncate group-hover:text-stone-600">
                            {product.name}
                          </p>
                          <p className="text-xs font-semibold text-stone-950">
                            {formatRupiah(product.price)}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="mt-4 w-full py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-center text-stone-900 border border-stone-300 hover:border-stone-900 transition-colors cursor-pointer"
                  >
                    View All Results for "{query}"
                  </button>
                </div>
              )}

              {/* No results */}
              {query && liveResults.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm font-medium text-stone-900">No products found for "{query}"</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Try searching for "hoodie", "tee", "cargo", or "jacket"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
