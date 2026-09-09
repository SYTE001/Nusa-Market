# NusaMarket — Editorial UI + SEO Upgrade Plan

> Scope: homepage visual coherence, CTA hierarchy, editorial rhythm, material tactility, semantic SEO, structured data, crawlability, and international signals.
>
> Repository: `SYTE001/Nusa-Market` — Vite + React + TypeScript SPA. Existing routes are defined in `src/App.tsx`; the homepage is `src/pages/HomePage.tsx`; global design tokens/textures live in `src/index.css`; document-level metadata currently lives in `index.html`. [SOURCE: repository inspection]
>
> Execution rule: inspect existing implementation before editing. Preserve working commerce flows, motion accessibility, responsive behavior, and existing design-system tokens unless this plan explicitly changes them.

---

## 0. Goal

Move NusaMarket from “premium ecommerce with heritage copy” to a coherent **editorial Indonesian craft storefront** where:

1. Hero visual, copy, product positioning, and stats tell the same story.
2. The first action is visually obvious.
3. Layout behaves like an editorial catalog rather than a generic SaaS/ecommerce dashboard.
4. Texture adds material warmth without looking decorative or noisy.
5. Google can crawl and understand products, organization/store identity, hierarchy, and internal relationships.
6. Social shares expose a strong 1200×630 editorial preview.
7. All changes remain compatible with the current Vite SPA architecture.

## 1. Current Repository Reality

Known implementation facts:

- `src/App.tsx` uses `BrowserRouter` with routes for `/`, `/shop`, `/product/:slug`, `/journal`, `/admin`, `/case-study`, and others. [SOURCE: `src/App.tsx`]
- `src/pages/HomePage.tsx` currently renders a heritage-focused hero headline but the featured hero image is explicitly labeled `Classic Heavyweight Boxy Tee`. The hero currently exposes **three competing actions**: `Explore the Collection`, `See What's New`, and `Watch the Craft`. [SOURCE: `src/pages/HomePage.tsx`]
- Homepage metrics are currently dynamic but presented as `Curated Styles`, `Named Ateliers`, and `Regions → Provinces`; this needs editorial reframing rather than SaaS-like KPI treatment. [SOURCE: `src/pages/HomePage.tsx`]
- `src/index.css` already has warm canvas tokens, clay accent tokens, batik texture, motif divider, and a 6% film-grain utility. Do not introduce a second competing visual system. Tune the existing system instead. [SOURCE: `src/index.css`]
- `index.html` already contains title, description, OpenGraph, and Twitter metadata, but **no `og:image`/`twitter:image` and no JSON-LD**. [SOURCE: `index.html`]
- The project is a Vite SPA, not Next.js. Do not add Next.js-specific APIs, Server Actions, metadata files, or assumptions. [SOURCE: `Plan.md`, project inspection]
- Existing package scripts include `build`, `typecheck`, `lint`, and `images`, so QA must use those existing commands. [SOURCE: `package.json`]

---

# PHASE 1 — BETTER LOOK / CREATIVE UI CRITIQUE

## 1.1 Hero Narrative Disconnect — PRIORITY P0

### Problem
The hero copy promises Indonesian craft/provenance:

- “Handwoven batik from Pekalongan.”
- “Carved teak from Jepara.”
- “Shipped worldwide.”

But the primary visual is a basic black tee. The visual does not substantiate the narrative.

### Required direction
Choose **one** coherent direction and implement it consistently:

**Preferred:** replace the hero asset with an editorial image showing Indonesian craft/materiality: contemporary batik apparel, handwoven textile detail, teak craft/still-life, or a refined atelier scene.

**Fallback:** if the actual catalog remains streetwear/basic apparel and no craft-specific asset exists, rewrite the lead copy so it describes that product honestly. Example direction:

`A curated storefront for Indonesia's independent ateliers — heavyweight cut-and-sew, naturally dyed textiles, and considered everyday pieces.`

