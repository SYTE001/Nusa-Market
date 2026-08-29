import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { products } from '../data/products';
import { formatRupiah } from '../utils';
import { Rating } from '../components/ui/Rating';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export default function WishlistPage() {
  const navigate = useNavigate();
  const ids = useWishlistStore((s) => s.ids);
  const removeWishlist = useWishlistStore((s) => s.removeWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  // Resolve products from IDs
  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  function handleAddToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
    openCartDrawer();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-500">
        Wishlist
        {wishlistProducts.length > 0 && (
          <span className="ml-2 text-stone-400">({wishlistProducts.length})</span>
        )}
      </h1>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          type="wishlist"
          action={{ label: 'Continue Shopping', onClick: () => navigate('/shop') }}
        />
      ) : (
        <div className="flex flex-col divide-y divide-stone-100">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="flex gap-4 py-5">
              {/* Image */}
              <Link to={`/product/${product.slug}`} className="shrink-0">
                <div className="h-24 w-20 overflow-hidden bg-stone-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">{product.brand}</p>
                  <Link to={`/product/${product.slug}`} className="text-sm font-medium text-stone-900 hover:underline">
                    {product.name}
                  </Link>
                  <div className="mt-1">
                    <Rating value={product.rating} count={product.reviewCount} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-stone-900">{formatRupiah(product.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={() => handleAddToCart(product.id)}>
                    Add to Bag
                  </Button>
                  <button
                    onClick={() => removeWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Heart size={12} fill="currentColor" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

