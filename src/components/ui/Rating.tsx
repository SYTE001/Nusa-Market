import { Star } from 'lucide-react';

type RatingProps = {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
};

export function Rating({ value, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 11 : 14;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-hidden="true">
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
      <span className={`font-medium text-stone-600 ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
        {value.toFixed(1)}
        {count !== undefined && <span className="ml-1 text-stone-400 font-normal">({count})</span>}
      </span>
    </div>
  );
}
