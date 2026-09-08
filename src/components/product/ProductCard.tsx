import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, MapPin } from 'lucide-react';
import type { Product } from '../../types';
import { formatRupiah, discountPercent, imageSource, thumbSource } from '../../utils';
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
  const { openCartDrawer, setFlyToCart } = useUIStore();

  const [wishlistPopping, setWishlistPopping] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0];
    const color = product.colors?.[0];
    addItem(product, 1, size, color);

    // Fly-to-cart ghost launches from the quick-add button, and the drawer
    // opens only after the flight has landed (~620ms).
    setFlyToCart({ id: Date.now(), from: { x: e.clientX, y: e.clientY } });
    window.setTimeout(() => openCartDrawer(), reduceMotion() ? 0 : 620);
  }

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      <div className="relative overflow-hidden bg-stone-100 aspect-[4/5]">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          {imgError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-canvas-muted p-3 text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-wider text-stone-600">
                {product.brand}
              </span>
              <span className="text-[10px] text-stone-400">{product.name}</span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-clay-600">
                {product.region}
              </span>
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden">
              {/* Primary image — sized sources: phones decode a 480px frame
                  instead of the 900px master (cheaper on low-end GPUs). */}
              <img
                src={thumbSource(imageSource(product.images[0], 300))}
                srcSet={`${thumbSource(imageSource(product.images[0], 240))} 480w, ${imageSource(product.images[0], 450)} 900w`}
                sizes="(max-width: 640px) 50vw, 300px"
                alt={product.name}
                width={480}
                height={600}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const img = e.currentTarget;
                  // Mobile variant missing (e.g. real photography without a
                  // -480 sibling): retry the master before showing the tile.
                  if (img.srcset && img.currentSrc.includes('-480')) {
                    img.srcset = imageSource(product.images[0], 450);
                    img.src = imageSource(product.images[0], 450);
                    return;
                  }
                  setImgError(true);
                }}
                className={`h-full w-full object-cover object-center transition-all duration-500 ease-editorial group-hover:scale-[1.05] ${
                  hasSecondary ? 'sm:group-hover:opacity-0' : ''
                }`}
              />
              {/* Secondary image for hover swap */}
              {hasSecondary && (
                <img
                  src={imageSource(product.images[1], 300)}
                  alt=""
                  aria-hidden="true"
                  width={480}
                  height={600}
                  loading="lazy"
                  onError={() => setTwinError(true)}
                  className="absolute inset-0 hidden h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-editorial group-hover:scale-[1.05] group-hover:opacity-100 sm:block"
                />
              )}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestSeller && !product.isNew && <Badge variant="bestseller">Best Seller</Badge>}
          {product.originalPrice && (
            <Badge variant="sale">-{discountPercent(product.price, product.originalPrice)}%</Badge>
          )}
        </div>

        {/* Wishlist toggle with pop animation */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-stone-700 shadow-2xs hover:bg-white hover:text-ink transition-all duration-150 active:scale-90 cursor-pointer"
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

        {/* Hover text overlay: product + region fade-in (desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden translate-y-[-4px] p-3 opacity-0 transition-all duration-300 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 sm:block"
        >
          <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white drop-shadow-sm">
            <MapPin size={10} strokeWidth={2.5} />
            {product.craft.atelier.split(',')[1]?.trim() ?? product.region}
          </p>
        </div>

        {/* Quick Add Overlay (Desktop) — fly-to-cart origin */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden translate-y-1.5 p-2 opacity-0 transition-all duration-200 ease-editorial group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:block">
          <button
            onClick={handleAddToCart}
            aria-label={`Quick add ${product.name} to bag`}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-ink/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas shadow-sm backdrop-blur-xs transition-colors duration-150 hover:bg-clay-600 active:scale-[0.99]"
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
          <Rating value={product.rating} size="sm" hideLabelOnMobile />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-xs sm:text-[13px] font-medium text-stone-900 hover:text-stone-600 transition-colors duration-150 line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <span className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-semibold tabular-nums text-ink">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && (
              <s className="text-[11px] tabular-nums text-stone-500">
                <span className="sr-only">Original price </span>
                {formatRupiah(product.originalPrice)}
              </s>
            )}
          </span>
          <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-clay-600 sm:inline">
            {product.region}
          </span>
        </div>
      </div>
    </div>
  );
}
