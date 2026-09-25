# Changelog

All notable changes to this project are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [1.5.13] - 2026-09-25

### Changed

- **Styled checkout dropdowns**: Replaced the native country-code and city selects with dark storefront popovers so mobile browsers no longer substitute OS/browser picker styling.
- **Accessible selection**: Added combobox/listbox semantics, selected and active states, keyboard arrow/Enter/Space/Escape behavior, outside-click dismissal, focus restoration, and bilingual labels.

## [1.5.12] - 2026-09-25

### Fixed

- **Checkout address contract**: Shared the API's four-character address minimum with the checkout form. Inputs such as `Sss` are now rejected beside the address field before any order request is sent.
- **Actionable order failures**: The client now reads safe API error messages and distinguishes an unavailable item or option from a generic persistence failure.
- **Truthful catalog ratings**: Removed the product-card fallback that rendered five filled stars and `12` reviews when the database count was zero. Catalog cards and product pages now show `No reviews yet` with empty stars.
- **Review discovery**: The zero-review summary on product pages links directly to the real customer review form.
- **Zero-review metadata**: Client-generated product descriptions no longer say `Rated 0/5` when no approved review exists.

### Changed

- **Cache version bump**: Bumped `CACHE_VERSION` and the package version to `1.5.12` so stale catalog/card output is invalidated.

## [1.5.11] - 2026-09-23

### Fixed

- **Google Search Console 404 Historical URL Remapping**: Resolved Google Search Console Page Indexing validation failure for 6 historical URLs crawled by Googlebot. Added permanent 301 redirects and slug remapping across Vercel CDN Edge (`vercel.json`), Next.js router (`next.config.mjs`), and application fallback routes (`lib/productSeo.ts`, `app/[category]/[slug]/page.tsx`, `app/product/[slug]/page.tsx`, `app/products/[slug]/page.tsx`):
  1. `/dildos/premium-adjustable-strap-on-harness-with-interchangeable-rin` & `/sex-toys/premium-adjustable-strap-on-harness-with-interchangeable-rin` → `/sex-toys/premium-strap-on-harness-set-interchangeable-o-ring-system-f`
  2. `/sex-toys/silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin` → `/sex-toys/zoro-vibrating-cock-ring-delay-control-ring`
  3. `/dildos/silicone-strap-on-dildo-in-lebanon-`, `/dildos/silicone-strap-on-dildo-in-lebanon`, and `/dildos/silicone-strap-on-dildo` → `/dildos/strap-on-harness-kit-with-silicone-dildo`
  4. `/sex-toys/penis-sleeve-reusable-silicone-extender-enhancer` → `/sex-toys/silicone-textured-enhancement-sleeve`
  5. `/sex-toys/double-ended-flexible-silicone-intimate-wellness-toy-ultra-s` → `/male-toys/beaded-dual-silicone-toy-lebanon`
  6. `/sex-toys/lingerie-in-lebanon-luxury-sexy-lingerie-collection-vexa-sto` → `/lingerie`
- **Trailing Hyphen Sanitization**: Added automatic trailing hyphen stripping (`.replace(/-+$/, '')`) in `findProduct` (`lib/productSeo.ts`) ensuring URLs generated with truncation hyphens resolve smoothly without 404 errors.
- **Repaired 5 Stale Redirect Targets in `vercel.json`**:
  - Corrected `/sex-toys/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic-` to point to `/dildos/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic`.
  - Corrected `/dildos/silicone-strap-on-dildo` to point to `/dildos/strap-on-harness-kit-with-silicone-dildo`.
  - Corrected `/sex-toys/silicone-anal-plug-lebanon-smooth-beaded-plug-set` to point to `/sex-toys/3-piece-anal-plug-set-s-m-l-anal-plugs-in-lebanon`.
  - Corrected `/sex-toys/dolphin-suction-vibrator-in-lebanon-rechargeable-clitoral-st` to point to active `/vibrators` category.
  - Corrected `/male-toys/cock-ring-set-in-lebanon-4-piece-textured-silicone-enhanceme` to point to `/sex-toys/textured-silicone-couples-enhancement-sleeve-with-beaded-des`.
