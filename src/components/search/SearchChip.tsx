type SearchChipProps = {
  label: string;
  onClick: () => void;
  /** `outline` = editorial quick-search chip, `fill` = quieter secondary chip */
  variant?: 'outline' | 'fill';
};

/**
 * Compact editorial chip used for trending searches and category discovery
 * inside the search surface. Intentionally light — not a pill button.
 */
export function SearchChip({ label, onClick, variant = 'outline' }: SearchChipProps) {
  const base =
    'cursor-pointer rounded-xs px-3 py-1.5 text-xs tracking-tight transition-all duration-150 active:scale-[0.98]';
  const styles =
    variant === 'outline'
      ? 'border border-stone-200/80 bg-stone-50/60 font-medium text-stone-600 hover:-translate-y-px hover:border-stone-900 hover:bg-white hover:text-stone-950'
      : 'border border-transparent bg-stone-100/70 font-medium text-stone-500 hover:bg-stone-200/60 hover:text-stone-950';

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {label}
    </button>
  );
}
