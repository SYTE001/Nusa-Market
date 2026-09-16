/**
 * Register network trace: what does the signup call return?
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
  page.on('response', async (res) => {
    if (res.url().includes('/auth/')) {
      let body = '';
      try { body = (await res.text()).slice(0, 300); } catch {}
      net.push({ status: res.status(), path: res.url().split('v1/').pop(), body });
    }
  });

  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  const email = `nusa-reg-${Date.now().toString(36)}@gmail.com`;
  await page.type('input[name=fullName]', 'Reg Trace');
  const ei = await page.$('input[type=email]');
  await ei.click({ clickCount: 3 });
  await ei.type(email);
  const pws = await page.$$('input[type=password]');
  for (const p of pws) {
    await p.click({ clickCount: 3 });
    await p.type('TestPass12345!');
  }
  await page.click('input[type=checkbox]');
  await new Promise((r) => setTimeout(r, 300));
  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 3000));

  const dom = await page.evaluate(() => ({
    url: location.pathname,
    alerts: Array.from(document.querySelectorAll('[role=alert]'))
      .map((e) => e.textContent.trim())
      .filter(Boolean),
    inbox: document.body.textContent.includes('Check your inbox'),
  }));
  console.log('email:', email);
  console.log('dom:', JSON.stringify(dom));
  console.log('network:');
  for (const n of net) console.log(' ', JSON.stringify(n));

  await browser.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
