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
    ? 'h-7.5 w-7.5 text-stone-700 hover:bg-stone-100'
    : 'h-9.5 w-9.5 text-stone-700 hover:bg-stone-100';
  const displayClass = size === 'sm' ? 'w-8 text-xs' : 'w-10 text-sm';

  return (
    <div className="inline-flex items-center border border-stone-200/90 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnClass} flex items-center justify-center transition-colors disabled:text-stone-300 disabled:hover:bg-transparent cursor-pointer`}
      >
        <Minus size={size === 'sm' ? 11 : 13} strokeWidth={2} />
      </button>
      <span className={`${displayClass} select-none text-center font-medium text-stone-900`}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnClass} flex items-center justify-center transition-colors disabled:text-stone-300 disabled:hover:bg-transparent cursor-pointer`}
      >
        <Plus size={size === 'sm' ? 11 : 13} strokeWidth={2} />
      </button>
    </div>
  );
}
