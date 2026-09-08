import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RotateCcw, MapPin } from 'lucide-react';
import type { Product } from '../types';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { formatRupiah, discountPercent } from '../utils';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useUIStore } from '../stores/uiStore';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

type Tab = 'story' | 'origin' | 'material';

const TABS: { id: Tab; label: string }[] = [
  { id: 'story', label: 'Craft Story' },
  { id: 'origin', label: 'Origin' },
  { id: 'material', label: 'Material & Care' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [tab, setTab] = useState<Tab>('story');

  useDocumentTitle(
    product ? `${product.name} — NusaMarket` : 'NusaMarket — Handcrafted in Indonesia'
  );

  const addItem = useCartStore((s) => s.addItem);
  const { openCartDrawer, setFlyToCart } = useUIStore();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id ?? ''));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const [wishlistPopping, setWishlistPopping] = useState(false);

  function handleWishlistClick() {
    if (!product) return;
    setWishlistPopping(true);
    toggleWishlist(product);
    setTimeout(() => setWishlistPopping(false), 250);
  }

  useEffect(() => {
    if (!slug) return;
    let active = true;

    getProductBySlug(slug)
      .then((p) => {
        if (!active) return;
        if (!p) {
          setError(true);
          return;
        }
        setProduct(p);
        setSelectedSize(p.sizes?.[0]);
        setSelectedColor(p.colors?.[0]);
        return getRelatedProducts(p);
      })
      .then((rel) => {
        if (active && rel) setRelated(rel);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  function handleAddToCart(e: React.MouseEvent) {
    if (!product) return;
    addItem(product, qty, selectedSize, selectedColor);
    setFlyToCart({ id: Date.now(), from: { x: e.clientX, y: e.clientY } });
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 620;
    window.setTimeout(() => openCartDrawer(), delay);
  }

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <div className="pt-20">
        <EmptyState
          type="error"
          message="Product not found."
          action={{ label: 'Return to Catalog', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  const stockLabel =
    product.stock === 0
      ? 'Out of stock'
      : product.stock < 5
      ? `Limited run: only ${product.stock} units remain`
      : 'In stock — ready for dispatch';

  return (
    <div className="pb-24 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-stone-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="transition-colors duration-150 hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="transition-colors duration-150 hover:text-ink"
              >
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              aria-current="page"
              className="max-w-[200px] truncate font-medium text-stone-900 sm:max-w-none"
            >
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Gallery Column */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row lg:col-span-7">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 sm:max-h-[640px] sm:flex-col sm:overflow-y-auto sm:pb-0 scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-pressed={activeImg === i}
                    className={`h-20 w-16 shrink-0 cursor-pointer border-2 bg-stone-100 transition-all duration-150 sm:h-24 sm:w-18 ${
                      activeImg === i
                        ? 'border-ink shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View perspective ${i + 1} of ${product.images.length}`}
                  >
                    {imgErrors[i] ? (
                      <div className="h-full w-full bg-stone-200" />
                    ) : (
                      <img
                        src={img}
                        alt=""
                        width={72}
                        height={96}
                        loading="lazy"
                        className="h-full w-full object-cover object-center"
                        onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-stone-100 shadow-xs">
              {imgErrors[activeImg] ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-canvas-muted px-6 text-center">
                  <span className="font-display text-sm font-semibold uppercase tracking-wider text-stone-500">
                    {product.brand}
                  </span>
                  <span className="text-xs text-stone-400">{product.name}</span>
                  <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-clay-600">
                    Photography in production
                  </span>
                </div>
              ) : (
                <img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={`${product.name} — perspective ${activeImg + 1}`}
                  width={900}
                  height={1200}
                  className="animate-fade-rise h-full w-full object-cover object-center"
                  onError={() => setImgErrors((prev) => ({ ...prev, [activeImg]: true }))}
                />
              )}

              {/* Floating badges */}
              <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
                {product.isNew && <Badge variant="new">New Drop</Badge>}
                {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
                {product.originalPrice && (
                  <Badge variant="sale">
                    Save {discountPercent(product.price, product.originalPrice)}%
                  </Badge>
                )}
                <Badge variant="provenance">{product.region} · {product.craft.atelier.split(',')[0]}</Badge>
              </div>
            </div>
          </div>

          {/* Right: Product Specification & Purchase Column */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Header meta */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  {product.brand}
                </span>
                <Rating value={product.rating} count={product.reviewCount} size="md" />
              </div>

              <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-display text-2xl font-semibold tabular-nums tracking-tight text-ink sm:text-3xl">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <s className="text-sm tabular-nums text-stone-500">
                    <span className="sr-only">Original price </span>
                    {formatRupiah(product.originalPrice)}
                  </s>
                )}
              </div>

              {/* Origin line */}
              <p className="flex items-center gap-1.5 pt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-clay-700">
                <MapPin size={12} strokeWidth={2.25} aria-hidden="true" />
                {product.craft.atelier} — {product.region}
              </p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-amber-500' : 'bg-jade-600'
                }`}
              />
              <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-stone-600'}`}>
                {stockLabel}
              </span>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2.5 border-t border-stone-200/80 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700">
                    Select Size
                  </p>
                  <span className="text-xs font-medium text-stone-500">Standard Fit</span>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      aria-pressed={selectedSize === s}
                      className={`h-10 min-w-[42px] cursor-pointer border px-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                        selectedSize === s
                          ? 'border-ink bg-ink text-canvas shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700">
                  Colorway:{' '}
                  <span className="font-normal capitalize text-stone-500">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Select colorway">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      aria-pressed={selectedColor === c}
                      className={`h-9 cursor-pointer border px-4 text-xs font-medium transition-all duration-150 ${
                        selectedColor === c
                          ? 'border-ink bg-ink text-canvas shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Bag Row */}
            <div className="flex flex-col gap-3 border-t border-stone-200/80 pt-4">
              <div className="flex items-center gap-3">
                <QuantitySelector value={qty} min={1} max={product.stock} onChange={setQty} size="md" />
                <Button
                  size="lg"
                  fullWidth
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="flex-1"
                  magnetic
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </Button>
                <button
                  onClick={handleWishlistClick}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border border-stone-300 bg-white shadow-2xs transition-colors duration-150 hover:border-ink active:scale-95"
                >
                  <Heart
                    size={18}
                    strokeWidth={1.75}
                    className={`${
                      isWishlisted ? 'text-red-600 fill-red-600' : 'text-stone-700'
                    } ${wishlistPopping ? 'animate-heart-pop' : 'transition-transform duration-150'}`}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>

            {/* ============ Craft tabs: Story / Origin / Material ============ */}
            <div className="border-t border-stone-200/80 pt-4">
              <div role="tablist" aria-label="Product provenance" className="flex gap-1 border-b border-stone-200/80">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    aria-controls={`tab-${t.id}`}
                    id={`tabbtn-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`-mb-px cursor-pointer border-b-2 px-3 pb-2.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                      tab === t.id
                        ? 'border-clay-500 text-ink'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div
                id={`tab-${tab}`}
                role="tabpanel"
                aria-labelledby={`tabbtn-${tab}`}
                className="animate-fade-rise pt-4 text-xs leading-relaxed text-stone-600 sm:text-[13px]"
              >
                {tab === 'story' && (
                  <div className="flex flex-col gap-3">
                    <p className="font-serif-editorial text-base italic text-ink sm:text-lg">
                      {product.description}
                    </p>
                    <p>{product.craft.story ?? product.craft.process}</p>
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">
                      Process — <span className="text-stone-700">{product.craft.process}</span>
                    </p>
                  </div>
                )}
                {tab === 'origin' && (
                  <div className="flex flex-col gap-3">
                    <p>
                      <strong className="text-ink">{product.name}</strong> is made at{' '}
                      <strong className="text-ink">{product.craft.atelier}</strong>, in{' '}
                      {product.region}, Indonesia.
                    </p>
                    <p>
                      Every NusaMarket piece carries its region as part of the product data:
                      the archipelago filter on the catalog, the origin line on this page, and
                      the receipt all read from the same field.
                    </p>
                    <Link
                      to={`/shop?region=${encodeURIComponent(product.region)}`}
                      className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-wider text-clay-700 underline decoration-clay-400 underline-offset-4 transition-colors duration-150 hover:text-clay-600"
                    >
                      <MapPin size={12} aria-hidden="true" />
                      More from {product.region}
                    </Link>
                  </div>
                )}
                {tab === 'material' && (
                  <div className="flex flex-col gap-3">
                    <p>
                      <strong className="text-ink">Material.</strong> {product.craft.material}
                    </p>
                    <p>
                      <strong className="text-ink">Process.</strong> {product.craft.process}
                    </p>
                    <p>
                      <strong className="text-ink">Care.</strong> Cold wash, line dry in shade,
                      warm iron if needed. Natural dyes soften with age — that is the material
                      behaving as material, not a defect.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Editorial Features Strip */}
            <div className="flex flex-col gap-3.5 border-t border-stone-200/80 pt-5 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <Truck size={16} className="mt-0.5 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink">Express Domestic Delivery</p>
                  <p className="text-[11px] text-stone-500">
                    Regular (3-5 days) or Express (1-2 days) across Indonesia; worldwide on request.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={16} className="mt-0.5 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink">14-Day Complimentary Exchanges</p>
                  <p className="text-[11px] text-stone-500">
                    Unworn items with tags can be exchanged for size adjustments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink">Named Atelier Guarantee</p>
                  <p className="text-[11px] text-stone-500">
                    Verified origin from partner Indonesian workshops — the atelier is printed
                    on the receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-200/80 pt-12">
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  Curated Match
                </span>
                <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Complete the Look
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors duration-150 hover:text-stone-500"
              >
                More in {product.category}
              </Link>
            </div>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      {/* Sticky mobile purchase bar */}
      <div
        data-print-hide
        className="fixed bottom-0 left-0 right-0 z-10 border-t border-stone-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-stone-900">{product.name}</p>
            <p className="text-sm font-bold tabular-nums text-ink">{formatRupiah(product.price)}</p>
          </div>
          <Button
            size="md"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="shrink-0"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </Button>
        </div>
      </div>
    </div>
  );
}
