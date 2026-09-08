import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X, MapPin } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Reveal } from '../hooks/useReveal';
import type { Product } from '../types';
import { getNewArrivals, getBestSellers } from '../services/productService';
import { products } from '../data/products';
import { artisans } from '../data/artisans';
import { ProductGrid } from '../components/product/ProductGrid';
import { NewsletterForm } from '../components/sections/NewsletterForm';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useUIStore } from '../stores/uiStore';

// Category tile images live in public/images/categories/.
const CATEGORY_IMAGES: Record<string, string> = {
  'T-Shirts': '/images/categories/t-shirts.webp',
  Hoodies: '/images/categories/hoodies.webp',
  Pants: '/images/categories/pants.webp',
  Jackets: '/images/categories/jackets.webp',
  Accessories: '/images/categories/accessories.webp',
  Bags: '/images/categories/bags.webp',
};

/** Style counts are derived from the catalog so a tile can never advertise a
    number the shop does not actually return. */
const CATEGORY_TILES = Object.entries(CATEGORY_IMAGES).map(([name, img]) => ({
  name,
  img,
  count: products.filter((p) => p.category === name).length,
}));

const CATALOG_SIZE = products.length;
const REGION_COUNT = new Set(products.map((p) => p.region)).size;
const ATELIER_COUNT = new Set(products.map((p) => p.craft.atelier)).size;

/** Behind-the-scenes film modal — an honest placeholder: a poster frame with
    a play affordance, and a caption about where the footage will come from. */
