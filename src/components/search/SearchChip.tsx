type SearchChipProps = {
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'fill';
};

export function SearchChip({ label, onClick, variant = 'outline' }: SearchChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
        variant === 'fill'
          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}
