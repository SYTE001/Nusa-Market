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

  const [wishlistPopping, setWishlistPopping] = useState(false);

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
    setWishlistPopping(true);
    toggleWishlist(product);
    setTimeout(() => setWishlistPopping(false), 250);
  }

  const hasSecondary = product.images.length > 1;

  return (
    <div className="group flex flex-col">
      {/* Refined Portrait Media Frame (4:5 ratio) */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[4/5] rounded-none">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400 text-xs font-medium uppercase tracking-wider p-2 text-center">
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
                className={`h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                  hasSecondary ? 'group-hover:opacity-0' : ''
                }`}
              />
              {/* Secondary image for hover swap */}
              {hasSecondary && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate angle`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
                />
              )}
            </div>
          )}
        </Link>

        {/* Small subtle Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestSeller && !product.isNew && <Badge variant="bestseller">Best Seller</Badge>}
          {product.originalPrice && (
            <Badge variant="sale">-{discountPercent(product.price, product.originalPrice)}%</Badge>
          )}
        </div>

        {/* Small subtle Wishlist toggle with pop animation */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-stone-700 shadow-2xs hover:bg-white hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
        >
          <Heart
            size={14}
            strokeWidth={1.75}
            className={`${
              isWishlisted ? 'text-red-600 fill-red-600' : 'text-stone-700'
            } ${wishlistPopping ? 'animate-heart-pop' : 'transition-transform duration-150'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block z-10">
          <button
            onClick={handleAddToCart}
            className="w-full bg-stone-950/95 backdrop-blur-xs text-stone-50 py-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] hover:bg-stone-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <Plus size={12} strokeWidth={2} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Balanced Product Metadata */}
      <div className="mt-2.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {product.brand}
          </span>
          <Rating value={product.rating} count={product.reviewCount} size="sm" />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-xs sm:text-[13px] font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-1 leading-snug"
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
