import { CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { useOrderStore } from '../stores/orderStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatRupiah } from '../utils';
import { Button } from '../components/ui/Button';
import { ProductThumb } from '../components/product/ProductThumb';

const PAYMENT_LABELS: Record<string, string> = {
  'bank-transfer': 'Virtual Account / Bank Transfer',
  'e-wallet': 'QRIS / Instant E-Wallet',
  cod: 'Cash on Delivery (COD)',
};

const SHIPPING_LABELS: Record<string, string> = {
  regular: 'Standard Courier Dispatch (3–5 Days)',
  express: 'Express Air Delivery (1–2 Days)',
};

export default function OrderSuccessPage() {
  useDocumentTitle('Order Confirmed — NusaMarket');

  const order = useOrderStore((state) => state.currentOrder);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-sm font-medium text-stone-600">
          No order receipt is held for this session.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-stone-500">
          Receipts are kept for the current browser tab only. Place an order to see one here.
        </p>
        <div className="mt-6">
          <Button to="/shop" variant="secondary">
            Browse Collection
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Confirmation Banner */}
      <div className="text-center mb-10">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-950">
          <CheckCircle2 size={36} strokeWidth={1.5} />
        </div>
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">
          Receipt Generated
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Order Successfully Placed
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-stone-500 sm:text-sm">
          Thank you for supporting independent Indonesian craftsmanship. Your receipt is below —
          in this demo it is kept in the browser rather than emailed to{' '}
          <strong className="text-stone-900">{order.customer.email}</strong>.
        </p>
      </div>

      {/* Main Receipt Container */}
      <div className="border border-stone-200 bg-white shadow-xs overflow-hidden">
        {/* Header Metadata Strip */}
        <div className="grid grid-cols-2 gap-4 border-b border-stone-200/80 bg-canvas-raised p-6 text-xs sm:grid-cols-4">
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Order Ref
            </span>
            <span className="font-mono font-bold text-stone-950">{order.id}</span>
          </div>
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Placement Date
            </span>
            <span className="font-medium text-stone-800">{orderDate}</span>
          </div>
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Courier
            </span>
            <span className="font-medium text-stone-800">{SHIPPING_LABELS[order.shippingMethod]}</span>
          </div>
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Payment
            </span>
            <span className="font-medium text-stone-800">{PAYMENT_LABELS[order.paymentMethod]}</span>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="p-6 border-b border-stone-200/80 text-xs flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Recipient Information
            </span>
            <p className="font-semibold text-stone-950 text-sm">{order.customer.name}</p>
            <p className="text-stone-500 mt-0.5">{order.customer.phone} · {order.customer.email}</p>
          </div>
          <div className="sm:text-right max-w-xs">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Delivery Address
            </span>
            <p className="text-stone-800 leading-relaxed">
              {order.customer.address}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
          </div>
        </div>

        {/* Ordered Garments */}
        <div className="p-6">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Items in Parcel ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </span>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ProductThumb
                    product={item.product}
                    className="h-14 w-11"
                    width={44}
                    height={56}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                      {item.product.brand}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-stone-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {[
                        item.selectedSize && `Size: ${item.selectedSize}`,
                        item.selectedColor && `Color: ${item.selectedColor}`,
                        `Qty: ${item.quantity}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold tabular-nums text-stone-950 shrink-0">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals Table */}
          <div className="mt-6 border-t border-stone-200/80 pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Garments Subtotal</span>
              <span className="font-semibold tabular-nums text-stone-900">{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Domestic Shipping</span>
              {/* Same wording as the bag, the drawer and the checkout summary -
                  a receipt reading "Rp 0" invites a second look. */}
              <span className="font-semibold tabular-nums text-stone-900">
                {order.shippingCost === 0 ? (
                  <span className="text-emerald-700">Complimentary</span>
                ) : (
                  formatRupiah(order.shippingCost)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-950 border-t border-stone-200/80 pt-3">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div data-print-hide className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button to="/shop" size="lg" className="w-full sm:w-auto">
          <span>Continue Shopping</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Button>
        <button
          onClick={() => window.print()}
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 border border-stone-300 bg-white px-6 text-xs font-semibold uppercase tracking-[0.1em] text-stone-700 transition-colors duration-150 hover:border-stone-900 hover:bg-stone-50 sm:w-auto"
        >
          <Printer size={14} aria-hidden="true" />
          Print Receipt
        </button>
      </div>
    </div>
  );
}
