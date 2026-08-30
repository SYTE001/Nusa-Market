import { Star } from 'lucide-react';
import type { Product } from '../../types';
import { getRatingBreakdown, getReviews } from '../../data/reviews';
import { Rating } from '../ui/Rating';

type ProductReviewsProps = {
  product: Product;
};

function relativeDate(daysAgo: number): string {
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 30) return `${Math.round(daysAgo / 7)} weeks ago`;
  return `${Math.round(daysAgo / 30)} months ago`;
}

/**
 * Review block for the product detail page: aggregate score, star breakdown and
 * individual notes. Reads from the local sample review set (see data/reviews).
 */
export function ProductReviews({ product }: ProductReviewsProps) {
  const reviews = getReviews(product);
  const breakdown = getRatingBreakdown(product.rating);

  return (
    <section aria-labelledby="reviews-heading" className="mt-20 border-t border-stone-200/80 pt-12">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Verified Feedback
        </span>
        <h2
          id="reviews-heading"
          className="mt-1 text-xl font-bold tracking-tight text-stone-950 sm:text-2xl"
        >
          Customer Reviews
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Aggregate + distribution */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold tracking-tight text-stone-950">
              {product.rating.toFixed(1)}
            </span>
            <div>
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <p className="mt-0.5 text-[11px] text-stone-500">
                {product.reviewCount} customer reviews
              </p>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-2">
            {breakdown.map((row) => (
              <li key={row.stars} className="flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex w-9 shrink-0 items-center gap-1 font-medium text-stone-700">
                  {row.stars}
                  <Star size={10} strokeWidth={0} className="fill-stone-400" aria-hidden="true" />
                </span>
                <span
                  role="img"
                  aria-label={`${row.stars} star: ${row.percent} percent`}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-stone-100"
                >
                  <span
                    className="block h-full rounded-full bg-stone-800"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right tabular-nums">{row.percent}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Individual notes */}
        <ul className="flex flex-col divide-y divide-stone-200/70 lg:col-span-8">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                    {review.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold tracking-tight text-stone-950">
                      {review.author}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {review.location} · {relativeDate(review.daysAgo)}
                    </p>
                  </div>
                </div>
                <Rating value={review.rating} size="sm" />
              </div>

              <div>
                <p className="text-[13px] font-semibold tracking-tight text-stone-900">
                  {review.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">{review.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 border-t border-stone-200/70 pt-4 text-[11px] text-stone-500">
        Reviews shown are sample content bundled with this demo catalog.
      </p>
    </section>
  );
}
