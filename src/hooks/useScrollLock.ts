import { useEffect } from 'react';

/**
 * Ref-counted body scroll lock: two overlapping overlays (search modal over
 * mobile menu) can never leave the page stuck when one of them closes.
 */
let lockCount = 0;

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    const overflow = document.body.style.overflow;
    const paddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = paddingRight;
      }
    };
  }, [active]);
}
