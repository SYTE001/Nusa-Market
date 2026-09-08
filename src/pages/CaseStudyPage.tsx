import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';

/** One numbered section of the case study. */
function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-stone-200/80 py-10">
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-mono-data text-[11px] font-semibold text-clay-600">{n}</span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 text-sm leading-[1.85] text-stone-700">{children}</div>
    </section>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-clay-400 pl-5 font-serif-editorial text-lg italic leading-relaxed text-ink sm:text-xl">
      {children}
    </blockquote>
  );
}

export default function CaseStudyPage() {
  useDocumentTitle('Case Study — NusaMarket — NusaMarket');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Masthead */}
      <header className="mb-4 border-b border-stone-200/80 pb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-clay-600">
          Case Study · NusaMarket
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
          A storefront that treats provenance as product data.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600">
          How a portfolio storefront for Indonesian independent ateliers was rebuilt around
          one idea: the maker belongs in the data model, not the marketing copy.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
          <span>Role — Design & Engineering</span>
          <span>Stack — React 19 · Vite 8 · Tailwind v4 · Zustand</span>
          <span>Status — Live demo</span>
        </div>
      </header>

      <Section n="01" title="The problem">
        <p>
          Indonesian craft marketplaces have a shape, and the shape is the problem. A generic
          marketplace template renders every seller identically: product photo, price,
          discount badge, ‘terlaris!’. The maker — the entire reason a hand-stamped batik
          costs eight times a printed one — appears nowhere in the interface.
        </p>
        <p>
          The brief I set myself was narrow: <strong>what does a storefront look like when
          provenance is a first-class field?</strong> Not a story page nobody reads, but data
          that flows through the catalog filter, the product page, the cart row, and the
          receipt. If the atelier is product data, then ‘made in Pekalongan by Bengkel
          Tamtama’ can be filtered, compared, and printed — exactly like price.
        </p>
        <Pull>
          Success metric: a visitor can answer ‘who made this, where, and how’ from the
          catalog grid alone — without clicking anything.
        </Pull>
      </Section>

      <Section n="02" title="Research">
        <p>
          I audited four reference points on a spectrum: <strong>Etsy</strong> (maker-front,
          but chaotic filtering), <strong>Tokopedia Premium</strong> (Indonesian, but
          marketplace-generic), <strong>Aesop</strong> (provenance as brand voice, zero
          data), and <strong>Studio Nicholson</strong> (restraint, type discipline).
        </p>
        <p>
          Two findings shaped everything after. First: the references that felt premium
          shared <em>less</em> chrome, not more — Aesop’s product pages carry one material
          paragraph, set like a poem, and it lands harder than any spec table. Second:
          nobody in the set let you filter by origin, even though origin is the strongest
          natural taxonomy Indonesian craft has. Regions are how craft people actually
          talk: ‘Javanese batik’, ‘Sumba ikat’, ‘Bali tenun’.
        </p>
        <p>
          The target audience write-up: urban Indonesian buyers and design-literate
          international browsers who pay a premium for the story but distrust marketing
          prose — they want the story in verifiable fields.
        </p>
      </Section>

      <Section n="03" title="Brand & design direction">
        <p>
          The visual language is <strong>editorial minimalism with an archipelago accent</strong>.
          The base stays warm-neutral — canvas tones borrowed from undyed cotton, ink for
          every emphasis — because the craft itself supplies the colour. Into that quiet
          base, one accent was added deliberately: <strong>clay / terracotta</strong>, the
          colour of sogan dye and red laterite soil, paired with (never replacing) ink.
          Emerald was demoted to what it always should have been: a status colour reserved
          for the free-shipping unlock and stock signals. Soft gold marks provenance only.
        </p>
        <p>
          Typography carries the ‘heritage × modern’ thesis directly:{' '}
          <strong>Clash Display</strong> (geometric, contemporary) for headings,{' '}
          <strong>Cormorant Garamond</strong> (bookish serif, italic) for artisan quotes
          and editorial lines, <strong>Satoshi</strong> for body, and{' '}
          <strong>JetBrains Mono</strong> tabular figures for prices and data. The pairing
          is the argument: a serif set inside a geometric grid reads as craft catalogued by
          a modern institution.
        </p>
        <p>
          Texture is used as material, not decoration: a 5–8% opacity kawung-inspired
          weave behind the artisan band, a tenun strip as section divider, and film grain
          on hero imagery. All three are CSS/SVG, cost nothing to load, and vanish under
          reduced-motion settings where they could distract.
        </p>
      </Section>

      <Section n="04" title="Technical decisions">
        <p>
          <strong>The stack is Vite + React Router, and the case study says so.</strong>{' '}
          Portfolio advice often pushes Next.js App Router for the buzzwords; I evaluated
          it and stayed with an SPA deliberately. There is no server, no SEO surface to
          render, and no data fetching beyond a typed local catalog behind a service seam.
          A Server Component that renders static data is a dependency, not a feature. The
          honest engineering call was: keep the client bundle tiny, make the data layer
          swappable in one file (<code className="font-mono-data text-xs bg-stone-100 px-1">productService.ts</code>),
          and document the trade-off.
        </p>
        <p>
          <strong>Provenance in the type system.</strong> The{' '}
          <code className="font-mono-data text-xs bg-stone-100 px-1">Product</code> type grew
          a <code className="font-mono-data text-xs bg-stone-100 px-1">region</code> union
          and a <code className="font-mono-data text-xs bg-stone-100 px-1">craft</code>{' '}
          object (material, process, atelier, story). Because the filter reads the same
          field the product page renders, the two can never drift. The region filter
          persists in the URL like every other filter — shareable, bookmarkable, back-button-safe.
        </p>
        <p>
          <strong>State is split by lifetime</strong>: cart and wishlist persist to
          localStorage; the completed order lives in sessionStorage so a receipt survives a
          refresh but not a new tab; UI flags (drawers, overlays) persist nowhere.
          Zustand stores stay dumb; components read them through selectors.
        </p>
        <p>
          <strong>Optimistic motion, honest fallbacks.</strong> Fly-to-cart uses a
          framer-motion ghost chip animating toward the bag button’s live position
          (resolved per frame, so it lands after scroll). Every animation path checks{' '}
          <code className="font-mono-data text-xs bg-stone-100 px-1">useReducedMotion</code>{' '}
          first, and the global CSS collapses durations to near-zero. Images: every surface
          has an <code className="font-mono-data text-xs bg-stone-100 px-1">onError</code>{' '}
          fallback tile, so a missing photo degrades to a typographic brand tile instead of
          a broken-image icon.
        </p>
      </Section>

      <Section n="05" title="Challenges & solutions">
        <p>
          <strong>The scroll-locked fixed header.</strong> The fixed header reserves space
          via <code className="font-mono-data text-xs bg-stone-100 px-1">--nm-header-h</code>,
          measured by a ResizeObserver and published to CSS. Early on, anchors and the
          search overlay drifted out of sync at breakpoints where the announcement bar
          wraps. Moving the measurement into the header itself — the only element that
          knows its own height — fixed every consumer at once.
        </p>
        <p>
          <strong>Overlays that stay mounted.</strong> The cart drawer and search overlay
          never unmount; they toggle <code className="font-mono-data text-xs bg-stone-100 px-1">aria-hidden</code>{' '}
          and <code className="font-mono-data text-xs bg-stone-100 px-1">inert</code>.
          That keeps their transitions cheap, but creates an exit hazard: a closed
          overlay must not sit in the tab order. The ref-counted scroll lock and the
          focus-return on close came out of tracing that exact bug.
        </p>
        <p>
          <strong>Placeholder imagery without stock-photo soup.</strong> No photography
          existed for 23 of 24 catalog slots. Rather than mixing random stock, every
          placeholder is generated from one deterministic system — a per-product ‘studio
          tile’ derived from brand colour and weave pattern, produced by a single script.
          The grid stays visually coherent whether the photo is real or placeholder, which
          is exactly what a portfolio demo needs.
        </p>
      </Section>

      <Section n="06" title="Results & learnings">
        <p>
          <strong>What shipped:</strong> 24 typed products with full provenance data, a
          region-filterable shareable catalog, craft-story tabs on every product page, an
          artisan editorial section with scroll reveals, fly-to-cart and spring drawers,
          a journal, a design-system page, and an admin surface — all passing typecheck,
          lint, and a production build at a gzip bundle weight the Lighthouse budget
          absorbs without complaint.
        </p>
        <p>
          <strong>What outperformed expectation:</strong> putting the atelier name on the
          cart line item. It costs one line of JSX, and it changes the receipt from a
          price list into a provenance document — the single most ‘portfolio-difference’
          per byte spent.
        </p>
        <p>
          <strong>What I would do differently:</strong> invent the imagery pipeline
          earlier. The placeholder system ended up shaping the visual identity (brand
          colours, weave textures) — had it come first, the palette would have been
          derived from it in one pass instead of reconciled after.
        </p>
        <Pull>
          The learning I keep: provenance is not content to be written — it is a schema
          decision. Make it data, and every surface becomes honest for free.
        </Pull>
      </Section>

      {/* Outbound */}
      <footer className="mt-8 flex flex-col gap-3 border-t-2 border-ink py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-sm font-semibold text-ink">
          See the decisions running live.
        </p>
        <div className="flex gap-3">
          <Link
            to="/shop?region=Bali"
            className="border border-stone-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors duration-150 hover:border-ink"
          >
            Filter by region
          </Link>
          <Link
            to="/design-system"
            className="border border-stone-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink transition-colors duration-150 hover:border-ink"
          >
            Design system
          </Link>
        </div>
      </footer>
    </div>
  );
}