### Implementation
- Inspect `public/images/editorial/` and the existing product/catalog image set before creating or referencing a new asset.
- Replace `/images/editorial/hero.webp` only when the new asset genuinely supports the final copy.
- Update the hero `<img alt>` to describe the actual visual and product/context.
- Keep `fetchPriority="high"`, explicit dimensions, and the existing reduced-motion handling.
- Do not use generic “artisan” stock photography that does not correspond to NusaMarket inventory.
- Avoid visual clichés: fake hands, excessive sepia, staged “ethnic” props, meaningless loom closeups, or AI-looking craft scenes.
- Preserve the current 4:5 composition unless the source image requires another crop. Adapt with `object-position`, not arbitrary stretching.

### Acceptance criteria
- Hero visual can be shown independently of the copy and still communicates “Indonesian craft/editorial commerce”.
- Hero headline and image describe the same product universe.
- No layout shift is introduced.
- Mobile crop still presents the key material/product subject.

---

## 1.2 CTA Hierarchy — PRIORITY P0

### Problem
Three actions compete in the same row, weakening the primary conversion path.

### Required hierarchy
Use exactly:

**Primary:** `Explore the Collection`

**Secondary:** `Watch the Craft` as a lightweight inline text/video action near the lead copy.

Remove the current peer-level `See What's New` button from the hero. Keep “new” discovery elsewhere on the page, where it does not compete with the primary action.

### Implementation
- Keep the solid dark CTA as the strongest visual element.
- Convert `Watch the Craft` into a compact inline action/badge; retain the existing modal behavior.
- Suggested pattern:
  - small play icon
  - `Watch the Craft`
  - optional microcopy `2-min atelier film` only when an actual video exists
- Do not fabricate “2-min” duration if footage remains placeholder.
- Do not add another pill/button merely to replace the removed CTA.
- Ensure keyboard focus and accessible names remain intact.

### Acceptance criteria
- User has one unmistakable primary action.
- Hero no longer presents three equal-weight CTAs.
- Video action remains discoverable without looking like a competing purchase CTA.

---

## 1.3 Editorial Stats / Grid Rhythm — PRIORITY P1

### Problem
Numeric stats currently read like SaaS KPI cards.

### Required content treatment
Reframe the stats as catalog/editorial provenance markers. Target copy:

- `24` → `Curated Masterpieces`
- `7` → `Heritage Workshops`
- `38` → `Regencies Documented`

Important: use **verified project data** for the numbers. Do not hard-code claims that are not represented in the actual catalog/data model.

### Implementation
- Derive the values from existing data where possible.
- If the current data does not support “38 regencies documented”, expose the value only if it is a deliberate brand dataset; otherwise use an accurate alternative such as the existing catalog-derived count.
- Keep the typography restrained and editorial; no KPI-card background, no icon row, no decorative badges.
- Add a 1px horizontal rule using `#E8E4DE` or the nearest existing stone token.
- The rule should align from the content margin toward the right edge of the hero media/lookbook boundary on desktop.
- On mobile, collapse to a clean full-width rule within the page gutter; never create horizontal overflow.

### Acceptance criteria
- Stats read as provenance/curation context, not business analytics.
- Horizontal rule aligns with the locked desktop grid.
- No brittle absolute positioning that breaks at intermediate widths.

---

## 1.4 Tactility & Warmth — PRIORITY P1

### Problem
The warm canvas is good, but the surface still reads digitally flat.

### Required direction
Use a **very subtle paper/fiber texture** at approximately 2–3% opacity. Reuse the existing grain system where possible instead of layering multiple heavy filters.

### Implementation
- Prefer CSS texture or a tiny embedded SVG/pattern over a large bitmap asset.
- Tune existing `.grain-overlay` from the current 6% where necessary for large neutral canvas regions; do not blindly increase it.
- The texture must be nearly imperceptible at normal viewing distance.
- Keep the current mobile optimization that disables heavy grain on touch devices.
- Do not apply grain to every component individually; use it selectively on major editorial surfaces.
- Avoid high-frequency noise that harms text readability or causes excessive repaint work.

### Acceptance criteria
- Surface feels tactile on desktop.
- Body text remains crisp.
- Mobile GPU load is not materially increased.
- No duplicated grain artifacts when components already use `.grain-overlay`.

---

## 1.5 Typography / Spacing Polish — PRIORITY P1

The repository already uses Clash Display, Satoshi, Cormorant Garamond, and JetBrains Mono. Keep that hierarchy. [SOURCE: `src/index.css`]

Audit:

