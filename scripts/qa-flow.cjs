const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });

  // --- Admin gate, driven with real keyboard events ---
  await page.goto('http://localhost:4173/admin', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  const probe = await page.evaluate(() => ({
    pwInputs: document.querySelectorAll('input[type="password"]').length,
    submits: document.querySelectorAll('button[type="submit"]').length,
  }));
  console.log('admin probe', JSON.stringify(probe));
  await page.type('input[type="password"]', 'nusa2026');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 700));
  const adminIn = await page.evaluate(() =>
    document.querySelector('main').innerText.includes('Catalog Console')
  );
  console.log('admin unlocked (real keyboard):', adminIn);

  // --- Full purchase flow: add to cart -> checkout -> order success ---
  await page.goto('http://localhost:4173/shop', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));
  await page.click('button[aria-label^="Quick add"]');
  await new Promise((r) => setTimeout(r, 900));
  await page.goto('http://localhost:4173/checkout', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 500));
  const checkoutProbe = await page.evaluate(() => ({
    isEmpty: document.querySelector('main').innerText.includes('Explore the Collection'),
    hasForm: !!document.querySelector('form'),
  }));
  console.log('checkout probe', JSON.stringify(checkoutProbe));

  await page.type('input[name="name"]', 'Sari Wulandari');
  await page.type('input[name="email"]', 'sari@example.com');
  await page.type('input[name="phone"]', '081234567890');
  await page.type('input[name="address"]', 'Jl. Merdeka No. 17 RT 03 RW 05');
  await page.type('input[name="city"]', 'Bandung');
  await page.type('input[name="province"]', 'Jawa Barat');
  await page.type('input[name="postalCode"]', '40123');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1600));
  const orderProbe = await page.evaluate(() => ({
    url: location.pathname,
    isOrderSuccess: document.querySelector('main').innerText.includes('Order Successfully Placed'),
    orderId: (document.querySelector('main').innerText.match(/NM-\d{6}-[A-Z0-9]{4}/) || [null])[0],
  }));
  console.log('order probe', JSON.stringify(orderProbe));

  // --- Auth pages render the not-configured notice honestly ---
  for (const route of ['/login', '/register', '/auth/reset']) {
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 300));
    const p = await page.evaluate(() => ({
      notice: document.querySelector('main').innerText.includes('not configured'),
      formPresent: !!document.querySelector('form'),
    }));
    console.log(route, JSON.stringify(p));
  }

  // --- Protected route redirects to login when unauthenticated ---
  await page.goto('http://localhost:4173/account', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 400));
  const accountProbe = await page.evaluate(() => ({ url: location.pathname + location.search }));
  console.log('account probe', JSON.stringify(accountProbe));

  console.log('consoleErrors:', JSON.stringify(errors));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
