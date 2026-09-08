/* Focused admin-gate QA with real keyboard events. */
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });

  await page.goto('http://localhost:4173/admin', { waitUntil: 'networkidle2' });

  // Type like a human — real key events reach React's onChange.
  await page.click('input[type="password"]');
  await page.type('input[type="password"]', 'nusa2026', { delay: 10 });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 700));

  const adminIn = await page.evaluate(() => ({
    console: document.querySelector('main').innerText.includes('Catalog Console'),
    passcodeFieldGone: !document.querySelector('input[type="password"]'),
    statText: document.querySelector('main').innerText.match(/Inventory value[^\n]*/)?.[0] ?? null,
  }));

  console.log(JSON.stringify({ adminIn, consoleErrors }, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
