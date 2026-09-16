/**
 * Precise Google-OAuth trace. The /auth/v1/settings endpoint says the Google
 * provider is disabled and the authorize endpoint 400s with
 * "Unsupported provider: provider is not enabled", yet the button appears to
 * leave the site. Determine exactly what happens on the click.
 */
const puppeteer = require('puppeteer-core');

const BASE = 'https://nusa-market.vercel.app';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const nav = [];
  page.on('framenavigated', (f) => {
    if (f === page.mainFrame()) nav.push(f.url());
  });
  const res = [];
  page.on('response', (r) => {
    if (r.url().includes('authorize') || r.url().includes('google')) {
      res.push({ status: r.status(), url: r.url().slice(0, 120) });
    }
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await page.click('button[aria-label*="Google"]');
  await new Promise((r) => setTimeout(r, 6000));

  console.log('--- main-frame navigations after Google click ---');
  for (const u of nav) console.log(' ', u.slice(0, 140));
  console.log('--- authorize/google responses ---');
  for (const r of res) console.log(' ', JSON.stringify(r));

  const final = await page.evaluate(() => ({
    url: location.href,
    alerts: Array.from(document.querySelectorAll('[role=alert]'))
      .map((e) => e.textContent.trim())
      .filter(Boolean),
  }));
  console.log('--- final page state ---');
  console.log(JSON.stringify(final, null, 2));

  await browser.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
