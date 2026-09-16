/**
 * Hunt the 404 heard on /login during the auth probe, and verify the whole
 * auth surface against the live backend once more.
 */
const puppeteer =require('puppeteer-core');

const BASE = 'https://nusa-market.vercel.app';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const failed = [];
  page.on('requestfailed', (r) => failed.push(r.url().slice(0, 100) + ' [' + r.failure()?.errorText + ']'));
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('supabase.co/auth/v1/token')) {
      failed.push(res.status() + ' ' + res.url().slice(0, 100));
    }
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  console.log('--- requests that failed or 4xx/5xx (excluding the expected 401/400 auth calls) ---');
  for (const f of [...new Set(failed)]) console.log(' ', f);
  if (!failed.length) console.log('  none');

  // Also: what does the login page actually request?
  const reqs = [];
  page.on('request', (r) => reqs.push(r.url().slice(0, 80)));
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  console.log('\n--- all requests on /login reload ---');
  for (const r of [...new Set(reqs)]) console.log(' ', r);

  await browser.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
