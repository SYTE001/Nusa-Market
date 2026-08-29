import { formatRupiah, SHIPPING_COSTS } from '../../utils';

type CartSummaryProps = {
  subtotal: number;
  shippingMethod?: 'regular' | 'express';
  compact?: boolean;
};

export function CartSummary({ subtotal, shippingMethod, compact = false }: CartSummaryProps) {
  const shipping = shippingMethod ? SHIPPING_COSTS[shippingMethod] : null;
  const total = subtotal + (shipping ?? 0);

  return (
    <div className="flex flex-col gap-2 border-t border-stone-100 pt-4">
      <div className="flex justify-between text-sm text-stone-700">
        <span>Subtotal</span>
        <span>{formatRupiah(subtotal)}</span>
      </div>
      {shipping !== null && (
        <div className="flex justify-between text-sm text-stone-700">
          <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Regular'})</span>
          <span>{formatRupiah(shipping)}</span>
        </div>
      )}
      {!compact && (
        <p className="text-xs text-stone-500">Shipping calculated at checkout.</p>
      )}
      <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-semibold text-stone-900">
        <span>Total</span>
        <span>{formatRupiah(total)}</span>
      </div>
    </div>
  );
}

