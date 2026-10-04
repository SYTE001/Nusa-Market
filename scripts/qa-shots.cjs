/* Capture README screenshots (home, product detail, checkout) plus mobile QA
   shots. Requires the preview server (`npm run preview`) on :4173. */
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const OUT_DIR = 'docs/screenshots';

// A minimal cart item matching the CartItem shape the cart store persists;
// injected via the zustand persist key so the checkout page has content.
const CART_SEED = JSON.stringify({
  state: {
    items: [
      {
        product: {
          id: 'lokal-classic-tee',
          slug: 'lokal-classic-tee',
          brand: 'LOKAL',
          name: 'Classic Heavyweight Tee',
          category: 'Tops',
          price: 189000,
          originalPrice: 229000,
          rating: 4.8,
          reviewCount: 64,
          images: ['/images/products/lokal-classic-tee/01.webp'],
          description: 'Heavyweight cotton tee.',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Ink', 'Canvas'],
          stock: 24,
          featured: true,
          region: 'Java',
          craft: {
            material: '240 gsm combed cotton',
            process: 'Garment-dyed in small runs',
            atelier: 'Bengkel Tamtama, Pekalongan',
          },
        },
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Ink',
      },
    ],
  },
  version: 0,
});

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  async function shot(url, w, h, out, { fullPage = false, cart = false } = {}) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    if (cart) {
      await page.evaluateOnNewDocument((seed) => {
        window.localStorage.setItem('nusa-cart', seed);
      }, CART_SEED);
    }
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: out, type: 'jpeg', quality: 82, fullPage });
    await page.close();
    console.log('saved', out);
  }

  const base = 'http://localhost:4173';
  await shot(`${base}/`, 1280, 900, `${OUT_DIR}/home.jpg`);
  await shot(`${base}/product/lokal-classic-tee`, 1280, 900, `${OUT_DIR}/product.jpg`);
  await shot(`${base}/checkout`, 1280, 900, `${OUT_DIR}/checkout.jpg`, { cart: true });

  // Mobile QA shots (kept from the visual-QA pipeline)
  await shot(`${base}/`, 360, 740, 'scripts/shots/home-mobile.jpg');
  await shot(`${base}/shop`, 360, 740, 'scripts/shots/shop-mobile.jpg');
  await shot(`${base}/`, 1280, 900, 'scripts/shots/home-desktop.jpg');
  await shot(`${base}/shop`, 1280, 900, 'scripts/shots/shop-desktop.jpg');

  await browser.close();
})().catch((e) => { console.error('FATAL', String(e).slice(0, 200)); process.exit(1); });
