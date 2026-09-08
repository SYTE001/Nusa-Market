import { formatRupiah } from '../../utils';

type CartSummaryProps = {
  subtotal: number;
  shippingLabel?: string;
  shippingCost?: number;
};

export function CartSummary({ subtotal, shippingLabel, shippingCost }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-stone-600">Subtotal</span>
        <span className="font-semibold tabular-nums text-ink">{formatRupiah(subtotal)}</span>
      </div>
      {shippingLabel !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-stone-600">{shippingLabel}</span>
          <span className="font-semibold tabular-nums text-ink">
            {shippingCost === 0 ? 'Complimentary' : shippingCost !== undefined ? formatRupiah(shippingCost) : '—'}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-stone-200/80 pt-2">
        <span className="font-semibold text-ink">Total</span>
        <span className="font-bold tabular-nums text-ink">
          {formatRupiah(subtotal + (shippingCost ?? 0))}
        </span>
      </div>
    </div>
  );
}
