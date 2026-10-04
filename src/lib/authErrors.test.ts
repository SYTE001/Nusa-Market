import { describe, expect, it } from 'vitest';
import { authErrorMessage } from './authErrors';

function supabaseError(message: string, code?: string): Error {
  const err = new Error(message);
  if (code) (err as { code?: string }).code = code;
  return err;
}

describe('authErrorMessage', () => {
  const cases: Array<[string, string]> = [
    ['Invalid login credentials', 'That email and password combination is not recognized.'],
    ['User already registered', 'An account with this email already exists. Try signing in instead.'],
    ['Password should be at least 6 characters', 'Password is too weak — Supabase requires at least 6 characters.'],
    ['Unable to validate email address', 'Enter a valid email address.'],
    ['Email not confirmed', 'Confirm your email address first — the link is in your inbox.'],
    ['Rate limit exceeded', 'Too many attempts. Wait a moment and try again.'],
    ['Failed to fetch', 'Network connection failed. Check your connection and try again.'],
    ['Session expired', 'Your session has expired. Please sign in again.'],
  ];

  it.each(cases)('maps "%s" to storefront copy', (raw, expected) => {
    expect(authErrorMessage(supabaseError(raw))).toBe(expected);
  });

  it('maps the AUTH_NOT_CONFIGURED code even when the message is generic', () => {
    expect(authErrorMessage(supabaseError('oops', 'AUTH_NOT_CONFIGURED'))).toBe(
      'Sign-in is not configured on this deployment yet.'
    );
  });

  it('never leaks backend prose for unknown errors', () => {
    expect(authErrorMessage(supabaseError('traveling_salesman_problem: pgcrypto exploded'))).toBe(
      'Something went wrong. Please try again.'
    );
  });

  it('handles non-Error throwables', () => {
    expect(authErrorMessage('failed to fetch')).toBe('Something went wrong. Please try again.');
    expect(authErrorMessage(null)).toBe('Something went wrong. Please try again.');
  });
});
