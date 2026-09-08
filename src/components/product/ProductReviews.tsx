import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../types';
import { reviewsFor, ratingBreakdown } from '../../data/reviews';
import { Rating } from '../ui/Rating';

/**
 * Sample reviews with an aggregate score and a star-distribution breakdown.
 * Reviews are generated deterministically from the product id, so they stay
 * stable between renders and reloads.
 */
export function ProductReviews({ product }: { product: Product }) {
  const reviews = reviewsFor(product, 3);
  const dist = ratingBreakdown(product);
  const [shown, setShown] = useState(2);
  const visible = reviews.slice(0, shown);

  return (
    <section aria-label={`Reviews for ${product.name}`} className="mt-16 border-t border-stone-200/80 pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Aggregate column */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Wearer Notes
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold tabular-nums text-ink">
              {product.rating.toFixed(1)}
            </span>
            <Rating value={product.rating} />
          </div>
          <p className="text-xs text-stone-500">
            Based on {product.reviewCount} verified purchases.
          </p>

          {/* Star distribution */}
          <div className="mt-2 flex flex-col gap-1.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="flex w-6 items-center gap-0.5 text-[10px] font-medium text-stone-500 tabular-nums">
                  {d.stars}
                  <Star size={9} className="fill-stone-300 text-stone-300" aria-hidden="true" />
                </span>
                <div className="h-1.5 flex-1 overflow-hidden bg-stone-100">
                  <div className="h-full bg-clay-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-[10px] text-stone-400 tabular-nums">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="lg:col-span-8 flex flex-col divide-y divide-stone-100">
          {visible.map((r) => (
            <article key={r.id} className="flex flex-col gap-2 py-4 first:pt-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-50 font-display text-[11px] font-semibold text-clay-700">
                    {r.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{r.author}</p>
                    <p className="text-[10px] text-stone-500">Verified purchase · {r.date}</p>
                  </div>
                </div>
                <Rating value={r.rating} />
              </div>
              <p className="text-xs font-semibold text-stone-800">{r.title}</p>
              <p className="text-xs leading-relaxed text-stone-600">{r.body}</p>
            </article>
          ))}
          {reviews.length > shown && (
            <button
              onClick={() => setShown(reviews.length)}
              className="mt-4 self-start text-[11px] font-semibold uppercase tracking-wider text-stone-500 underline underline-offset-4 transition-colors duration-150 hover:text-ink cursor-pointer"
            >
              Read more notes
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
