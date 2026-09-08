import { useState } from 'react';
import type { Product } from '../../types';

type ProductThumbProps = {
  product: Product;
  size?: 'sm' | 'md';
};

/**
 * Square thumbnail with brand-monogram fallback (first two letters) when the
 * image file is absent — used by cart rows and search results.
 */
export function ProductThumb({ product, size = 'sm' }: ProductThumbProps) {
  const [error, setError] = useState(false);
  const dim = size === 'sm' ? 'h-14 w-14' : 'h-16 w-16';

  if (error) {
    return (
      <div
        aria-hidden="true"
        className={`flex ${dim} shrink-0 items-center justify-center bg-stone-100 font-display text-xs font-semibold uppercase tracking-wider text-stone-500`}
      >
        {product.brand.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`${dim} shrink-0 overflow-hidden bg-stone-100`}>
      <img
        src={product.images[0]}
        alt=""
        width={112}
        height={140}
        loading="lazy"
        onError={() => setError(true)}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
