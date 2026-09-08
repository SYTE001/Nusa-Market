import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * IntersectionObserver reveal — the platform replacement for the animation
 * library. One observer per element, disconnected after first reveal, and
 * reduced-motion users skip straight to the shown state.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = '-60px') {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: `0px 0px ${rootMargin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, shown };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms (grid cards pass index * 55). */
  delay?: number;
  as?: 'div' | 'article';
};

/** Wrapper that fades/rises its children in when scrolled into view. */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const { ref, shown } = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`reveal ${shown ? 'reveal-shown' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
