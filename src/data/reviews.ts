import type { Product } from '../types';

export type Review = {
  id: string;
  author: string;
  location: string;
  rating: number;
  /** Whole days before today — kept relative so the demo never reads as stale. */
  daysAgo: number;
  title: string;
  body: string;
};

/**
 * Sample review copy for the demo catalog. Selection is deterministic (derived
 * from the product id) so a given product always shows the same reviews across
 * reloads — the same role a real `GET /products/:id/reviews` would fill.
 */
const REVIEWERS = [
  { author: 'Raka W.', location: 'Bandung' },
  { author: 'Ayu P.', location: 'Denpasar' },
  { author: 'Dimas S.', location: 'Jakarta Selatan' },
  { author: 'Nadia R.', location: 'Yogyakarta' },
  { author: 'Bagas H.', location: 'Surabaya' },
  { author: 'Sekar M.', location: 'Semarang' },
  { author: 'Fajar A.', location: 'Makassar' },
  { author: 'Tania L.', location: 'Medan' },
];

const NOTES = [
  {
    title: 'Material is the real deal',
    body: 'The fabric weight is exactly as described and the stitching is clean throughout. It has held its shape after several washes.',
  },
  {
    title: 'True to size',
    body: 'Ordered my usual size and the fit is spot on. The cut sits well without feeling boxy, which is rare at this price.',
  },
  {
    title: 'Packaging deserves a mention',
    body: 'Arrived in three days, folded properly with a care card. Small details, but it makes the whole thing feel considered.',
  },
  {
    title: 'Wears in nicely',
    body: 'Slightly stiff on the first wear, then it softened up and started to feel like something I have owned for years.',
  },
  {
    title: 'Colour is accurate',
    body: 'What you see in the photos is what arrives — no surprise undertones. Pairs with almost everything I already own.',
  },
  {
    title: 'Would buy again',
    body: 'Second piece I have bought from this label. Consistent quality and the finishing is noticeably better than fast fashion.',
  },
];

/** Cheap deterministic hash so the same product always maps to the same sample. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 100000;
  }
  return h;
}

const clampRating = (value: number) => Math.max(3, Math.min(5, Math.round(value)));

/** Three sample reviews whose ratings bracket the product's aggregate score. */
export function getReviews(product: Product): Review[] {
  const seed = hash(product.id);
  const offsets = [0.4, 0, -0.6];
  const daysAgo = [6, 21, 44];

  return offsets.map((offset, i) => {
    const reviewer = REVIEWERS[(seed + i * 3) % REVIEWERS.length];
    const note = NOTES[(seed + i * 2) % NOTES.length];
    return {
      id: `${product.id}-review-${i}`,
      author: reviewer.author,
      location: reviewer.location,
      rating: clampRating(product.rating + offset),
      daysAgo: daysAgo[i],
      title: note.title,
      body: note.body,
    };
  });
}

/**
 * Star distribution implied by the aggregate score, weighted toward the top
 * bucket. Returns percentages that always sum to 100.
 */
export function getRatingBreakdown(rating: number): { stars: number; percent: number }[] {
  const top = Math.round(Math.max(0, Math.min(1, (rating - 3) / 2)) * 62) + 30;
  const second = Math.round((100 - top) * 0.62);
  const third = Math.round((100 - top - second) * 0.7);
  const fourth = Math.max(0, 100 - top - second - third);
  return [
    { stars: 5, percent: top },
    { stars: 4, percent: second },
    { stars: 3, percent: third },
    { stars: 2, percent: fourth },
    { stars: 1, percent: 0 },
  ];
}
