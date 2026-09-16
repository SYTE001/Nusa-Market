// Does signInWithOAuth resolve with an error, or navigate away regardless?
const { createClient } = require('@supabase/supabase-js');

const URL = 'https://jqjxhnvtxrycctvbvuac.supabase.co';
const KEY = 'sb_publishable_lAG7DrrLsscOzQK5Ntjd6g_Vz-n6z7D';
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

(async () => {
  const r = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://nusa-market.vercel.app/account' },
  });
  console.log('error message:', r.error?.message ?? 'null');
  console.log('error code:', r.error?.code ?? 'null');
  console.log('data.url:', r.data?.url ?? 'null');
  console.log('=> In a browser, window.location.assign(data.url) is what leaves the site.');
})();
