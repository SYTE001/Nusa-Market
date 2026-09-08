import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'new' | 'sale' | 'bestseller' | 'featured' | 'provenance';
  className?: string;
};

const variantMap: Record<string, string> = {
  new: 'bg-ink text-canvas border border-ink',
  sale: 'bg-clay-50 text-clay-700 border border-clay-200 font-bold',
  bestseller: 'bg-stone-100 text-ink border border-stone-300/80',
  featured: 'bg-stone-50 text-stone-700 border border-stone-200',
  provenance: 'bg-gold-300/15 text-gold-600 border border-gold-300/60',
};

export function Badge({ children, variant = 'featured', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] shadow-2xs',
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
