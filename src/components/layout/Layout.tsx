import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { FlyToCartLayer } from '../cart/FlyToCartLayer';
import { useUIStore } from '../../stores/uiStore';

function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-ink" />
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef<HTMLElement>(null);
  // `location.key` below makes this effect fire on every navigation, including
  // the query-only pushes a filter dropdown performs. Remembering which
  // document was last handled tells those apart from a real page change.
  const previousDocument = useRef<string | null>(null);

  // The mobile navigation panel covers the page rather than replacing it, so the
  // content underneath has to leave the tab order and the accessibility tree
  // while it is open. The header stays interactive on purpose: it owns the
  // control that closes the panel.
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);

  useEffect(() => {
    const documentKey = location.pathname + location.hash;
    const firstRender = previousDocument.current === null;
    const sameDocument = previousDocument.current === documentKey;
    previousDocument.current = documentKey;

    if (location.hash) {
      // The hash target can live on a lazily loaded page that has not committed
      // yet, so retry across a few frames instead of silently doing nothing.
      const id = location.hash.slice(1);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let attempts = 0;
      let frame = 0;

      const scrollToTarget = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          return;
        }
        if (attempts++ < 60) frame = requestAnimationFrame(scrollToTarget);
      };

      frame = requestAnimationFrame(scrollToTarget);
      return () => cancelAnimationFrame(frame);
    }

    // Applying a filter or a sort only rewrites the query string. The catalog
    // stays put and keeps the trigger focused.
    if (sameDocument) return;

    // Back and forward keep their remembered scroll position.
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Keyboard and screen reader users continue from the new page, not from the
    // link they just followed.
    if (!firstRender) {
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash, location.key, navigationType]);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-[11px] focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-canvas"
      >
        Skip to content
      </a>

      <Navbar />

      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        inert={mobileMenuOpen}
        className="flex min-h-dvh flex-1 flex-col pt-[var(--nm-header-h)] focus:outline-none"
      >
        <div key={location.pathname} className="animate-page-enter">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <div inert={mobileMenuOpen}>
        <Footer />
      </div>

      <CartDrawer />
      <FlyToCartLayer />
    </div>
  );
}