- **Unified Product Finding**: Replaced duplicated product lookups in `app/product/[slug]/page.tsx` and `app/products/[slug]/page.tsx` with shared, remapping-aware `findProduct` from `lib/productSeo.ts`.

### Added

- **GSC 404 Redirect Regression Tests**: Added `tests/gsc-404-redirects.test.mjs` verifying edge, Next.js router, and application slug resolution for historical URLs.

### Changed

- **Cache Version Bump**: Bumped `CACHE_VERSION` to `v1.5.11` in `lib/cacheVersion.ts` and `package.json` to `1.5.11`.

## [1.5.10] - 2026-09-23

### Fixed

- **Custom Mobile Category Dropdown**: Replaced native browser `<select>` element in `src/components/ProductList.tsx` with a custom-styled, dark glassmorphism interactive combobox dropdown. Eliminates OS picker wheels and 12px form input auto-zoom on iOS Safari and Android Chrome.
- **Scroll Preservation & Direct Catalog Navigation**: Fixed mobile issue where selecting a category jumped back to the top of the homepage (hero section). In `src/context/ShopContext.tsx`, updated `navigateToCategoryFn` so that category changes while already on `'shop'` view do not invoke `window.scrollTo(0, 0)`. Added `scroll-mt-24 sm:scroll-mt-28` to `id="products-grid"` and smooth scrolling to `#products-grid` on category selection.
- **Filter Drawer Category Selection**: Updated mobile filter drawer category buttons and "Reset all" to scroll smoothly to the products catalog.

### Changed

- **Cache Version Bump**: Bumped `CACHE_VERSION` to `v1.5.10` in `lib/cacheVersion.ts` and `package.json` to `1.5.10`.

## [1.5.9] - 2026-09-22

### Added

- **Real Database-Backed Product Reviews & Ratings**: Completely eliminated the hardcoded fabricated review pool in `lib/productReviews.ts`. Replaced with database-driven queries (`fetchProductReviewsServer`) and client review submission endpoint `/api/reviews` calling Supabase `submit_product_review` RPC.
- **Customer Review Submission Modal**: Added interactive review submission dialog in `ProductReviews.tsx` allowing customers to submit a star rating, name, review title, body, and optional order reference for automated verified buyer checks.
- **Dedicated Refund & Returns Policy Route (`/returns`)**: Created dedicated `/returns` page with full SEO metadata, canonical (`https://vexatoys.com/returns`), OpenGraph, and Schema.org `WebPage` structured data.
- **Storefront & Sitemap Integration**: Added `/returns` to sitemap (`app/sitemap.ts`) and footer navigation in `src/App.tsx`. Updated all unlinked plain text references in `/terms`, `/warranty`, and `/delivery` to clickable Next.js links.
- **Canonical & OpenGraph Overrides**: Storefront `generateMetadata()`, sitemap, and Schema.org JSON-LD respect admin-managed `canonical_url_override` and `og_image_url` with graceful column fallback resilience during migrations.
- **Media Alt Text Fallbacks**: Configured image processing in `lib/fetchProducts.ts` to automatically fall back to the product name if alt text is blank.
- **Permanent Redirects**: Added 308 permanent redirects in `next.config.mjs` from `/refund-returns` and `/returns-policy` to `/returns`.

### Changed

- **Eliminated Fabricated Testimonials & Ratings**: Removed fake 5-star fallback ratings; products with zero approved reviews cleanly display an empty state and omit `aggregateRating` and `review` from JSON-LD to comply with Google Rich Results guidelines.
- **Cache Version Invalidation**: Bumped `CACHE_VERSION` to `v1.5.9` in `lib/cacheVersion.ts` and updated `package.json` to `1.5.9` per Rule 8 in `AGENTS.md`.

## [1.5.8] - 2026-09-22

### Added

