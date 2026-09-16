/**
 * Debug the register flow: capture the network response the signup call gets.
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
      try { body = (await res.text()).slice(0, 250); } catch {}
      net.push({ status: res.status(), url: res.url().split('/').pop(), body });
    }
  });

  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  await page.type('input[name=fullName]', 'QA Probe');
  const emailInput = await page.$('input[type=email]');
  await emailInput.click({ clickCount: 3 });
  await emailInput.type('nusa-qa-7714@gmail.com');
  const pws = await page.$$('input[type=password]');
  for (const p of pws) {
    await p.click({ clickCount: 3 });
    await p.type('TestPass12345!');
  }
  await page.click('input[type=checkbox]');
  await new Promise((r) => setTimeout(r, 300));

  // Inspect the submit button state before clicking
  const btn = await page.evaluate(() => ({
    disabled: document.querySelector('button[type=submit]')?.disabled,
    text: document.querySelector('button[type=submit]')?.textContent.trim(),
  }));
  console.log('submit button before click:', JSON.stringify(btn));

  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 3000));

  const after = await page.evaluate(() => ({
    url: location.pathname,
    alerts: Array.from(document.querySelectorAll('[role=alert]'))
      .map((e) => e.textContent.trim())
      .filter(Boolean),
    bodySnippet: document.body.textContent.slice(0, 120),
  }));
  console.log('after submit:', JSON.stringify(after, null, 2));
  console.log('network:');
  for (const n of net) console.log(' ', JSON.stringify(n));

  await browser.close();
}

main().catch((e) => { console.error('FATAL', e); process.exit(2); });
