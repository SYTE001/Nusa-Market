import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'new' | 'sale' | 'bestseller' | 'featured';
  className?: string;
};

const variantMap: Record<string, string> = {
  new: 'bg-stone-900 text-stone-50 border border-stone-800',
  sale: 'bg-stone-50 text-stone-900 border border-stone-300 font-bold',
  bestseller: 'bg-stone-100 text-stone-900 border border-stone-300/80',
  featured: 'bg-stone-50 text-stone-700 border border-stone-200',
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
