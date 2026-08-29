import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUIStore } from '../../stores/uiStore';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

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
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Route active state logic
  const isHomeActive = location.pathname === '/' && !location.hash;
  const isAboutActive = location.hash === '#about' || (location.pathname === '/' && location.hash === '#about');
  const isNewArrivalsActive =
    location.pathname === '/shop' && searchParams.get('sort') === 'newest';
  const isCollectionsActive =
    location.pathname === '/shop' &&
    (searchParams.get('category') === 'all' ||
      searchParams.get('category') === 'All' ||
      Boolean(searchParams.get('category')));
  const isShopActive =
    location.pathname === '/shop' && !isNewArrivalsActive && !isCollectionsActive;

  const navLinks = [
    { label: 'Home', to: '/', isActive: isHomeActive },
    { label: 'Shop', to: '/shop', isActive: isShopActive },
    { label: 'New Arrivals', to: '/shop?sort=newest', isActive: isNewArrivalsActive },
    { label: 'Collections', to: '/shop?category=All', isActive: isCollectionsActive },
    { label: 'About', to: '/#about', isActive: isAboutActive },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          scrolled ? 'border-b border-stone-200/80 shadow-xs' : 'border-b border-stone-200/50'
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
            className="flex h-9 w-9 items-center justify-center text-stone-700 hover:text-stone-950 lg:hidden cursor-pointer active:scale-95 transition-transform"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-stone-950 transition-opacity hover:opacity-80 active:opacity-70"
            onClick={closeMobileMenu}
          >
            NusaMarket
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative py-1 text-xs uppercase tracking-[0.14em] transition-all duration-150 ${
                  link.isActive
                    ? 'font-bold text-stone-950'
                    : 'font-medium text-stone-500 hover:text-stone-950 hover:opacity-90 active:scale-[0.98]'
                }`}
              >
                {link.label}
                {link.isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-950 rounded-full transition-all" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={openSearchOverlay}
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
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
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
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
        <div className="fixed inset-0 z-20 bg-white pt-24 pb-8 px-6 flex flex-col justify-between lg:hidden overflow-y-auto animate-page-enter">
          <div>
            <nav className="flex flex-col gap-5 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`text-lg tracking-tight transition-colors flex items-center justify-between ${
                    link.isActive
                      ? 'font-bold text-stone-950'
                      : 'font-medium text-stone-600 hover:text-stone-950 active:text-stone-950'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isActive && <span className="h-1.5 w-1.5 rounded-full bg-stone-950" />}
                </Link>
              ))}

              <div className="border-t border-stone-200/80 my-2 pt-4 flex flex-col gap-4">
                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors flex items-center justify-between active:scale-[0.99]"
                >
                  <span>Wishlist ({wishlistCount})</span>
                  <Heart size={16} strokeWidth={1.5} />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors flex items-center justify-between active:scale-[0.99]"
                >
                  <span>Shopping Bag ({totalItems})</span>
                  <ShoppingBag size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </nav>
          </div>

          <div className="border-t border-stone-200/80 pt-6 mt-6">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1.5">
              NusaMarket Editorial
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Thoughtfully crafted essentials from independent Indonesian creators.
            </p>
          </div>
        </div>
      )}

      {/* Redesigned Editorial Search Modal */}
      <SearchModal isOpen={searchOverlayOpen} onClose={closeSearchOverlay} />
    </>
  );
}
