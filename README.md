# NusaMarket

**Modern storefront concept for Indonesian local brands.** A complete, responsive
ecommerce front end built with React, TypeScript and Tailwind CSS — from catalog
browsing through checkout and order confirmation.

> Front-end only. There is no backend, no payment processing and no account
> system: the catalog is typed local data and the order flow resolves in the
> browser. Everything described below is implemented and interactive.

---

## Overview

NusaMarket is a portfolio project that answers a narrow question: what does a
premium, editorial storefront for independent Indonesian apparel labels look and
feel like when every interaction actually works?

The app ships a full purchase path — browse, search, filter, sort, inspect a
product, save it, add it to a bag, review the bag, check out with validated form
data, and land on a printable receipt. Cart and wishlist survive a reload; the
receipt survives a refresh within the same tab. Nothing is a dead button, and
nothing claims to do more than it does.

The catalog is 24 typed products across 6 categories (T-Shirts, Hoodies, Pants,
Jackets, Accessories, Bags) from 4 fictional labels — LOKAL, NUSANTARA, KOTABARU
and GARIS — priced in Indonesian Rupiah.

## Features

**Catalog & discovery**

- Product grid at 2 / 3 / 4 columns (mobile / tablet / desktop) with 4:5 cards,
  hover image swap, quick add, and a wishlist toggle
- Search across product name, brand and category — case-insensitive partial
  matching through one shared matcher
- Editorial search overlay with live results, product thumbnails, trending terms
  and category shortcuts
- Category, price-tier and rating filters plus five sort orders, all persisted in
  the URL (`/shop?category=Hoodies&sort=price-low`) so a refresh or a shared link
  restores the exact view
- Active-filter chips with individual removal and a reset-all action

**Product detail**

- Image gallery with thumbnail navigation, size and colorway selection, quantity
  control bounded by stock, and stock messaging
- Sample reviews with an aggregate score and a star-distribution breakdown
- Related products from the same category
- Sticky add-to-bag bar on mobile

**Commerce**

- Cart drawer and full cart page sharing one summary component and one shipping
  calculation, with a free-shipping progress banner
- Wishlist page reusing the catalog card, preserving the order pieces were saved in
- Checkout with React Hook Form + Zod validation, shipping method, payment method
  and a live order summary
- Order confirmation with order number, itemised receipt and print support

**States**

- Layout-matched skeletons for the grid and product detail
- Distinct empty states for cart, wishlist, no search results and no filter matches
- Error state with a real retry that re-runs the data call rather than reloading
  the page

## Tech Stack

| Concern | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript (strict) | Typed components, no `any` in app code |
| Build | Vite 8 | Fast dev server, small production output |
| Styling | Tailwind CSS v4 | CSS-first config — tokens live in `@theme`, no JS config file |
| Routing | React Router 7 | Lazy-loaded route modules behind one Suspense boundary around the outlet, so a loading chunk never takes the header, footer or cart drawer with it |
| State | Zustand 5 | Small stores, `persist` middleware for cart and wishlist |
| Forms | React Hook Form + Zod | Schema-driven validation, errors beside their fields |
| Icons | lucide-react | Consistent stroke weight at small sizes |
| Linting | oxlint | Fast flat-config lint pass |

Eight runtime dependencies total. No component library, no animation library, no
state-management framework beyond Zustand, no data-fetching client — the mock
service layer is a promise.

## Design Direction

Editorial minimalism: generous whitespace, strong type hierarchy, hairline
borders, restrained motion. Three rules hold the visual language together.

**One accent.** A single near-black ink carries every emphasis — active nav item,
primary button, selected filter, price — with warm stone greys for everything
secondary. Colour is used for meaning (emerald for a free-shipping unlock, red for
a validation error), never for decoration. Surfaces are three warm neutrals
defined as `@theme` tokens: `canvas`, `canvas-raised`, `canvas-muted`; `ink` sets
body text, text selection and the focus ring.

**Deliberate image ratios.** Product cards are 4:5 so a grid of them reads as a
lookbook rather than a spreadsheet of squares. Category tiles are 4:3 so they sit
lighter than the products they lead to. The detail gallery is 3:4 and allowed to
dominate, because that is the one place the garment is the subject.

**A three-step motion scale.** 150 ms for feedback on a control, 200 ms for an
overlay or a page entrance, 500 ms for an editorial image reveal. Keyframed
entrances and the slow image reveals run on the shared `--ease-editorial` curve;
the short 150–200 ms transitions use `ease-out`, which at that length is
visually the same thing with less CSS. A route change fades the new page in and
nothing slides or bounces. `prefers-reduced-motion` collapses every duration to
near-zero, with one exception: the spinner and the skeleton pulse keep animating
(slower than the default) because a frozen loading indicator reads as a hung
page rather than a calm one.

Typography is Inter throughout, with uppercase tracked labels for eyebrows and
tabular numerals for prices.

## UX Decisions

**Filter state belongs in the URL.** Every filter, sort order and search term is a
query parameter, so browser back works, refresh preserves the view, and any
catalog state can be shared as a link.

