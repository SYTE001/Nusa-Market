import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info, Truck, CreditCard } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { EmptyState } from '../components/ui/EmptyState';
import { generateOrderId, SHIPPING_COSTS, shippingCostFor, formatRupiah } from '../utils';
import type { CheckoutFormData } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const INDONESIAN_PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'D.I. Yogyakarta', 'D.K.I. Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat',
  'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Papua Barat Daya', 'Papua Pegunungan', 'Papua Selatan', 'Papua Tengah',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan',
  'Sumatera Utara',
];

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().min(1, 'Contact phone number is required'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City/Regency is required'),
  province: z.string().min(1, 'Please select your province'),
  postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be exactly 5 digits'),
  shippingMethod: z.enum(['regular', 'express']),
  paymentMethod: z.enum(['bank-transfer', 'e-wallet', 'cod']),
});

export default function CheckoutPage() {
  useDocumentTitle('Checkout — NusaMarket');

  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());
  const clearCart = useCartStore((s) => s.clearCart);
  const setCurrentOrder = useOrderStore((s) => s.setCurrentOrder);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      province: '',
      shippingMethod: 'regular',
      paymentMethod: 'bank-transfer',
    },
  });

  // useWatch subscribes to a single field through `control` instead of
  // re-rendering the page on every keystroke in every input, the way the
  // form-wide `watch()` does.
  const shippingMethod = useWatch({ control, name: 'shippingMethod' });
  const paymentMethod = useWatch({ control, name: 'paymentMethod' });
  const shippingCost = shippingCostFor(shippingMethod, subtotal);
  const shippingIsFree = shippingCost === 0;
  const total = subtotal + shippingCost;

  async function onSubmit(data: CheckoutFormData) {
    setSubmitting(true);
    // Simulate short asynchronous order creation
    await new Promise((r) => setTimeout(r, 900));

    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: [...items],
      subtotal,
      shippingCost,
      total,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      },
    };

    setCurrentOrder(order);
    clearCart();
    navigate('/order/success', { replace: true });
  }

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <EmptyState
          type="cart"
          message="Your shopping bag is empty."
          action={{ label: 'Return to Catalog', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Title */}
      <div className="mb-8 border-b border-stone-200/80 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Order Placement
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 mt-1">
          Checkout & Dispatch
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Section 01: Contact */}
            <section className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="text-xs font-bold font-mono text-stone-500">01</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Client & Contact Information
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  autoComplete="name"
                  placeholder="e.g. Raden Arya"
                />
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  autoComplete="email"
                  placeholder="name@domain.com"
                />
                <Input
                  label="WhatsApp / Phone Number"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  autoComplete="tel"
                  placeholder="+62 812-xxxx-xxxx"
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* Section 02: Shipping Address */}
            <section className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="text-xs font-bold font-mono text-stone-500">02</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Delivery Destination
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Street Address & Apt/Unit"
                  {...register('address')}
                  error={errors.address?.message}
                  autoComplete="street-address"
                  placeholder="Jl. Senopati No. 42, Kebayoran Baru"
                  className="sm:col-span-2"
                />
                <Input
                  label="City / Regency"
                  {...register('city')}
                  error={errors.city?.message}
                  autoComplete="address-level2"
                  placeholder="Jakarta Selatan"
                />
                {/* Controlled through RHF so the field owns a ref and an invalid
                    submit can move focus to it like any other input. */}
                <Controller
                  control={control}
                  name="province"
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id="province"
                      label="Province"
                      size="md"
                      placeholder="Select province..."
                      options={INDONESIAN_PROVINCES}
                      value={field.value}
                      onChange={field.onChange}
                      ref={field.ref}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Input
                  label="Postal Code"
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="12190"
                />
              </div>
            </section>

            {/* Section 03: Shipping Method */}
            <section className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="text-xs font-bold font-mono text-stone-500">03</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Shipping Courier
                </h2>
              </div>
              <fieldset className="flex flex-col gap-3">
                <legend className="sr-only">Shipping courier</legend>
                {(['regular', 'express'] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 border transition-all duration-150 cursor-pointer ${
                      shippingMethod === method
                        ? 'border-stone-950 bg-stone-50/70 shadow-xs'
                        : 'border-stone-200/80 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        value={method}
                        {...register('shippingMethod')}
                        className="accent-stone-950 h-4 w-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Truck size={15} className="text-stone-700" />
                          <p className="text-xs sm:text-sm font-semibold text-stone-950 capitalize">
                            {method === 'regular' ? 'Standard Courier Dispatch' : 'Express Air Delivery'}
                          </p>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {method === 'regular' ? '3–5 business days nationwide' : '1–2 business days priority dispatch'}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-right text-xs font-bold tabular-nums text-stone-950 sm:text-sm">
                      {shippingIsFree ? (
                        <>
                          <s className="block text-[11px] font-medium text-stone-500">
                            {formatRupiah(SHIPPING_COSTS[method])}
                          </s>
                          <span className="text-emerald-700">Complimentary</span>
                        </>
                      ) : (
                        formatRupiah(SHIPPING_COSTS[method])
                      )}
                    </span>
                  </label>
                ))}
                {errors.shippingMethod && (
                  <p className="text-[11px] font-medium text-red-600">{errors.shippingMethod.message}</p>
                )}
              </fieldset>
            </section>

            {/* Section 04: Payment Method */}
            <section className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="text-xs font-bold font-mono text-stone-500">04</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Payment Gateway
                </h2>
              </div>
              <fieldset className="flex flex-col gap-3">
                <legend className="sr-only">Payment method</legend>
                {[
                  {
                    value: 'bank-transfer',
                    label: 'Virtual Account / Bank Transfer',
                    desc: 'BCA, Mandiri, BNI, BRI automated reconciliation',
                  },
                  {
                    value: 'e-wallet',
                    label: 'QRIS & Instant E-Wallet',
                    desc: 'GoPay, OVO, DANA, ShopeePay direct QR payment',
                  },
                  {
                    value: 'cod',
                    label: 'Cash on Delivery (COD)',
                    desc: 'Pay cash directly upon parcel handover',
                  },
                ].map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3.5 p-4 border transition-all duration-150 cursor-pointer ${
                      paymentMethod === pm.value
                        ? 'border-stone-950 bg-stone-50/70 shadow-xs'
                        : 'border-stone-200/80 bg-white hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={pm.value}
                      {...register('paymentMethod')}
                      className="accent-stone-950 h-4 w-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={15} className="text-stone-700" />
                        <p className="text-xs sm:text-sm font-semibold text-stone-950">{pm.label}</p>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{pm.desc}</p>
                    </div>
                  </label>
                ))}
                {errors.paymentMethod && (
                  <p className="text-[11px] font-medium text-red-600">{errors.paymentMethod.message}</p>
                )}
              </fieldset>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-[calc(var(--nm-header-h)+1.5rem)] border border-stone-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col gap-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-950 border-b border-stone-100 pb-3">
                Order Review ({totalItems})
              </h2>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item, i) => (
                  <CartItem key={`${item.product.id}-${i}`} item={item} compact />
                ))}
              </div>

              <div>
                <CartSummary subtotal={subtotal} shippingMethod={shippingMethod} compact />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={submitting}
                >
                  Place Order — {formatRupiah(total)}
                </Button>
              </div>

              <div className="flex items-start gap-2 border-t border-stone-100 pt-3 text-[11px] leading-relaxed text-stone-500">
                <Info size={13} className="mt-0.5 shrink-0 text-stone-700" aria-hidden="true" />
                <span>
                  Demonstration checkout — no payment is processed and no data leaves your browser.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
