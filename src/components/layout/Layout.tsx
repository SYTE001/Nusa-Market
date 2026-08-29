import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    // If navigating to a hash on the same page, scroll to it, otherwise scroll to top
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#faf9f7]">
      <Navbar />
      <main className="flex-1 pt-14">
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
