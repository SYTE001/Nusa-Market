/**
 * Focused probe: trace the exact network exchange and DOM state when the
 * login form is submitted with invalid credentials, to find where the
 * Supabase error gets lost.
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
  const net = [];
  page.on('request', (req) => {
    if (req.url().includes('supabase') || req.url().includes('auth')) {
      net.push({ m: 'REQ', url: req.url().slice(0, 90), method: req.method() });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('supabase') || res.url().includes('/auth/')) {
      let body = '';
      try {
        body = (await res.text()).slice(0, 200);
      } catch {}
      net.push({
        m: 'RES',
        status: res.status(),
        url: res.url().slice(0, 90),
        body,
      });
    }
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('--- typing bad credentials + Enter ---');
  await page.click('input[type=email]', { clickCount: 3 });
  await page.type('input[type=email]', 'nobody99@example.com');
  await page.click('input[type=password]', { clickCount: 3 });
  await page.type('input[type=password]', 'wrongpass123');
  await page.keyboard.press('Enter');

  for (const ms of [800, 1600, 3000]) {
    await new Promise((r) => setTimeout(r, ms));
    const dom = await page.evaluate(() => ({
      url: location.pathname + location.search,
      alerts: Array.from(document.querySelectorAll('[role=alert]'))
        .map((e) => e.textContent.trim())
        .filter(Boolean),
      submitDisabled: document.querySelector('button[type=submit]')?.disabled,
      submitText: document.querySelector('button[type=submit]')?.textContent.trim(),
    }));
    console.log(`t+${ms}:`, JSON.stringify(dom));
  }

  console.log('\n--- network trace ---');
  for (const n of net) console.log(JSON.stringify(n));

  await browser.close();
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
