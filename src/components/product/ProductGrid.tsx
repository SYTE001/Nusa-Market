import type { ReactNode } from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  /**
   * Optional per-card action slot rendered under the card metadata. Used by the
   * wishlist to expose "Add to Bag" at every breakpoint while keeping the exact
   * same 4:5 card as the catalog.
   */
  renderFooter?: (product: Product) => ReactNode;
};

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  renderFooter,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-11">
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p) =>
            renderFooter ? (
              <div key={p.id} className="flex flex-col">
                <ProductCard product={p} />
                <div className="mt-3">{renderFooter(p)}</div>
              </div>
            ) : (
              <ProductCard key={p.id} product={p} />
            )
          )}
    </div>
  );
}
