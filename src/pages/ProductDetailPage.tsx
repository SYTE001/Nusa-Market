import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import type { Product } from '../types';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { formatRupiah, discountPercent } from '../utils';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useUIStore } from '../stores/uiStore';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

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

  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id ?? ''));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    setActiveImg(0);
    setQty(1);
    getProductBySlug(slug)
      .then((p) => {
        if (!p) {
          setError(true);
          return;
        }
        setProduct(p);
        setSelectedSize(p.sizes?.[0]);
        setSelectedColor(p.colors?.[0]);
        return getRelatedProducts(p);
      })
      .then((rel) => rel && setRelated(rel))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, qty, selectedSize, selectedColor);
    openCartDrawer();
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-stone-900 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[640px] pb-2 sm:pb-0 scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-16 sm:h-24 sm:w-18 shrink-0 overflow-hidden border-2 bg-stone-100 transition-all cursor-pointer ${
                      activeImg === i
                        ? 'border-stone-950 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View perspective ${i + 1}`}
                  >
                    {imgErrors[i] ? (
                      <div className="h-full w-full bg-stone-200" />
                    ) : (
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover object-center"
                        onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 overflow-hidden bg-stone-100 aspect-[3/4] relative shadow-xs">
              {imgErrors[activeImg] ? (
                <div className="flex h-full w-full items-center justify-center bg-stone-200 text-stone-400 text-sm">
                  Image perspective unavailable
                </div>
              ) : (
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-300"
                  onError={() => setImgErrors((prev) => ({ ...prev, [activeImg]: true }))}
                />
              )}

              {/* Floating badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-1.5 z-10">
                {product.isNew && <Badge variant="new">New Drop</Badge>}
                {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
                {product.originalPrice && (
                  <Badge variant="sale">
                    Save {discountPercent(product.price, product.originalPrice)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Specification & Purchase Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header meta */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
                  {product.brand}
                </span>
                <Rating value={product.rating} count={product.reviewCount} size="md" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
              />
              <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-stone-600'}`}>
                {stockLabel}
              </span>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2 border-t border-stone-200/80">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700">
                    Select Size
                  </p>
                  <span className="text-xs text-stone-400 font-medium">Standard Fit</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 min-w-[42px] px-3.5 border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-stone-950 bg-stone-950 text-stone-50 shadow-xs'
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
                  Colorway: <span className="font-normal text-stone-500 capitalize">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`h-9 px-4 border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'border-stone-950 bg-stone-950 text-stone-50 shadow-xs'
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
            <div className="flex flex-col gap-3 pt-4 border-t border-stone-200/80">
              <div className="flex items-center gap-3">
                <QuantitySelector value={qty} min={1} max={product.stock} onChange={setQty} size="md" />
                <Button
                  size="lg"
                  fullWidth
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </Button>
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 shrink-0 items-center justify-center border border-stone-300 bg-white hover:border-stone-950 transition-colors cursor-pointer shadow-2xs"
                >
                  <Heart
                    size={18}
                    strokeWidth={1.75}
                    className={isWishlisted ? 'text-red-600 fill-red-600' : 'text-stone-700'}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
                {product.description}
              </p>
            </div>

            {/* Editorial Features Strip */}
            <div className="border-t border-stone-200/80 pt-5 flex flex-col gap-3.5 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <Truck size={16} className="text-stone-900 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-stone-950">Express Domestic Delivery</p>
                  <p className="text-stone-500 text-[11px]">Regular (3-5 days) or Express (1-2 days) across Indonesia.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={16} className="text-stone-900 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-stone-950">14-Day Complimentary Exchanges</p>
                  <p className="text-stone-500 text-[11px]">Unworn items with tags can be exchanged for size adjustments.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-stone-900 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-stone-950">100% Authentic Independent Label</p>
                  <p className="text-stone-500 text-[11px]">Verified original manufacturing from partner Indonesian workshops.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 border-t border-stone-200/80 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Verified Feedback
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mt-1">
                Customer Reviews
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-stone-950">{product.rating.toFixed(1)}</span>
              <div>
                <Rating value={product.rating} count={product.reviewCount} size="md" />
                <p className="text-[11px] text-stone-400">Based on verified purchases</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 p-6 text-center text-xs text-stone-500">
            <p className="font-medium text-stone-800 mb-1">[REAL REVIEWS]</p>
            <p>Customer feedback and fit ratings will synchronize live from the partner store review engine.</p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-200/80 pt-12">
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Curated Match
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mt-1">
                  Complete the Look
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-500 transition-colors"
              >
                More in {product.category}
              </Link>
            </div>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur-md p-3 px-4 lg:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-stone-900">{product.name}</p>
            <p className="text-sm font-bold text-stone-950">{formatRupiah(product.price)}</p>
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
