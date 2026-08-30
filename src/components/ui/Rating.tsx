import { Star } from 'lucide-react';

type RatingProps = {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  /**
   * Drops the numeric label below `sm`, where a two-column product card is too
   * narrow to hold brand and rating on one line. The stars and the screen
   * reader text stay.
   */
  hideLabelOnMobile?: boolean;
};

export function Rating({ value, count, size = 'sm', hideLabelOnMobile = false }: RatingProps) {
  const starSize = size === 'sm' ? 11 : 14;
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <div className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;
          return (
            <div key={i} className="relative">
              <Star
                size={starSize}
                className="text-stone-200"
                fill="currentColor"
                strokeWidth={1.5}
              />
              {(filled || half) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star size={starSize} className="text-stone-800" fill="currentColor" strokeWidth={1.5} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* One clean sentence for assistive tech, whatever the visual variant is. */}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5
        {count !== undefined ? ` from ${count} reviews` : ''}
      </span>

      <span
        aria-hidden="true"
        className={`font-medium text-stone-600 ${size === 'sm' ? 'text-[11px]' : 'text-xs'} ${
          hideLabelOnMobile ? 'hidden sm:inline' : ''
        }`}
      >
        {value.toFixed(1)}
        {count !== undefined && <span className="ml-1 font-normal text-stone-500">({count})</span>}
      </span>
    </div>
  );
}
