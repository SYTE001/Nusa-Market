import { X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatRupiah } from '../../utils';
import { useCartStore } from '../../stores/cartStore';
import { QuantitySelector } from '../ui/QuantitySelector';
import { ProductThumb } from '../product/ProductThumb';

type CartItemProps = {
  item: CartItemType;
  compact?: boolean;
};

export function CartItem({ item, compact = false }: CartItemProps) {
  // Subscribed field by field: a bare `useCartStore()` would re-render every row
  // in the bag whenever any part of the store changes.
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity, selectedSize, selectedColor } = item;

  function handleRemove() {
    removeItem(product.id, selectedSize, selectedColor);
  }

  return (
    <div className={`flex gap-3.5 ${compact ? 'py-3' : 'py-4.5'}`}>
      {/* Product Image */}
      <ProductThumb
        product={product}
        className={compact ? 'h-16 w-12' : 'h-22 w-16'}
        width={compact ? 48 : 64}
        height={compact ? 64 : 88}
      />

      {/* Details & Controls */}
      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              {product.brand}
            </p>
            <p className="truncate text-xs sm:text-sm font-medium text-stone-900 leading-snug">
              {product.name}
            </p>
            {(selectedSize || selectedColor) && (
              <p className="text-[11px] text-stone-500 mt-0.5">
                {[selectedSize && `Size: ${selectedSize}`, selectedColor && `Color: ${selectedColor}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            aria-label={`Remove ${product.name} from bag`}
            className="-mr-1.5 -mt-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-xs text-stone-500 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-900"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          {compact ? (
            <p className="text-xs text-stone-500 font-medium">Qty {quantity}</p>
          ) : (
            <QuantitySelector
              value={quantity}
              max={product.stock}
              // The selector reports the quantity it wants, not a direction, so
              // the store call takes that value straight. Removal stays on the X
              // button: the minus control stops at 1 rather than emptying the row
              // out from under a mistimed second tap.
              onChange={(val) => updateQuantity(product.id, val, selectedSize, selectedColor)}
              size="sm"
            />
          )}
          <span className="text-xs sm:text-sm font-semibold tabular-nums text-stone-950">
            {formatRupiah(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
