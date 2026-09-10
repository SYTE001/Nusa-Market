import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function createOgImage() {
  const ogDir = path.join(root, 'public', 'images', 'og');
  mkdirSync(ogDir, { recursive: true });
  const targetFile = path.join(ogDir, 'nusamarket-og-editorial.webp');

  const width = 1200;
  const height = 630;

  // Base canvas SVG with editorial layout
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF9F7" />
        <stop offset="100%" stop-color="#F5F3EF" />
      </linearGradient>
    </defs>
    
    <!-- Canvas background -->
    <rect width="${width}" height="${height}" fill="url(#bg)" />
    
    <!-- Outer perimeter border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="#E5E0D8" stroke-width="1.5" />
    
    <!-- Top badge -->
    <g transform="translate(64, 90)">
      <circle cx="5" cy="5" r="4" fill="#CD7A4D" />
      <text x="18" y="9" font-family="'Segoe UI', -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="3.5" fill="#78716C">INDEPENDENT INDONESIAN ATELIERS</text>
    </g>

    <!-- Brand Logo -->
    <text x="64" y="170" font-family="'Segoe UI', -apple-system, sans-serif" font-size="44" font-weight="800" letter-spacing="5" fill="#18181B">
      NUSA<tspan fill="#CD7A4D">MARKET</tspan>
    </text>

    <!-- Primary Headline -->
    <g transform="translate(64, 232)">
      <text x="0" y="0" font-family="'Segoe UI', -apple-system, sans-serif" font-size="34" font-weight="700" fill="#18181B" letter-spacing="-0.5">Handcrafted in Indonesia.</text>
      <text x="0" y="44" font-family="'Georgia', serif" font-size="32" font-style="italic" font-weight="500" fill="#CD7A4D">Shipped Worldwide.</text>
    </g>

    <!-- Editorial Description -->
    <g transform="translate(64, 335)">
      <text x="0" y="0" font-family="'Segoe UI', -apple-system, sans-serif" font-size="16" fill="#57534E">
        A curated storefront for Indonesia’s independent ateliers —
      </text>
      <text x="0" y="28" font-family="'Segoe UI', -apple-system, sans-serif" font-size="16" fill="#57534E">
        hand-stamped batik, heavyweight cut-and-sew, and
      </text>
      <text x="0" y="56" font-family="'Segoe UI', -apple-system, sans-serif" font-size="16" fill="#57534E">
        considered goods built to outlast trend cycles.
      </text>
    </g>

    <!-- Provenance Stats Bar -->
    <g transform="translate(64, 475)">
      <line x1="0" y1="0" x2="540" y2="0" stroke="#E5E0D8" stroke-width="1" />
      
      <g transform="translate(0, 32)">
        <text x="0" y="0" font-family="'Segoe UI', -apple-system, sans-serif" font-size="22" font-weight="700" fill="#18181B">24</text>
        <text x="0" y="18" font-family="'Segoe UI', -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#78716C">CURATED STYLES</text>
      </g>
      
      <g transform="translate(190, 32)">
        <text x="0" y="0" font-family="'Segoe UI', -apple-system, sans-serif" font-size="22" font-weight="700" fill="#18181B">7</text>
        <text x="0" y="18" font-family="'Segoe UI', -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#78716C">HERITAGE ATELIERS</text>
      </g>
      
      <g transform="translate(380, 32)">
        <text x="0" y="0" font-family="'Segoe UI', -apple-system, sans-serif" font-size="22" font-weight="700" fill="#18181B">3</text>
        <text x="0" y="18" font-family="'Segoe UI', -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#78716C">ISLAND REGIONS</text>
      </g>
    </g>
  </svg>
  `;

  // Photo frame badge overlay
  const photoBadgeSvg = `
  <svg width="460" height="570" viewBox="0 0 460 570" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="460" height="570" fill="none" stroke="#D6D3D1" stroke-width="1.5" />
    <rect x="16" y="500" width="428" height="54" fill="rgba(24,24,27,0.85)" />
    <text x="32" y="522" font-family="'Segoe UI', -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="#D6D3D1">LOOKBOOK 01</text>
    <text x="32" y="542" font-family="'Segoe UI', -apple-system, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Atelier Senja · Heavyweight Cotton</text>
  </svg>
  `;

  const heroPath = path.join(root, 'public', 'images', 'editorial', 'hero.webp');
  let photoBuffer = null;
  if (existsSync(heroPath)) {
    // Resize photo to 460 x 570
    const rawPhoto = await sharp(heroPath)
      .resize(460, 570, { fit: 'cover', position: 'top' })
      .toBuffer();

    // Composite the photoBadge on top of the photo
    photoBuffer = await sharp(rawPhoto)
      .composite([{ input: Buffer.from(photoBadgeSvg), top: 0, left: 0 }])
      .toBuffer();
  }

  const composites = [];
  if (photoBuffer) {
    composites.push({
      input: photoBuffer,
      top: 30,
      left: 690,
    });
  }

  await sharp(Buffer.from(svgOverlay))
    .composite(composites)
    .webp({ quality: 90 })
    .toFile(targetFile);

  console.log(`Regenerated OG image at ${targetFile} (1200x630)`);
}

createOgImage().catch(console.error);
