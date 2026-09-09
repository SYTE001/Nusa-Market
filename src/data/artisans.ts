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
    name: 'Ibu Widianti Widjaja',
    craft: 'Hand-stamped & hand-drawn batik',
    region: 'Java',
    place: 'Kedungwuni, Pekalongan, Central Java',
    summary:
      'Third-generation batik maker. Draws with canting, stamps with carved kap blocks, boils the wax out by hand.',
    story:
      'Continuing the third generation of the legendary Oey Soe Tjoen studio, founded in 1925, Widianti refuses to rush the process to meet market demands; a single sheet of fine hand-drawn batik cloth in her workshop takes one to three years to create using a micro-tipped canting (canting). For her, the precision of the wax inking is not just a motif, but the rhythm of the breath of the veteran craftsmen, a rhythm that cannot be replaced by a printing machine.”',
    yearsAtBench: 34,
    photo: '/images/artisans/tamtama.webp',
    signature: 'Peranakan bouquet motif, micro-dots, fine sogan & pastel coloring',
  },
  {
    id: 'senja',
    name: 'I Made Ada',
    craft: 'Wood Carving',
    region: 'Bali',
    place: 'Gianyar, Bali',
    summary:
      'Runs a twelve-person cut-and-sew atelier in southern Bandung. Cuts heavyweight cotton like it was canvas.',
    story:
      'Under his hands, a single piece of jackfruit or suar wood is transformed into a living mythological figure. Made Ada holds the title of master of the most intricate garuda carvings in Bali. Each wing, spur, and leaf carving ornament is carved without modern blueprints, relying solely on traditional anatomical calculations and an aesthetic sense honed from a young age.',
    yearsAtBench: 41,
    photo: '/images/artisans/senja.webp',
    signature: 'Loopback fleece, four-piece waistbands, bias-cut caps',
  },
  {
    id: 'sari',
    name: 'Empu Sungkowo Harumbrodjo',
    craft: 'Keris Forging',
    region: 'Java',
    place: 'Moyudan, Sleman, D.I. Yogyakarta',
    summary:
      'Knits and flatlocks on machines older than her operators. Links beanie crowns loop-by-loop by hand.',
    story:
      'Carrying on the legacy of Majapahit-era craftsmen, Sungkowo ignites teak charcoal embers in his traditional kiln without the aid of modern machinery. Each heirloom blade is forged through hundreds of layers of iron, steel, and nickel meteorite, producing vibrant pamor lines. For him, forging a keris is not simply metal fabrication, but an inner discipline that balances weight, the aesthetics of the blades anatomy, and Javanese philosophy.',
    yearsAtBench: 44,
    photo: '/images/artisans/sari.webp',
    signature: 'Classic pamor folding technique (Beras Wutah & Udan Mas), manual meteorite forging, carved warangka ladrang',
  },
  {
    id: 'widya',
    name: 'Sapuan',
    craft: 'Tenun & natural dye',
    region: 'Java',
    place: 'Wiradesa, Pekalongan, Central Java',
    summary:
      'Weaves songket-influenced panels on a backstrap loom; dyes with indigo from her own beds.',
    story:
      'Known among textile collectors as one of the most meticulous male batik makers on the north coast of Java, Sapuan spends months completing a single piece of primissima mori cloth or hand-drawn silk. His flowing canting strokes, devoid of heavy pencil sketches, rely on visual memories of coastal flora and fauna, executed using a micro-isen-isen technique nearly impossible to replicate with a copper stamp.',
    yearsAtBench: 30,
    photo: '/images/artisans/widya.webp',
    signature: 'Coastal micro-isen-isen, ATBM silk batik, endemic Indonesian fauna motifs',
  },
  {
    id: 'yosef',
    name: 'Priyo Salim',
    craft: 'Silver Filigree',
    region: 'Java',
    place: 'Kotagede, Yogyakarta',
    summary:
      'Ikat master: binds the warp before dyeing so the pattern emerges only on the loom.',
    story:
      'Kotagede is renowned for its lustrous precious metal crafts, and Priyo Salim maintains its most challenging branch: silver filigree. A single strand of pure silver wire is stretched to the thickness of a hair, then twisted, bent, and soldered by hand with borax solder over a blowtorch. The resulting object is not simply jewelry, but a three-dimensional woven silver filigree that is sturdy yet feels as light as silk lace.',
    yearsAtBench: 38,
    photo: '/images/artisans/yosef.webp',
    signature: 'Manually twisted 925 silver filigree, replica of palace architecture, traditional blow-stained technique',
  },
];
