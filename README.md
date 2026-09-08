# NusaMarket

**A curated storefront for Indonesia's independent ateliers.** A complete, responsive
ecommerce front end built with React, TypeScript and Tailwind CSS — from catalog
browsing through checkout and order confirmation, with **provenance as product
data**: every piece carries its atelier, region, material and process.

> Front-end only. There is no backend, no payment processing and no account
> system: the catalog is typed local data and the order flow resolves in the
> browser. Everything described below is implemented and interactive.

---

## Overview

NusaMarket is a portfolio project that answers one narrow question: **what does a
storefront look like when the maker is part of the product data?**

The app ships a full purchase path — browse, search, filter (including by
Indonesian region), inspect a product's craft story, save it, add it to a bag,
check out with validated form data, and land on a printable receipt that names
the atelier of every item. Cart and wishlist survive a reload; the receipt
survives a refresh within the same tab. Nothing is a dead button, and nothing
claims to do more than it does.

The catalog is 24 typed products across 6 categories from 4 fictional labels —
LOKAL, NUSANTARA, KOTABARU and GARIS — made by 7 named fictional ateliers across
Sumatra, Java and Bali, priced in Indonesian Rupiah.

## Features

**Provenance system (new)**

- Every product carries `region` and a `craft` object: material, process,
  atelier, and a written story — typed data, not marketing prose
- Region filter (Sumatra · Java · Bali · Nusa Tenggara) persisted in the URL
  (`/shop?region=Bali`) — shareable, bookmarkable, back-button-safe
- Product detail tabs: **Craft Story / Origin / Material & Care**
- The atelier is printed on the cart row and the order receipt

**Catalog & discovery**

- Product grid at 2 / 3 / 4 columns with 4:5 cards, hover image swap, quick add,
  and a wishlist toggle
- Search across product name, brand, category and atelier — case-insensitive
  partial matching through one shared matcher
- Editorial search overlay with live results, product thumbnails, trending terms
  and category shortcuts
- Category, region, price-tier and rating filters plus five sort orders, all
  persisted in the URL
- Active-filter chips with individual removal and a reset-all action

**Product detail**

- Image gallery with thumbnail navigation, size and colorway selection, quantity
  control bounded by stock, and stock messaging
- Craft tabs, sample reviews with aggregate score and star-distribution
- Related products from the same category
- Sticky add-to-bag bar on mobile

**Commerce**

- Cart drawer and full cart page sharing one summary component and one shipping
  calculation, with a free-shipping progress banner
- Wishlist page with per-item add-to-bag
- Checkout with React Hook Form + Zod validation, shipping method, payment
  method and a live order summary
- Order confirmation with order number, itemised receipt and print support

**Motion (new)**

- Fly-to-cart: a clay chip flies from the add button into the bag icon, the
  badge pulses, the spring drawer follows
- Spring-physics drawer; scroll-revealed artisan stories; magnetic primary
  buttons; Ken Burns hero with film grain
- Every animation path respects `prefers-reduced-motion`

**Editorial & portfolio surfaces (new)**

- **Stories from the Archipelago** — five artisan profiles in an alternating
  editorial layout
- **The Craft** (`/journal`) — three long-form reads on batik, tenun and fabric
  weight
- **Case study** (`/case-study`) — the engineering write-up: problem, research,
  decisions, challenges, results
- **Design system** (`/design-system`) — live token sheet, type scale, motion
  scale, component inventory
- **Admin** (`/admin`) — passcode-gated catalog console (demo gate: `nusa2026`)

**States**

- Layout-matched skeletons for the grid and product detail
- Distinct empty states for cart, wishlist, no search results and no filter
  matches
- Error state with a real retry that re-runs the data call

## Tech Stack

