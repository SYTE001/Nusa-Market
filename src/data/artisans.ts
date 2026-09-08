import type { Region } from '../types';

/**
 * Artisan profiles powering "Stories from the Archipelago".
 * Photos resolve to local studio tiles generated from the same palette —
 * see public/images/artisans/ for the current placeholder set.
 */
export type Artisan = {
  id: string;
  name: string;
  craft: string;
  region: Region;
  place: string;
  summary: string;
  story: string;
  yearsAtBench: number;
  photo: string;
  signature: string;
};

export const artisans: Artisan[] = [
  {
    id: 'tamtama',
    name: 'Ibu Ratna Tamtama',
    craft: 'Hand-stamped & hand-drawn batik',
    region: 'Java',
    place: 'Pekalongan, Central Java',
    summary:
      'Third-generation batik maker. Draws with canting, stamps with carved kap blocks, boils the wax out by hand.',
    story:
      'Her grandmother kept the dye vats of a Pekalongan compound; her mother refused synthetic dyes when the market turned; Ratna now runs eight stampers and two canting artists in the same hall. When a motif is drawn, it stays drawn — she will not digitise a hand-drawn parang, because “the hand returns to the line differently every morning, and that is the point.”',
    yearsAtBench: 34,
    photo: '/images/artisans/tamtama.webp',
    signature: 'Parang & kawung motifs, natural sogan dye',
  },
  {
    id: 'senja',
    name: 'Pak Darto of Atelier Senja',
    craft: 'Heavyweight cut-and-sew',
    region: 'Java',
    place: 'Bandung, West Java',
    summary:
      'Runs a twelve-person cut-and-sew atelier in southern Bandung. Cuts heavyweight cotton like it was canvas.',
    story:
      'Trained in a state textile mill before it closed in ’98, Pak Darto bought two of its cutting tables at auction and never replaced them — “they cut straighter than anything new.” His atelier runs small batches for four independent labels; runs of 150 are his ceiling, because past that, he says, you stop seeing each garment.',
    yearsAtBench: 41,
    photo: '/images/artisans/senja.webp',
    signature: 'Loopback fleece, four-piece waistbands, bias-cut caps',
  },
  {
    id: 'sari',
    name: 'Ibu Lilis Sari',
    craft: 'Flatlock & circular knit',
    region: 'Java',
    place: 'Bandung, West Java',
    summary:
      'Knits and flatlocks on machines older than her operators. Links beanie crowns loop-by-loop by hand.',
    story:
      'Ibu Lilis apprenticed at fourteen on a sock linker — the machine that closes toe seams by hand-mounting every loop onto a needle. She kept the linker when the sock factory went automated, kept the flatlock when sportswear went overlock, and now teaches both to a crew of nine, mostly mothers, all paid by the finished piece at rates she publishes on the workshop wall.',
    yearsAtBench: 22,
    photo: '/images/artisans/sari.webp',
    signature: 'Flatlocked seams, hand-linked crowns',
  },
  {
    id: 'widya',
    name: 'Ni Made Widya',
    craft: 'Tenun & natural dye',
    region: 'Bali',
    place: 'Sidemen, Karangasem, Bali',
    summary:
      'Weaves songket-influenced panels on a backstrap loom; dyes with indigo from her own beds.',
    story:
      'Widya grows the indigo behind her loom hall in Sidemen, a valley where the river folds the rice terraces. She weaves on a backstrap loom — tension held by her own body — so the cloth records her posture that day. Her panels go into NusaMarket garments as trim and facing: a handwoven strip inside each piece, hidden where only the wearer knows.',
    yearsAtBench: 18,
    photo: '/images/artisans/widya.webp',
    signature: 'Backstrap tenun, home-grown indigo',
  },
  {
    id: 'yosef',
    name: 'Yosef Ndiki',
    craft: 'Tenun ikat & palm-fibre cord',
    region: 'Nusa Tenggara',
    place: 'Sumba, East Nusa Tenggara',
    summary:
      'Ikat master: binds the warp before dyeing so the pattern emerges only on the loom.',
    story:
      'In Sumba, cloth is ceremonial currency — Yosef’s ikat hinggi can settle a bride-price line. He binds the warp with palm fibre before it ever touches dye; the pattern does not exist until the threads align on the loom, which is ikat in its most literal sense: “to bind”. NusaMarket stocks his cord and small goods, and one made-to-order panel a year.',
    yearsAtBench: 27,
    photo: '/images/artisans/yosef.webp',
    signature: 'Warp ikat hinggi, lontar palm cord',
  },
];
