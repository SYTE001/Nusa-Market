import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Rating } from '../components/ui/Rating';
import { Input } from '../components/ui/Input';
import { QuantitySelector } from '../components/ui/QuantitySelector';

/** Row-swatch token card. */
function Swatch({
  name,
  token,
  hex,
  role,
}: {
  name: string;
  token: string;
  hex: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-4 border border-stone-200 bg-white p-4">
      <div
        aria-hidden="true"
        className="h-14 w-14 shrink-0 border border-stone-300/60"
        style={{ backgroundColor: hex }}
      />
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-ink">{name}</p>
        <p className="font-mono-data text-[10px] text-stone-500">{token}</p>
        <p className="font-mono-data text-[10px] text-stone-400">{hex}</p>
        <p className="mt-1 text-[11px] leading-snug text-stone-600">{role}</p>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  className,
  sample,
}: {
  label: string;
  className: string;
  sample: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-stone-100 py-5 sm:flex-row sm:items-baseline sm:justify-between">
      <p className={className}>{sample}</p>
      <p className="font-mono-data shrink-0 text-[10px] uppercase tracking-wider text-stone-500">{label}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  useDocumentTitle('Design System — NusaMarket');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-10 border-b border-stone-200/80 pb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-clay-600">
          Design System
        </span>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          The NusaMarket token sheet.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
          One page, the whole system: colour tokens with their meaning, the type scale,
          and the component inventory. Every token shown here is defined once in{' '}
          <code className="font-mono-data bg-stone-100 px-1 text-xs">@theme</code> in
          index.css and consumed by Tailwind everywhere.
        </p>
      </div>

      {/* ============ Colour ============ */}
      <section className="mb-14">
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">01 · Colour</h2>
        <p className="mb-5 max-w-2xl text-xs leading-relaxed text-stone-600">
          Ink carries every emphasis. Clay is the archipelago accent — paired with ink,
          never replacing it. Emerald is reserved for commerce status (free shipping,
          stock). Gold marks provenance only.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch name="Canvas" token="--color-canvas" hex="#faf9f7" role="Page ground, warm white" />
          <Swatch name="Canvas Muted" token="--color-canvas-muted" hex="#f5f3ef" role="Editorial bands, sand tone" />
          <Swatch name="Ink" token="--color-ink" hex="#18181b" role="Every emphasis: buttons, price, active nav" />
          <Swatch name="Clay 500" token="--color-clay-500" hex="#c1440e" role="Accent: active filters, sale, fly-to-cart" />
          <Swatch name="Clay 700" token="--color-clay-700" hex="#84300c" role="Accent text on light, hover depth" />
          <Swatch name="Jade 600" token="--color-jade-600" hex="#047857" role="Status only: free shipping, in stock" />
          <Swatch name="Gold 400" token="--color-gold-400" hex="#c69a3e" role="Provenance marks, premium labels" />
        </div>
      </section>

      {/* ============ Typography ============ */}
      <section className="mb-14">
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">02 · Typography</h2>
        <p className="mb-5 max-w-2xl text-xs leading-relaxed text-stone-600">
          Four faces, four jobs. Clash Display speaks; Satoshi works; Cormorant quotes;
          JetBrains Mono counts.
        </p>
        <div className="border border-stone-200 bg-white px-6 py-2">
          <TypeRow
            label="Display / Clash Display 600"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            sample="Handwoven, by name."
          />
          <TypeRow
            label="Serif / Cormorant Garamond italic"
            className="font-serif-editorial text-xl italic text-ink"
            sample="“The hand returns to the line differently.”"
          />
          <TypeRow
            label="Body / Satoshi 400"
            className="text-sm text-stone-700"
            sample="Body copy sets at 14px with relaxed leading for long-form reading."
          />
          <TypeRow
            label="Eyebrow / Satoshi 700, tracked caps"
            className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500"
            sample="Section eyebrow"
          />
          <TypeRow
            label="Data / JetBrains Mono"
            className="font-mono-data text-sm tabular-nums text-ink"
            sample="Rp 1.490.000 · #NM-20260908-412"
          />
        </div>
      </section>

      {/* ============ Texture & motion ============ */}
      <section className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">03 · Texture</h2>
          <div className="grain-overlay border border-stone-200 bg-canvas-muted p-6">
            <p className="text-xs text-stone-600">
              Film grain (6%) — hero and editorial bands.
            </p>
            <div className="mt-4 h-14 batik-weave opacity-[0.35]" aria-hidden="true" />
            <p className="mt-3 text-xs text-stone-600">Kawung weave — section backgrounds at 5–8%.</p>
            <div className="mt-3 motif-divider" aria-hidden="true" />
            <p className="mt-3 text-xs text-stone-600">Tenun divider — section breaks.</p>
          </div>
        </div>
        <div>
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">04 · Motion</h2>
          <div className="border border-stone-200 bg-white p-6 text-xs leading-relaxed text-stone-600">
            <p className="font-mono-data mb-3 text-[10px] uppercase tracking-wider text-stone-500">
              Three-step scale
            </p>
            <ul className="flex flex-col gap-2">
              <li><strong className="text-ink">150ms</strong> — control feedback (hover, press)</li>
              <li><strong className="text-ink">200ms</strong> — overlays, page entrance</li>
              <li><strong className="text-ink">500ms</strong> — editorial image reveals</li>
              <li><strong className="text-ink">Spring</strong> — drawer physics, stiffness 300 / damping 34</li>
              <li><strong className="text-ink">18s</strong> — Ken Burns hero settle</li>
            </ul>
            <p className="mt-3">
              Everything collapses to 0.01ms under <code className="font-mono-data text-[10px]">prefers-reduced-motion</code>,
              except loading feedback, which stays (slower) because a frozen spinner reads as a hung page.
            </p>
          </div>
        </div>
      </section>

      {/* ============ Components ============ */}
      <section>
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">05 · Component inventory</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 border border-stone-200 bg-white p-6">
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-stone-500">Buttons</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
              <Button size="sm" loading>Loading</Button>
            </div>
            <p className="text-[11px] text-stone-500">
              Primary buttons support the magnetic lean on desktop pointers.
            </p>
          </div>

          <div className="flex flex-col gap-4 border border-stone-200 bg-white p-6">
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-stone-500">Badges</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="new">New</Badge>
              <Badge variant="bestseller">Best Seller</Badge>
              <Badge variant="sale">-25%</Badge>
              <Badge variant="provenance">Java · Atelier Senja</Badge>
            </div>
            <p className="font-mono-data mt-2 text-[10px] uppercase tracking-wider text-stone-500">Rating</p>
            <Rating value={4.7} count={128} />
          </div>

          <div className="flex flex-col gap-4 border border-stone-200 bg-white p-6">
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-stone-500">Input & Quantity</p>
            <Input label="Postal Code" placeholder="12345" hint="Five digits" />
            <QuantitySelector value={2} min={1} max={9} onChange={() => {}} />
          </div>

          <div className="flex flex-col gap-3 border border-stone-200 bg-white p-6">
            <p className="font-mono-data text-[10px] uppercase tracking-wider text-stone-500">Overlays & cards</p>
            <p className="text-xs leading-relaxed text-stone-600">
              Drawer (spring physics) · Search combobox · Fly-to-cart layer ·
              Product card (4:5, hover swap, quick add) · Cart row · Skeletons ·
              Empty states (cart / wishlist / search / filter / error)
            </p>
            <p className="text-[11px] text-stone-500">
              All documented in the case study, all interactive on the storefront.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
