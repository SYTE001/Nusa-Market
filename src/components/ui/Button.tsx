import React from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type SharedProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonElementProps = SharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never;
    loading?: boolean;
  };

type LinkElementProps = SharedProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    /**
     * Renders the button as a router link. Navigation buttons must use this
     * rather than being wrapped in a <Link>, which would nest a <button>
     * inside an <a> - invalid interactive content, and a double tab stop.
     */
    to: string;
    loading?: never;
  };

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-stone-950 text-stone-50 hover:bg-stone-800 active:bg-stone-900 disabled:bg-stone-200 disabled:text-stone-400 shadow-xs',
  secondary:
    'border border-stone-300 text-stone-900 bg-white hover:border-stone-900 hover:bg-stone-50 active:bg-stone-100 disabled:border-stone-200 disabled:text-stone-400 shadow-2xs',
  ghost:
    'text-stone-700 hover:bg-stone-100/80 hover:text-stone-900 active:bg-stone-200/60 disabled:text-stone-400',
  danger:
    'bg-stone-900 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white disabled:bg-stone-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[11px] gap-1.5 tracking-[0.08em]',
  md: 'h-10 px-5 text-xs gap-2 tracking-[0.08em]',
  lg: 'h-12 px-7 text-xs gap-2.5 tracking-[0.1em]',
};

function composeClasses({ variant = 'primary', size = 'md', fullWidth = false, className = '' }: SharedProps) {
  return [
    'inline-flex items-center justify-center font-semibold uppercase transition-all duration-150 select-none cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99]',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonElementProps | LinkElementProps) {
  if (props.to !== undefined) {
    const { to, variant, size, fullWidth, className, children, ...rest } = props;
    return (
      <Link to={to} className={composeClasses({ variant, size, fullWidth, className })} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant, size, fullWidth, className, children, loading = false, disabled, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={composeClasses({ variant, size, fullWidth, className })}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 h-3.5 w-3.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
