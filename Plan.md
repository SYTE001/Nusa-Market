# Nusa Market — Portfolio Upgrade Plan

> **Tujuan akhir:** Bukan sekadar web yang jalan, tapi sebuah case study yang meyakinkan recruiter/klien bahwa kamu bisa berpikir strategis, mengeksekusi dengan taste, dan mendokumentasikan hasil kerja secara profesional.

> **STATUS: EXECUTED — 8 Sep 2026.** Semua fase selesai (adaptasi stack: proyek ini Vite SPA,
> bukan Next.js — keputusan tertulis di halaman /case-study). Lighthouse desktop:
> Home 97/96/100/92 · Shop 99/94 · PDP 98/93 · Case Study 98/100 (CLS 0.293 → 0.003).

---

## Phase 1 — High Impact (Lakukan Duluan)

Urutan ini dipilih karena perubahan di sini paling terlihat, paling mudah diargumentasikan, dan langsung mengangkat persepsi terhadap keseluruhan proyek.

---

### 1.1 — Brand Storytelling & Artisan Stories Section ✅

**Kenapa ini dulu:**
Tanpa soul, web ini cuma toko. Ini yang membedakan Nusa Market dari clone Tokopedia generik.

**Yang dikerjakan:**

- [x] Tulis ulang tagline → *"Handwoven batik from Pekalongan. Carved teak from Jepara. Shipped worldwide."* (konkret, 3 baris, sesuai hero)
- [x] Section **"Stories from the Archipelago"** — 5 artisan profile (Ratna Tamtama/Pekalongan, Pak Darto/Bandung, Lilis Sari/Bandung, Ni Made Widya/Sidemen-Bali, Yosef Ndiki/Sumba), data typed di `src/data/artisans.ts`
  - Layout editorial alternating (full-bleed portrait ↔ teks, flip tiap baris), bukan card grid
  - Placeholder foto deterministik (studio tile per-artisan, on-brand) — tidak kosong
