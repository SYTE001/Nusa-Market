import { X, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../../types';
import { formatRupiah } from '../../utils';
import { useCartStore } from '../../stores/cartStore';
import { ProductThumb } from '../product/ProductThumb';

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const variant = [item.selectedSize, item.selectedColor].filter(Boolean).join(' · ');

  return (
    <div className="flex gap-4 py-4">
      <ProductThumb product={item.product} size="md" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">{item.product.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone-500">
              {item.product.brand}
              {variant ? ` · ${variant}` : ''}
            </p>
            <p className="text-[10px] text-clay-600 uppercase tracking-wider">
              Made in {item.product.region}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
            aria-label={`Remove ${item.product.name} from bag`}
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-stone-400 transition-colors duration-150 hover:text-red-600"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center border border-stone-200">
            <button
              onClick={() => decreaseQuantity(item.product.id, item.selectedSize, item.selectedColor)}
              aria-label={`Decrease quantity of ${item.product.name}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-stone-600 transition-colors duration-150 hover:text-ink"
            >
              <Minus size={12} strokeWidth={2} />
            </button>
            <span className="w-7 text-center text-xs font-semibold tabular-nums text-ink">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item.product.id, item.selectedSize, item.selectedColor)}
              aria-label={`Increase quantity of ${item.product.name}`}
              disabled={item.quantity >= item.product.stock}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-stone-600 transition-colors duration-150 hover:text-ink disabled:opacity-40"
            >
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>
          <p className="text-xs font-semibold tabular-nums text-ink">
            {formatRupiah(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
