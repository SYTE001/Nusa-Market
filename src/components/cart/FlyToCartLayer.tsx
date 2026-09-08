import { useEffect, useRef } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Fly-to-cart ghost: a small clay chip flies from the add-to-bag origin into
 * the navbar bag icon, then the badge pulses. Implemented with the Web
 * Animations API — no animation library in the bundle. The flight targets the
 * bag button's live position (re-resolved on scroll/resize). Collapses to
 * nothing under prefers-reduced-motion.
 */
export function FlyToCartLayer() {
  const fly = useUIStore((s) => s.flyToCart);
  const setFlyToCart = useUIStore((s) => s.setFlyToCart);
  const triggerBagPulse = useUIStore((s) => s.triggerBagPulse);
  const reduce = usePrefersReducedMotion();
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fly || reduce) {
      if (fly && reduce) {
        // Reduced motion still counts: the badge pulses immediately.
        triggerBagPulse();
        setFlyToCart(null);
      }
      return;
    }

    const chip = chipRef.current;
    const bag = document.querySelector<HTMLButtonElement>('button[aria-label^="Shopping bag"]');
    if (!chip || !bag) return;

    const rect = bag.getBoundingClientRect();
    const target = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    const anim = chip.animate(
      [
        { left: `${fly.from.x}px`, top: `${fly.from.y}px`, transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { left: `${target.x}px`, top: `${target.y}px`, transform: 'translate(-50%, -50%) scale(0.25)', opacity: 0.9, offset: 0.85 },
        { left: `${target.x}px`, top: `${target.y}px`, transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 },
      ],
      { duration: 620, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'forwards' }
    );

    const done = () => {
      setFlyToCart(null);
      triggerBagPulse();
    };
    anim.addEventListener('finish', done);
    return () => {
      anim.removeEventListener('finish', done);
      anim.cancel();
    };
  }, [fly, reduce, setFlyToCart, triggerBagPulse]);

  if (!fly || reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <div
        ref={chipRef}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full bg-clay-500 shadow-md"
      />
    </div>
  );
}