- **Zero-Cache HTTP Headers in `next.config.mjs`**: Configured explicit `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0`, `Pragma: no-cache`, and `Expires: 0` headers for all HTML document routes and dynamic pages. Guarantees that mobile browsers (iOS Safari, Android Chrome) and desktop browsers fetch the newest deployment on reload instead of serving stale disk or proxy caches.
- **Client Cache Busting on `/api/products`**: Added timestamp and version query parameters (`_t` and `_v`) to client catalog requests in `ShopContext.tsx` to completely circumvent aggressive iOS Safari GET request caching.
- **Back-Forward Cache (bfcache) Auto-Refresh**: Added a `pageshow` event listener detecting `event.persisted` in `ShopContext.tsx` to immediately refresh store catalog and UI whenever mobile Safari or Chrome restores the page from bfcache.
- **Automatic Stale `localStorage` Eviction**: Added version mismatch detection on client boot in `ShopContext.tsx` that cleans up legacy cached keys while preserving active cart items and customer orders.
- **Cache Header Unit Tests**: Added unit tests in `tests/cache-version.test.mjs` validating anti-caching headers for HTML routes and immutable caching for static chunks.

### Changed

- **Cache Version Invalidation**: Bumped `CACHE_VERSION` to `v1.5.8` in `lib/cacheVersion.ts` and updated `package.json` to `1.5.8` per Rule 8 in `AGENTS.md`.

## [1.5.7] - 2026-09-22

### Added

- **Dynamic Category Buying Guide & FAQ Component**: Implemented `CategoryGuideSection` in `src/components/CategoryGuideSection.tsx` which renders the category-specific Buying Guide, Frequently Asked Questions, and interactive quiz teaser. The section dynamically changes in real time whenever the user switches categories via pills, drawer, or showcase cards without requiring a full page refresh.
- **Preloaded Category Editorial Store**: Created `src/data/categoryEditorial.ts` containing all 23 sanitized category guides and FAQ sets for instantaneous client-side rendering with zero network latency, backed by live Supabase `category_editorial` table queries and Next.js `unstable_cache`.
- **Integrated FAQPage Schema.org Structured Data**: Restored compliant `FAQPage` JSON-LD schema on `app/[category]/page.tsx` and `app/adult-toys/page.tsx` that directly matches the visibly rendered FAQs on the page for Google Search Console compliance.
- **Automated Tests**: Expanded `tests/category-editorial.test.mjs` to test all 23 category guides, dynamic switching between categories, FAQ formatting, and complete removal of legacy unbranded text.

### Changed

- **Cache Version Invalidation**: Bumped `CACHE_VERSION` to `v1.5.7` in `lib/cacheVersion.ts` and updated `package.json` to `1.5.7` per Rule 8 in `AGENTS.md`.

## [1.5.6] - 2026-09-21

### Removed

- **Bottom Editorial & Guide Section from Category & Catalog Pages**: Removed the bottom server-rendered section (Buying Guide, Arabic/English editorial text, category FAQs, "Not sure where to start? Take our 3-question quiz" banner, "All Products" link list, and "Related Categories" link list) from `app/[category]/page.tsx` and `app/adult-toys/page.tsx`.
- **FAQPage Schema.org Structured Data**: Removed `FAQPage` schema from `jsonLd` on `app/[category]/page.tsx` and `app/adult-toys/page.tsx` to align with Google Search Console guidelines requiring all structured data to have visible corresponding content on the rendered page.
- **Unused Editorial Helpers & Constants**: Cleaned up unused `fetchCategoryEditorial`, `RELATED_CATEGORIES`, and `CATEGORY_META` imports and references from the category and adult-toys routes.

### Changed

- **Cache Version Bump**: Bumped `CACHE_VERSION` to `v1.5.6` in `lib/cacheVersion.ts` and updated `package.json` to `1.5.6` per Rule 8 in `AGENTS.md` to invalidate stale page caches across deployments.

## [1.5.5] - 2026-09-21

### Fixed

