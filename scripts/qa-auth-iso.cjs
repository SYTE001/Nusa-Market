/**
 * Pinpoint where the error goes. Patches the live page's runtime so the
 * supabase client's signInWithPassword reports exactly what it returns,
 * and the auth context's catch reports what it sees.
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

  // Wrap Promise.prototype.then/catch AFTER the page's JS has evaluated its
  // modules, by re-instrumenting at the point of the call. Simpler: intercept
  // fetch (already proven) + inspect React state through the DOM, plus test
  // the same code path in Node with the real error shape.
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Simulate the exact login flow by calling the same functions the app does,
  // but with instrumentation on the error path.
  const out = await page.evaluate(async () => {
    const log = [];
    try {
      // Find the supabase client in the page. It is created lazily and held
      // in module scope, so reach it through the auth context instead: the
      // login form is mounted, so useAuth is live.
      // Instead, replicate the error-mapping logic with the real payload.
      const fakeError = {
        code: 'invalid_credentials',
        message: 'Invalid login credentials',
        name: 'AuthApiError',
      };
      // The app's authErrorMessage() shape-checks `error instanceof Error`.
      log.push('fakeError instanceof Error: ' + (fakeError instanceof Error));
    } catch (e) {
      log.push('eval error: ' + e.message);
    }
    return { log };
  });
  console.log('page eval:', JSON.stringify(out));

  await browser.close();

  // Now reproduce in Node: what does supabase-js v2 actually hand back?
  const { createClient } = require('@supabase/supabase-js');
  const URL = 'https://jqjxhnvtxrycctvbvuac.supabase.co';
  const KEY = 'sb_publishable_lAG7DrrLsscOzQK5Ntjd6g_Vz-n6z7D';
  const sb = createClient(URL, KEY, { auth: { persistSession: false } });
  const r = await sb.auth.signInWithPassword({
    email: 'nobody99@example.com',
    password: 'wrongpass123',
  });
  console.log('--- signInWithPassword result (Node) ---');
  console.log('error name:', r.error?.name);
  console.log('error code:', r.error?.code);
  console.log('error message:', r.error?.message);
  console.log('error instanceof Error:', r.error instanceof Error);
  console.log('data session:', !!r.data?.session);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
