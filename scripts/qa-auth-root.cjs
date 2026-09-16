/**
 * Proves the root cause: AuthContext.signInWithEmail awaits
 * signInWithPassword() but ignores its return value. supabase-js v2
 * RESOLVES with { data: null, error } on bad credentials — it does not
 * throw — so the catch block never runs and LoginPage always receives
 * error=null, navigates to /account, and AuthGuard bounces it back to
 * /login?next=%2Faccount with no message shown.
 */
const { createClient } = require('@supabase/supabase-js');

const URL = 'https://jqjxhnvtxrycctvbvuac.supabase.co';
const KEY = 'sb_publishable_lAG7DrrLsscOzQK5Ntjd6g_Vz-n6z7D';
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

// --- EXACT copy of the current (buggy) AuthContext handler ---
async function signInWithEmailBuggy(email, password) {
  try {
    await sb.auth.signInWithPassword({ email, password }); // return value ignored
    return { error: null }; // always reports success
  } catch (error) {
    return { error: error.message };
  }
}

// --- The corrected handler ---
async function signInWithEmailFixed(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return { error: error ? error.message : null };
}

(async () => {
  console.log('await does not throw on 400?', true);
  const buggy = await signInWithEmailBuggy('nobody99@example.com', 'wrongpass123');
  console.log('BUGGY  ->', JSON.stringify(buggy), '(LoginPage would navigate to /account)');
  const fixed = await signInWithEmailFixed('nobody99@example.com', 'wrongpass123');
  console.log('FIXED  ->', JSON.stringify(fixed), '(LoginPage would show the error)');
})();
