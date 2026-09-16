/**
 * Decide where the error-display path breaks. Two hypotheses:
 *  H1: authErrorMessage() does not recognize the v2 error shape and returns
 *      the generic "Something went wrong", which is set on the password field.
 *  H2: supabase-js v2's signInWithPassword resolves (not rejects) with
 *      { data: null, error }, but AuthContext treats it as a thrown error.
 * Captures the real JS objects in-page.
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

  // Expose the exact error object the browser hands to the catch block.
  await page.evaluateOnNewDocument(() => {
    window.__captured = [];
    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const res = await origFetch.apply(this, args);
      if (typeof args[0] === 'string' && args[0].includes('/auth/')) {
        const clone = res.clone();
        try {
          window.__captured.push({
            url: args[0],
            status: res.status,
            body: await clone.text(),
          });
        } catch {}
      }
      return res;
    };
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Type + submit, then read the captured response AND the DOM error path.
  await page.click('input[type=email]', { clickCount: 3 });
  await page.type('input[type=email]', 'nobody99@example.com');
  await page.click('input[type=password]', { clickCount: 3 });
  await page.type('input[type=password]', 'wrongpass123');
  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 2500));

  const out = await page.evaluate(() => {
    const pwField = document.querySelector('input[type=password]');
    // Walk up to the field wrapper and find its [role=alert] sibling.
    const wrapper = pwField?.closest('div.flex');
    const alert = wrapper?.querySelector('[role=alert]');
    return {
      captured: window.__captured,
      pwFieldAriaInvalid: pwField?.getAttribute('aria-invalid'),
      pwWrapperAlert: alert?.textContent?.trim() ?? null,
      allAlerts: Array.from(document.querySelectorAll('[role=alert]'))
        .map((e) => e.textContent.trim())
        .filter(Boolean),
      url: location.pathname + location.search,
    };
  });
  console.log(JSON.stringify(out, null, 2));

  await browser.close();
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
