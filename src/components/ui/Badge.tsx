
type BadgeProps = {
  children: React.ReactNode;
  variant?: 'new' | 'sale' | 'bestseller' | 'featured';
  className?: string;
};

const variantMap: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-800',
  sale: 'bg-red-100 text-red-700',
  bestseller: 'bg-amber-100 text-amber-800',
  featured: 'bg-stone-100 text-stone-700',
};

export function Badge({ children, variant = 'featured', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
        variantMap[variant] ?? variantMap.featured,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

