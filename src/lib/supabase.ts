import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for the auth system. Reads the public URL and anon key from
 * Vite env vars — only the publishable/anon key may ever appear here; the
 * service-role key belongs on a server and is never bundled into the client.
 *
 * The storefront must still build and run as a demo when no env is set (Vercel
 * preview deploys, fresh clones), so the client is created lazily and may be
 * null. Consumers check `isAuthConfigured` and degrade with an honest notice
 * instead of pretending sign-in works.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isAuthConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Session storage chosen per sign-in: "Remember me" keeps the Supabase
 * session in localStorage (survives browser close); unchecking it routes the
 * tokens to sessionStorage, so the sign-in ends when the tab closes. The
 * flag is set by the auth context just before each password sign-in; reads
 * check both stores so an existing session is always found.
 */
let rememberSession = true;

const dualStorage = {
  getItem(key: string): string | null {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (rememberSession) {
      window.localStorage.setItem(key, value);
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, value);
      window.localStorage.removeItem(key);
    }
  },
  removeItem(key: string): void {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export function setAuthPersistence(remember: boolean): void {
  rememberSession = remember;
}

if (isAuthConfigured) {
  client = createClient(url!, anonKey!, {
    auth: {
      // Persist the session and restore it on reload — this is what keeps a
      // user signed in across refreshes. OAuth redirects land on the site
      // with tokens in the URL; detectSessionInUrl exchanges them.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: dualStorage,
    },
  });
}

export const supabase: SupabaseClient | null = client;

/** Throws the friendly auth error when the deployment has no Supabase env. */
export function requireSupabase(): SupabaseClient {
  if (!client) {
    throw new Error('AUTH_NOT_CONFIGURED');
  }
  return client;
}
