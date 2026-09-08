/* Headless QA: load each route, capture console errors and failed requests. */
const puppeteer = require('puppeteer-core');

const ROUTES = [
  '/', '/shop', '/shop?region=Bali', '/shop?category=Hoodies&sort=price-low',
  '/product/nusantara-batik-shirt', '/product/lokal-classic-tee',
  '/journal', '/case-study', '/design-system', '/admin', '/wishlist', '/cart', '/checkout',
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const report = [];
  for (const route of ROUTES) {
    const consoleErrors = [];
    const failedReqs = [];
    const onError = (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200));
    };
    const onReqFail = (req) => failedReqs.push(`${req.url().slice(0, 90)} ${req.failure()?.errorText}`);
    page.on('console', onError);
    page.on('requestfailed', onReqFail);

    try {
      await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise((r) => setTimeout(r, 600));
      const mainLen = await page.$eval('main', (m) => m.innerText.trim().length).catch(() => 0);
      report.push({ route, mainLen, consoleErrors: consoleErrors.slice(0, 3), failedReqs: failedReqs.slice(0, 3) });
    } catch (e) {
      report.push({ route, error: String(e).slice(0, 150), consoleErrors: consoleErrors.slice(0, 3) });
    }
    page.off('console', onError);
    page.off('requestfailed', onReqFail);
  }

  /* ---- Interactive: craft video modal on homepage ---- */
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Watch the Craft'));
    if (!btn) return 'NOT FOUND';
    btn.click();
    return 'CLICKED';
  });
  await new Promise((r) => setTimeout(r, 400));
  const modalVisible = await page.evaluate(() => {
    const d = document.querySelector('[aria-label="Watch the Craft"]');
    return d ? { visible: true, text: d.innerText.slice(0, 80) } : { visible: false };
  });

  /* ---- Interactive: quick add → cart drawer + badge ---- */
  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));
  const quickAdd = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label^="Quick add"]');
    if (!btn) return 'NOT FOUND';
    btn.click();
    return 'CLICKED';
  });
  await new Promise((r) => setTimeout(r, 1200));
  const cartState = await page.evaluate(() => {
    const drawer = document.querySelector('[aria-label="Shopping Bag"]');
    const bagBtn = document.querySelector('button[aria-label^="Shopping bag"]');
    return {
      drawerOpen: drawer ? drawer.getAttribute('aria-hidden') !== 'true' : false,
      bagLabel: bagBtn ? bagBtn.getAttribute('aria-label') : null,
      drawerText: drawer ? drawer.innerText.slice(0, 60) : null,
    };
  });

  /* ---- Interactive: admin gate ---- */
  await page.goto('http://localhost:4173/admin', { waitUntil: 'networkidle2' });
  const adminGate = await page.evaluate(() => document.querySelector('main').innerText.includes('Admin surface'));
  await page.evaluate(() => {
    const input = document.querySelector('input[type="password"]');
    input.value = 'nusa2026';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await new Promise((r) => setTimeout(r, 500));
  const adminIn = await page.evaluate(() => document.querySelector('main').innerText.includes('Catalog Console'));

  /* ---- Region filter URL state ---- */
  await page.goto('http://localhost:4173/shop?region=Sumatra', { waitUntil: 'networkidle2' });
  const sumatraCount = await page.evaluate(() => {
    const text = document.querySelector('main').innerText;
    const m = text.match(/Showing\s+(\d+)/);
    return m ? m[1] : 'n/a';
  });

  console.log(JSON.stringify({ report, modal: { clicked, ...modalVisible }, quickAdd, cartState, admin: { adminGate, adminIn }, sumatraCount }, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
