import type { Product } from '../types';

/**
 * Deterministic pseudo-review generator, keyed on product id — the same
 * product always renders the same sample reviews between loads.
 */

const NAMES = [
  'Raka P.', 'Dewi A.', 'Bimo S.', 'Sari W.', 'Andra K.', 'Melati R.',
  'Yoga P.', 'Nadia F.', 'Gilang R.', 'Tania M.', 'Reza A.', 'Intan L.',
];

const OPENERS = [
  'The weight is the first thing you notice — it feels serious in the hand.',
  'Third wash and the shape is exactly as it arrived.',
  'Bought one, came back for a second within a month.',
  'The finishing is well above what the photos suggest.',
  'Wears cooler than expected for the fabric weight.',
  'The small details carry it: the seams, the buttons, the hem.',
];

const MIDDLES = [
  'Sizing note: cut follows the size chart honestly.',
  'Delivery was quick and the packaging was plastic-free.',
  'It has become my default weekend piece.',
  'You can tell an actual person finished this garment.',
  'Colour is slightly deeper in person — better, honestly.',
  'Holds a press after ironing better than anything else I own.',
];

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

export type SampleReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

export function reviewsFor(product: Product, count = 3): SampleReview[] {
  const rand = seeded(product.id + product.slug);
  return Array.from({ length: count }, (_, i) => {
    const nameIdx = Math.floor(rand() * NAMES.length);
    const rating = Math.max(3, Math.min(5, Math.round(product.rating + (rand() - 0.35))));
    const daysAgo = Math.floor(rand() * 120) + 3;
    const date = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return {
      id: `${product.id}-rev-${i}`,
      author: NAMES[(nameIdx + i) % NAMES.length],
      rating,
      date,
      title: ['Exactly as described', 'Quality shows', 'Worth the wait', 'Repeat purchase'][i % 4],
      body: `${OPENERS[(nameIdx + i) % OPENERS.length]} ${MIDDLES[(nameIdx + i * 2) % MIDDLES.length]}`,
    };
  });
}

/** Star-distribution breakdown derived from the aggregate rating. */
export function ratingBreakdown(product: Product): { stars: number; pct: number }[] {
  const top = Math.round(product.rating);
  return [5, 4, 3, 2, 1].map((stars) => {
    let pct = 0;
    if (stars === top) pct = 55 + Math.round((product.rating - top + 0.5) * 30);
    else if (stars === top - 1) pct = 22;
    else if (stars === 5) pct = 62;
    if (stars > top) pct = 0;
    if (stars === top && top === 5) pct = 78;
    return { stars, pct: Math.min(95, Math.max(2, pct)) };
  });
}
