import { Suspense, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function GuardLoader() {
  return (
    <div
      role="status"
      aria-label="Checking your session"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-ink" />
    </div>
  );
}

/**
 * Protected route wrapper driven by the real Supabase session — never by a
 * hand-rolled localStorage flag. While the initial getSession() resolves it
 * renders a loader instead of redirecting, so a refresh on a protected page
 * never flickers through /login.
 */
export function AuthGuard({ children }: { children?: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Suspense fallback={<GuardLoader />}>
        <GuardLoader />
      </Suspense>
    );
  }

  if (!session) {
    // Remember where they were going; the login page honors ?next=.
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

/**
 * Mirror guard for /login and /register: a signed-in user has no business
 * seeing the forms, so they go straight to their account.
 */
export function GuestGuard() {
  const { session, loading } = useAuth();

  if (loading) {
    return <GuardLoader />;
  }
  if (session) {
    return <Navigate to="/account" replace />;
  }
  return <Outlet />;
}