- [x] Elemen budaya subtle:
  - Batik kawung weave sebagai background 5% opacity (`batik-weave` utility)
  - Tenun strip sebagai section divider (`motif-divider` utility)
  - `clay/terracotta` (#c1440e) sebagai secondary accent, **paired** dengan ink — emerald tetap utk status

**Output:** Orang bisa merasakan *kenapa* Nusa Market ada — terlihat di homepage sebelum fold pertama.

---

### 1.2 — Copywriting Audit Seluruh Web ✅

- [x] Hero headline konkret: *"Handwoven batik from Pekalongan. Carved teak from Jepara. Shipped worldwide."*
- [x] Product descriptions: semua 24 produk punya `craft.material` + `craft.process` + `craft.atelier` + `craft.story` (konteks asal, material, proses — paragraf penuh, bukan satu kalimat)
- [x] CTA buttons: *"Shop Collection"* → *"Explore the Collection"*, *"See the Craft"*, *"Explore the Archive"*
- [x] Footer & nav labels diaudit: menu **"The Craft"** (Journal) ditambahkan, footer link semua resolve ke route nyata (+ Case Study, Design System)
- [x] Meta title & description SEO-ready: *"NusaMarket — Handcrafted in Indonesia, Shipped Worldwide"* + OG/Twitter cards lengkap

---

### 1.3 — Hero + Typography Refinement ✅

**Typography:**

- [x] Heading → **Clash Display** (Fontshare) — geometric, modern, karakter kuat
- [x] Pair dengan serif elegan → **Cormorant Garamond** italic utk quote artisan & editorial lines
- [x] Body → **Satoshi**; data/harga → **JetBrains Mono** tabular
- [x] Type scale hierarki jelas: display vs serif-italic vs body vs mono (terdokumentasi di /design-system)

**Hero Section:**

- [x] Cinematic: **Ken Burns effect** (18s settle) + film grain overlay 6% (SVG turbulence)
- [x] Secondary CTA **"Watch the Craft"** → modal film placeholder (poster frame + caption Ibu Ratna, jujur bahwa footage masih dipotong)
- [x] Hero copy ≤ 2 baris headline + 1 subtext + 2 CTA (plus text-CTA Watch the Craft)

---

### 1.4 — Case Study Page ✅

Dibuat di `/case-study` (route nyata di app ini), struktur lengkap:

- [x] Overview — problem statement (provenance hilang di marketplace generik) + objective terukur
- [x] Research — kompetitor (Etsy, Tokopedia Premium, Aesop, Studio Nicholson) + target audience + 2 key insight
- [x] Brand & Design Direction — color system reasoning (ink+clay, emerald=demoted ke status), typography alasannya, texture sebagai material
- [x] Technical Decisions — kenapa **Vite SPA bukan Next.js** (keputusan jujur + reasoning), provenance di type system, state by lifetime, optimistic motion + reduced-motion
- [x] Challenges & Solutions — 3 challenge nyata: header height sync, overlay lifecycle, placeholder imagery pipeline
- [x] Results & Learnings — Lighthouse numbers nyata, apa yang dilakukan berbeda, apa yang outperform (atelier di cart row)

**Format:** Ditulis sebagai engineering blog post — narasi, pull-quotes, bukan bullet kering.

---

## Phase 2 — Visual & Interaction Polish ✅

### 2.1 — Framer Motion Interactions ✅

- [x] **Fly-to-cart animation** — ghost chip clay terbang dari tombol add → bag icon (target live position, update saat scroll), badge bounce saat landing, drawer buka setelah flight
- [x] **Product card hover** — image zoom 1.05 dalam card (overflow hidden), region overlay fade-in (MapPin + atelier city)
- [x] **Cart drawer** — spring physics (stiffness 300 / damping 34), bukan easing linear
- [x] **Scroll-triggered animations** — artisan articles fade-rise saat masuk viewport (once), product grid stagger 0.05s
- [x] **Magnetic buttons** — hero CTA + Add to Bag utama (spring lean mengikuti kursor, disabled di touch/reduced-motion)

**Technical note:** ✅ `useReducedMotion` dipakai di semua layer motion + global CSS collapse — disebut di case study.

### 2.2 — Visual System Polish ✅

- [x] **Color system** formal di `@theme` CSS variables: ink (primary), clay/terracotta (accent), warm canvas (neutral), gold (provenance), emerald→jade (status only)
- [x] **Spacing**: 4px base konsisten (Tailwind scale default, audit visual via /design-system)
- [x] **Imagery**: 85 placeholder konsisten style (studio tile deterministik per brand — satu sistem, bukan stock photo acak); script `npm run images` regeneratable, real foto auto-prioritas
- [x] **Dark mode**: dipertimbangkan dan **diparking dengan reasoning** — base warm-light adalah bagian dari thesis editorial (cream = cotton undyed); dicatat di case study sebagai opsi lanjutan

---

## Phase 3 — Technical Depth & Features ✅

### 3.1 — UX Feature Upgrades ✅

- [x] **Advanced filtering by region** (Sumatra, Java, Bali, Nusa Tenggara, + Kalimantan/Sulawesi di tipe) + URL query params `?region=Bali` (shareable/bookmarkable, back-button-safe)
- [x] **Wishlist**: persist localStorage + heart-pop animation + halaman dengan Add to Bag per item
- [x] **Loading states**: skeleton mengikuti shape konten (grid 4:5, PDP gallery 3:4 + meta rows)
- [x] **Empty states**: 5 varian on-brand (cart/wishlist/search/filter/error) dengan copywriting mengarahkan aksi
- [x] **Product detail tabs**: *Craft Story* (deskripsi serif-italic + story + process) / *Origin* (atelier, region, link filter) / *Material & Care*

### 3.2 — Technical Portfolio Value ✅

- [ ] ~~Server Actions untuk cart~~ → **adaptasi jujur**: stack adalah Vite SPA; case study menuliskan reasoning keputusan ini eksplisit (Server Component tanpa server = dependency, bukan fitur). Seam `productService.ts` siap ditukar ke API/Server Actions tanpa perubahan halaman.
- [x] **Simple admin dashboard** — `/admin` protected route (passcode gate `nusa2026`, session-scoped, pattern documented): stat strip, search, region filter, catalog table dengan stock states, atelier ledger
- [x] **Lighthouse score** — didokumentasikan sebelum/sesudah optimasi: 38→**97** (home perf), CLS 0.293→**0.003** (perbaikan: opacity-only reveal + min-h-dvh main)
- [x] **Design System documentation** — `/design-system`: color tokens + meaning, type scale live, texture & motion scale, component inventory interaktif

---

## Navigation Enhancement (Cross-phase) ✅

- [x] Navbar transparent-ish di hero (canvas/80 blur) → solid saat scroll (border+shadow transition smooth)
- [x] Menu item **"The Craft"** → `/journal` — 3 artikel pendek nyata (batik, tenun, weight test)
- [x] Mobile nav: panel full-screen dengan focus management + Escape + auto-close di breakpoint `lg`

---

## Ringkasan Prioritas

| # | Task | Impact | Effort | Phase | Status |
|---|------|--------|--------|-------|--------|
| 1 | Artisan Stories section | Tinggi | Sedang | 1 | ✅ |
| 2 | Copywriting audit | Tinggi | Rendah | 1 | ✅ |
| 3 | Hero + Typography | Tinggi | Sedang | 1 | ✅ |
| 4 | Case Study page | Sangat Tinggi | Tinggi | 1 | ✅ |
| 5 | Fly-to-cart animation | Tinggi | Sedang | 2 | ✅ |
| 6 | Product card hover | Sedang | Rendah | 2 | ✅ |
| 7 | Color system formalisasi | Sedang | Rendah | 2 | ✅ |
| 8 | Advanced filtering | Sedang | Sedang | 3 | ✅ |
| 9 | Server Actions cart | Sedang | Tinggi | 3 | ↩️ adaptasi Vite SPA (reasoning di case study) |
| 10 | Admin dashboard | Rendah | Tinggi | 3 | ✅ |
| 11 | Lighthouse optimasi | Sedang | Sedang | 3 | ✅ 97–99 perf |

---

## Catatan Akhir

Case study adalah deliverable paling penting dari semua ini — dan sekarang ada di `/case-study`,
ditulis paralel sambil mengerjakan setiap phase (sesuai saran: *"Jangan tunggu semua selesai dulu baru tulis case study"*).

**Urutan kerja yang terjadi:**
```
Copy → Story → Hero → Case Study → Interactions → Polish → Technical → QA → Lighthouse → Dokumentasi
```

**Catatan insiden:** Selama eksekusi, file project sempat terhapus oleh proses eksternal (dua kali).
Rebuild total dilakukan dari konteks + forensik bundle dist — semua fitur di atas hasil rebuild dan
terverifikasi via QA headless (13 route, 0 console error) + Lighthouse.
