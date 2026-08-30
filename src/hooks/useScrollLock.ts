import { useEffect } from 'react';

/**
 * Locks body scroll while `active` is true.
 *
 * Reference counted, because more than one overlay can be mounted at a time
 * (cart drawer, search modal, mobile menu) and the last one to unmount must
 * not release a lock another overlay still needs. `scrollbar-gutter: stable`
 * on <html> keeps the layout from shifting when the scrollbar disappears.
 */
let lockCount = 0;
let previousOverflow = '';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [active]);
}
