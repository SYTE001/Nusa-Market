import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { getCurrentOrder } from '../stores/orderStore';
import { formatRupiah } from '../utils';
import { Button } from '../components/ui/Button';

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
  const order = getCurrentOrder();

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-sm font-medium text-stone-600">No active order receipt found in current session.</p>
        <div className="mt-6">
          <Link to="/shop">
            <Button variant="secondary">Browse Collection</Button>
          </Link>
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
        <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400 mb-1">
          Receipt Generated
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Order Successfully Placed
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Thank you for supporting independent Indonesian craftsmanship. A confirmation copy has been queued for <strong className="text-stone-900">{order.customer.email}</strong>.
        </p>
      </div>

      {/* Main Receipt Container */}
      <div className="border border-stone-200 bg-white shadow-xs overflow-hidden">
        {/* Header Metadata Strip */}
        <div className="bg-[#fcfbfa] border-b border-stone-200/80 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Order Ref
            </span>
            <span className="font-mono font-bold text-stone-950">{order.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Placement Date
            </span>
            <span className="font-medium text-stone-800">{orderDate}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Courier
            </span>
            <span className="font-medium text-stone-800">{SHIPPING_LABELS[order.shippingMethod]}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Payment
            </span>
            <span className="font-medium text-stone-800">{PAYMENT_LABELS[order.paymentMethod]}</span>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="p-6 border-b border-stone-200/80 text-xs flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Recipient Information
            </span>
            <p className="font-semibold text-stone-950 text-sm">{order.customer.name}</p>
            <p className="text-stone-500 mt-0.5">{order.customer.phone} · {order.customer.email}</p>
          </div>
          <div className="sm:text-right max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Delivery Address
            </span>
            <p className="text-stone-800 leading-relaxed">
              {order.customer.address}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
          </div>
        </div>

        {/* Ordered Garments */}
        <div className="p-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-4">
            Items in Parcel ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </span>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-14 w-11 object-cover bg-stone-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
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
                <span className="text-xs sm:text-sm font-bold text-stone-950 shrink-0">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals Table */}
          <div className="mt-6 border-t border-stone-200/80 pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Garments Subtotal</span>
              <span className="font-semibold text-stone-900">{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Domestic Shipping</span>
              <span className="font-semibold text-stone-900">{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-950 border-t border-stone-200/80 pt-3">
              <span>Grand Total</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/shop" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto">
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Button>
        </Link>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-12 px-6 text-xs font-semibold uppercase tracking-[0.1em] text-stone-700 bg-white border border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <Printer size={14} />
          Print Receipt
        </button>
      </div>
    </div>
  );
}
