import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUIStore } from '../../stores/uiStore';
import { useScrollLock } from '../../hooks/useScrollLock';
import { SearchModal } from '../search/SearchModal';

const MOBILE_MENU_ID = 'mobile-navigation';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const {
    openCartDrawer,
    closeCartDrawer,
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

  // Publish the real header height so page content, anchor offsets and the
  // search overlay reserve exactly the space the fixed header occupies
  // (announcement bar + nav row, which differ per breakpoint).
  // Before paint, not after: the first frame would otherwise lay the page out
  // against the CSS fallback and visibly jump once the real height arrives.
  useLayoutEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty('--nm-header-h', `${element.offsetHeight}px`);
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useScrollLock(mobileMenuOpen);

  // Escape closes the mobile menu and hands focus back to the trigger. The
  // search overlay sits above the menu and owns Escape while it is open, so one
  // press closes one layer instead of collapsing both at once.
  useEffect(() => {
    if (!mobileMenuOpen || searchOverlayOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeMobileMenu();
      menuTriggerRef.current?.focus();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen, searchOverlayOpen, closeMobileMenu]);

  // Opening the panel moves focus into it, so Tab continues through the menu
  // rather than from the top of the document. It stays a non-modal dialog: the
  // header - and with it the close control - has to remain reachable.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const timer = window.setTimeout(() => mobilePanelRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [mobileMenuOpen]);

  // The panel and its trigger are mobile-only. Growing the viewport past `lg`
  // would otherwise leave an open, unclosable overlay behind the desktop nav.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const query = window.matchMedia('(min-width: 64rem)');
    const syncBreakpoint = () => {
      if (query.matches) closeMobileMenu();
    };
    syncBreakpoint();
    query.addEventListener('change', syncBreakpoint);
    return () => query.removeEventListener('change', syncBreakpoint);
  }, [mobileMenuOpen, closeMobileMenu]);

  // A route change - including browser back/forward - must never leave an
  // overlay hanging over the new page.
  useEffect(() => {
    closeMobileMenu();
    closeSearchOverlay();
    closeCartDrawer();
  }, [
    location.pathname,
    location.search,
    location.hash,
    closeMobileMenu,
    closeSearchOverlay,
    closeCartDrawer,
  ]);

  // Active state: one nav item at a time, resolved from path + query + hash.
  const onHome = location.pathname === '/';
  const onShop = location.pathname === '/shop';
  const onProduct = location.pathname.startsWith('/product/');
  const onWishlist = location.pathname === '/wishlist';
  const isNewArrivalsActive = onShop && searchParams.get('sort') === 'newest';
  // Only the two real homepage sections count as a section hash; anything else
  // (the skip link's #main, a stale fragment) leaves Home itself current.
  const sectionHash = location.hash === '#collections' || location.hash === '#about' ? location.hash : '';

  // `page` marks the exact current document; `true` marks the section a
  // deeper page belongs to - a product page is inside the catalog, but it is
  // not the catalog page itself.
  const navLinks = [
    { label: 'Home', to: '/', isActive: onHome && !sectionHash, current: 'page' as const },
    {
      label: 'Shop',
      to: '/shop',
      isActive: (onShop || onProduct) && !isNewArrivalsActive,
      current: onProduct ? ('true' as const) : ('page' as const),
    },
    { label: 'New Arrivals', to: '/shop?sort=newest', isActive: isNewArrivalsActive, current: 'page' as const },
    { label: 'Collections', to: '/#collections', isActive: onHome && sectionHash === '#collections', current: 'true' as const },
    { label: 'About', to: '/#about', isActive: onHome && sectionHash === '#about', current: 'true' as const },
  ];

  return (
    <>
      <header
        ref={headerRef}
        data-print-hide
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          scrolled ? 'border-b border-stone-200/80 shadow-xs' : 'border-b border-stone-200/50'
        }`}
      >
        {/* Micro announcement bar */}
        <div className="bg-stone-950 text-stone-200 text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase py-1.5 px-4 text-center select-none border-b border-stone-800">
          Complimentary shipping on all national orders above Rp 500.000
        </div>

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu trigger */}
          <button
            ref={menuTriggerRef}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            className="flex h-9 w-9 items-center justify-center text-stone-700 hover:text-stone-950 lg:hidden cursor-pointer active:scale-95 transition-transform duration-150"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-stone-950 transition-opacity duration-150 hover:opacity-80 active:opacity-70"
            onClick={closeMobileMenu}
          >
            NusaMarket
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                aria-current={link.isActive ? link.current : undefined}
                className={`relative py-1 text-xs uppercase tracking-[0.14em] transition-all duration-150 ${
                  link.isActive
                    ? 'font-bold text-stone-950'
                    : 'font-medium text-stone-500 hover:text-stone-950 active:scale-[0.98]'
                }`}
              >
                {link.label}
                {link.isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-stone-950"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={openSearchOverlay}
              aria-label="Search products"
              aria-haspopup="dialog"
              aria-expanded={searchOverlayOpen}
              className="flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
              aria-current={onWishlist ? 'page' : undefined}
              className={`relative flex h-9 w-9 items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer ${
                onWishlist ? 'text-stone-950' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Heart size={18} strokeWidth={1.75} fill={onWishlist ? 'currentColor' : 'none'} />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-950 px-1 text-[9px] font-bold text-white shadow-xs"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCartDrawer}
              aria-label={`Shopping bag, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
              aria-haspopup="dialog"
              className="relative flex h-9 w-9 items-center justify-center text-stone-600 hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-950 px-1 text-[9px] font-bold text-white shadow-xs"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation panel */}
      <div
        id={MOBILE_MENU_ID}
        ref={mobilePanelRef}
        role="dialog"
        aria-label="Site navigation"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        tabIndex={-1}
        /* Stays mounted so it can fade out, the way the cart drawer does.
           `inert` keeps its links out of the tab order and the accessibility
           tree while closed; `pointer-events-none` keeps the invisible panel
           from swallowing taps meant for the page behind it. */
        className={[
          'fixed inset-0 z-20 flex flex-col justify-between overflow-y-auto bg-white px-6',
          'pt-[calc(var(--nm-header-h)+1.5rem)] pb-8 focus:outline-none lg:hidden',
          'transition-opacity duration-200 ease-out',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-5 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={closeMobileMenu}
              aria-current={link.isActive ? link.current : undefined}
              className={`flex items-center justify-between text-lg tracking-tight transition-colors duration-150 ${
                link.isActive
                  ? 'font-bold text-stone-950'
                  : 'font-medium text-stone-600 hover:text-stone-950 active:text-stone-950'
              }`}
            >
              <span>{link.label}</span>
              {link.isActive && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-stone-950" />}
            </Link>
          ))}

          <div className="my-2 flex flex-col gap-4 border-t border-stone-200/80 pt-4">
            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              aria-current={onWishlist ? 'page' : undefined}
              className={`flex items-center justify-between text-sm transition-colors duration-150 active:scale-[0.99] ${
                onWishlist ? 'font-semibold text-stone-950' : 'font-medium text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>Wishlist ({wishlistCount})</span>
              <Heart size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              aria-current={location.pathname === '/cart' ? 'page' : undefined}
              className={`flex items-center justify-between text-sm transition-colors duration-150 active:scale-[0.99] ${
                location.pathname === '/cart'
                  ? 'font-semibold text-stone-950'
                  : 'font-medium text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>Shopping Bag ({totalItems})</span>
              <ShoppingBag size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </nav>

        <div className="mt-6 border-t border-stone-200/80 pt-6">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
            NusaMarket Editorial
          </p>
          <p className="text-xs leading-relaxed text-stone-500">
            Thoughtfully crafted essentials from independent Indonesian creators.
          </p>
        </div>
      </div>

      {/* Editorial search overlay */}
      <SearchModal isOpen={searchOverlayOpen} onClose={closeSearchOverlay} />
    </>
  );
}