| Concern | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript (strict) | Typed components, no `any` in app code |
| Build | Vite 8 | Fast dev server, small production output |
| Styling | Tailwind CSS v4 | CSS-first config — tokens live in `@theme`, no JS config file |
| Routing | React Router 7 | Lazy-loaded route modules behind one Suspense boundary around the outlet |
| State | Zustand 5 | Small stores, `persist` middleware for cart and wishlist |
| Motion | Framer Motion 12 | Fly-to-cart, spring drawers, scroll reveals — all reduced-motion aware |
| Forms | React Hook Form + Zod | Schema-driven validation, errors beside their fields |
| Icons | lucide-react | Consistent stroke weight at small sizes |
| Linting | oxlint | Fast flat-config lint pass |
| Imagery | sharp (dev) | Deterministic studio-tile placeholder pipeline — `npm run images` |

Nine runtime dependencies. No component library, no data-fetching client — the
mock service layer is a promise.

## Design Direction

Editorial minimalism with an archipelago accent. Three rules hold the visual
language together.

**Ink plus clay.** Ink carries every emphasis — buttons, prices, active states —
with warm stone greys for everything secondary. Clay / terracotta (#c1440e), the
colour of sogan dye and laterite soil, is the one accent, paired with ink rather
than replacing it. Emerald is reserved for meaning (free-shipping unlock, stock),
soft gold marks provenance only. Typography carries the heritage × modern
thesis: **Clash Display** for headings, **Cormorant Garamond** italic for artisan
quotes, **Satoshi** for body, **JetBrains Mono** for prices and data.

**Texture as material.** A 5–8% kawung-inspired weave behind the artisan band, a
tenun strip as section divider, film grain on hero imagery — all CSS/SVG, all
free to load, all gone under reduced motion.

**A calm motion scale, now with springs.** 150 ms for control feedback, 200 ms
for overlays, 500 ms for editorial reveals, one spring for drawers and the
fly-to-cart ghost, 18 s for the hero Ken Burns. `prefers-reduced-motion`
collapses everything to near-zero except loading feedback.

## UX Decisions

**Provenance belongs in the URL.** Region filters persist as query parameters
like every other filter — any catalog state can be shared as a link.

**Overlays stay mounted.** The cart drawer and search overlay toggle `aria-hidden`
and `inert` rather than unmounting. Focus is trapped while open and returned on
close; scroll locking is ref-counted.

**Search behaves like a combobox.** Frameless oversized input, `listbox` results
with arrow-key navigation, `aria-activedescendant` tracking, polite result
announcements.

**No native selects.** One custom `Dropdown` with full keyboard support —
click, Enter/Space, arrows, Home/End, type-ahead, Escape, click-outside.

**The header measures itself.** A `ResizeObserver` publishes the real header
height to `--nm-header-h`; page padding, anchors and the search overlay all
read that variable.

**Money is calculated once.** Subtotal lives in the cart store; shipping comes
from a single `shippingCostFor()` helper. No component recomputes a total.

**Placeholders are a system, not stock soup.** With no photography for most
catalog slots, every placeholder is generated by one deterministic pipeline
(`scripts/generate-images.mjs`): a per-brand studio tile derived from brand
colour and weave angle. Real photography dropped into `public/images/` is never
overwritten and takes precedence automatically.

**Demo copy is honest.** The newsletter says the address goes nowhere, the
checkout says no payment is processed, and every footer link resolves to a
route that exists.

## Architecture

```
src/
├── App.tsx                  route table — lazy pages incl. journal,
│                            case-study, design-system, admin
├── index.css                Tailwind v4 theme: tokens, textures, motion scale
├── components/
│   ├── ui/                  Button (magnetic), Input, Dropdown, Badge, Rating,
│   │                        Drawer (spring), Skeleton, EmptyState, QuantitySelector
│   ├── layout/              Layout, Navbar (transparent→solid), Footer
│   ├── product/             ProductCard, ProductGrid (stagger), ProductThumb,
│   │                        ProductReviews
│   ├── cart/                CartDrawer, CartItem, CartSummary, FlyToCartLayer
│   ├── search/              SearchModal, SearchResultRow, SearchChip
│   └── sections/            NewsletterForm
├── pages/                   Home, Shop (+region), ProductDetail (+craft tabs),
│                            Wishlist, Cart, Checkout, OrderSuccess, Journal,
│                            CaseStudy, DesignSystem, Admin
├── data/                    products.ts (24 typed + provenance), artisans.ts,
│                            journal.ts, reviews.ts
├── services/                productService — the single data seam
├── stores/                  cartStore, wishlistStore, orderStore, uiStore
├── hooks/                   useScrollLock, useFocusTrap, useDocumentTitle
├── types/                   Product (region + craft), Order, FilterState
└── utils/                   currency, shipping, order ids, image resolver
```

**Data access is one seam.** Pages never import `data/products.ts` for their
primary fetch; they call `productService`. Swapping local data for a real API is
a change to that one module.

**State is split by lifetime.** Cart and wishlist persist to `localStorage`; the
completed order persists to `sessionStorage`; UI flags (drawer, menu, overlay,
fly-to-cart) persist nowhere.

## Verification

- `npm run typecheck` — clean (strict)
- `npm run lint` — no errors (pedantic warnings only: long data files, long page components)
- `npm run build` — production bundle ~250 kB js gzip ~77 kB; **no animation library** —
  motion is CSS transitions/keyframes + IntersectionObserver + Web Animations API
- Headless QA (`scripts/qa-headless.cjs`): 13 routes, **0 console errors,
  0 failed requests**; interactive flows verified — quick add opens drawer with
  correct badge, admin gate accepts passcode, region filter returns correct counts
- Lighthouse (desktop preset): **Home 99 / 96** (perf / a11y), CLS 0.004,
  Shop 99 / 94, Product 98 / 93, Case study 98 / 100
- Lighthouse (mobile, slow-4G + 4× CPU): **Home 75**, up from 65 — the gap to
  desktop is 90% simulated-hardware throttling; an unthrottled run measures
  LCP 1.8 s / TBT 40 ms
- Mobile imagery: product cards fetch **480px variants** (`-480.webp`, generated
  by `npm run images`) — a low-end phone decodes ~56% fewer pixels per card;
  verified via request log (18 small / 0 master on `/shop`)
- Low-end guards: no `backdrop-filter` anywhere, Ken Burns + film grain disabled
  on touch devices (`hover: none`), spring drawer & magnetic buttons are
  pure CSS transforms, all reveals collapse under `prefers-reduced-motion`

## Local Development

Requires Node 20.19+ or 22.12+ (Vite 8).

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run typecheck` | `tsc -b` across app and node configs |
| `npm run lint` | oxlint across the project |
| `npm run build` | Typecheck, then production bundle to `dist/` |
| `npm run preview` | Serve the built bundle locally |
| `npm run images` | Regenerate placeholder imagery (never overwrites real files) |
| `node scripts/qa-headless.cjs` | Headless route + interaction QA |

No environment variables are required — there is nothing to configure.

## Deployment

A static single-page app: `npm run build` emits `dist/`, which any static host
can serve. `vercel.json` is included and rewrites non-asset paths to
`index.html`. Deploying elsewhere needs the equivalent SPA fallback rule.

## Product Images

Product photography lives in `public/images/`. No code change is required to
replace a placeholder: drop real `.webp` files into the existing folders
(`products/<slug>/01..03.webp`, `categories/*.webp`, `editorial/*.webp`,
`artisans/*.webp`). The generator script skips existing files, so real photos
always win and `npm run images` only fills gaps.

## Project Status

Feature-complete as a front-end demonstration. Every route, control and state
described above is implemented and interactive.

Deliberately out of scope — storefront concept, not a commerce platform:
authentication, payment processing, persistent orders, CMS-managed content.

Known limitations:

- **Sample content.** Products, ateliers and reviews are fictional data bundled
  with the app; reviews are generated deterministically from a product id.
- **Placeholder photography.** Most imagery is generated studio tiles (see
  Design Direction) — coherent by design, replaceable file-by-file.
- **Static stock.** Stock counts are fixed per product; nothing decrements on
  purchase.
- **Admin is a demo gate.** The `/admin` passcode (documented: `nusa2026`) is a
  client-side pattern showing the protected-route shape; real auth would
  replace the challenge.
