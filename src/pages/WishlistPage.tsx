import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
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

  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  function handleAddToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
    openCartDrawer();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Personal Curation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 mt-1">
            Saved Pieces ({wishlistProducts.length})
          </h1>
        </div>
        {wishlistProducts.length > 0 && (
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors flex items-center gap-1"
          >
            <span>Explore More</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          type="wishlist"
          action={{ label: 'Explore the Catalog', onClick: () => navigate('/shop') }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white border border-stone-200/80 overflow-hidden shadow-2xs">
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <Link to={`/product/${product.slug}`} className="block h-full w-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
                  />
                </Link>
                <button
                  onClick={() => removeWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-red-600 shadow-xs hover:bg-white transition-colors cursor-pointer"
                >
                  <Heart size={15} fill="currentColor" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                      {product.brand}
                    </span>
                    <Rating value={product.rating} count={product.reviewCount} size="sm" />
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-xs sm:text-[13px] font-medium text-stone-900 hover:underline line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs sm:text-sm font-semibold text-stone-950 mt-1">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Bag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
