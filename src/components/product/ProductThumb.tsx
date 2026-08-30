import { useState } from 'react';
import type { Product } from '../../types';
import { imageSource } from '../../utils';

type ProductThumbProps = {
  product: Product;
  /** Size/shape utilities for the frame, e.g. `h-16 w-12`. */
  className?: string;
  /** Intrinsic pixel size, so the browser reserves space before load. */
  width: number;
  height: number;
  /** Subtle zoom when an ancestor marked `group` is hovered. */
  zoomOnGroupHover?: boolean;
};

/**
 * Small product image frame shared by the cart, search results and the order
 * receipt. Falls back to the brand monogram when the remote image fails, so a
 * dead image URL never leaves an empty hole in a list.
 */
export function ProductThumb({
  product,
  className = '',
  width,
  height,
  zoomOnGroupHover = false,
}: ProductThumbProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`shrink-0 overflow-hidden bg-stone-100 ${className}`}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-[9px] font-semibold uppercase tracking-widest text-stone-500">
          {product.brand.slice(0, 2)}
        </div>
      ) : (
        <img
          src={imageSource(product.images[0], width)}
          alt={product.name}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-center ${
            zoomOnGroupHover
              ? 'transition-transform duration-200 ease-out group-hover:scale-[1.04]'
              : ''
          }`}
        />
      )}
    </div>
  );
}
