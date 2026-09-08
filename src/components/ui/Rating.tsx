import { Star } from 'lucide-react';

type RatingProps = {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
  hideLabelOnMobile?: boolean;
};

export function Rating({ value, count, size = 'sm', className = '', hideLabelOnMobile }: RatingProps) {
  const iconSize = size === 'sm' ? 11 : 13;
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={count !== undefined ? `Rated ${value} out of 5 from ${count} reviews` : `Rated ${value} out of 5`}
    >
      <span className="flex items-center gap-px" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={iconSize}
            className={
              i <= Math.round(value)
                ? 'fill-clay-500 text-clay-500'
                : 'fill-stone-200 text-stone-200'
            }
          />
        ))}
      </span>
      {count !== undefined && (
        <span
          className={`text-[10px] font-medium text-stone-500 tabular-nums ${
            hideLabelOnMobile ? 'hidden xs:inline' : ''
          }`}
        >
          ({count})
        </span>
      )}
    </span>
  );
}
