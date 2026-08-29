# NusaMarket — AI Coding Agent Plan

## 0. ROLE

You are the primary coding agent responsible for implementing the entire NusaMarket ecommerce frontend from start to finish.

Your job is to:
- write all production-ready code
- create and organize all required files
- install and configure dependencies
- implement all pages
- implement all components
- implement state management
- implement mock product data
- implement validation
- implement responsive behavior
- implement loading, empty, and error states
- fix bugs
- run checks
- refactor when necessary
- keep the project deployable

The human is responsible for decisions and tasks outside coding.

DO NOT ask the human to manually code anything.

---

# 1. PRODUCT

## Project Name

NusaMarket

## Positioning

Modern ecommerce storefront for Indonesian local brands.

Primary demo niche:

Local fashion / streetwear.

The architecture must remain reusable for:
- fashion
- skincare
- coffee
- accessories
- digital products

The UI should feel like a real ecommerce product, not a coding demo.

---

# 2. PRIMARY GOAL

Build a complete frontend ecommerce experience.

The final application must support this complete flow:

Home
→ Shop
→ Search / Filter
→ Product Detail
→ Wishlist
→ Add to Cart
→ Cart Drawer
→ Full Cart
→ Checkout
→ Order Confirmation

Every step must work without dead-end UI.

---

# 3. HUMAN RESPONSIBILITIES

The human handles:

- final brand direction
- final logo
- final product photos if desired
- final marketing copy approval
- final visual review
- domain
- Vercel account
- GitHub account
- production credentials
- real payment provider
- real backend infrastructure if needed
- final deployment approval

The agent must still create the application so that the above can be connected later.

Do not block development waiting for these items.

Use placeholders / dummy assets where necessary.

---

# 4. AGENT RESPONSIBILITIES

The agent owns all coding work.

This includes:

- project setup
- architecture
- dependencies
- components
- routes
- pages
- Zustand stores
- product data
- utility functions
- form validation
- filtering
- search
- sorting
- cart logic
- wishlist logic
- checkout logic
- responsive behavior
- UI states
- accessibility basics
- loading states
- error handling
- code quality
- build verification

---

# 5. TECH STACK

Use:

- React
- TypeScript
- Tailwind CSS
- React Router or framework routing appropriate to the selected project setup
- Zustand
- React Hook Form
- Zod
- Fetch API or TanStack Query
- Lucide React for icons
- Vercel-compatible setup

Prefer a modern TypeScript architecture.

Avoid unnecessary dependencies.

If the repository already has a framework configured, preserve the existing architecture unless there is a strong technical reason to change it.

---

# 6. DEVELOPMENT PRINCIPLES

## 6.1 Production mindset

Do not build throwaway demo code.

Code should be:
- reusable
- readable
- typed
- modular
- maintainable
- responsive
- accessible
- easy to extend

## 6.2 Component reuse

Do not duplicate UI.

Prefer reusable components such as:

- Button
- Input
- Badge
- Rating
- ProductCard
- ProductGrid
- ProductGallery
- QuantitySelector
- CartItem
- CartSummary
- Modal
- Drawer
- EmptyState
- ErrorState
- Skeleton

## 6.3 Avoid overengineering

Do not introduce:
- unnecessary abstractions
- unnecessary backend services
- unnecessary libraries
- complex architecture for simple features

Use the simplest architecture that supports future expansion.

---

# 7. EXPECTED PROJECT STRUCTURE

Prefer:

src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── sections/
├── data/
├── stores/
├── services/
├── hooks/
├── types/
├── lib/
└── utils/

Adapt this to the actual repository if necessary.

Do not force this structure if the existing codebase already has a better consistent architecture.

---

# 8. DATA MODEL

Create strongly typed product data.

Recommended shape:

```ts
type Product = {
  id: string
  slug: string
  brand: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  images: string[]
  description: string
  sizes?: string[]
  colors?: string[]
  stock: number
  featured?: boolean
  isNew?: boolean
  isBestSeller?: boolean
}
```

Create at least 24 realistic dummy products.

Categories:

- T-Shirts
- Hoodies
- Pants
- Jackets
- Accessories
- Bags

Use realistic Indonesian Rupiah pricing.

Keep all dummy data centralized.

Do not hardcode product data directly inside components.

---

# 9. PAGES

Implement all of these pages.

## Homepage

Route:

`/`

Sections:

1. Navbar
2. Hero
3. Featured categories
4. New arrivals
5. Promotional banner
6. Best sellers
7. Brand story
8. Newsletter
9. Footer

Hero copy:

"Made Local. Made Better."

Supporting copy:

