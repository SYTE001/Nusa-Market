/**
 * NusaMarket placeholder imagery pipeline.
 *
 * Deterministic "studio tiles": every product gets 3 frames derived from its
 * brand colour family and a weave/pattern motif — coherent placeholders that
 * keep the grid visually consistent while real photography is pending.
 * Also emits category tiles, editorial bands, and artisan portraits.
 *
 * Run: node scripts/generate-images.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => path.join(root, 'public', 'images', p);

/** Brand palettes — warm, archipelago-derived, light enough to read as
    "product tile" not "empty box" on small screens. */
const BRANDS = {
  LOKAL: { base: [87, 83, 78], accent: [214, 129, 84] },      // stone + warm clay
  NUSANTARA: { base: [78, 92, 118], accent: [222, 178, 98] }, // indigo + gold
  KOTABARU: { base: [110, 104, 90], accent: [176, 140, 100] },// olive + tan
  GARIS: { base: [72, 78, 74], accent: [140, 158, 132] },     // ink + sage
};

/** Simple deterministic hash → 0..1 float. */
function seeded(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

/** Build an SVG studio tile for a product frame. */
function productTile(slug, brand, frame, size = [900, 1125]) {
  const rand = seeded(slug + frame);
  const [w, h] = size;
  const { base, accent } = BRANDS[brand] ?? BRANDS.LOKAL;

  const rgb = (c, k = 1) =>
    `rgb(${c.map((v) => Math.round(Math.min(255, Math.max(0, v * k)))).join(',')})`;

  // Weave angle & spacing vary deterministically per frame.
  const angle = 45 + Math.floor(rand() * 4) * 15;
  const gap = 14 + Math.floor(rand() * 5) * 6;

  // Weave lines — high enough contrast to read as texture at thumbnail size
  let lines = '';
  for (let i = -h; i < w + h; i += gap) {
    lines += `<line x1="${i}" y1="0" x2="${i + h}" y2="${h}" stroke="${rgb(accent, 0.55)}" stroke-width="1.6" opacity="0.8" />`;
  }

  // Frame-specific motif mark
  const cx = w * (0.3 + rand() * 0.4);
  const cy = h * (0.35 + rand() * 0.3);
  const r = 120 + rand() * 160;
  const mark =
    frame === 2
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${rgb(accent, 0.8)}" stroke-width="2.5" opacity="0.7"/>
         <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="${rgb(accent, 0.6)}" stroke-width="1.5" opacity="0.5"/>`
      : frame === 3
      ? `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="none" stroke="${rgb(accent, 0.75)}" stroke-width="2" opacity="0.65" transform="rotate(${angle / 3} ${cx} ${cy})"/>`
      : `<path d="M ${cx - r} ${cy} q ${r} -${r * 0.8} ${r * 2} 0 q -${r} ${r * 0.8} ${r * 2} 0" fill="none" stroke="${rgb(accent, 0.8)}" stroke-width="2.5" opacity="0.7"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${rgb(base, 1.35)}"/>
      <stop offset="1" stop-color="${rgb(base, 0.75)}"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="rgba(255,255,255,0.14)"/>
      <stop offset="1" stop-color="rgba(0,0,0,0.22)"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g transform="rotate(${angle - 45} ${w / 2} ${h / 2})" opacity="0.5">${lines}</g>
  ${mark}
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h - 88}" font-size="34" letter-spacing="10" fill="${rgb([255, 250, 244], 0.92)}">${brand}</text>
    <text x="${w / 2}" y="${h - 54}" font-size="15" letter-spacing="5" fill="${rgb(accent, 1.1)}">NUSAMARKET STUDIO</text>
  </g>
</svg>`;
}

/** Editorial band tile — wide. */
function editorialTile(name, w = 1100, h = 734) {
  const rand = seeded(name);
  const tone = name === 'hero' ? [44, 38, 33] : [30, 30, 34];
  const accent = [193, 68, 14];
  let bands = '';
  for (let i = 0; i < 8; i++) {
    const y = (h / 8) * i + rand() * 20;
    bands += `<rect x="0" y="${y}" width="${w}" height="${2 + rand() * 3}" fill="rgba(193,68,14,${0.18 + rand() * 0.2})"/>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="rgb(${tone.map((v) => v + 26).join(',')})"/>
      <stop offset="1" stop-color="rgb(${tone.join(',')})"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${bands}
  <circle cx="${w * (0.3 + rand() * 0.4)}" cy="${h * (0.3 + rand() * 0.3)}" r="${140 + rand() * 120}" fill="none" stroke="rgba(193,68,14,0.55)" stroke-width="2.5"/>
  <g font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle" fill="rgba(255,250,244,0.9)">
    <text x="${w / 2}" y="${h / 2 - 6}" font-size="40" letter-spacing="14">NUSAMARKET</text>
    <text x="${w / 2}" y="${h / 2 + 28}" font-size="16" letter-spacing="7" fill="rgb(214,158,66)">EDITORIAL — ${name.toUpperCase()}</text>
  </g>
</svg>`;
}

/** Artisan portrait tile. */
function artisanTile(id, w = 720, h = 900) {
  const rand = seeded(id);
  const base = [58, 50, 44];
  let warp = '';
  for (let x = 0; x < w; x += 22) {
    warp += `<line x1="${x}" y1="0" x2="${x + (rand() - 0.5) * 30}" y2="${h}" stroke="rgba(193,68,14,${0.12 + rand() * 0.12})" stroke-width="1.5"/>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(${base.map((v) => v + 30).join(',')})"/>
      <stop offset="1" stop-color="rgb(${base.join(',')})"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${warp}
  <circle cx="${w / 2}" cy="${h * 0.38}" r="${90 + rand() * 50}" fill="none" stroke="rgba(214,158,66,0.7)" stroke-width="3"/>
  <path d="M ${w * 0.2} ${h * 0.72} q ${w * 0.3} ${-h * 0.1} ${w * 0.6} 0" fill="none" stroke="rgba(214,158,66,0.55)" stroke-width="2.5"/>
  <g font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h - 64}" font-size="22" letter-spacing="8" fill="rgba(255,250,244,0.9)">ARTISAN PORTRAIT</text>
    <text x="${w / 2}" y="${h - 38}" font-size="13" letter-spacing="4" fill="rgb(193,68,14)">${id.toUpperCase()} · PENDING</text>
  </g>
