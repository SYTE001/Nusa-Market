/* Mobile low-end QA: blank boxes, heavy assets, animation cost. */
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--cpu-throttling=4', '--enable-features=NetworkService'],
  });

  // Moto G-class device
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Moto G (40)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
  });
  await page.setNetworkThrottling ? null : null; // not available in puppeteer-core directly
  await page.emulateNetworkConditions ? null : null;

  const out = {};

  for (const route of ['/', '/shop']) {
    const failed = [];
    const onFail = (r) => failed.push(r.url().slice(0, 100));
    page.on('requestfailed', onFail);

    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1200));

    // 1) BLANK BOX AUDIT: images with zero visible paint
    out[route] = await page.evaluate(() => {
      const blanks = [];
      document.querySelectorAll('img').forEach((img) => {
        const r = img.getBoundingClientRect();
        const styled = img.closest('[class*="aspect-"], [class*="bg-stone"]');
        if ((img.style.display === 'none' || !img.complete || img.naturalWidth === 0) && r.width > 50) {
          blanks.push({
            src: img.getAttribute('src')?.slice(0, 70),
            hidden: img.style.display === 'none',
            parentHasBg: styled ? true : false,
            parentClass: img.parentElement?.className?.slice(0, 80),
          });
        }
      });
      // big empty-looking sections (no text, no img painted)
      const emptySections = [];
      document.querySelectorAll('main section, main > div > div').forEach((s) => {
        const r = s.getBoundingClientRect();
        const txt = (s.innerText || '').trim();
        if (r.height > 150 && r.width > 300 && txt.length < 10 && !s.querySelector('img:not([style*="display: none"])')) {
          if (s.querySelectorAll('img').length > 0) emptySections.push({ h: Math.round(r.height), cls: (s.className || '').slice(0, 90), imgs: s.querySelectorAll('img').length });
        }
      });
      return {
        totalImgs: document.querySelectorAll('img').length,
        blanks: blanks.slice(0, 8),
        emptySections: emptySections.slice(0, 6),
      };
    });

    // 2) WEIGHT AUDIT: transfer sizes by type
    out[route + 'Weight'] = await page.evaluate(async () => {
      const entries = performance.getEntriesByType('resource');
      const byType = {};
      let total = 0;
      entries.forEach((e) => {
        const t = e.initiatorType || 'other';
        byType[t] = (byType[t] || 0) + (e.transferSize || 0);
        total += e.transferSize || 0;
      });
      const big = entries
        .filter((e) => (e.transferSize || 0) > 12000)
        .sort((a, b) => b.transferSize - a.transferSize)
        .slice(0, 6)
        .map((e) => ({ url: e.name.split('/').slice(-2).join('/').slice(0, 60), kb: Math.round(e.transferSize / 1024) }));
      return { totalKB: Math.round(total / 1024), byType, big };
    });

    // 3) SMOOTHNESS AUDIT: long tasks during load
    out[route + 'LongTasks'] = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const tasks = [];
        if (!window.PerformanceObserver) return resolve('unsupported');
        try {
          const po = new PerformanceObserver((list) => {
            list.getEntries().forEach((e) => tasks.push(Math.round(e.duration)));
          });
          po.observe({ entryTypes: ['longtask'] });
          // scroll to trigger reveals
          window.scrollBy({ top: 2400, behavior: 'instant' });
          setTimeout(() => {
            window.scrollBy({ top: 2400, behavior: 'instant' });
          }, 500);
          setTimeout(() => resolve(tasks.slice(0, 12)), 1800);
        } catch {
          resolve('err');
        }
      });
    });

    page.off('requestfailed', onFail);
    out[route + 'Failed'] = failed.slice(0, 5);
  }

  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', String(e).slice(0, 300)); process.exit(1); });