"Discover thoughtfully designed products from independent Indonesian brands."

Primary CTA:

"Shop Collection"

Secondary CTA:

"Explore New Arrivals"

---

## Shop

Route:

`/shop`

Requirements:

- product grid
- search
- category filter
- price filter
- rating filter
- sorting
- result count
- responsive layout
- loading state
- empty state
- error state

Desktop:
4 columns

Tablet:
3 columns

Mobile:
2 columns

---

## Product Detail

Route:

`/product/:slug`

Requirements:

- image gallery
- thumbnails
- product name
- brand
- rating
- price
- original price
- description
- sizes
- colors
- quantity selector
- stock status
- add to cart
- wishlist
- product information
- shipping / returns
- reviews
- related products

If product supports no size selection, do not render irrelevant size controls.

---

## Wishlist

Route:

`/wishlist`

Requirements:

- saved products
- remove item
- add to cart
- empty state

---

## Cart

Route:

`/cart`

Requirements:

- cart items
- quantity controls
- remove item
- subtotal
- shipping
- total
- checkout CTA
- empty state

Also create a cart drawer.

---

## Checkout

Route:

`/checkout`

Requirements:

Contact information:
- name
- email
- phone

Shipping:
- address
- city
- province
- postal code

Shipping method:
- regular
- express

Payment:
- bank transfer
- e-wallet
- COD

Order summary.

Use React Hook Form + Zod validation.

---

## Order Success

Route:

`/order/success`

Requirements:

- confirmation icon
- order number
- total
- order summary
- continue shopping button

Generate a deterministic-looking dummy order number.

Example:

`#NM-20260829`

Do not create a real payment transaction.

---

## Search

Search should be available through the global navigation.

Support:
- keyword matching
- product name
- brand
- category

Search UI should work on:
- desktop
- tablet
- mobile

---

# 10. NAVIGATION

Desktop:

NusaMarket

Shop
New Arrivals
Collections
About

Search
Wishlist
Bag

Mobile:

Menu
Logo
Bag

Implement:

- mobile navigation
- search overlay
- wishlist counter
- cart counter

Counters must update reactively.

---

# 11. STATE MANAGEMENT

Use Zustand.

Create separate stores where useful.

Recommended:

`cartStore`

Methods:

- addItem
- removeItem
- increaseQuantity
- decreaseQuantity
- updateQuantity
- clearCart

Computed / selectors:

- totalItems
- subtotal

`wishlistStore`

Methods:

- toggleWishlist
- addWishlist
- removeWishlist
- isWishlisted

`uiStore`

State:

- cart drawer
- mobile menu
- search overlay

Persist cart and wishlist to localStorage.

Do not persist unnecessary UI state.

---

# 12. CART BEHAVIOR

When the user clicks Add to Cart:

1. add item
2. update quantity if item already exists
3. open cart drawer
4. update cart counter
5. show lightweight feedback

Quantity behavior:

- minimum = 1
- increasing quantity must respect stock
- removing item at quantity 1 must work
- zero quantity should remove item if supported through updateQuantity

Cart calculations must be centralized.

Never duplicate subtotal calculation logic across components.

---

# 13. WISHLIST BEHAVIOR

Wishlist icon:

not saved:
`♡`

saved:
filled heart icon

User can toggle wishlist from:
- Product Card
- Product Detail

Persist wishlist.

---

# 14. FILTERING

Support:

Category:
- All
- T-Shirts
- Hoodies
- Pants
- Jackets
- Accessories
- Bags

Price:

- Under Rp100K
- Rp100K–250K
- Rp250K–500K
- Above Rp500K

Rating:
- 4+
- 4.5+

Sort:

- Featured
- Newest
- Price Low → High
- Price High → Low
- Rating

Use URL query parameters when appropriate.

Example:

`/shop?category=hoodies&sort=price-low`

Refreshing the page must preserve filters.

---

# 15. PRODUCT SEARCH

Search should support partial matching.

Example:
query:
`hood`

Possible results:
- Heavyweight Hoodie
- Essential Hoodie
- Zip Hoodie

Search should be case-insensitive.

No result:

"0 products found"

Show an appropriate empty state.

---

# 16. LOADING STATES

Do not rely only on spinners.

Implement skeletons that match the target layout.

Product skeleton should resemble:

image
title
price
rating

Use skeletons for:
- product grid
- product detail
- search results where useful

---

# 17. EMPTY STATES

Implement:

Cart empty:

"Your bag is empty."

CTA:
"Continue Shopping"

Wishlist empty:

"Nothing saved yet."

Search empty:

"No products found."

