import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../stores/cartStore';
import { setCurrentOrder } from '../stores/orderStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
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
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingMethod: 'regular',
      paymentMethod: 'bank-transfer',
    },
  });

  const shippingMethod = watch('shippingMethod') as ShippingMethod;
  const shippingCost = SHIPPING_COSTS[shippingMethod] ?? SHIPPING_COSTS.regular;
  const total = subtotal + shippingCost;

  async function onSubmit(data: CheckoutFormData) {
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1000));

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
          message="Your bag is empty."
          action={{ label: 'Continue Shopping', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-500">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: form */}
          <div className="flex flex-col gap-8">
            {/* Contact */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-900">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  autoComplete="email"
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  autoComplete="tel"
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-900">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Street Address"
                  {...register('address')}
                  error={errors.address?.message}
                  autoComplete="street-address"
                  className="sm:col-span-2"
                />
                <Input
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                  autoComplete="address-level2"
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="province" className="text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Province
                  </label>
                  <select
                    id="province"
                    {...register('province')}
                    className={`h-10 w-full border px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 ${errors.province ? 'border-red-500' : 'border-stone-300'}`}
                  >
                    <option value="">Select province...</option>
                    {INDONESIAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
                </div>
                <Input
                  label="Postal Code"
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-900">
                Shipping Method
              </h2>
              <div className="flex flex-col gap-2">
                {(['regular', 'express'] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      shippingMethod === method ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={method}
                        {...register('shippingMethod')}
                        className="accent-stone-900"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900 capitalize">{method}</p>
                        <p className="text-xs text-stone-500">
                          {method === 'regular' ? '3–5 business days' : '1–2 business days'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-stone-900">
                      {formatRupiah(SHIPPING_COSTS[method])}
                    </span>
                  </label>
                ))}
                {errors.shippingMethod && (
                  <p className="text-xs text-red-500">{errors.shippingMethod.message}</p>
                )}
              </div>
            </section>

            {/* Payment method */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-900">
                Payment Method
              </h2>
              <div className="flex flex-col gap-2">
                {([
                  { value: 'bank-transfer', label: 'Bank Transfer', desc: 'BCA, Mandiri, BNI, BRI' },
                  { value: 'e-wallet', label: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Available for selected areas' },
                ] as const).map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                      watch('paymentMethod') === pm.value ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={pm.value}
                      {...register('paymentMethod')}
                      className="accent-stone-900"
                    />
                    <div>
                      <p className="text-sm font-medium text-stone-900">{pm.label}</p>
                      <p className="text-xs text-stone-500">{pm.desc}</p>
                    </div>
                  </label>
                ))}
                {errors.paymentMethod && (
                  <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>
                )}
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="border border-stone-100 p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">Order Summary</h2>
              <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <CartItem
                    key={`${item.product.id}-${i}`}
                    item={item}
                    compact
                  />
                ))}
              </div>
              <div className="mt-4">
                <CartSummary subtotal={subtotal} shippingMethod={shippingMethod} compact />
              </div>
            </div>
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              className="mt-4"
            >
              Place Order — {formatRupiah(total)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

