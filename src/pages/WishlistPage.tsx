import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useUIStore } from '../stores/uiStore';
import { products } from '../data/products';
import type { Product } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function WishlistPage() {
  useDocumentTitle('Saved Pieces — NusaMarket');

  const navigate = useNavigate();
  const ids = useWishlistStore((s) => s.ids);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  // Preserve the order the user saved pieces in rather than catalog order.
  const wishlistProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  function handleAddToCart(product: Product) {
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
    openCartDrawer();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-baseline justify-between border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Personal Curation
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Saved Pieces ({wishlistProducts.length})
          </h1>
        </div>
        {wishlistProducts.length > 0 && (
          <Link
            to="/shop"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors duration-150 hover:text-stone-500"
          >
            <span>Explore More</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          type="wishlist"
          action={{ label: 'Explore the Catalog', onClick: () => navigate('/shop') }}
        />
      ) : (
        <>
          <p className="mb-6 text-xs text-stone-500">
            Tap the heart on a card to remove a piece from your curation.
          </p>
          <ProductGrid
            products={wishlistProducts}
            renderFooter={(product) => (
              <Button size="sm" fullWidth onClick={() => handleAddToCart(product)}>
                Add to Bag
              </Button>
            )}
          />
        </>
      )}
    </div>
  );
}
