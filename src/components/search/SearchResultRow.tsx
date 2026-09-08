import type { Product } from '../../types';
import { formatRupiah } from '../../utils';
import { ProductThumb } from '../product/ProductThumb';

type SearchResultRowProps = {
  id: string;
  product: Product;
  active: boolean;
  onSelect: (product: Product) => void;
};

export function SearchResultRow({ id, product, active, onSelect }: SearchResultRowProps) {
  return (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={active}
      onClick={() => onSelect(product)}
      className={`flex w-full cursor-pointer items-center gap-3.5 border-l-2 px-4 py-2.5 text-left transition-colors duration-100 ${
        active ? 'border-clay-500 bg-stone-50' : 'border-transparent hover:bg-stone-50'
      }`}
    >
      <ProductThumb product={product} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-ink">{product.name}</span>
        <span className="block truncate text-[10px] uppercase tracking-wider text-stone-500">
          {product.brand} · {product.category} · {product.region}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-ink">
        {formatRupiah(product.price)}
      </span>
    </button>
  );
}
