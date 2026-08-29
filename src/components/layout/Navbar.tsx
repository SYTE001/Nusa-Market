import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUIStore } from '../../stores/uiStore';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const { openCartDrawer, mobileMenuOpen, toggleMobileMenu, closeMobileMenu, searchOverlayOpen, openSearchOverlay, closeSearchOverlay } = useUIStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchOverlayOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOverlayOpen]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    closeSearchOverlay();
    closeMobileMenu();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery('');
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-medium uppercase tracking-widest transition-colors ${isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Mobile: menu */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center text-stone-700 hover:text-stone-900 lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.2em] text-stone-900 lg:static lg:translate-x-0"
            onClick={closeMobileMenu}
          >
            NusaMarket
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/shop?filter=new" className={navLinkClass}>New Arrivals</NavLink>
            <NavLink to="/shop?category=all" className={navLinkClass}>Collections</NavLink>
            <NavLink to="/#about" className={navLinkClass}>About</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={openSearchOverlay}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Search size={18} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center bg-stone-900 text-[10px] font-bold text-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCartDrawer}
              aria-label={`Cart (${totalItems} items)`}
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center bg-stone-900 text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-white pt-14 lg:hidden">
          <nav className="flex flex-col divide-y divide-stone-100">
            {[
              { to: '/shop', label: 'Shop' },
              { to: '/shop?filter=new', label: 'New Arrivals' },
              { to: '/shop?category=all', label: 'Collections' },
              { to: '/#about', label: 'About' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/cart', label: 'Your Bag' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className="px-6 py-4 text-sm font-medium text-stone-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Mobile Search */}
          <div className="px-6 pt-6">
            <form onSubmit={handleSearch} className="flex items-center border border-stone-200">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 h-10 px-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                aria-label="Search"
              />
              <button type="submit" className="flex h-10 w-10 items-center justify-center text-stone-600">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Search overlay (desktop) */}
      {searchOverlayOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={closeSearchOverlay}
        >
          <div
            className="mx-auto mt-20 max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center bg-white shadow-xl">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 h-12 px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                aria-label="Search"
              />
              <button type="submit" className="flex h-12 w-12 items-center justify-center text-stone-600 hover:text-stone-900">
                <Search size={18} />
              </button>
              <button type="button" onClick={closeSearchOverlay} className="flex h-12 w-12 items-center justify-center text-stone-600 hover:text-stone-900">
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

