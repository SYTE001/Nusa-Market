import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft } from 'lucide-react';
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
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(slug ?? ''));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    setActiveImg(0);
    setQty(1);
    getProductBySlug(slug)
      .then((p) => {
        if (!p) { setError(true); return; }
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
          action={{ label: 'Go to Shop', onClick: () => navigate('/shop') }}
        />
      </div>
    );
  }

  const stockLabel =
    product.stock === 0
      ? 'Out of stock'
      : product.stock < 5
      ? `Only ${product.stock} left`
      : 'In stock';

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-18 w-14 shrink-0 overflow-hidden border-2 transition-colors ${
                      activeImg === i ? 'border-stone-900' : 'border-transparent'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    {imgErrors[i] ? (
                      <div className="h-full w-full bg-stone-100" />
                    ) : (
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1 overflow-hidden bg-stone-50 aspect-[3/4]">
              {imgErrors[activeImg] ? (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400 text-sm">
                  Image unavailable
                </div>
              ) : (
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={() => setImgErrors((prev) => ({ ...prev, [activeImg]: true }))}
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
              {product.originalPrice && (
                <Badge variant="sale">-{discountPercent(product.price, product.originalPrice)}%</Badge>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold text-stone-900 lg:text-3xl">{product.name}</h1>
            </div>

            <Rating value={product.rating} count={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-stone-900">{formatRupiah(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">{formatRupiah(product.originalPrice)}</span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-xs font-medium ${product.stock === 0 ? 'text-red-500' : 'text-emerald-700'}`}>
              {stockLabel}
            </p>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-700">
                  Size: <span className="font-normal normal-case tracking-normal">{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-9 min-w-[2.5rem] px-2 border text-xs font-medium transition-colors ${
                        selectedSize === s
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 text-stone-700 hover:border-stone-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-700">
                  Color: <span className="font-normal normal-case tracking-normal">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`h-8 px-3 border text-xs transition-colors ${
                        selectedColor === c
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 text-stone-700 hover:border-stone-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-700">Qty</p>
              <QuantitySelector value={qty} min={1} max={product.stock} onChange={setQty} />
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button
                size="lg"
                fullWidth
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-stone-200 hover:border-stone-900 transition-colors"
              >
                <Heart
                  size={18}
                  className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-600'}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-stone-100 pt-5">
              <p className="text-sm leading-relaxed text-stone-600">{product.description}</p>
            </div>

            {/* Product info accordion-style */}
            <div className="border-t border-stone-100 pt-4 flex flex-col gap-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span className="font-medium text-stone-900">Shipping</span>
                <span>Regular (3-5 days) · Express (1-2 days)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-900">Returns</span>
                <span>14-day return policy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-900">Category</span>
                <span>{product.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews placeholder */}
        <div className="mt-16 border-t border-stone-100 pt-10">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-stone-500">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-stone-900">{product.rating.toFixed(1)}</span>
            <div>
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <p className="mt-1 text-xs text-stone-500">Based on {product.reviewCount} reviews</p>
            </div>
          </div>
          <p className="text-sm text-stone-400 italic">[REAL REVIEWS]</p>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-stone-100 pt-10">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-stone-500">
              More from {product.category}
            </h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-100 bg-white p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-stone-900">{product.name}</p>
            <p className="text-sm font-bold text-stone-900">{formatRupiah(product.price)}</p>
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

