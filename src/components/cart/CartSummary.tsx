import { formatRupiah, shippingCostFor, FREE_SHIPPING_THRESHOLD, SHIPPING_COSTS } from '../../utils';
import type { ShippingMethod } from '../../types';

type CartSummaryProps = {
  subtotal: number;
  shippingMethod?: ShippingMethod;
  compact?: boolean;
};

export function CartSummary({ subtotal, shippingMethod, compact = false }: CartSummaryProps) {
  const shipping = shippingMethod ? shippingCostFor(shippingMethod, subtotal) : null;
  const isComplimentary = shipping === 0;
  const total = subtotal + (shipping ?? 0);

  return (
    <div className="flex flex-col gap-2.5 border-t border-stone-200/80 pt-4 text-xs">
      <div className="flex justify-between text-stone-600">
        <span>Garment Subtotal</span>
        <span className="font-semibold tabular-nums text-stone-900">{formatRupiah(subtotal)}</span>
      </div>

      {shipping !== null && shippingMethod ? (
        <div className="flex justify-between gap-3 text-stone-600">
          <span>
            Domestic Shipping ({shippingMethod === 'express' ? 'Express 1–2 Days' : 'Regular 3–5 Days'}
            )
          </span>
          {isComplimentary ? (
            <span className="shrink-0 text-right">
              <s className="mr-1.5 tabular-nums text-stone-500">
                {formatRupiah(SHIPPING_COSTS[shippingMethod])}
              </s>
              <span className="font-semibold text-emerald-700">Complimentary</span>
            </span>
          ) : (
            <span className="shrink-0 font-semibold tabular-nums text-stone-900">{formatRupiah(shipping)}</span>
          )}
        </div>
      ) : (
        !compact && (
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>Shipping Calculation</span>
            <span>
              {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : 'Calculated at checkout'}
            </span>
          </div>
        )
      )}

      <div className="flex justify-between border-t border-stone-200/80 pt-3 text-sm font-bold text-stone-950">
        <span>Estimated Total</span>
        <span className="tabular-nums">{formatRupiah(total)}</span>
      </div>
    </div>
  );
}
