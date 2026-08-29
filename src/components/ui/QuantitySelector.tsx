import { Minus, Plus } from 'lucide-react';

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  size?: 'sm' | 'md';
};

export function QuantitySelector({ value, min = 1, max = 99, onChange, size = 'md' }: QuantitySelectorProps) {
  const btnClass = size === 'sm'
    ? 'h-7 w-7 text-stone-600'
    : 'h-9 w-9 text-stone-600';
  const displayClass = size === 'sm' ? 'w-8 text-xs' : 'w-10 text-sm';

  return (
    <div className="inline-flex items-center border border-stone-200">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnClass} flex items-center justify-center hover:bg-stone-50 disabled:text-stone-300 transition-colors`}
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>
      <span className={`${displayClass} text-center font-medium text-stone-900`}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnClass} flex items-center justify-center hover:bg-stone-50 disabled:text-stone-300 transition-colors`}
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
}

