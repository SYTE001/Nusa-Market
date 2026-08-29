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
    <div className="flex flex-col gap-2.5 border-t border-stone-200/80 pt-4 text-xs">
      <div className="flex justify-between text-stone-600">
        <span>Garment Subtotal</span>
        <span className="font-semibold text-stone-900">{formatRupiah(subtotal)}</span>
      </div>

      {shipping !== null ? (
        <div className="flex justify-between text-stone-600">
          <span>Domestic Shipping ({shippingMethod === 'express' ? 'Express 1–2 Days' : 'Regular 3–5 Days'})</span>
          <span className="font-semibold text-stone-900">{formatRupiah(shipping)}</span>
        </div>
      ) : (
        !compact && (
          <div className="flex justify-between text-stone-400 text-[11px]">
            <span>Shipping Calculation</span>
            <span>Calculated at checkout</span>
          </div>
        )
      )}

      <div className="flex justify-between border-t border-stone-200/80 pt-3 text-sm font-bold text-stone-950">
        <span>Estimated Total</span>
        <span>{formatRupiah(total)}</span>
      </div>
    </div>
  );
}
