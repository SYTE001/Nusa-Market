import { Star } from 'lucide-react';

type RatingProps = {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
};

export function Rating({ value, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 12 : 16;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;
          return (
            <div key={i} className="relative">
              <Star
                size={starSize}
                className="text-stone-200"
                fill="currentColor"
              />
              {(filled || half) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star size={starSize} className="text-amber-400" fill="currentColor" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className={`text-stone-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {value.toFixed(1)}
        {count !== undefined && <span className="ml-1">({count})</span>}
      </span>
    </div>
  );
}

