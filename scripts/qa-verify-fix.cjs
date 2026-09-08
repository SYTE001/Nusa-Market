/* Verify: 1) mobile fetches -480 variants, 2) new tiles have visible contrast. */
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2, isMobile: true });
  const requests = [];
  page.on('request', (r) => { if (r.url().includes('.webp')) requests.push(r.url().split('/').pop()); });

  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle2', timeout: 25000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
  });

  const small = requests.filter((r) => r.includes('-480')).length;
  const big = requests.filter((r) => !r.includes('-480')).length;

  // pixel variance of first product card image (new tiles)
  const el = await page.$('img[loading="lazy"]');
  const buf = await el.screenshot({ type: 'jpeg', quality: 70 });
  const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  let sum = 0, sum2 = 0;
  for (let i = 0; i < data.length; i += 4) { sum += data[i]; sum2 += data[i] * data[i]; }
  const n = Math.ceil(data.length / 4);
  const std = Math.sqrt(sum2 / n - (sum / n) ** 2);

  console.log(JSON.stringify({
    mobileRequests: { small480: small, bigMaster: big, sample: requests.slice(0, 4) },
    firstTileStdDev: Math.round(std * 10) / 10,
    verdict: std > 25 ? 'tiles clearly textured (not plain)' : std > 14 ? 'tiles subtly textured' : 'STILL PLAIN',
  }, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', String(e).slice(0, 200)); process.exit(1); });
