import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  return (
    <BrowserRouter>
      {/* The Suspense boundary for these lazy routes lives inside Layout, around
          the outlet, so a chunk still loading does not take the header, the
          footer and the cart drawer down with it. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order/success" element={<OrderSuccessPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="case-study" element={<CaseStudyPage />} />
          <Route path="design-system" element={<DesignSystemPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                <p className="font-display text-sm font-semibold text-ink">
                  That page does not exist.
                </p>
                <Link
                  to="/"
                  className="text-xs text-stone-600 underline underline-offset-4 transition-colors duration-150 hover:text-ink"
                >
                  Return to the storefront
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
