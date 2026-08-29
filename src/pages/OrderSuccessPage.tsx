import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getCurrentOrder } from '../stores/orderStore';
import { formatRupiah } from '../utils';
import { Button } from '../components/ui/Button';

const PAYMENT_LABELS: Record<string, string> = {
  'bank-transfer': 'Bank Transfer',
  'e-wallet': 'E-Wallet',
  'cod': 'Cash on Delivery',
};

const SHIPPING_LABELS: Record<string, string> = {
  regular: 'Regular Shipping (3–5 days)',
  express: 'Express Shipping (1–2 days)',
};

export default function OrderSuccessPage() {
  const order = getCurrentOrder();

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-sm text-stone-500">No order found.</p>
        <div className="mt-4">
          <Link to="/shop">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Order Confirmed</h1>
        <p className="mt-2 text-sm text-stone-500">
          Thank you, {order.customer.name.split(' ')[0]}. Your order has been placed.
        </p>
      </div>

      {/* Order meta */}
      <div className="border border-stone-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Order Number</p>
            <p className="font-bold text-stone-900 font-mono">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Date</p>
            <p className="font-medium text-stone-900">{orderDate}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Shipping</p>
            <p className="font-medium text-stone-900">{SHIPPING_LABELS[order.shippingMethod]}</p>
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Payment</p>
            <p className="font-medium text-stone-900">{PAYMENT_LABELS[order.paymentMethod]}</p>
          </div>
        </div>

        <div className="mt-4 border-t border-stone-100 pt-4">
          <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Deliver to</p>
          <p className="text-sm text-stone-900">
            {order.customer.address}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="border border-stone-100 p-6 mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Items Ordered</h2>
        <div className="flex flex-col gap-4 divide-y divide-stone-50">
          {order.items.map((item, i) => (
            <div key={i} className={`${i > 0 ? 'pt-4' : ''} flex gap-3`}>
              <div className="h-14 w-11 shrink-0 overflow-hidden bg-stone-50">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">{item.product.brand}</p>
                  <p className="text-sm font-medium text-stone-900 truncate">{item.product.name}</p>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-xs text-stone-500">
                      {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-stone-900">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 border-t border-stone-100 pt-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span>{formatRupiah(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-stone-900 border-t border-stone-100 pt-2">
            <span>Total</span>
            <span>{formatRupiah(order.total)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

