const puppeteer = require('puppeteer-core');

/**
 * Mobile + overlay QA (post-fix).
 *
 * The off-canvas cart drawer and the mobile nav panel stay in the DOM while
 * closed (they animate out via transform), so a naive "any element wider than
 * the viewport" check flags them as false positives. scrollWidth is what
 * actually governs horizontal scrolling, and translateX(100%) elements do NOT
 * contribute to it. This script reports document scrollWidth as the source of
 * truth and only lists real in-flow offenders: elements that are NOT
 * off-canvas-transformed and still extend past the viewport.
 */

const ROUTES = ['/', '/shop', '/product/nusantara-batik-shirt', '/cart', '/checkout'];

function isOffCanvas(el) {
  const cs = getComputedStyle(el);
  // The drawer slides out with translateX(±100%); the closed mobile panel is
  // inert with pointer-events:none and opacity-0.
  const t = cs.transform;
  if (t && t !== 'none' && /matrix\([^)]*\)/.test(t)) {
    const m = t.match(/matrix\(([^)]+)\)/);
    if (m) {
      const tx = parseFloat(m[1].split(',')[4]);
      const w = el.getBoundingClientRect().width;
      if (Math.abs(tx) >= w * 0.9) return true; // fully translated off-screen
    }
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 180)); });

  for (const [w, h] of [[390, 844], [360, 800]]) {
    await page.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
    for (const route of ROUTES) {
      await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 500));
      const res = await page.evaluate(() => {
        const de = document.documentElement;
        const scrollW = de.scrollWidth;
        const clientW = de.clientWidth;
        const real = [];
        document.querySelectorAll('main *, footer *, header *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width <= 0) return;
          if (r.right <= clientW + 1) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') return;
          // off-canvas drawer / inert overlays do not create scrollbars
          const t = cs.transform;
          if (t && t !== 'none') {
            const m = t.match(/matrix\(([^)]+)\)/);
            if (m && Math.abs(parseFloat(m[1].split(',')[4])) >= r.width * 0.9) return;
          }
          if (el.closest('[inert], [aria-hidden="true"]')) return;
          // Pills inside an overflow-x-auto rail scroll internally — they do
          // not scroll the page.
          if (el.closest('[class*="overflow-x-auto"]')) return;
          const cls = (typeof el.className === 'string') ? el.className.split(' ').slice(0, 2).join('.') : '';
          real.push(`<${el.tagName.toLowerCase()}> R=${Math.round(r.right)} w=${Math.round(r.width)} | ${cls}`);
        });
        return { scrollW, clientW, overflow: scrollW > clientW, real: real.slice(0, 4) };
      });
      const tag = res.overflow ? 'OVERFLOW' : 'ok';
      console.log(`${tag} ${w} ${route} scrollW=${res.scrollW} clientW=${res.clientW}${res.real.length ? ' :: ' + res.real.join(' ; ') : ''}`);
    }
  }

  // 404 route
  await page.goto('http://localhost:4173/this-route-does-not-exist', { waitUntil: 'networkidle2' });
  const notFound = await page.evaluate(() =>
    document.querySelector('main').innerText.includes('does not exist')
  );
  console.log('404 handled:', notFound);

  // ---------- Desktop: overlays + keyboard ----------
  await page.setViewport({ width: 1280, height: 900 });

  // Search overlay
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
  await page.click('button[aria-label="Search products"]');
  await new Promise((r) => setTimeout(r, 400));
  const searchOpen = await page.$eval('[aria-label="Search products"]', (d) => d.getAttribute('aria-expanded'));
  await page.type('input', 'batik', { delay: 40 });
  await new Promise((r) => setTimeout(r, 500));
  const searchResults = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[role="option"], li, a'))
      .filter((el) => el.innerText.includes('Batik')).length
  );
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const searchClosed = await page.$eval('[aria-label="Search products"]', (d) => d.getAttribute('aria-expanded'));
  console.log('SEARCH open:', searchOpen, '| batik results:', searchResults, '| after Esc:', searchClosed);

  // Cart drawer + Escape
  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  await page.click('button[aria-label^="Quick add"]');
  await new Promise((r) => setTimeout(r, 1100));
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const drawerAfterEsc = await page.$eval('[aria-label="Shopping Bag"]', (d) => d.getAttribute('aria-hidden'));
  console.log('CART drawer aria-hidden after Esc:', drawerAfterEsc);

  // Mobile nav open/close
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  await page.click('button[aria-label="Open menu"]');
  await new Promise((r) => setTimeout(r, 400));
  const menuOpen = await page.$eval('#mobile-navigation', (d) => d.getAttribute('aria-hidden'));
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const menuAfterEsc = await page.$eval('#mobile-navigation', (d) => d.getAttribute('aria-hidden'));
  console.log('MOBILE NAV open:', menuOpen, '| after Esc:', menuAfterEsc);

  console.log('consoleErrors:', JSON.stringify(errors));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
