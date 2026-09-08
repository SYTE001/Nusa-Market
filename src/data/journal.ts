/**
 * Journal entries — "The Craft" section content.
 * Short editorial pieces on Indonesian craft traditions; entries are
 * self-contained and link to the shop or artisan pages.
 */
export type JournalEntry = {
  slug: string;
  title: string;
  eyebrow: string;
  minutes: number;
  date: string;
  excerpt: string;
  body: string[];
};

export const journal: JournalEntry[] = [
  {
    slug: 'why-batik-takes-days',
    title: 'Why real batik takes days, not hours',
    eyebrow: 'Craft Notes',
    minutes: 4,
    date: '2026-08-12',
    excerpt:
      'The difference between printed pattern and batik tulis is the difference between a photograph of rain and being rained on.',
    body: [
      'A printed parang motif is a picture of batik. Batik tulis is batik: wax drawn by hand with a canting, cloth dyed in a vat, wax boiled out, and the cycle repeated for every colour the pattern carries. Each pass through the vat darkens everything the wax does not protect, so the maker must plan the entire colour sequence before the first stroke.',
      'This is why a genuine batik tulis cloth can take two weeks per metre, and why no two lengths are identical. The hand wavers — a hair of a degree — and the line records it. Machine stamping, even hand stamping with a carved kap block, is faster because it removes the hand from the line.',
      'NusaMarket stocks both: hand-drawn tulis pieces when the atelier can spare them, and hand-stamped (batik cap) pieces that carry the same wax-resist process at a pace a wardrobe can afford. Both are batik. The difference between them and anything printed is that in a printed cloth, the pattern sits on the surface. In a resisted cloth, the pattern is the cloth.',
    ],
  },
  {
    slug: 'reading-a-tenun-landscape',
    title: 'How to read a tenun the way a weaver does',
    eyebrow: 'Material Studies',
    minutes: 5,
    date: '2026-07-02',
    excerpt:
      'East of Bali, the cloth keeps livestock accounts, marriage lines, and the memory of a river\u2019s bend. Here is the grammar.',
    body: [
      'Tenun simply means woven. But east of the Wallace line, in the islands of Nusa Tenggara, tenun carries a specific grammar: warp ikat where the pattern is bound into the vertical threads before the cloth exists, supplementary weft where gold or coloured thread is laid on top during weaving, and songket borders that mark the edge a household considers itself.',
      'A Sumbanese hinggi reads in paired bands — and the older the piece, the more likely a band records something literal: a horse, a crocodile, a skull tree from a village festival. The weaver is not decorating; she is keeping records. Anthropologists call it a textile archive, which is accurate but colder than the weavers\u2019 own word: kitab, book.',
      'The pieces NusaMarket carries from the region stay honest to that grammar. Yosef Ndiki\u2019s cord and small goods use lontar palm fibre and binding techniques from the hinggi tradition, at a scale a daily wardrobe can absorb. The full hinggi we stock once a year, made to order, because that is the pace the technique allows.',
    ],
  },
  {
    slug: 'the-bandung-weight-test',
    title: 'The Bandung weight test: why grams matter',
    eyebrow: 'Field Notes',
    minutes: 3,
    date: '2026-06-18',
    excerpt:
      'A 230gsm tee and a 160gsm tee are not the same product. Here is how to feel the difference in ten seconds.',
    body: [
      'Hold the hem up to the light. A lightweight tee shows the light through the knit in an even haze; a heavyweight one blocks most of it. Now scrunch the hem in your fist and release: lightweight knits spring back instantly, heavyweight ones unfold slowly. That slow return is the fabric you can live in for years — dense yarn, tight loop, less air between fibres to break down.',
      'Bandung\u2019s mills built their reputation on exactly this. The city\u2019s garment industry grew around textile mills that over-spun and over-knit for the domestic market, which is why Indonesian streetwear labels weigh their fabrics like jewellers. Our 230gsm to 480gsm range is deliberately at the heavy end of each garment class.',
      'The honest caveat: heavyweight cloth is warmer and slower to dry. If you dress for equatorial afternoons, the lighter pieces in our catalog — the linen trousers, the camp-collar shirt — are not compromises. They are the correct answer to the same question.',
    ],
  },
];
