import { useNavigate } from 'react-router-dom';
import { Check, Printer, MapPin } from 'lucide-react';
import { useOrderStore } from '../stores/orderStore';
import { formatRupiah } from '../utils';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const PAYMENT_LABELS: Record<string, string> = {
  'bank-transfer': 'Bank Transfer',
  'e-wallet': 'Instant E-Wallet',
  cod: 'Cash on Delivery (COD)',
};

const SHIPPING_LABELS: Record<string, string> = {
  regular: 'Standard Courier Dispatch (3–5 days)',
  express: 'Express Air Delivery (1–2 days)',
};

export default function OrderSuccessPage() {
  useDocumentTitle('Order Confirmed — NusaMarket');

  const order = useOrderStore((s) => s.order);
  const navigate = useNavigate();

  if (!order) {
    return (
      <div className="pt-10">
        <EmptyState
          type="cart"
          message="No order receipt is held for this session."
          action={{ label: 'Browse Collection', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  const itemRows = (
    <div className="flex flex-col divide-y divide-stone-100 text-xs">
      {order.items.map((item, i) => (
        <div key={`${item.product.id}-${i}`} className="flex items-start justify-between gap-3 py-3">
          <span className="min-w-0">
            <span className="block truncate font-semibold text-ink">{item.product.name}</span>
            <span className="block text-[10px] text-stone-500">
              {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')} × {item.quantity}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-clay-600">
              <MapPin size={9} aria-hidden="true" />
              {item.product.craft.atelier}
            </span>
          </span>
          <span className="shrink-0 font-semibold tabular-nums text-ink">
            {formatRupiah(item.product.price * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Confirmation header */}
      <div className="mb-10 flex flex-col items-center gap-4 border-b border-stone-200/80 pb-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade-600 text-white">
          <Check size={22} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-jade-700">
            Receipt Generated
          </span>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Order Successfully Placed
          </h1>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-stone-500">
          Thank you for supporting independent Indonesian craftsmanship. Your receipt is below —
          in this demo it is kept in the browser rather than emailed to you.
        </p>
        <p className="font-mono-data text-sm font-semibold text-ink">{order.id}</p>
      </div>

      {/* Receipt */}
      <div className="border border-stone-200 bg-white p-6 shadow-xs sm:p-8">
        {/* Meta rows */}
        <div className="mb-6 grid grid-cols-1 gap-4 border-b border-stone-100 pb-6 text-xs sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
              Placement Date
            </p>
            <p className="mt-1 font-medium text-ink">
              {new Date(order.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
              Delivery
            </p>
            <p className="mt-1 font-medium text-ink">
              {SHIPPING_LABELS[order.shippingMethod] ?? order.shippingMethod}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
              Payment
            </p>
            <p className="mt-1 font-medium text-ink">
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
              Recipient
            </p>
            <p className="mt-1 font-medium text-ink">{order.customer.name}</p>
            <p className="text-stone-500">{order.customer.phone}</p>
            <p className="text-stone-500">{order.customer.email}</p>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
            Delivery Address
          </p>
          <p className="text-xs leading-relaxed text-stone-700">
            {order.customer.address}, {order.customer.city}, {order.customer.province},{' '}
            {order.customer.postalCode}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
            Items in Parcel ({order.items.length})
          </p>
          {itemRows}
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-2 border-t border-stone-200/80 pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-600">Garments Subtotal</span>
            <span className="font-semibold tabular-nums text-ink">{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Domestic Shipping</span>
            <span className="font-semibold tabular-nums text-ink">
              {order.shippingCost === 0 ? 'Complimentary' : formatRupiah(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-bold tabular-nums text-ink">{formatRupiah(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="secondary" size="md" onClick={() => window.print()}>
          <Printer size={13} strokeWidth={2} aria-hidden="true" />
          Print Receipt
        </Button>
        <Button to="/shop" size="md">
          Continue Shopping
        </Button>
      </div>

      <p className="mt-6 text-center text-[11px] text-stone-400">
        Receipts are kept for the current browser tab only. Place an order to see one here.
      </p>
    </div>
  );
}