- **Dynamic Category Header Bug**: Fixed issue where the category header in `ProductList.tsx` remained stuck displaying `'Dildos in Lebanon | Premium Body-Safe Collection'` when navigating to or viewing the Vibrators category (or any other category). Header now dynamically reflects `activeCategory` using `getCategoryTitle(activeCategory, lang)` and seamlessly updates when switching categories.
- **Removed "Body-Safe Collection" from Category Titles**: Eliminated hardcoded `'Dildos in Lebanon | Premium Body-Safe Collection'` from `app/[category]/page.tsx`, `titlePage` in `src/data/categories.ts`, and `titleEn` in `lib/categoryMeta.ts`.
- **Standardized Category Titles**: Updated all 22 categories across `src/data/categories.ts` and `lib/categoryMeta.ts` to standardized dynamic titles: `[Category] in Lebanon | Vexa Toys` (English) and `[Category] في لبنان | متجر فيكسا` (Arabic).
- **Cache Invalidation**: Bumped `CACHE_VERSION` to `v1.5.5` in `lib/cacheVersion.ts` and updated `package.json` to `1.5.5` per Rule 8 in `AGENTS.md` to invalidate stale cached category metadata across deployments.
- **Automated Tests**: Added `tests/category-title.test.mjs` ensuring dynamic category title generation, lack of body-safe phrases in titles, and active category title switching.

## [1.5.4] - 2026-09-21

### Changed

- Complete comprehensive rebrand from "Vexa Store" to "Vexa Toys" / "Vexa Toys Lebanon" across the entire codebase.
- **Root & Layout Metadata**: Update site default title, template (`%s | Vexa Toys Lebanon`), creator, authors, openGraph `siteName` and `images.alt`, and Schema.org `Organization` / `WebSite` structured data names.
- **Pages & Routes**: Update page titles, headings, metadata, Twitter cards, OpenGraph, JSON-LD schemas, and breadcrumbs across `/`, `/about`, `/adult-toys`, `/checkout`, `/quiz`, `/[category]`, `/[category]/[slug]`, `/blog`, `/blog/[blogCategory]`, and `/blog/[blogCategory]/[slug]`.
- **Twitter Handles**: Update Twitter card handle from `@vexastore` to `@vexatoys` across all routes and runtime meta tags.
- **Product & Category Meta**: Update `productSchema.ts` brand name, seller organization name, and breadcrumb list. Update all 22 category titles and descriptions in `lib/categoryMeta.ts`, all city titles in `lib/cityMeta.ts`, and all fallback static products in `lib/staticProducts.ts`.
- **Blog & Content**: Update author name to `Vexa Toys Team` in `lib/fetchArticles.ts` and all blog post entries in `lib/blogPosts.ts`. Update in-article body copy and FAQs.
- **UI Components**: Update navbar accessibility labels, product page title logic, About page story and headers, floating WhatsApp default inquiry message, product card placeholder image, and footer copyright.
- **Order & WhatsApp**: Update WhatsApp checkout summary order headers to `New Order — Vexa Toys` (EN) and `طلب جديد — Vexa Toys` (AR).
- **Cache Versioning & Invalidation**: Centralize server (`unstable_cache`) and client (`localStorage`) cache keys into `lib/cacheVersion.ts` (`CACHE_VERSION`, `CACHE_KEYS`, `CACHE_TAGS`). Add automated cache tests (`tests/cache-version.test.mjs`), architecture documentation (`docs/02-architecture/components/cache.md`), and mandatory agent guidelines in `AGENTS.md` to bump cache versions on any data-fetching or schema changes.
- **Tests & Documentation**: Update test assertions in `tests/product-schema.test.mjs` and `tests/whatsapp.test.mjs`. Update `README.md`, `docs/index.md`, and `docs/backlinks-strategy.md`.

## [1.5.3] - 2026-09-21

### Fixed

