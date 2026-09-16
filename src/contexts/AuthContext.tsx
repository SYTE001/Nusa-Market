import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { isAuthConfigured, requireSupabase, setAuthPersistence } from '../lib/supabase';
import { authErrorMessage } from '../lib/authErrors';

/** The account shape the app renders — derived from Supabase user metadata. */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  provider: string;
};

type AuthResult = { error: string | null; needsEmailConfirmation: boolean };

export type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  /** True until the initial getSession() resolves (or is skipped when unconfigured). */
  loading: boolean;
  /** False on deployments without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. */
  configured: boolean;
  signInWithEmail: (email: string, password: string, remember: boolean) => Promise<AuthResult>;
  signUpWithEmail: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null; sent: boolean }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  /** True after landing on the site from a password-reset link. */
  passwordRecovery: boolean;
  finishPasswordRecovery: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  const identities = (u as { identities?: { provider?: string }[] }).identities;
  const provider = identities?.[0]?.provider ?? u.app_metadata?.provider ?? 'email';
  const meta = u.user_metadata as { full_name?: string; name?: string; picture?: string; avatar_url?: string } | undefined;
  const name = meta?.full_name || meta?.name || u.email?.split('@')[0] || '';
  return {
    id: u.id,
    email: u.email ?? '',
    name,
    avatarUrl: meta?.picture || meta?.avatar_url || null,
    provider,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // Set when Supabase fires PASSWORD_RECOVERY (the user landed on the site
  // from a reset link) — drives the /auth/reset page into its form state.
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  // Until the first getSession() resolves (or the client is known to be
  // unconfigured), guards must render their loading state, never a redirect —
  // that is what keeps /account from flicking to /login on every refresh.
  const [loading, setLoading] = useState(isAuthConfigured);

  useEffect(() => {
    const supabase = requireSupabaseSafe();
    if (!supabase) return;

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      if (event === 'SIGNED_OUT') setPasswordRecovery(false);
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback<AuthContextValue['signInWithEmail']>(
    async (email, password, remember) => {
      try {
        setAuthPersistence(remember);
        // supabase-js v2 RESOLVES with { data, error } on a failed sign-in —
        // it does not throw. Reading the return value is the only way the
        // credential error ever reaches the user.
        const { error } = await requireSupabase().auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: authErrorMessage(error), needsEmailConfirmation: false };
        return { error: null, needsEmailConfirmation: false };
      } catch (error) {
        return { error: authErrorMessage(error), needsEmailConfirmation: false };
      }
    },
    []
  );

  const signUpWithEmail = useCallback<AuthContextValue['signUpWithEmail']>(
    async (fullName, email, password) => {
      try {
        setAuthPersistence(true);
        const supabase = requireSupabase();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) return { error: authErrorMessage(error), needsEmailConfirmation: false };
        // Supabase returns a session immediately only when email
        // confirmation is off in the project settings.
        const needsEmailConfirmation = !data.session;
        return { error: null, needsEmailConfirmation };
      } catch (error) {
        return { error: authErrorMessage(error), needsEmailConfirmation: false };
      }
    },
    []
  );

  const signInWithGoogle = useCallback<AuthContextValue['signInWithGoogle']>(async () => {
    try {
      setAuthPersistence(true);
      const supabase = requireSupabase();
      // skipBrowserRedirect lets us validate the handoff before leaving the
      // page. Supabase returns the authorize URL without an error even when
      // the provider is disabled — the browser would otherwise navigate to
      // a raw JSON error page with no way back. Checking the endpoint first
      // turns that dead end into an in-page message.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          skipBrowserRedirect: true,
        },
      });
      if (error) return { error: authErrorMessage(error) };
      if (!data?.url) return { error: 'Google sign-in could not start.' };

      const check = await fetch(data.url, { method: 'GET', redirect: 'follow' });
      if (!check.ok) {
        return {
          error:
            'Google sign-in is not enabled on this project yet. Enable the Google provider in the Supabase dashboard, or sign in with your email.',
        };
      }
      // Provider is live — now commit to the OAuth handoff.
      window.location.assign(data.url);
      return { error: null };
    } catch (error) {
      return { error: authErrorMessage(error) }
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = requireSupabaseSafe();
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const resetPassword = useCallback<AuthContextValue['resetPassword']>(async (email) => {
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) return { error: authErrorMessage(error), sent: false };
      return { error: null, sent: true };
    } catch (error) {
      return { error: authErrorMessage(error), sent: false };
    }
  }, []);

  const updatePassword = useCallback<AuthContextValue['updatePassword']>(async (password) => {
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error ? authErrorMessage(error) : null };
    } catch (error) {
      return { error: authErrorMessage(error) };
    }
  }, []);

  const finishPasswordRecovery = useCallback(() => setPasswordRecovery(false), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: toAuthUser(session),
      session,
      loading,
      configured: isAuthConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      resetPassword,
      updatePassword,
      passwordRecovery,
      finishPasswordRecovery,
    }),
    [session, loading, passwordRecovery, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, resetPassword, updatePassword, finishPasswordRecovery]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function requireSupabaseSafe() {
  return isAuthConfigured ? requireSupabase() : null;
}