- Hero headline line length and breakpoints.
- Lead paragraph width.
- CTA baseline alignment.
- Stats baseline alignment.
- Section heading/eyebrow spacing.
- Image-to-copy rhythm.
- Desktop max-width consistency.
- Intermediate tablet widths (especially 768–1100px).

Do not introduce additional fonts.

---

# PHASE 2 — SEO / SEARCH DISCOVERABILITY

## 2.1 Structured Data — PRIORITY P0

### Principle
Implement structured data based on **actual repository entities**, not invented metadata. Because this is a Vite SPA, JSON-LD can be emitted from the document head in `index.html` for site-level entities and from React page components for route-specific product entities when the page data is available.

### Organization / Store
Add a JSON-LD block representing NusaMarket. Suggested shape:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NusaMarket",
  "url": "https://nusa-market.vercel.app/",
  "description": "Curated storefront for Indonesia's independent artisans and heritage ateliers."
}
```

If an actual business/store entity is appropriate based on the implemented commerce model, use `Store`/`OnlineStore` only when the available properties are truthful. Do not claim physical addresses, payment methods, currencies, or global shipping terms without repository-backed evidence.

### Product JSON-LD
For each product detail page, emit `Product` JSON-LD from the same product source used by the UI.

Minimum useful fields:

- `name`
- `image`
- `description`
- `offers.price`
- `offers.priceCurrency`
- `offers.availability`
- `offers.url`

Only emit a USD offer when the application actually has a USD price. Never generate a fake currency conversion merely to satisfy schema.

### BreadcrumbList
For product/detail and taxonomy-like pages, emit breadcrumb hierarchy from the real route/data model.

Example:

`Home > Shop > [Category] > [Product]`

Do not claim `/collections/batik`, `/regions/pekalongan`, or other routes until those routes exist.

### Validation
After implementation, validate JSON-LD syntax and inspect for:

- missing required fields
- malformed URLs
- invalid currency codes
- mismatched visible content vs structured data
- duplicate/conflicting schemas

---

## 2.2 Semantic SEO / Keyword Bridging — PRIORITY P0

### Homepage lead copy
Replace the current generic lead with a stronger search-intent bridge while retaining premium brand voice. Target direction:

`A curated storefront for Indonesia’s independent ateliers — discover authentic handwoven batik apparel, artisanal Jepara teak homeware, and sustainable handcrafted goods delivered worldwide.`

Important: this exact copy must only be used if the catalog actually contains these product types. Otherwise adapt the nouns to the real catalog.

### Internal linking
Create contextual links only to routes that actually exist.

Known working route examples from the current router:

- `/shop`
- `/journal`
- `/product/:slug`
- `/wishlist`
- `/cart`
- `/case-study`
- `/design-system`

Do **not** invent `/collections/batik`, `/regions/pekalongan`, or `/artisans` pages unless implementing those routes as part of this plan.

For current homepage copy, link meaningful terms to existing destinations where semantically appropriate:

- product/category language → `/shop` or an existing filtered `/shop?...` URL
- artisan/craft editorial language → `/journal`
- featured product → actual `/product/:slug`

Avoid stuffing multiple links into one sentence. One or two high-value contextual links are enough.

---

## 2.3 Navigation / Crawlability — PRIORITY P0

### Header links
Audit `src/components/layout/Navbar.tsx`.

Every crawlable destination must use a real anchor semantics through React Router `<Link>` or plain `<a href>` as appropriate. Avoid click-only navigation patterns where the destination is a normal page.

Rules:

- Normal page navigation → `<Link to="/route">` is acceptable and renders anchor semantics.
- External destination → `<a href>`.
- Button-only interaction (modal, drawer, sort control) → `<button>`.
- Never misuse `<button>` as a normal navigation link.

### Lookbook card
The featured product image and title must both participate in the same meaningful product link, or a single linked wrapper should contain both.

Target:

- title clickable
- image clickable
- descriptive `aria-label`
- link destination `/product/lokal-classic-tee` (or dynamic product slug)

Avoid leaving only the tiny arrow as the clickable target.

---

## 2.4 OpenGraph / Social Preview — PRIORITY P0

### Required metadata
Expand `index.html` with:

- `og:image`
- `og:image:width` = `1200`
- `og:image:height` = `630`
- `og:image:alt`
- `twitter:image`
- `twitter:card` = `summary_large_image`

Use an actual public asset, ideally a dedicated 1200×630 editorial composition. Do not reuse a portrait 4:5 hero image without checking how the crop behaves.

### Asset requirement
Create/prepare a dedicated image under `public/images/og/` or another clearly named public path. File name must be descriptive, for example:

`nusamarket-og-editorial.webp`

The asset should visually match the new hero/art direction.

---

## 2.5 International Signals — PRIORITY P1 / ONLY WHEN ROUTES EXIST

Current router is a single-language SPA. Do **not** add `hreflang` pointing to `/id/` and `/en/` until those routes/pages actually exist.

When an ID/EN route system is implemented:

```html
<link rel="alternate" hreflang="id" href=".../id/" />
<link rel="alternate" hreflang="en" href=".../en/" />
<link rel="alternate" hreflang="x-default" href=".../" />
```

Until then, prioritize correct canonical URLs, language declaration, metadata, and crawlable route structure.

---

# PHASE 3 — TECHNICAL SEO / HTML QUALITY

## 3.1 Head / Document Metadata

Audit `index.html` and any route-specific title/description logic.

Requirements:

- `<html lang="en">` must match the actual current UI language.
- Page titles must be unique by route.
- Descriptions must be unique where route content materially differs.
- Canonical URL strategy must reflect the deployed canonical origin.
- Do not hard-code a production domain that is not actually configured.

The repository currently uses `useDocumentTitle` on the homepage and a Vite SPA shell. Keep route-specific title behavior consistent with the existing architecture. [SOURCE: `HomePage.tsx`, `index.html`]

## 3.2 Image SEO / Performance

For every primary content image:

- meaningful `alt`
- explicit width/height when practical
- `fetchPriority="high"` only for the true LCP image
- lazy loading for below-fold imagery
- stable aspect-ratio containers
- avoid hiding broken images with `display:none` unless a genuine fallback exists

The hero must remain the single intentional LCP candidate.

## 3.3 Heading Hierarchy

Audit the homepage and key routes:

- one logical `<h1>` per page
- section titles as `<h2>`
- no visual-only text masquerading as headings
- no skipped heading levels solely for styling

## 3.4 Link Text

Replace vague link-only labels such as `→` when they are the only accessible name. A visual arrow can remain, but the accessible link should communicate the destination.

---

# PHASE 4 — IMPLEMENTATION ORDER

Execute in this exact order to minimize rework:

### Step 1 — Forensic audit
Inspect:

- `src/pages/HomePage.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/product/*`
- `src/data/products.ts`
- `src/data/artisans.ts`
- `src/index.css`
- `index.html`
- route definitions in `src/App.tsx`
- current public editorial/product images

Record actual available routes, product fields, currencies, atelier names, region fields, and existing imagery before changing copy/schema.

### Step 2 — Resolve hero narrative
Either:

A. install/use a craft-relevant editorial hero asset and keep the craft-led copy, or
B. keep the existing product image and rewrite the copy to match the actual product universe.

Preferred outcome: A.

### Step 3 — Simplify CTA hierarchy
Keep one solid primary CTA. Convert `Watch the Craft` to an inline secondary action. Remove `See What's New` from the hero.

### Step 4 — Rework stats / locked grid
Convert metrics to editorial provenance labels backed by real data. Align the horizontal rule with the desktop hero grid.

### Step 5 — Tune texture
Refine the existing grain/paper treatment to a subtle 2–3% material layer without adding a heavy bitmap dependency.

### Step 6 — Add structured data
Start with Organization/site-level JSON-LD. Add Product + BreadcrumbList using existing product/route data.

### Step 7 — Fix semantic navigation
Audit Navbar + featured lookbook links. Use proper anchor semantics and enlarge product-card click targets.

### Step 8 — Upgrade OpenGraph
Add a dedicated 1200×630 preview asset and complete OG/Twitter metadata.

### Step 9 — SEO content pass
Tighten hero lead, internal links, alt text, titles/descriptions, and heading hierarchy.

### Step 10 — Responsive + accessibility QA
Check desktop, tablet, mobile, keyboard navigation, focus states, reduced motion, and long localized copy behavior.

### Step 11 — Build/lint/typecheck
Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Fix all introduced errors before completion.

### Step 12 — Visual verification
Use a real browser/headless run where available. Check:

- first viewport narrative coherence
- CTA hierarchy
- no horizontal overflow
- hero crop
- stats rule alignment
- header/nav links
- featured product click target
- OG asset dimensions
- JSON-LD presence

---

# PHASE 5 — ANTI-AI-SLOP DESIGN RULES

The agent must follow these constraints during implementation:

1. Do not add arbitrary gradients, glassmorphism, neon accents, floating cards, excessive pills, or generic dashboard decoration.
2. Do not add UI elements simply because “premium websites use them”. Every element needs a content or interaction reason.
3. Avoid excessive rounded corners. Preserve the current restrained editorial geometry.
4. Do not add fake badges like `TRENDING`, `BEST SELLER`, `CURATED`, or `NEW` unless the data supports them.
5. Do not use random stock imagery.
6. Do not duplicate components merely to achieve visual variation.
7. Avoid icon-heavy UI. Text and composition should carry the hierarchy.
8. Keep animation subtle and compositor-friendly. Preserve reduced-motion support.
9. Do not turn the homepage into a metrics dashboard.
10. Do not over-optimize for “dribbble aesthetics” at the expense of navigation, semantics, and conversion.
11. Keep the warm editorial palette. Clay is an accent, not a dominant UI color.
12. Preserve the existing design-system roles instead of introducing another token family.

---

# PHASE 6 — DEFINITION OF DONE

The work is complete only when all are true:

### Visual
- [ ] Hero copy and hero visual tell one story.
- [ ] Exactly one dominant hero CTA.
- [ ] Watch-the-craft action reads as secondary.
- [ ] Stats feel editorial/provenance-led.
- [ ] Desktop grid reads as one locked layout.
- [ ] Warm canvas has subtle tactile texture.
- [ ] No obvious AI-slop patterns introduced.

### SEO
- [ ] Organization/store JSON-LD is valid and truthful.
- [ ] Product JSON-LD exists on product pages and matches visible data.
- [ ] BreadcrumbList exists where route hierarchy supports it.
- [ ] Homepage lead contains useful product-intent language without keyword stuffing.
- [ ] Internal contextual links resolve to real routes.
- [ ] Navbar navigation is crawlable anchor semantics.
- [ ] Lookbook image/title are part of the product link target.
- [ ] OG image is 1200×630.
- [ ] Twitter large-card metadata is present.
- [ ] `hreflang` is not added prematurely; only implement when locale routes exist.

### Engineering
- [ ] No Next.js/server-only APIs introduced.
- [ ] Existing route behavior remains intact.
- [ ] `prefers-reduced-motion` remains respected.
- [ ] No new console errors.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No new layout shift caused by hero/metadata changes.
- [ ] No horizontal overflow at common breakpoints.

---

# Priorities

| Priority | Task | Impact | Notes |
|---|---|---:|---|
| P0 | Hero narrative disconnect | Very High | Most visible coherence issue |
| P0 | CTA hierarchy | Very High | Simplify conversion path |
| P0 | JSON-LD | High | Use truthful repository data |
| P0 | Semantic/crawlable navigation | High | Real links, real routes |
| P0 | OpenGraph 1200×630 | High | Social sharing quality |
| P0 | SEO keyword bridge | High | Buyer-intent without keyword stuffing |
| P1 | Editorial stats/grid | Medium-High | Remove SaaS visual language |
| P1 | Tactile texture | Medium | Subtle paper/material cue |
| P1 | Heading/image/link audit | Medium | Technical/semantic quality |
| P1 | hreflang | Deferred | Only after locale routes exist |

---

# Agent Behavior Contract

Before editing, inspect the current implementation and reuse existing patterns.

When a requested business claim, route, currency, product type, atelier, region, or statistic is not present in the repository:

**DATA NOT SUFFICIENT — do not invent it.** Use the closest verified implementation or leave the feature deferred.

Do not rewrite unrelated pages or refactor architecture unless the change is required for this plan.

Do not replace working systems with new libraries when the current stack already supports the requirement.

Every visual change must be checked against:

1. content truth,
2. hierarchy,
3. responsiveness,
4. accessibility,
5. performance,
6. SEO semantics.

The agent should finish with a concise implementation summary and exact files changed.
