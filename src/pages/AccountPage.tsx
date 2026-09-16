import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogOut, MapPin, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrderStore } from '../stores/orderStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PasswordField } from '../components/auth/PasswordField';
import { Button } from '../components/ui/Button';
import { formatRupiah } from '../utils';

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

export default function AccountPage() {
  useDocumentTitle('Account — NusaMarket');
  const navigate = useNavigate();
  const { user, signOut, updatePassword, configured } = useAuth();
  const order = useOrderStore((s) => s.order);

  const [formError, setFormError] = useState<string | null>(null);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // AuthGuard already guaranteed a session, but keep the render honest if the
  // page is ever reached without one.
  if (!user) return null;

  const initials = user.name
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const isEmailAccount = user.provider === 'email';

  async function onSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  async function onSubmit(values: FormValues) {
    setFormError(null);
    setPasswordUpdated(false);
    const { error } = await updatePassword(values.password);
    if (error) {
      setFormError(error);
      return;
    }
    setPasswordUpdated(true);
    reset({ password: '', confirmPassword: '' });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 border-b border-stone-200/80 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Members
        </span>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Your account
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Profile + recent order */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <section className="border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Profile
            </h2>
            <div className="mt-5 flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-14 w-14 rounded-full border border-stone-200 object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-50 font-display text-base font-semibold text-clay-700"
                >
                  {initials || '—'}
                </span>
              )}
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold tracking-tight text-ink">
                  {user.name || 'Member'}
                </p>
                <p className="truncate text-xs text-stone-500">{user.email}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-clay-600">
                  via {user.provider}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row">
              <Button variant="secondary" size="md" onClick={onSignOut} className="sm:w-auto">
                <LogOut size={13} strokeWidth={2} aria-hidden="true" />
                Sign out
              </Button>
              {!configured && (
                <p className="self-center text-[11px] text-stone-400">
                  Auth is not configured on this deployment.
                </p>
              )}
            </div>
          </section>

          <section className="border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Most recent order
            </h2>
            {order ? (
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-mono-data text-stone-500">Order {order.id}</span>
                  <span className="text-stone-400">
                    {new Date(order.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="mt-4 flex flex-col divide-y divide-stone-100">
                  {order.items.map((item, i) => (
                    <div
                      key={`${item.product.id}-${i}`}
                      className="flex items-start justify-between gap-3 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-ink">
                          {item.product.name}
                        </span>
                        <span className="block text-[10px] text-stone-500">
                          {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')} ×{' '}
                          {item.quantity}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-clay-600">
                          <MapPin size={9} aria-hidden="true" />
                          {item.product.craft.atelier}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-ink">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-bold tabular-nums text-ink">{formatRupiah(order.total)}</span>
                </div>
                <div className="mt-5">
                  <Button to="/order/success" variant="ghost" size="sm" className="sm:w-auto">
                    View receipt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-stone-500">
                  No order is held for this session. Receipts are kept in this tab only — nothing
                  is stored on a server.
                </p>
                <div>
                  <Button to="/shop" variant="ghost" size="sm" className="sm:w-auto">
                    Explore the collection
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Security */}
        <div className="lg:col-span-5">
          <section className="border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              <KeyRound size={13} strokeWidth={2} aria-hidden="true" />
              Password
            </h2>
            {isEmailAccount ? (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
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
                  <p role="alert" className="text-[11px] font-medium text-red-600">
                    {formError}
                  </p>
                )}
                {passwordUpdated && (
                  <p role="status" className="text-[11px] font-medium text-clay-700">
                    Password updated.
                  </p>
                )}
                <Button type="submit" size="md" loading={isSubmitting} disabled={isSubmitting} className="sm:w-auto">
                  Update password
                </Button>
                <p className="text-[11px] leading-relaxed text-stone-400">
                  Forgot it entirely?{' '}
                  <Link
                    to="/auth/reset"
                    className="font-medium text-stone-600 underline underline-offset-4 transition-colors duration-150 hover:text-ink"
                  >
                    Send a reset link
                  </Link>
                  .
                </p>
              </form>
            ) : (
              <p className="mt-5 text-xs leading-relaxed text-stone-500">
                You signed in with {user.provider}. Your password is managed by that provider, so
                there is nothing to change here.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
