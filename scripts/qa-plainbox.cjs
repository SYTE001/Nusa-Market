/* Plain-box detector: screenshot each img/section, measure pixel variance.
   Low stddev = plain/unpainted box. Also reports hero & category tiles. */
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

  const report = {};
  for (const [label, route] of [['home', '/'], ['shop', '/shop']]) {
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise((r) => setTimeout(r, 1500));
    // scroll through to force lazy loads
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));

    const imgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter((i) => i.getBoundingClientRect().width > 40)
        .map((i, idx) => ({ idx, src: i.getAttribute('src') || '', box: i.getBoundingClientRect().toJSON() }))
    );

    const plain = [];
    for (const im of imgs.slice(0, 60)) {
      try {
        const el = (await page.$x(`//img[@src="${im.src}"]`))[0];
        if (!el) continue;
        const buf = await el.screenshot({ type: 'jpeg', quality: 60 });
        const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
        // stddev
        let sum = 0, sum2 = 0;
        for (let i = 0; i < data.length; i += 4) { sum += data[i]; sum2 += data[i] * data[i]; }
        const n = Math.ceil(data.length / 4);
        const mean = sum / n;
        const std = Math.sqrt(sum2 / n - mean * mean);
        if (std < 14) plain.push({ src: im.src.slice(0, 70), std: Math.round(std * 10) / 10 });
      } catch { /* skip */ }
    }
    report[label] = { imgCount: imgs.length, plainBoxes: plain };
  }
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', String(e).slice(0, 200)); process.exit(1); });
