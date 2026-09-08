import { type ReactNode } from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { Reveal } from '../../hooks/useReveal';

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  /** Stagger the cards in on scroll reveal (IntersectionObserver, CSS). */
  animate?: boolean;
  /** Optional per-card action slot rendered under the card metadata. */
  renderFooter?: (product: Product) => ReactNode;
};

/**
 * Grid with a CSS/IntersectionObserver stagger reveal — one observer per
 * card, no animation library, and a no-op under reduced motion.
 */
export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  animate = true,
  renderFooter,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-11">
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) =>
            renderFooter ? (
              <Reveal key={p.id} className="flex flex-col" delay={animate ? (i % 4) * 55 : 0}>
                <ProductCard product={p} />
                <div className="mt-3">{renderFooter(p)}</div>
              </Reveal>
            ) : (
              <Reveal key={p.id} className="flex flex-col" delay={animate ? (i % 4) * 55 : 0}>
                <ProductCard product={p} />
              </Reveal>
            )
          )}
    </div>
  );
}
