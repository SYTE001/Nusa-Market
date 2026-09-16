import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailCheck, ShieldCheck } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordField } from '../components/auth/PasswordField';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Only the new-password form is schema-driven; the reset-request form is a
// single email field, so it is kept as plain state below.
const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  useDocumentTitle('Reset password — NusaMarket');
  const navigate = useNavigate();
  const {
    passwordRecovery,
    session,
    updatePassword,
    resetPassword,
    finishPasswordRecovery,
  } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // The reset link has already been exchanged for a session by the time this
  // page renders — Supabase fires PASSWORD_RECOVERY for exactly this moment.
  // A signed-in user visiting directly can also change their password here.
  const canSetPassword = passwordRecovery || Boolean(session);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const { error } = await updatePassword(values.password);
    if (error) {
      setFormError(error);
      return;
    }
    // Drop the recovery flag so a later visit does not stay in recovery state.
    finishPasswordRecovery();
    setUpdated(true);
  }

  async function onRequestLink(event: React.FormEvent) {
    event.preventDefault();
    const email = resetEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError(null);
    setFormError(null);
    setSending(true);
    const { error, sent } = await resetPassword(email);
    setSending(false);
    if (sent) setSentTo(email);
    else if (error) setFormError(error);
  }

  if (updated) {
    return (
      <AuthShell>
        <div className="animate-fade-rise text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center border border-stone-300 bg-white">
            <ShieldCheck size={20} strokeWidth={1.75} className="text-clay-600" aria-hidden="true" />
          </span>
          <h2 className="font-display mt-6 text-2xl font-semibold tracking-tight text-ink">
            Password updated
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            Your new password is active. Use it the next time you sign in.
          </p>
          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/account', { replace: true })}
            >
              Back to account
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (sentTo) {
    return (
      <AuthShell>
        <div className="animate-fade-rise text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center border border-stone-300 bg-white">
            <MailCheck size={20} strokeWidth={1.75} className="text-clay-600" aria-hidden="true" />
          </span>
          <h2 className="font-display mt-6 text-2xl font-semibold tracking-tight text-ink">
            Check your inbox
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
            A reset link is on its way to <span className="font-semibold text-ink">{sentTo}</span>.
            Open it to choose a new password.
          </p>
          <div className="mt-8">
            <Button to="/login" variant="secondary" size="lg" fullWidth>
              Back to sign in
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="animate-fade-rise">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay-600">
          {canSetPassword ? 'Security' : 'Members'}
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
          {canSetPassword ? 'Choose a new password' : 'Reset your password'}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-stone-500">
          {canSetPassword
            ? 'Pick a password of at least 8 characters for your account.'
            : 'Enter the email on your account and we will send a link to reset it.'}
        </p>

        {canSetPassword ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
            <PasswordField
              label="New password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordField
              label="Confirm new password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            {formError && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {formError}
              </p>
            )}
            <Button type="submit" fullWidth size="lg" loading={isSubmitting} disabled={isSubmitting}>
              Update password
            </Button>
          </form>
        ) : (
          <form onSubmit={onRequestLink} noValidate className="mt-8 flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              error={emailError ?? undefined}
            />
            {formError && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {formError}
              </p>
            )}
            <Button type="submit" fullWidth size="lg" loading={sending} disabled={sending}>
              {sending ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-stone-500">
          Remembered it?{' '}
          <Link
            to="/login"
            className="font-semibold text-ink underline underline-offset-4 transition-colors duration-150 hover:text-clay-600"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
