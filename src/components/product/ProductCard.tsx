import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../../types';
import { formatRupiah, discountPercent, imageSource } from '../../utils';
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
  const [twinError, setTwinError] = useState(false);
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

  // A hover image that fails to load must not blank the primary one.
  const hasSecondary = product.images.length > 1 && !twinError;

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
            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-600 text-xs font-medium uppercase tracking-wider p-2 text-center">
              {product.name}
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden">
              {/* Primary image */}
              <img
                src={imageSource(product.images[0], 300)}
                alt={product.name}
                width={480}
                height={600}
                loading="lazy"
                onError={() => setImgError(true)}
                className={`h-full w-full object-cover object-center transition-all duration-500 ease-editorial group-hover:scale-[1.03] ${
                  hasSecondary ? 'sm:group-hover:opacity-0' : ''
                }`}
              />
              {/* Secondary image for hover swap */}
              {/* `hidden sm:block` keeps a phone from downloading a second
                  full-size photo it can never reveal - an opacity-0 image still
                  has a box, and so is still fetched. */}
              {hasSecondary && (
                <img
                  src={imageSource(product.images[1], 300)}
                  alt=""
                  aria-hidden="true"
                  width={480}
                  height={600}
                  loading="lazy"
                  onError={() => setTwinError(true)}
                  className="absolute inset-0 hidden h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-editorial group-hover:scale-[1.03] group-hover:opacity-100 sm:block"
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
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-stone-700 shadow-2xs hover:bg-white hover:text-stone-950 transition-all duration-150 active:scale-90 cursor-pointer"
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
        {/* pointer-events-none is load-bearing: Tailwind compiles `group-hover:`
            inside `@media (hover:hover)`, so on a tablet this overlay can never be
            revealed by hover - but at opacity-0 it would still swallow the tap
            meant for the product link and quietly add to the bag. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden translate-y-1.5 p-2 opacity-0 transition-all duration-200 ease-editorial group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:block">
          <button
            onClick={handleAddToCart}
            aria-label={`Quick add ${product.name} to bag`}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-stone-950/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-50 shadow-sm backdrop-blur-xs transition-colors duration-150 hover:bg-stone-900 active:scale-[0.99]"
          >
            <Plus size={12} strokeWidth={2} aria-hidden="true" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Balanced Product Metadata */}
      <div className="mt-2.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {product.brand}
          </span>
          {/* Review count belongs on the product page - a 158px card at 360px
              has room for the stars and nothing more. */}
          <Rating value={product.rating} size="sm" hideLabelOnMobile />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-xs sm:text-[13px] font-medium text-stone-900 hover:text-stone-600 transition-colors duration-150 line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-xs sm:text-sm font-semibold tabular-nums text-stone-950">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && (
            <s className="text-[11px] tabular-nums text-stone-500">
              <span className="sr-only">Original price </span>
              {formatRupiah(product.originalPrice)}
            </s>
          )}
        </div>
      </div>
    </div>
  );
}