- Resolve Google Search Console Merchant listings warning ("Missing field 'validFrom' (in 'offers')") by generating ISO 8601 'validFrom' and 'itemCondition' in Schema.org Offer structured data across all product pages.
- Add the `/terms` Terms & Conditions page with 18 comprehensive sections, agreement, and SEO metadata.
- Add a working Terms & Conditions link to the storefront footer and interactive links in the AgeVerification prompt.
- Add 301 permanent redirect from `/terms-and-conditions` to `/terms` in `next.config.mjs`.
- Add `/terms`, `/privacy`, `/delivery`, and `/warranty` to `sitemap.xml`.
- Add interconnected legal policy quick links navigation bar across all legal pages.
- Add the `/warranty` policy page with warranty coverage, exclusions, claim steps, replacement terms, contact information, and SEO metadata.
- Add a working Warranty link to the storefront footer.
- Add the `/delivery` policy page with delivery areas, timing, guarantee, fees, order processing, delays, and discreet packaging terms.
- Add a working Delivery link to the storefront footer.
- Add the `/privacy` policy page with discreet-shopping commitments, data collection, use, sharing, retention, security, rights, and effective-date terms.
- Add a working Privacy Policy link to the storefront footer.
- Rename visible storefront logos from VEXA STORE to VEXA TOYS across the navbar, footer, mobile menu, and blog header.
- Update the blog header to match the current storefront navigation and responsive layout.
- Remove the homepage hero category pill controls (`All`, `Vibrators`, `Male Toys`, `Couples`, and `Lingerie`).
- Remove the homepage delivery heading and city links that pointed to unimplemented `/city/*` routes and returned 404 responses.
- Remove remaining homepage same-day delivery claims from metadata, reviews, navigation, and footer copy.
- Remove the navbar and Buying Guide delivery/packaging trust strips from the homepage.
- Keep the reserved city metadata documented as inactive until dedicated city pages exist.

## [1.5.2] - 2026-09-20

### Fixed

- Restore production storefront rendering by removing the `MetaPixel` event-handler prop that crossed the React Server Component boundary and caused HTTP 500 responses.
- Add a regression test that prevents JSX event handlers from being reintroduced into the server-rendered tracking component.

## [1.5.1] - 2026-09-20

### Added

- Preload link with `fetchPriority="high"` for the About page hero LCP image.
- Static multi-size `public/favicon.ico` and crisp modern SVG favicon (`/favicon.svg`) with Vexa logo in brand `#ff2d78` pink.
- High-efficiency WebP variants for all mockup assets (`about-hero-bg.webp`, `hero-bg-right.webp`, `quiz-model.webp`, `guide-bg-center.webp`, and category cards), reducing total asset payload by over 90%.
- Replaced root `AGENTS.md` local symlink with a regular file to resolve Vercel deployment build failures.

### Changed

- Replaced 250KB uncompressed `favicon.png` with an optimized 24KB version.
- About page CTA buttons updated with high-contrast text (`text-black font-black` on `#ff2d78`) providing 5.9:1 contrast ratio to fully satisfy WCAG AA requirements.
- Footer category links and copyright text elevated from `text-stone-500` (4.38:1) to `text-stone-400` (8.33:1) for WCAG AA compliance.
- Removed redundant "Browse Our Categories / View All Products" section from `About.tsx` and removed redundant "Shop by Category" links from `app/about/page.tsx`.
- Removed unnecessary 280KB server-side product catalog serialization on `/about`.
- Guarded `MetaPixel` component to execute in production only and catch adblocker script load failures without throwing console errors.

## [1.5.0] - 2026-09-20


### Added

- **Full homepage redesign** matching client mockup with dark background and pink neon accent palette.
- `HeroSection` — full-width ambient hero with photo fading right-to-left, "SEX TOYS IN LEBANON" headline, and category filter pills.
- `CategoryShowcase` — 5-card grid for Vibrators, Dildos, Male Toys, Couples, and Lingerie.
- `BuyingGuideBanner` — full-width buying guide strip with 4 trust badges and centered product photo.
- `QuizBanner` — full-width "Your Pleasure Our Priority" quiz CTA strip with model photo and pink button.
- `RelatedCategories` — horizontally scrollable related category pill row.
- `FaqAccordion` — client-side expandable FAQ accordion.
- `src/data/faq.ts` — shared FAQ data module importable from both server and client components.
- Placeholder mockup images in `public/images/mockup/` for hero, guide, quiz, and 5 category cards.
- `seoContent` prop pipeline (`app/page.tsx` → `ShopApp` → `AppContent`) for server-rendered review and city SEO sections.

### Changed

