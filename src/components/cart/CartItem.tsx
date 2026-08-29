import { X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatRupiah } from '../../utils';
import { useCartStore } from '../../stores/cartStore';
import { QuantitySelector } from '../ui/QuantitySelector';

type CartItemProps = {
  item: CartItemType;
  compact?: boolean;
};

export function CartItem({ item, compact = false }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
  const { product, quantity, selectedSize, selectedColor } = item;

  function handleIncrease() {
    increaseQuantity(product.id, selectedSize, selectedColor);
  }
  function handleDecrease() {
    decreaseQuantity(product.id, selectedSize, selectedColor);
  }
  function handleRemove() {
    removeItem(product.id, selectedSize, selectedColor);
  }

  return (
    <div className={`flex gap-3.5 ${compact ? 'py-3' : 'py-4.5'}`}>
      {/* Product Image */}
      <div className={`shrink-0 overflow-hidden bg-stone-100 ${compact ? 'h-16 w-12' : 'h-22 w-16'}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
        />
      </div>

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
            className="shrink-0 text-stone-400 hover:text-stone-900 transition-colors p-0.5 cursor-pointer"
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
              onChange={(val) => {
                if (val > quantity) handleIncrease();
                else handleDecrease();
              }}
              size="sm"
            />
          )}
          <span className="text-xs sm:text-sm font-semibold text-stone-950">
            {formatRupiah(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
