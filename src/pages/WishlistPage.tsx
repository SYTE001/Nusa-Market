import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useUIStore } from '../stores/uiStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function WishlistPage() {
  useDocumentTitle('Saved Pieces — NusaMarket');

  const items = useWishlistStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-10">
        <EmptyState
          type="wishlist"
          action={{ label: 'Explore the Catalog', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 border-b border-stone-200/80 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Personal Curation
        </span>
        <h1 className="font-display mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Saved Pieces
          <span className="rounded-full bg-clay-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-clay-700">
            {items.length}
          </span>
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          Tap the heart on a card to remove a piece from your curation.
        </p>
      </div>

      <ProductGrid
        products={items}
        renderFooter={(p) => (
          <Button
            size="sm"
            variant="secondary"
            fullWidth
            onClick={() => {
              addItem(p, 1, p.sizes?.[0], p.colors?.[0]);
              openCartDrawer();
            }}
          >
            Add to Bag
          </Button>
        )}
      />
    </div>
  );
}