Filter empty:

"No products match your filters."

Every empty state must have a useful CTA when appropriate.

---

# 18. ERROR STATES

Implement human-readable errors.

Example:

"Something went wrong."

"We couldn't load the products."

CTA:

"Try Again"

Never expose raw stack traces to users.

---

# 19. RESPONSIVE DESIGN

Mobile-first.

Target:

Mobile:
< 640px

Tablet:
640–1024px

Desktop:
> 1024px

Must test:

- 360px
- 390px
- 768px
- 1024px
- 1280px
- 1440px

Do not allow:
- horizontal overflow
- broken grids
- text clipping
- unusable buttons
- overlapping fixed elements

---

# 20. MOBILE UX

Important mobile behaviors:

- mobile menu
- full-screen or drawer search
- 2-column product grid
- sticky add-to-cart CTA on product detail
- thumb-friendly buttons
- responsive checkout form
- accessible drawer behavior

Sticky CTA example:

`Rp249.000    [Add to Bag]`

---

# 21. DESIGN SYSTEM

Visual direction:

- modern
- premium
- minimal
- editorial ecommerce
- local-brand feel
- clean whitespace
- strong typography
- subtle borders
- subtle shadows
- restrained animation

Do not create:
- excessive gradients
- excessive glassmorphism
- excessive rounded cards
- noisy backgrounds
- unnecessary animations

Use one accent color.

Keep hierarchy strong.

---

# 22. TYPOGRAPHY

Use a modern sans-serif.

Recommended:

Inter

Use consistent hierarchy:

- display
- h1
- h2
- h3
- body
- caption
- label

Do not use too many font sizes.

---

# 23. IMAGES

Use stable dummy image sources or local assets.

The application must still function if remote images fail.

Always include:

- image dimensions
- alt text
- sensible object-fit behavior

Product gallery should preserve image proportions.

---

# 24. ACCESSIBILITY

Implement basic accessibility.

Required:

- semantic buttons
- labels for inputs
- alt text
- keyboard focus
- visible focus states
- accessible drawer controls
- aria labels where needed
- adequate touch target size
- color contrast

Do not make clickable divs when a button or link is appropriate.

---

# 25. ANIMATIONS

Use subtle animations only.

Examples:

- product hover
- drawer opening
- favorite icon transition
- button feedback
- image transitions

Avoid animation that slows down navigation.

Respect reduced-motion preferences where practical.

---

# 26. SERVICES / DATA ACCESS

Create a simple service layer.

Example:

`services/productService.ts`

Functions:

- getProducts
- getProductBySlug
- searchProducts

Initially the service can use local TypeScript data.

Structure it so a real API can replace the implementation later without rewriting the UI.

---

# 27. FUTURE API COMPATIBILITY

Do not build a backend now.

Do not add:
- real authentication
- real payments
- real order database
- admin dashboard
- inventory backend

The architecture only needs to remain compatible with future backend integration.

---

# 28. FORM VALIDATION

Use React Hook Form + Zod.

Validate:

Name:
required

Email:
valid email

Phone:
required

Address:
required

City:
required

Province:
required

Postal Code:
required and numeric

Shipping method:
required

Payment method:
required

Errors must appear near the relevant fields.

---

# 29. CHECKOUT FLOW

Submission:

1. validate
2. disable submit during processing
3. simulate short async submission
4. create dummy order
5. clear cart
6. redirect to success page

Do not create fake payment APIs unnecessarily.

---

# 30. ORDER SUCCESS

Generate:

- order ID
- order date
- purchased items
- total
- selected shipping method
- selected payment method

Keep the data local.

No backend required.

---

# 31. PERFORMANCE

Avoid unnecessary re-renders.

Use:

- memoization only when justified
- image lazy loading where appropriate
- reusable selectors
- optimized data access
- minimal dependencies

Do not prematurely optimize.

Prioritize correctness first.

---

# 32. CODE QUALITY

Use TypeScript strictly.

Avoid:

```ts
any
```

unless there is a genuine unavoidable reason.

Prefer explicit types.

Do not leave:

- console errors
- unused imports
- dead code
- broken routes
- TODOs for core functionality
- fake buttons that do nothing

---

# 33. ERROR HANDLING

Every interactive feature must have defined behavior.

Examples:

Add to cart:
works

Wishlist:
works

Search:
works

Filter:
works

Sorting:
works

Checkout:
validated

Empty cart:
handled

Empty wishlist:
handled

No search result:
handled

Image failure:
handled reasonably

---

# 34. TESTING CHECKLIST

Before considering the project complete, manually verify:

## Navigation

