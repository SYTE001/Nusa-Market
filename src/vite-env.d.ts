/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xxxxxxxx.supabase.co. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon/publishable key — never the service-role key. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
