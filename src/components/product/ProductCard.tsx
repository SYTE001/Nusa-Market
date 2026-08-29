import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
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
    e.stopPropagation();
    const size = product.sizes?.[0];
    const color = product.colors?.[0];
    addItem(product, 1, size, color);
    openCartDrawer();
  }

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  const hasSecondary = product.images.length > 1;

  return (
    <div className="group flex flex-col">
      {/* Media frame */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400 text-xs font-medium uppercase tracking-wider">
              {product.name}
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden">
              {/* Primary image */}
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] ${
                  hasSecondary ? 'group-hover:opacity-0' : ''
                }`}
              />
              {/* Secondary image for hover swap */}
              {hasSecondary && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate angle`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
                />
              )}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestSeller && !product.isNew && <Badge variant="bestseller">Best Seller</Badge>}
          {product.originalPrice && (
            <Badge variant="sale">-{discountPercent(product.price, product.originalPrice)}%</Badge>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-stone-700 shadow-2xs hover:bg-white hover:text-stone-950 transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Heart
            size={15}
            strokeWidth={1.75}
            className={isWishlisted ? 'text-red-600 fill-red-600' : 'text-stone-700'}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 opacity-0 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block z-10">
          <button
            onClick={handleAddToCart}
            className="w-full bg-stone-950/95 backdrop-blur-xs text-stone-50 py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-stone-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <Plus size={13} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {product.brand}
          </span>
          <Rating value={product.rating} count={product.reviewCount} size="sm" />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-xs sm:text-[13px] font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-xs sm:text-sm font-semibold text-stone-950">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-stone-400 line-through">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