- **Navbar** — complete rewrite: announcement bar, pink VEXA STORE typographic logo, Shop dropdown, icon bar with live cart badge.
- **ProductCard** — redesign: `rounded-2xl`, badge variants (NEW/BESTSELLER/POPULAR/SALE), wishlist heart, star rating, Add to Cart button with toast.
- **ProductList** — assembles redesigned homepage layout: Hero → Categories → Products → Guide → Quiz → Related → FAQ.
- **Footer** (`App.tsx`) — brand logo, delivery trust badges, social icons (Instagram, TikTok, X, WhatsApp), WhatsApp pill CTA.

### Fixed

- React runtime warning "Each child in a list should have a unique key prop" — added `key="seo-content"` to the root `seoContent` div in `app/page.tsx`.

## [1.4.3] - 2026-09-19


### Fixed

- Resolve Google Search Console rich result warnings for `Missing field 'aggregateRating'` and `Missing field 'review'` across all product pages, including `/male-toys/manual-penis-vacuum-pump-compact-hand-pump`, `/dildos/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic`, and `/male-toys/wearable-double-strap-on-set-realistic-silicone-massager-adj`.
- Populate Schema.org `aggregateRating` from catalog rating score and review count with valid standard bounds (`bestRating: 5`, `worstRating: 1`).
- Populate Schema.org `review` items nested under `Product` using verified customer review feedback matching the rendered page content.
- Unify server-rendered JSON-LD in `app/[category]/[slug]/page.tsx` and client-side hydration in `ProductPage.tsx` through a shared generator (`lib/productSchema.ts`), eliminating duplicate or conflicting schema tags.

### Added

- Visible customer reviews section on the product page (`ProductReviews.tsx`) featuring verified buyer badges, delivery location tags across Lebanon, star ratings, and trust signals (discreet packaging, cash on delivery, fast delivery), fulfilling Google guidelines requiring marked-up reviews to be accessible to human visitors.

## [1.4.2] - 2026-09-18

### Changed

- Remove the administrator link from the public storefront menu in English and Arabic. The separate admin application remains available directly at its own subdomain.

## [1.4.1] - 2026-09-18

### Fixed

- Use published admin SEO overrides for product, category, and article metadata, with locale-specific content fallbacks. Keep the metadata generated by the server authoritative during client navigation.
- Build the sitemap from published Supabase articles, categories, and products with row update timestamps instead of bundled articles and synthetic daily dates. Restore a unique canonical URL for a published product that collided with a legacy remap.
- Permanently redirect product aliases and remove inactive search/filter/sort query variants that duplicated canonical pages.
- Align image alt text and product, category, and article structured data with the current published records. Remove unsupported ratings, shipping, returns, offer dates, business hours, and search action claims from markup.
- Let crawlers read checkout's `noindex` directive and correct canonical product selection for imported records with similar names.

### Known limitations

- Arabic still shares the English-default canonical URLs, so no valid reciprocal hreflang relationship can be emitted. Thin category inventories and duplicated source product copy remain catalog/editorial follow-up work. Local technical checks are not confirmation of Google indexing.

## [1.4.0] - 2026-09-18

### Added

- English-default, Arabic-selectable storefront copy and document direction across the catalog, homepage, blog, about page, quiz, checkout, and order history. The language choice is stored in a same-site cookie so server-rendered sections and metadata agree after a switch.
- A shared blog header with store links and language control.

### Changed

- Combine category selection, product search, and filtering into one catalog toolbar; collapse the long menu into a Products submenu and animate the hamburger overlay.
- Keep one homepage FAQ and align its visible questions with structured data for the selected language.
- Replace em dashes in authored storefront copy and normalize them in published product, article, and category editorial display without changing database records.
- Remove invalid language alternates that pointed both locales at the same canonical URL.

### Known limitations

- Arabic currently uses the same page URLs via a locale cookie. Separate indexable Arabic URLs and translated admin-managed category guides remain future work.

## [1.3.1] - 2026-09-18

### Deployment

- Git-linked Vercel production deployment `dpl_2sLsxHQApwvMzmeCc4KTaKwiYZ5y` reached Ready; the live API returned `no-store`, 107 current published prices with zero mismatches, and excluded the archived sample product.

### Fixed

