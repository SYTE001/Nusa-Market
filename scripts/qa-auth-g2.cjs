/**
 * The Google flow lands on a raw Supabase 400 JSON page because the provider
 * is disabled. Trace where signInWithOAuth resolves in the app so the button
 * can surface the error in-page instead of leaving the site for JSON.
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

  // Capture the supabase-js call result by wrapping fetch on the authorize
  // call — the library detects the 400 before navigating and should resolve
  // with an error. A full navigation means it did not get the chance.
  await page.evaluateOnNewDocument(() => {
    window.__auth = [];
    const o = window.fetch;
    window.fetch = async function (...a) {
      const r = await o.apply(this, a);
      if (typeof a[0] === 'string' && a[0].includes('authorize')) {
        try {
          window.__auth.push({ status: r.status, body: await r.clone().text() });
        } catch {}
      }
      return r;
    };
  });

  // Block the top-level navigation to the authorize URL so the page survives
  // and the in-page error path (if any) can be observed.
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url().includes('/auth/v1/authorize')) {
      req.respond({ status: 400, body: '{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}' });
    } else {
      req.continue();
    }
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await page.click('button[aria-label*="Google"]');
  await new Promise((r) => setTimeout(r, 4000));

  const final = await page.evaluate(() => ({
    url: location.href,
    alerts: Array.from(document.querySelectorAll('[role=alert]'))
      .map((e) => e.textContent.trim())
      .filter(Boolean),
    auth: window.__auth,
    btnDisabled: document.querySelector('button[aria-label*="Google"]')?.disabled,
  }));
  console.log(JSON.stringify(final, null, 2));

  await browser.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