**Overlays stay mounted.** The cart drawer and search overlay never unmount; they
toggle `aria-hidden` and `inert` alongside a CSS transition. That keeps
open/close animation cheap and keeps closed overlays out of both the tab order
and the accessibility tree. Each traps focus while open and returns it to the
trigger on close, and scroll locking is ref-counted so two overlaps cannot leave
the page stuck.

**Search behaves like a combobox, not a form.** The input is frameless and
oversized, results are a `listbox` navigated with arrow keys, `aria-activedescendant`
tracks the highlighted row, Enter opens it, Escape closes the overlay, and the
result count is announced politely for screen reader users.

**No native selects.** Filters and sorting use one custom `Dropdown` component so
the control looks identical on every platform. It supports click, Enter/Space,
arrow keys, Home/End, type-ahead, Escape, click-outside, a visible focus ring and
a marked selected option.

**The header measures itself.** A `ResizeObserver` publishes the real header
height to `--nm-header-h`, and page padding, anchor offsets and the search overlay
all read that variable — so the announcement bar can change height at any
breakpoint without a hard-coded offset drifting out of sync.

**Money is calculated once.** Subtotal lives in the cart store; shipping comes from
a single `shippingCostFor()` helper. No component recomputes a total.

**Demo copy is honest.** The newsletter form says the address goes nowhere, the
checkout says no payment is processed, and every footer link resolves to a route
that exists.

## Architecture

```
src/
├── App.tsx                  route table — lazy pages, 404 fallback
├── index.css                Tailwind v4 theme: tokens, utilities, motion scale
├── components/
│   ├── ui/                  Button, Input, Dropdown, Badge, Rating, Drawer,
│   │                        Skeleton, EmptyState, QuantitySelector
│   ├── layout/              Layout, Navbar, Footer
│   ├── product/             ProductCard, ProductGrid, ProductThumb,
│   │                        ProductReviews
│   ├── cart/                CartDrawer, CartItem, CartSummary
│   ├── search/              SearchModal, SearchResultRow, SearchChip
│   └── sections/            NewsletterForm
├── pages/                   Home, Shop, ProductDetail, Wishlist, Cart,
│                            Checkout, OrderSuccess
├── data/                    products.ts (24 typed products + categories),
│                            reviews.ts
├── services/                productService — the single data seam
├── stores/                  cartStore, wishlistStore, orderStore, uiStore
├── hooks/                   useScrollLock, useFocusTrap, useDocumentTitle
├── types/                   Product, CartItem, Order, FilterState, form types
└── utils/                   currency formatting, shipping, order ids
```

**Data access is one seam.** Pages never import `data/products.ts` for their
primary fetch; they call `productService`, which returns promises. Swapping local
data for a real API is a change to that one module.

**State is split by lifetime.** Cart and wishlist persist to `localStorage`; the
completed order persists to `sessionStorage` so a receipt survives a refresh but
not a new tab; UI flags (drawer, menu, overlay) persist nowhere.

**Presentation stays dumb.** Stores hold logic and derived values, components read
them through selectors.

## Screenshots

No screenshots are committed to this repository. Product imagery is served from
Unsplash at runtime and is not redistributed here.

To capture your own set, run the dev server and photograph these views — they
cover the full flow and every distinctive interaction:

| View | Route / action |
| --- | --- |
| Home | `/` |
| Catalog with active filters | `/shop?category=Hoodies&sort=price-low` |
| Search overlay | any page → search icon in the header |
| Product detail | `/product/lokal-heavyweight-hoodie` |
| Cart drawer | add any product to the bag |
| Checkout | `/cart` → Proceed to Checkout |
| Order confirmation | submit the checkout form |

Every product frame falls back to a brand monogram if a remote image fails, so the
layout stays intact offline.

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

No environment variables are required — there is nothing to configure.

## Deployment

A static single-page app: `npm run build` emits `dist/`, which any static host can
serve. `vercel.json` is included and rewrites non-asset paths to `index.html` so
client-side routes survive a direct hit or a refresh. Deploying elsewhere needs
the equivalent SPA fallback rule.

## Project Status

Feature-complete as a front-end demonstration. Every route, control and state
described above is implemented and interactive.

Deliberately out of scope — this is a storefront concept, not a commerce platform:

- Authentication and user accounts
- Real payment processing
- Persistent orders, inventory or an admin surface
- CMS-managed content or analytics

Known limitations:

- **Sample content.** Products, prices, brands and reviews are fictional data
  bundled with the app; reviews are generated deterministically from a product id
  so they stay stable between renders.
- **Remote imagery.** Photography is loaded from Unsplash, so the catalog needs a
  network connection to look right; each frame degrades to a monogram if it does not.
- **Search scope.** Matching covers product name, brand and category — not
  descriptions or attributes.
- **Static stock.** Stock counts are fixed per product; nothing decrements on
  purchase.
- **Shared gallery photography.** All 24 primary product images are distinct, but
  a few secondary gallery frames are reused between products in the same
  category — a property of the sample data, not of the gallery code.
- **Verification is static.** Typecheck, lint and production build all pass, and
  the flows were traced through the source. No browser-driven or automated test
  suite is committed.
