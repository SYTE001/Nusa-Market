import React, { useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type SharedProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  /** Magnetic hover: the button leans toward the cursor (desktop pointers only). */
  magnetic?: boolean;
};

type ButtonElementProps = SharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never;
    loading?: boolean;
  };

type LinkElementProps = SharedProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    /** Renders the button as a router link. Navigation buttons must use this
        rather than being wrapped in a <Link> (nested interactive content). */
    to: string;
    loading?: never;
  };

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-canvas hover:bg-ink-soft active:bg-ink disabled:bg-stone-200 disabled:text-stone-400 shadow-xs',
  secondary:
    'border border-stone-300 text-ink bg-white hover:border-ink hover:bg-stone-50 active:bg-stone-100 disabled:border-stone-200 disabled:text-stone-400 shadow-2xs',
  ghost:
    'text-stone-700 hover:bg-stone-100/80 hover:text-ink active:bg-stone-200/60 disabled:text-stone-400',
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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99]',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Magnetic lean without an animation library: a rAF-throttled pointermove
 * listener sets CSS custom properties, and a transition on transform gives
 * the pull. ~40 lines total, zero runtime dependencies beyond the browser.
 */
function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const host = el.parentElement ?? el;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = host.getBoundingClientRect();
      host.style.setProperty('--mag-x', `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
      host.style.setProperty('--mag-y', `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
    });
  }
  function onLeave() {
    const el = ref.current;
    cancelAnimationFrame(frame.current);
    (el?.parentElement ?? el)?.style.removeProperty('--mag-x');
    (el?.parentElement ?? el)?.style.removeProperty('--mag-y');
  }

  return { ref, onMove, onLeave, enabled };
}

/** Wrapper that carries the magnetic transform via CSS variables. */
function MagneticWrap({
  magnetic,
  fullWidth,
  children,
}: {
  magnetic?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={`nm-magnetic ${fullWidth ? 'w-full' : 'inline-flex'} ${magnetic ? 'nm-magnetic-on' : ''}`}>
      {children}
    </span>
  );
}

export function Button(props: ButtonElementProps | LinkElementProps) {
  const mag = useMagnetic(true);

  if (props.to !== undefined) {
    const { to, variant, size, fullWidth, className, children, magnetic, ...rest } = props;
    return (
      <MagneticWrap magnetic={magnetic} fullWidth={fullWidth}>
        <Link
          ref={mag.ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={composeClasses({ variant, size, fullWidth, className })}
          onMouseMove={magnetic ? mag.onMove : undefined}
          onMouseLeave={magnetic ? mag.onLeave : undefined}
          {...rest}
        >
          {children}
        </Link>
      </MagneticWrap>
    );
  }

  const { variant, size, fullWidth, className, children, loading = false, disabled, magnetic, ...rest } = props;
  return (
    <MagneticWrap magnetic={magnetic} fullWidth={fullWidth}>
      <button
        ref={mag.ref as React.Ref<HTMLButtonElement>}
        {...rest}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={composeClasses({ variant, size, fullWidth, className })}
        onMouseMove={magnetic ? mag.onMove : undefined}
        onMouseLeave={magnetic ? mag.onLeave : undefined}
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
    </MagneticWrap>
  );
}