</svg>`;
}

async function emit(file, svg, quality = 82) {
  mkdirSync(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality }).toFile(file);
  return file;
}

/* ---------- Catalog map (mirrors src/data/products.ts) ---------- */
const CATALOG = [
  ['lokal-classic-tee', 'LOKAL'], ['nusantara-graphic-tee', 'NUSANTARA'],
  ['kotabaru-oversized-tee', 'KOTABARU'], ['garis-stripe-tee', 'GARIS'],
  ['lokal-heavyweight-hoodie', 'LOKAL'], ['nusantara-zip-hoodie', 'NUSANTARA'],
  ['kotabaru-cropped-hoodie', 'KOTABARU'], ['garis-cargo-pants', 'GARIS'],
  ['lokal-chino-pants', 'LOKAL'], ['nusantara-jogger-pants', 'NUSANTARA'],
  ['lokal-coach-jacket', 'LOKAL'], ['kotabaru-denim-jacket', 'KOTABARU'],
  ['garis-bomber-jacket', 'GARIS'], ['lokal-canvas-cap', 'LOKAL'],
  ['nusantara-beanie', 'NUSANTARA'], ['kotabaru-canvas-belt', 'KOTABARU'],
  ['garis-wool-socks', 'GARIS'], ['lokal-tote-bag', 'LOKAL'],
  ['nusantara-daypack', 'NUSANTARA'], ['kotabaru-crossbody', 'KOTABARU'],
  ['garis-waist-bag', 'GARIS'], ['lokal-fleece-jacket', 'LOKAL'],
  ['nusantara-batik-shirt', 'NUSANTARA'], ['kotabaru-wide-pants', 'KOTABARU'],
];

const CATEGORIES = ['t-shirts', 'hoodies', 'pants', 'jackets', 'accessories', 'bags'];
const EDITORIAL = ['hero', 'archival-series'];
const ARTISANS = ['tamtama', 'senja', 'sari', 'widya', 'yosef'];

async function main() {
  let count = 0;

  for (const [slug, brand] of CATALOG) {
    for (const frame of [1, 2, 3]) {
      const file = pub(`products/${slug}/${String(frame).padStart(2, '0')}.webp`);
      if (!existsSync(file)) {
        await emit(file, productTile(slug, brand, frame));
        count++;
      }
      // Mobile variant: same tile at 480px wide — low-end phones decode
      // ~56% fewer pixels per card.
      const small = pub(`products/${slug}/${String(frame).padStart(2, '0')}-480.webp`);
      if (!existsSync(small)) {
        await sharp(file)
          .resize({ width: 480 })
          .webp({ quality: 78 })
          .toFile(small);
        count++;
      }
    }
  }

  for (const cat of CATEGORIES) {
    const file = pub(`categories/${cat}.webp`);
    if (!existsSync(file)) {
      await emit(file, productTile(cat, 'NUSANTARA', 1, [600, 450]), 80);
      count++;
    }
  }

  for (const name of EDITORIAL) {
    const file = pub(`editorial/${name}.webp`);
    if (!existsSync(file)) {
      await emit(file, editorialTile(name));
      count++;
    }
  }

  for (const id of ARTISANS) {
    const file = pub(`artisans/${id}.webp`);
    if (!existsSync(file)) {
      await emit(file, artisanTile(id));
      count++;
    }
  }

  console.log(`generate-images: emitted ${count} tiles (existing real files untouched).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
