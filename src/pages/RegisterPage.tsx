import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailCheck } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordField } from '../components/auth/PasswordField';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const schema = z
  .object({
    fullName: z.string().min(3, 'Full name is required'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, 'Please accept the terms to continue'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  useDocumentTitle('Create account — NusaMarket');
  const { signUpWithEmail, configured } = useAuth();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setEmailError(null);
    setFormError(null);
    const { error, needsEmailConfirmation } = await signUpWithEmail(
      values.fullName,
      values.email,
      values.password
    );
    if (error) {
      // Email-collision errors belong beside the email field; everything
      // else (network, config) is a form-level line.
      if (/email|exist/i.test(error)) setEmailError(error);
      else setFormError(error);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationSent(values.email);
    }
    // Email confirmation disabled on the project — the context already holds
    // the session, so GuestGuard will redirect to /account on re-render.
  }

  if (confirmationSent) {
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
            We sent a confirmation link to{' '}
            <span className="font-semibold text-ink">{confirmationSent}</span>. Confirm your
            email, then sign in to reach your account.
          </p>
          <div className="mt-8">
            <Button to="/login" variant="primary" size="lg" fullWidth>
              Go to sign in
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
          Join the list
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
          Create your account
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-stone-500">
          Save pieces, track orders and keep your bag across devices.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
          <Input
            label="Full name"
            autoComplete="name"
            placeholder="Nama lengkap"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            error={errors.email?.message ?? emailError ?? undefined}
            {...register('email')}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div>
            <label className="flex cursor-pointer select-none items-start gap-2.5 text-xs leading-relaxed text-stone-600">
              <input
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-ink"
                {...register('terms')}
              />
              <span>
                I agree to the Terms of Craft and Privacy Policy. This is a portfolio storefront
                — nothing is sold and no payment is processed.
              </span>
            </label>
            {errors.terms && (
              <p role="alert" className="mt-1.5 text-[11px] font-medium text-red-600">
                {errors.terms.message}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-xs font-medium text-red-600">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting || !configured}
          >
            Create account
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
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-ink underline underline-offset-4 transition-colors duration-150 hover:text-clay-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
