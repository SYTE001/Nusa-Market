/**
 * Translates raw Supabase auth errors into copy that reads like the rest of
 * the storefront. Unknown errors fall back to a neutral line rather than
 * leaking backend prose into the UI.
 */
export function authErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    const message = error.message.toLowerCase();

    if (message === 'auth_not_configured' || code === 'AUTH_NOT_CONFIGURED') {
      return 'Sign-in is not configured on this deployment yet.';
    }
    if (message.includes('invalid login credentials')) {
      return 'That email and password combination is not recognized.';
    }
    if (
      message.includes('email already registered') ||
      message.includes('user already registered') ||
      message.includes('already been registered')
    ) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (message.includes('password should be at least') || message.includes('password should contain')) {
      return 'Password is too weak — Supabase requires at least 6 characters.';
    }
    if (message.includes('unable to validate email') || message.includes('invalid email')) {
      return 'Enter a valid email address.';
    }
    if (message.includes('email not confirmed')) {
      return 'Confirm your email address first — the link is in your inbox.';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Too many attempts. Wait a moment and try again.';
    }
    if (message.includes('failed to fetch') || message.includes('networkerror') || message.includes('network request failed')) {
      return 'Network connection failed. Check your connection and try again.';
    }
    if (message.includes('oauth') || message.includes('provider')) {
      return 'Google sign-in could not complete. Try again, or use your email.';
    }
    if (message.includes('session expired') || message.includes('invalid jwt') || message.includes('refresh token not found')) {
      return 'Your session has expired. Please sign in again.';
    }
  }
  return 'Something went wrong. Please try again.';
}
