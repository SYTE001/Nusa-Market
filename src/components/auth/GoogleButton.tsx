import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authErrorMessage } from '../../lib/authErrors';

/**
 * The Supabase OAuth handoff, styled as a secondary storefront button.
 * A successful request means the browser is leaving for Google, so the
 * button stays in its loading state until the page unloads (or 3.5s pass
 * with no redirect, which surfaces the real error instead).
 */
export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  const { signInWithGoogle, configured } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the handoff never completes, stop spinning and say so honestly.
  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => {
      setPending(false);
      setError(authErrorMessage(new Error('OAuth redirect failed')));
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [pending]);

  async function onClick() {
    setError(null);
    setPending(true);
    const { error: oauthError } = await signInWithGoogle();
    if (oauthError) {
      setPending(false);
      setError(oauthError);
    }
    // On success the redirect has already started; leave `pending` true.
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={!configured || pending}
        aria-label={label}
        aria-busy={pending || undefined}
        className="inline-flex h-11 w-full items-center justify-center gap-2.5 border border-stone-300 bg-white text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-2xs transition-all duration-150 hover:border-ink hover:bg-stone-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin text-stone-500" aria-hidden="true" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.54v2.93h3.88c2.28-2.09 3.58-5.19 3.58-8.66Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.93l-3.88-2.93c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.03A11.99 11.99 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.27 14.33a7.2 7.2 0 0 1 0-4.66V6.64H1.27a12 12 0 0 0 0 10.72l4-3.03Z" />
            <path fill="#EA4335" d="M12 4.71c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.27 6.64l4 3.03C6.22 6.82 8.87 4.71 12 4.71Z" />
          </svg>
        )}
        {label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