- home works
- shop works
- product links work
- wishlist works
- cart works
- checkout works
- success page works

## Products

- all products render
- product detail works
- image gallery works
- related products work

## Search

- search works
- search with no results works

## Filters

- category works
- price works
- rating works
- sorting works
- URL state works if implemented

## Cart

- add product
- add same product again
- increase quantity
- decrease quantity
- remove product
- clear cart
- subtotal calculation

## Wishlist

- add
- remove
- persistence

## Checkout

- validation
- submit
- success redirect
- cart clear

## Responsive

test all target widths.

---

# 35. BUILD VERIFICATION

Before finishing:

Run the appropriate commands for the project:

- install dependencies
- typecheck
- lint
- build

Fix every blocking error.

Final project should successfully build for production.

---

# 36. GIT HYGIENE

Keep commits logical when Git is available.

Suggested commits:

1. `chore: setup project`
2. `feat: build design system`
3. `feat: add product catalog`
4. `feat: add product detail`
5. `feat: add cart and wishlist`
6. `feat: add checkout flow`
7. `feat: polish responsive ux`
8. `fix: resolve final issues`

Do not commit secrets.

Do not create `.env` values containing credentials.

---

# 37. DEVELOPMENT ORDER

Follow this implementation order.

## Phase 1 — Foundation

1. inspect repository
2. understand existing setup
3. install missing dependencies
4. configure TypeScript
5. configure Tailwind
6. establish design tokens
7. establish folder structure
8. build base layout

## Phase 2 — Global UI

9. navbar
10. mobile menu
11. search overlay
12. footer
13. reusable UI primitives

## Phase 3 — Product System

14. product types
15. product data
16. product service
17. product card
18. product grid
19. product detail
20. related products

## Phase 4 — Catalog UX

21. search
22. filters
23. sorting
24. URL state
25. empty states
26. loading states
27. error states

## Phase 5 — Commerce UX

28. Zustand cart store
29. Zustand wishlist store
30. cart drawer
31. full cart
32. quantity control
33. wishlist page

## Phase 6 — Checkout

34. checkout form
35. Zod validation
36. order summary
37. simulated submission
38. order success

## Phase 7 — Polish

39. responsive refinement
40. accessibility
41. animations
42. image handling
43. performance
44. code cleanup

## Phase 8 — Verification

45. lint
46. typecheck
47. build
48. fix all errors
49. inspect routes
50. verify all critical flows

---

# 38. AGENT BEHAVIOR

When working:

- inspect before modifying
- reuse existing code when sensible
- do not delete working features without reason
- do not rewrite the entire project unnecessarily
- make changes incrementally
- verify after major changes
- fix errors immediately
- keep architecture consistent

When requirements are clear, execute them directly.

Do not stop because a non-coding decision is missing.

Use a sensible placeholder and continue.

---

# 39. DECISION RULE

When there are several technically valid choices:

Choose the option that best satisfies:

1. maintainability
2. simplicity
3. user experience
4. responsiveness
5. future extensibility

Avoid overengineering.

---

# 40. DEFINITION OF DONE

The project is DONE only when:

- all required routes exist
- all required interactions work
- product data is functional
- cart works
- wishlist works
- search works
- filtering works
- sorting works
- checkout works
- order success works
- responsive layout works
- empty states exist
- error states exist
- loading states exist
- forms validate
- no major TypeScript errors
- no major lint errors
- production build succeeds
- no core feature is left as a fake button

The final result should feel like a complete ecommerce storefront.

---

# 41. FINAL OUTPUT FROM AGENT

When coding is complete, provide a concise final report containing:

## Implemented

List the major completed features.

## Architecture

List the important architecture decisions.

## Verification

Report:

- typecheck result
- lint result
- build result
- important flows tested

## Known Limitations

Only mention things intentionally left for the human / future backend.

Do not claim something works if it was not verified.

---

# 42. NON-CODING BOUNDARY

Do NOT take ownership of:

- choosing final brand identity
- creating final marketing campaign
- choosing final product photography
- buying domain
- creating Vercel account
- entering private API credentials
- creating payment accounts
- deploying using credentials you do not have
- deciding final business strategy

The agent's responsibility ends at producing a complete, working, production-ready frontend codebase.

The human handles the real-world business and account-level tasks.

---

# 43. FINAL PRINCIPLE

Build NusaMarket as if it will be shown to a professional client.

Do not optimize for "having many features."

Optimize for:

- complete user flow
- visual quality
- UX consistency
- clean architecture
- responsive behavior
- maintainable code
- reliable interactions

The final application must look and behave like a real modern ecommerce storefront.
