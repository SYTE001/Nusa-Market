import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { formatRupiah, discountPercent } from '../../utils';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    const size = product.sizes?.[0];
    const color = product.colors?.[0];
    addItem(product, 1, size, color);
    openCartDrawer();
  }

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <Link to={`/product/${product.slug}`} tabIndex={-1} aria-hidden="true">
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400 text-xs">
              Image unavailable
            </div>
          ) : (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
          {product.originalPrice && (
            <Badge variant="sale">-{discountPercent(product.price, product.originalPrice)}%</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white/90 shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-600'}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick add */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-stone-900 py-2.5 text-center text-xs font-medium uppercase tracking-widest text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          Add to Bag
        </button>
      </div>

      {/* Info */}
      <Link to={`/product/${product.slug}`} className="mt-3 flex flex-col gap-1 px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
          {product.brand}
        </span>
        <span className="text-sm font-medium text-stone-900 leading-tight">{product.name}</span>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-stone-900">{formatRupiah(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">{formatRupiah(product.originalPrice)}</span>
          )}
        </div>
      </Link>
    </div>
  );
}

