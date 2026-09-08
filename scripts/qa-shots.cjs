/* Capture mobile + desktop screenshots (small JPEGs) for visual QA. */
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });

  async function shot(url, w, h, out, fullPage = false) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: out, type: 'jpeg', quality: 72, fullPage });
    await page.close();
    console.log('saved', out);
  }

  const base = 'http://localhost:4173';
  await shot(`${base}/`, 360, 740, 'scripts/shots/home-mobile.jpg');
  await shot(`${base}/shop`, 360, 740, 'scripts/shots/shop-mobile.jpg');
  await shot(`${base}/`, 1280, 900, 'scripts/shots/home-desktop.jpg');
  await shot(`${base}/shop`, 1280, 900, 'scripts/shots/shop-desktop.jpg');

  await browser.close();
})().catch((e) => { console.error('FATAL', String(e).slice(0, 200)); process.exit(1); });
