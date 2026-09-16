const puppeteer = require('puppeteer-core');

/**
 * Definitive horizontal-overflow check.
 * Measures document.documentElement.scrollWidth vs clientWidth at 390px and
 * 360px widths, and reports the widest offending element chain.
 */
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 150)); });

  for (const [w, h] of [[390, 844], [360, 800]]) {
    await page.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
    for (const route of ['/', '/shop', '/cart', '/checkout', '/account', '/wishlist']) {
      await page.goto(`http://localhost:4175${route}`, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 500));
      const res = await page.evaluate(() => {
        const de = document.documentElement;
        const scrollW = de.scrollWidth;
        const clientW = de.clientWidth;
        // find the deepest widest element
        let worst = null;
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > (worst ? worst.w : 0)) {
            const cls = (el.className && typeof el.className === 'string')
              ? el.className.split(' ').slice(0, 2).join('.')
              : el.tagName.toLowerCase();
            worst = { w: r.width, right: r.right, tag: el.tagName.toLowerCase(), cls };
          }
        });
        return { scrollW, clientW, overflow: scrollW > clientW, worst };
      });
      console.log(`${w} ${route} scrollW=${res.scrollW} clientW=${res.clientW} overflow=${res.overflow} worst=${res.worst ? JSON.stringify({ t: res.worst.tag, c: res.worst.cls, w: Math.round(res.worst.w) }) : null}`);
    }
  }
  console.log('consoleErrors:', JSON.stringify(errors));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
