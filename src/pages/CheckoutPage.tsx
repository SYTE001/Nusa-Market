import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import type { PaymentMethod, ShippingMethod } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { shippingCostFor, formatRupiah, generateOrderId } from '../utils';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const schema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(9, 'Enter a valid phone number'),
  address: z.string().min(10, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().regex(/^\d{5}$/, 'Postal code is 5 digits'),
});

const PAYMENT_METHODS: { value: PaymentMethod; label: string; note: string }[] = [
  { value: 'bank-transfer', label: 'Bank Transfer', note: 'Virtual Account — manual confirmation' },
  { value: 'e-wallet', label: 'Instant E-Wallet', note: 'QRIS scan at the next step' },
  { value: 'cod', label: 'Cash on Delivery', note: 'Available for regular shipping only' },
];

const SHIPPING_METHODS: { value: ShippingMethod; label: string; note: string }[] = [
  { value: 'regular', label: 'Standard Courier Dispatch', note: '3–5 days' },
  { value: 'express', label: 'Express Air Delivery', note: '1–2 days' },
];

export default function CheckoutPage() {
  useDocumentTitle('Checkout — NusaMarket');

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const setOrder = useOrderStore((s) => s.setOrder);
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('regular');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank-transfer');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const shippingCost = shippingCostFor(shippingMethod, subtotal);
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="pt-10">
        <EmptyState
          type="cart"
          action={{ label: 'Explore the Collection', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  function onSubmit(data: z.infer<typeof schema>) {
    setSubmitting(true);
    // Resolve in the browser: this demo processes no payment.
    window.setTimeout(() => {
      setOrder({
        id: generateOrderId(),
        date: new Date().toISOString(),
        items,
        subtotal,
        shippingCost,
        total,
        shippingMethod,
        paymentMethod,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
        },
      });
      clearCart();
      navigate('/order/success');
    }, 900);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 border-b border-stone-200/80 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Final Step
        </span>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <Lock size={12} aria-hidden="true" />
          Demo checkout — no payment is processed and no data leaves the browser.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: form */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Recipient */}
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Recipient Information
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" placeholder="Nama lengkap" error={errors.name?.message} {...register('name')} />
              <Input label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
              <Input label="Phone" type="tel" placeholder="+62 8xx xxxx xxxx" error={errors.phone?.message} {...register('phone')} />
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Delivery Address
            </legend>
            <Input label="Street Address" placeholder="Jalan, number, RT/RW" error={errors.address?.message} {...register('address')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="City" placeholder="Kota" error={errors.city?.message} {...register('city')} />
              <Input label="Province" placeholder="Provinsi" error={errors.province?.message} {...register('province')} />
              <Input label="Postal Code" inputMode="numeric" maxLength={5} placeholder="12345" error={errors.postalCode?.message} {...register('postalCode')} />
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Shipping Method
            </legend>
            {SHIPPING_METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex cursor-pointer items-center justify-between gap-3 border p-4 transition-colors duration-150 ${
                  shippingMethod === m.value ? 'border-ink bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value={m.value}
                    checked={shippingMethod === m.value}
                    onChange={() => setShippingMethod(m.value)}
                    className="accent-clay-600"
                  />
                  <span>
                    <span className="block text-xs font-semibold text-ink">{m.label}</span>
                    <span className="block text-[11px] text-stone-500">{m.note}</span>
                  </span>
                </span>
                <span className="text-xs font-semibold tabular-nums text-ink">
                  {shippingCostFor(m.value, subtotal) === 0
                    ? 'Complimentary'
                    : formatRupiah(shippingCostFor(m.value, subtotal))}
                </span>
              </label>
            ))}
          </fieldset>

          {/* Payment */}
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Payment Method
            </legend>
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex cursor-pointer items-center gap-3 border p-4 transition-colors duration-150 ${
                  paymentMethod === m.value ? 'border-ink bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.value}
                  checked={paymentMethod === m.value}
                  onChange={() => setPaymentMethod(m.value)}
                  className="accent-clay-600"
                />
                <span>
                  <span className="block text-xs font-semibold text-ink">{m.label}</span>
                  <span className="block text-[11px] text-stone-500">{m.note}</span>
                </span>
              </label>
            ))}
            <p className="text-[11px] text-stone-400">
              No payment is processed — this is a storefront demonstration.
            </p>
          </fieldset>
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-[calc(var(--nm-header-h)+1.5rem)] flex flex-col gap-4 border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-900">
              Order Summary
            </h2>
            <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto text-xs">
              {items.map((item, i) => (
                <li key={`${item.product.id}-${i}`} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{item.product.name}</span>
                    <span className="block text-[10px] text-stone-500">
                      {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')} × {item.quantity}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-clay-600">
                      {item.product.craft.atelier}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border-t border-stone-100 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Garments Subtotal</span>
                <span className="font-semibold tabular-nums text-ink">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Domestic Shipping</span>
                <span className="font-semibold tabular-nums text-ink">
                  {shippingCost === 0 ? 'Complimentary' : formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-2">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-bold tabular-nums text-ink">{formatRupiah(total)}</span>
              </div>
            </div>
            <Button type="submit" fullWidth size="lg" loading={submitting}>
              {submitting ? 'Placing Order…' : 'Place Order'}
            </Button>
            <p className="text-center text-[10px] leading-relaxed text-stone-400">
              By placing an order you agree to the demo terms: nothing is charged, nothing is shipped, everything is honest.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
