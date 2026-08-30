const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brainDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\1e297db1-0db0-467e-a339-15d20ce55e2f';
const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

const products = [
  'lokal-classic-tee', 'nusantara-graphic-tee', 'kotabaru-oversized-tee', 'garis-stripe-tee',
  'lokal-heavyweight-hoodie', 'nusantara-zip-hoodie', 'kotabaru-cropped-hoodie',
  'garis-cargo-pants', 'lokal-chino-pants', 'nusantara-jogger-pants',
  'lokal-coach-jacket', 'kotabaru-denim-jacket', 'garis-bomber-jacket',
  'lokal-canvas-cap', 'nusantara-beanie', 'kotabaru-canvas-belt', 'garis-wool-socks',
  'lokal-tote-bag', 'nusantara-daypack', 'kotabaru-crossbody', 'garis-waist-bag',
  'lokal-fleece-jacket', 'nusantara-batik-shirt', 'kotabaru-wide-pants'
];

let convertedCount = 0;
let missingCount = 0;

console.log('=== NUSA-MARKET IMAGE SYNC STATUS ===');
products.forEach(slug => {
  const prefix = slug.replace(/-/g, '_');
  const outDir = path.join(process.cwd(), 'public', 'images', 'products', slug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const status = [];
  ['01', '02', '03'].forEach(num => {
    const dst = path.join(outDir, `${num}.webp`);
    // Find latest matching image in brainDir
    const pattern = new RegExp(`^${prefix}_${num}_.*\\.(jpg|png)$`);
    const matched = files.filter(f => pattern.test(f)).sort().pop();

    if (matched) {
      const src = path.join(brainDir, matched);
      if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) {
        try {
          execSync(`ffmpeg -y -i "${src}" -q:v 85 "${dst}"`, { stdio: 'ignore' });
        } catch (e) {
          console.error(`Error converting ${src} to ${dst}:`, e.message);
        }
      }
      if (fs.existsSync(dst)) {
        status.push(`${num}: OK`);
        convertedCount++;
      } else {
        status.push(`${num}: FAIL`);
        missingCount++;
      }
    } else {
      if (fs.existsSync(dst)) {
        status.push(`${num}: OK (cached)`);
        convertedCount++;
      } else {
        status.push(`${num}: MISSING`);
        missingCount++;
      }
    }
  });
  console.log(`${slug.padEnd(30)} -> ${status.join(' | ')}`);
});

console.log('-------------------------------------');
console.log(`Total images present: ${convertedCount}/72 (Missing: ${missingCount})`);
