import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatRupiah } from '../../utils';
import { ProductThumb } from '../product/ProductThumb';

type SearchResultRowProps = {
  product: Product;
  /** Highlighted via keyboard navigation */
  active?: boolean;
  onSelect: () => void;
  /** Stagger index for the entrance animation */
  index?: number;
  /** Set when the row acts as an option inside the search combobox listbox */
  id?: string;
};

/** A single row in the search discovery panel: thumbnail, brand, name, price. */
export function SearchResultRow({
  product,
  active = false,
  onSelect,
  index = 0,
  id,
}: SearchResultRowProps) {
  return (
    <Link
      id={id}
      role={id ? 'option' : undefined}
      aria-selected={id ? active : undefined}
      // Inside the combobox the rows are options, driven by arrow keys and
      // aria-activedescendant - they must not also be individual tab stops.
      tabIndex={id ? -1 : undefined}
      to={`/product/${product.slug}`}
      onClick={onSelect}
      style={{ animationDelay: `${Math.min(index, 6) * 25}ms` }}
      className={[
        'group animate-fade-rise -mx-2.5 flex items-center gap-4 rounded-xs px-2.5 py-2.5 sm:gap-5',
        'transition-colors duration-150',
        active
          ? 'bg-stone-100 shadow-[inset_2px_0_0_0_var(--color-ink)]'
          : 'hover:bg-stone-50',
      ].join(' ')}
    >
      <ProductThumb product={product} className="h-[62px] w-[50px]" width={50} height={62} zoomOnGroupHover />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500">
          {product.brand}
        </p>
        <p className="truncate text-[13px] font-medium tracking-tight text-stone-900 sm:text-sm">
          {product.name}
        </p>
        <p className="pt-0.5 text-[12px] font-medium tabular-nums text-stone-700 sm:text-[13px]">
          {formatRupiah(product.price)}
        </p>
      </div>
    </Link>
  );
}