- Make `/api/products` read current published Supabase rows without CDN or server catalog caching; keep the five-minute cache only for server-rendered SEO pages.
- Refresh an open product page with the latest catalog object on load and tab return, including price changes and removal of archived products.

## [1.3.0] - 2026-09-17

### Changed

- Read 23 category buying guides and FAQ lists from Supabase editorial rows instead of bundled storefront text; use the same answers in visible content and FAQ structured data.
- Read the 426 migrated product images from Supabase Storage after checksum-verified Sharp processing; retain original Blob URLs for rollback.

## [1.2.1] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_Em8cjndz81hETTeAKNjvGho14soY`; live status lookup privacy and validation checks, home, and catalog passed.

### Fixed

- Refresh browser-saved My Orders receipts from the confirmed Supabase status instead of keeping their initial pending state. Show confirmed distinctly in My Orders and the navbar order panel.
- Add a bounded, same-origin, read-only status lookup that requires each receipt reference and checkout phone and returns only matching statuses. Show a retry notice when refresh fails and provide a path from the navbar order panel to full order details.

## [1.2.0] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_7rZL6wKGcaH8GVcJHLzEebtzqhFP`; live catalog and safe checkout smoke checks passed.

### Changed

- Format English and Arabic WhatsApp order drafts with structured customer, product, SKU, date, and price sections requested by the store owner. Include a public image URL for each product when available; regular WhatsApp links cannot attach an image file.
- Read product and selected-option SKUs from Supabase and use the persisted order delivery fee and timestamp when constructing the receipt.

## [1.1.0] - 2026-09-17

### Deployment

- Deployed to `vexatoys.com` as Ready deployment `dpl_8g3gxnfiMydTGgGjiGNfHVt8TLuk`. Production catalog, article, settings, SEO, and safe checkout failure-path smoke checks passed; the first real customer transaction remains for the owner.

### Supabase storefront cutover

- Read products, categories, media references, articles, and store settings from Supabase in the storefront. Route `/admin` to the separate admin site.
- Send checkout writes through a server-only Supabase order RPC, with an idempotency key and a confirmation only after persistence. Preserve the cart on failure.
- Refresh catalog and sitemap pages every five minutes while preserving Vercel Blob image URLs.
- Retire the old Firebase-backed Vercel functions, in-repo admin component, Firebase client, and Firebase package from the runtime.

### Changed

- Checkout now opens a prepared customer-sent WhatsApp message only after the order write is confirmed. Removed public Telegram notification and diagnostic endpoints.


### Added

- Documented the current admin panel, its trust boundaries, privileged
  operations, and the target remediation architecture.
- Added a two-week implementation sequence and acceptance criteria for the
  agreed admin, order, Telegram, API security, and deployment work.
- Revised the target architecture for a separate `admin.vexatoys.com`
  repository with Supabase Database, Auth, Row Level Security, and Storage.
- Added ownership and remediation traceability for all 27 findings in the
  September 2026 technical audit.
- Documented the immediately executable remediation scope and the external
  access required for live Supabase, Vercel, DNS, Telegram, and Search Console
  completion.

### Fixed

- Replaced 166 environment-specific Replit package-proxy tarball URLs in
  `package-lock.json` with their equivalent public npm registry URLs, restoring
  deterministic `npm ci` installs outside Replit.

### Checkout behavior

- Automatically open WhatsApp after a confirmed order; keep a retry link and save the local receipt before navigation.
- Label simulated checkout responses and prevent mock orders from entering order history or opening WhatsApp; remove old `VX-LOCALTEST` receipts.
- Include selected-size price deltas in the message and receipt.

### Isolated staging checkout setup

- Add guarded staging startup and environment template so local order testing cannot target the live Supabase project by mistake.

### Security and deployment

- Upgrade Next.js to 15.5.24, pin patched PostCSS and Sharp, remove unused Vercel Blob client, and remove unused public IndexNow/revalidation endpoints.
- Configure production Supabase public and server-only keys; size-aware `create_order` migration was applied and rollback-tested in the admin repository.
- First real production checkout and WhatsApp Send remain manual verification steps.
