import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { setCurrentOrder } from '../stores/orderStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { EmptyState } from '../components/ui/EmptyState';
import { generateOrderId, SHIPPING_COSTS, formatRupiah } from '../utils';
import type { CheckoutFormData, ShippingMethod } from '../types';

const INDONESIAN_PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'D.I. Yogyakarta', 'D.K.I. Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat',
  'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat',
  'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan',
  'Sumatera Utara',
];

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Contact phone number is required'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City/Regency is required'),
  province: z.string().min(1, 'Please select your province'),
  postalCode: z.string().regex(/^\d+$/, 'Postal code must be numeric').min(5, 'Postal code must be at least 5 digits'),
  shippingMethod: z.enum(['regular', 'express']).refine((v) => v !== undefined, { message: 'Select a shipping method' }),
  paymentMethod: z.enum(['bank-transfer', 'e-wallet', 'cod']).refine((v) => v !== undefined, { message: 'Select a payment method' }),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingMethod: 'regular',
      paymentMethod: 'bank-transfer',
    },
  });

  const shippingMethod = watch('shippingMethod') as ShippingMethod;
  const paymentMethod = watch('paymentMethod');
  const shippingCost = SHIPPING_COSTS[shippingMethod] ?? SHIPPING_COSTS.regular;
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
    navigate('/order/success');
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
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
          Secure Transaction
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
                <span className="text-xs font-bold font-mono text-stone-400">01</span>
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
                <span className="text-xs font-bold font-mono text-stone-400">02</span>
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
                <Dropdown
                  id="province"
                  label="Province"
                  size="md"
                  placeholder="Select province..."
                  options={INDONESIAN_PROVINCES}
                  value={watch('province') || ''}
                  onChange={(val) => {
                    setValue('province', val, { shouldValidate: true });
                  }}
                  error={errors.province?.message}
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
                <span className="text-xs font-bold font-mono text-stone-400">03</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Shipping Courier
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {(['regular', 'express'] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 border transition-all cursor-pointer ${
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
                    <span className="text-xs sm:text-sm font-bold text-stone-950">
                      {formatRupiah(SHIPPING_COSTS[method])}
                    </span>
                  </label>
                ))}
                {errors.shippingMethod && (
                  <p className="text-[11px] font-medium text-red-600">{errors.shippingMethod.message}</p>
                )}
              </div>
            </section>

            {/* Section 04: Payment Method */}
            <section className="bg-white border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-stone-100">
                <span className="text-xs font-bold font-mono text-stone-400">04</span>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-950">
                  Payment Gateway
                </h2>
              </div>
              <div className="flex flex-col gap-3">
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
                    className={`flex items-center gap-3.5 p-4 border transition-all cursor-pointer ${
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
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 border border-stone-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col gap-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-stone-950 border-b border-stone-100 pb-3">
                Order Review ({items.reduce((acc, i) => acc + i.quantity, 0)})
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

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <ShieldCheck size={14} className="text-stone-800" />
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
