import { Minus, Plus } from 'lucide-react';

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
};

export function QuantitySelector({ value, min = 1, max, onChange, size = 'sm' }: QuantitySelectorProps) {
  const h = size === 'sm' ? 'h-8' : 'h-12';
  const w = size === 'sm' ? 'w-8' : 'w-11';

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={`inline-flex items-center border border-stone-300 bg-white ${h}`}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`flex ${h} ${w} items-center justify-center text-stone-600 transition-colors duration-150 hover:text-ink disabled:opacity-40 cursor-pointer`}
      >
        <Minus size={size === 'sm' ? 13 : 15} strokeWidth={2} />
      </button>
      <span
        aria-live="polite"
        className={`min-w-8 text-center text-xs font-semibold tabular-nums text-ink ${size === 'md' ? 'text-sm' : ''}`}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`flex ${h} ${w} items-center justify-center text-stone-600 transition-colors duration-150 hover:text-ink disabled:opacity-40 cursor-pointer`}
      >
        <Plus size={size === 'sm' ? 13 : 15} strokeWidth={2} />
      </button>
    </div>
  );
}
