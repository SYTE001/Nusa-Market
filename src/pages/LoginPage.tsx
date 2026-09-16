import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordField } from '../components/auth/PasswordField';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  useDocumentTitle('Sign in — NusaMarket');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithEmail, resetPassword } = useAuth();

  const [remember, setRemember] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // A ?next= target is only honored for same-origin paths, never open redirects.
  const rawNext = searchParams.get('next');
  const next = rawNext && /^\/(?!\/)/.test(rawNext) ? rawNext : '/account';

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    setResetSent(null);
    const { error } = await signInWithEmail(values.email, values.password, remember);
    if (error) {
      // Credential errors belong beside the password field.
      setError('password', { message: error });
      return;
    }
    navigate(next, { replace: true });
  }

  async function onForgotPassword() {
    const email = getValues('email');
    if (!email) {
      setError('email', { message: 'Enter your email first, then request a reset link.' });
      return;
    }
    setResetting(true);
    setFormError(null);
    const { error, sent } = await resetPassword(email);
    setResetting(false);
    if (sent) setResetSent(email);
    else if (error) setFormError(error);
  }

  return (
    <AuthShell>
      <div className="animate-fade-rise">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay-600">
          Members
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
          Sign in to your account
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-stone-500">
          Pick up your bag, your wishlist and your order receipts.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer accent-ink"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={resetting}
              className="cursor-pointer text-xs font-medium text-stone-500 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline disabled:cursor-wait"
            >
              {resetting ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>

          {resetSent && (
            <p
              role="status"
              className="border border-stone-300 bg-canvas-muted px-4 py-3 text-xs leading-relaxed text-stone-600"
            >
              A reset link is on its way to{' '}
              <span className="font-semibold text-ink">{resetSent}</span>. Open it to choose a
              new password.
            </p>
          )}
          {formError && (
            <p role="alert" className="text-xs font-medium text-red-600">
              {formError}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" loading={isSubmitting} disabled={isSubmitting}>
            Sign in
          </Button>
        </form>

        <div className="my-7 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            or
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <GoogleButton />

        <p className="mt-8 text-center text-xs text-stone-500">
          New to NusaMarket?{' '}
          <Link
            to="/register"
            className="font-semibold text-ink underline underline-offset-4 transition-colors duration-150 hover:text-clay-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