function CraftVideoModal() {
  const { craftVideoOpen, closeCraftVideo } = useUIStore();
  if (!craftVideoOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Watch the Craft"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      onClick={closeCraftVideo}
    >
      <div
        className="grain-overlay relative w-full max-w-3xl border border-stone-700 bg-stone-950"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeCraftVideo}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
        >
          <X size={17} strokeWidth={1.5} />
        </button>
        <div className="batik-weave relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <Play size={40} strokeWidth={1.2} className="text-clay-300" aria-hidden="true" />
            <p className="font-serif-editorial text-xl text-stone-200 italic sm:text-2xl">
              “The hand returns to the line differently every morning.”
            </p>
            <p className="max-w-md text-xs leading-relaxed text-stone-400">
              Ibu Ratna Tamtama, Pekalongan. The full studio film — wax drawing, vat dyeing,
              boiling out — is being cut now. This placeholder holds the frame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  useDocumentTitle('NusaMarket — Handcrafted in Indonesia, Shipped Worldwide');

  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const reduce = usePrefersReducedMotion();
  const openCraftVideo = useUIStore((s) => s.openCraftVideo);

  useEffect(() => {
    Promise.all([getNewArrivals(), getBestSellers()])
      .then(([na, bs]) => {
        setNewArrivals(na);
        setBestSellers(bs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* ============ Cinematic Hero ============ */}
      <section className="grain-overlay relative overflow-hidden border-b border-stone-200/80 bg-canvas-muted">
        {/* Batik texture band, subtle (4–8%) */}
        <div
          aria-hidden="true"
          className="batik-weave pointer-events-none absolute inset-0 opacity-[0.05]"
        />
        <div className="relative z-[2] mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
          {/* Headline Copy */}
          <div className="flex flex-col gap-5 lg:col-span-7 lg:pr-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-clay-500" aria-hidden="true" />
              <span>Independent Indonesian Ateliers</span>
            </div>

            <h1 className="font-display text-3xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Handwoven batik from Pekalongan.
              <br />
              <span className="font-serif-editorial font-medium italic text-clay-700">
                Carved teak from Jepara.
              </span>
              <br />
              Shipped worldwide.
            </h1>

            <p className="max-w-lg text-xs leading-relaxed text-stone-600 sm:text-sm">
              A curated storefront for Indonesia’s independent ateliers — every piece names
              its maker, its material, and the process behind it.
            </p>

            <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center">
              <Button to="/shop" size="md" magnetic className="w-full sm:w-auto">
                Explore the Collection
              </Button>
              <Button
                to="/shop?sort=newest"
                size="md"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                See What&rsquo;s New
              </Button>
              <button
                onClick={openCraftVideo}
                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 border-b border-stone-400 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-700 transition-colors duration-150 hover:border-clay-500 hover:text-clay-700 sm:w-auto"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-400 transition-colors duration-150 group-hover:border-clay-500 group-hover:bg-clay-50">
                  <Play size={11} strokeWidth={2.5} className="ml-0.5" aria-hidden="true" />
                </span>
                Watch the Craft
              </button>
            </div>

            {/* Quick metrics ticker */}
            <div className="mt-1 grid grid-cols-3 gap-4 border-t border-stone-300/60 pt-5 text-stone-900">
              <div>
                <p className="font-display text-base font-semibold tracking-tight sm:text-lg">
                  {CATALOG_SIZE}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Curated Styles</p>
              </div>
              <div>
                <p className="font-display text-base font-semibold tracking-tight sm:text-lg">
                  {ATELIER_COUNT}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Named Ateliers</p>
              </div>
              <div>
                <p className="font-display text-base font-semibold tracking-tight sm:text-lg">
                  {REGION_COUNT} → 38
                </p>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Regions → Provinces</p>
              </div>
            </div>
          </div>

          {/* Hero Visual — Ken Burns settle + grain */}
          <div className="relative lg:col-span-5">
            <div className="grain-overlay relative mx-auto aspect-[4/5] w-full max-w-[368px] overflow-hidden border border-stone-300/60 bg-stone-200 shadow-sm">
              <img
                src="/images/editorial/hero.webp"
                alt="Classic Heavyweight Tee from the NusaMarket lookbook"
                width={900}
                height={1125}
                fetchPriority="high"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className={`h-full w-full object-cover object-center ${
                  reduce ? '' : 'animate-ken-burns'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                  Lookbook 01
                </p>
                <p className="text-xs font-semibold sm:text-sm">Classic Heavyweight Boxy Tee</p>
                <Link
                  to="/product/lokal-classic-tee"
                  className="mt-2 inline-flex items-center gap-1.5 bg-white/95 p-2 text-xs text-ink backdrop-blur-xs transition-colors duration-150 hover:bg-white"
                  aria-label="View featured tee"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motif divider — tenun strip */}
      <div aria-hidden="true" className="motif-divider mx-auto max-w-7xl" />

      {/* ============ Featured Categories ============ */}
      <section
        id="collections"
        className="mx-auto max-w-7xl scroll-mt-[calc(var(--nm-header-h)+1.5rem)] px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Curated Categories
            </span>
            <h2 className="font-display mt-0.5 text-lg font-semibold tracking-tight text-ink sm:text-2xl">
              Shop by Silhouette
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors duration-150 hover:text-stone-500"
          >
            <span>All Silhouettes</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-6">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col overflow-hidden border border-stone-200/80 bg-white shadow-2xs transition-colors duration-200 hover:border-ink"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={cat.img}
                  alt={cat.name}
                  width={600}
                  height={450}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col bg-white p-2.5">
                <span className="text-xs font-bold tracking-tight text-ink">{cat.name}</span>
                <span className="text-[10px] font-medium text-stone-500">
                  {cat.count} {cat.count === 1 ? 'Style' : 'Styles'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ New Arrivals ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Fresh from the Bench
            </span>
            <h2 className="font-display mt-0.5 text-lg font-semibold tracking-tight text-ink sm:text-2xl">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors duration-150 hover:text-stone-500"
          >
            <span>View Full Drop</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <ProductGrid products={newArrivals.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* ============ Stories from the Archipelago (artisan editorial) ============ */}
      <section
        id="artisans"
        className="grain-overlay scroll-mt-[calc(var(--nm-header-h)+1.5rem)] border-y border-stone-200/80 bg-canvas-muted px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-clay-600">
              Stories from the Archipelago
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              The hands behind the cloth.
            </h2>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-stone-600 sm:text-sm">
              NusaMarket exists because of them: five ateliers, five regions, five
              techniques that no factory replicates.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {artisans.map((a, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal
                  as="article"
                  key={a.id}
                  className={`grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-12 ${
                    flip ? '' : ''
                  }`}
                >
                  {/* Portrait — full-bleed */}
                  <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                    <div className="grain-overlay relative aspect-[4/5] overflow-hidden border border-stone-300/60 bg-stone-200">
                      <img
                        src={a.photo}
                        alt={`${a.name}, ${a.craft}`}
                        width={720}
                        height={900}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white drop-shadow">
                        <MapPin size={11} strokeWidth={2.5} aria-hidden="true" />
                        {a.place}
                      </div>
                    </div>
                  </div>

                  {/* Story */}
                  <div className={`flex flex-col gap-3.5 lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-[10px] font-semibold uppercase tracking-widest text-clay-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="h-px w-8 bg-clay-300" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                        {a.craft}
                      </span>
                    </div>

                    <h3 className="font-serif-editorial text-xl font-semibold leading-snug text-ink sm:text-2xl">
                      {a.name}
                    </h3>

                    <p className="text-xs leading-[1.8] text-stone-600 sm:text-sm">{a.story}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-300/60 pt-4 text-[11px]">
                      <span className="text-stone-500">
                        <strong className="font-display font-semibold text-ink tabular-nums">
                          {a.yearsAtBench}
                        </strong>{' '}
                        years at the bench
                      </span>
                      <span className="text-stone-500">
                        Signature:{' '}
                        <span className="font-medium text-clay-700">{a.signature}</span>
                      </span>
                      <Link
                        to={`/shop?region=${encodeURIComponent(a.region)}`}
                        className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-stone-700 underline decoration-clay-400 decoration-1 underline-offset-4 transition-colors duration-150 hover:text-clay-700"
                      >
                        Pieces from {a.region}
                        <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Button to="/journal" variant="secondary" size="md">
              Read the Craft Journal
            </Button>
          </div>
        </div>
      </section>

      {/* ============ Best Sellers ============ */}
      <section className="below-fold mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Community Favorites
            </span>
            <h2 className="font-display mt-0.5 text-lg font-semibold tracking-tight text-ink sm:text-2xl">
              Bestselling Staples
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors duration-150 hover:text-stone-500"
          >
            <span>View All Bestsellers</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <ProductGrid products={bestSellers.slice(0, 4)} loading={loading} skeletonCount={4} />
      </section>

      {/* ============ Editorial promo band ============ */}
      <section className="below-fold mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grain-overlay relative grid min-h-[380px] grid-cols-1 overflow-hidden bg-ink text-white lg:min-h-[400px] lg:grid-cols-12">
          <div className="relative h-60 overflow-hidden sm:h-72 lg:col-span-7 lg:h-full">
            <img
              src="/images/editorial/archival-series.webp"
              alt="Archival Series campaign photograph"
              width={1100}
              height={734}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="h-full w-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:bg-gradient-to-r" />
          </div>

          <div className="z-[2] flex flex-col gap-4 p-6 sm:p-10 lg:col-span-5 lg:p-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-clay-300">
              Archival Series 2026
            </span>
            <h2 className="font-serif-editorial text-xl font-medium leading-tight text-white sm:text-3xl">
              Crafted for the Tropics. Kept for Generations.
            </h2>
            <p className="text-xs leading-relaxed text-stone-300 sm:text-sm">
              Low-volume runs across Java, Sumatra and Bali — hand-stamped batik, natural
              indigo vats, dense weaves, double-needle construction. Made to outlast trend cycles.
            </p>
            <div className="pt-1">
              <Button
                to="/shop"
                size="sm"
                variant="secondary"
                className="border-white bg-transparent text-white hover:bg-white hover:text-ink text-[11px] focus-visible:ring-white focus-visible:ring-offset-ink"
              >
                Explore the Archive
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Ethos ============ */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">
          About NusaMarket
        </span>
        <h2 className="font-serif-editorial mt-3 text-xl font-medium leading-snug text-ink sm:text-3xl">
          “A marketplace tells you what you can buy.{' '}
          <span className="italic text-clay-700">We tell you who made it.</span>”
        </h2>
        <p className="mt-5 text-xs leading-relaxed text-stone-600 sm:text-sm">
          NusaMarket was built on one belief: Indonesian craft deserves a storefront that
          treats the maker as part of the product. Every listing carries its atelier, its
          material, and its process — not as marketing, but as provenance.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-800">
          <span>Small-Batch</span>
          <span className="text-clay-400">·</span>
          <span>Named Makers</span>
          <span className="text-clay-400">·</span>
          <span>Natural Materials</span>
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3.5 border border-stone-300 bg-white p-7 text-center shadow-2xs sm:p-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Editorial Dispatch
          </span>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Letters from the workshops
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-stone-500 sm:text-sm">
            Restock announcements, artisan field notes, and one long read a month.
          </p>
          <NewsletterForm layout="inline" className="mt-1 max-w-md" />
        </div>
      </section>

      <CraftVideoModal />
    </div>
  );
}
