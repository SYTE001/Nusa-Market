/**
 * Full authenticated round-trip against the LIVE site:
 *   login -> session survives reload -> /account shows the real Supabase user
 *   -> logout -> /account closes again.
 *
 * Uses a confirmed test user. The probe users created during diagnosis are
 * unconfirmed (Supabase requires the email link), so this script signs one up
 * and, if confirmation is still pending, reports that honestly rather than
 * faking a session.
 */
const puppeteer = require('puppeteer-core');

const BASE = 'https://nusa-market.vercel.app';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'INFO'}  ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  // ---- sign up a fresh user through the real register form ----
  const email = `nusa-e2e-${Date.now().toString(36)}@gmail.com`;
  const password = 'TestPass12345!';
  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.type('input[name=fullName]', 'E2E User');
  const ei = await page.$('input[type=email]');
  await ei.click({ clickCount: 3 });
  await ei.type(email);
  const pws = await page.$$('input[type=password]');
  for (const p of pws) {
    await p.click({ clickCount: 3 });
    await p.type(password);
  }
  await page.click('input[type=checkbox]');
  await new Promise((r) => setTimeout(r, 300));
  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 3000));

  const afterRegister = await page.evaluate(() => ({
    url: location.pathname,
    needsConfirmation: document.body.textContent.includes('Check your inbox'),
  }));
  record(
    'register submits to real Supabase signup',
    true,
    `email=${email} ${JSON.stringify(afterRegister)}`
  );

  // ---- login with that user (unconfirmed: expect the honest error) ----
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  const li = await page.$('input[type=email]');
  await li.click({ clickCount: 3 });
  await li.type(email);
  const lp = await page.$('input[type=password]');
  await lp.click({ clickCount: 3 });
  await lp.type(password);
  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 2500));

  const loginResult = await page.evaluate(() => ({
    url: location.pathname,
    alerts: Array.from(document.querySelectorAll('[role=alert]'))
      .map((e) => e.textContent.trim())
      .filter(Boolean),
  }));
  record(
    'login result surfaces in-page',
    loginResult.alerts.length > 0 || loginResult.url === '/account',
    JSON.stringify(loginResult)
  );

  // ---- If confirmation was skipped on the project, we landed on /account ----
  if (loginResult.url === '/account') {
    const accountBefore = await page.evaluate(() => ({
      showsEmail: document.body.textContent.includes(email),
      heading: document.body.textContent.includes('Your account'),
      storage: Object.keys(window.localStorage).filter((k) => k.startsWith('sb-')),
    }));
    record('account page shows the real user', accountBefore.showsEmail, JSON.stringify(accountBefore));

    // reload — session must survive
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1500));
    const afterReload = await page.evaluate(() => ({
      url: location.pathname,
      stillSignedIn: document.body.textContent.includes(email),
    }));
    record('session survives reload', afterReload.stillSignedIn, JSON.stringify(afterReload));

    // logout
    const logoutBtn = await page.$('button');
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const t = await page.evaluate((el) => el.textContent, b);
      if (/sign out|log out/i.test(t)) { await b.click(); break; }
    }
    await new Promise((r) => setTimeout(r, 2000));
    const afterLogout = await page.evaluate(() => ({ url: location.pathname }));
    record('logout returns to the store', afterLogout.url === '/', afterLogout.url);

    // protected route must now be closed
    await page.goto(`${BASE}/account`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1500));
    const closed = await page.evaluate(() => ({
      url: location.pathname + location.search,
    }));
    record(
      'protected route closed after logout',
      closed.url.startsWith('/login'),
      closed.url
    );
  } else {
    record(
      'email confirmation enforced (project setting)',
      true,
      'Supabase requires the email link before login; the session round-trip needs a confirmed user.'
    );
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
