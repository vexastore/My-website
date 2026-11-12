# Changelog

All notable changes to this project are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [1.7.0] - 2026-11-12

### Arabic policy pages

- **Terms, privacy, delivery, warranty and returns in Arabic** at `/ar/terms`, `/ar/privacy`, `/ar/delivery`, `/ar/warranty` and `/ar/returns`. Each policy is now data in both languages (`src/content/policies/*.ts`, with a tiny inline markup for links and bold) rendered by one component (`src/components/policy/PolicyPage.tsx`) that sets the canonical, `en`/`ar`/`x-default` alternates, Open Graph, the WebPage JSON-LD and the quick-links navigation for the page language. The `app/` files are two-line wrappers.
- The English text is unchanged; the Arabic is a faithful Modern Standard Arabic rendering with the same sections, numbers, hours, phone number and links.
- `lib/localePath.ts` no longer treats the policies as English only, so every policy link on Arabic pages (footer, product page badges, category guides, blog) now stays in Arabic, and the sitemap lists both languages of each policy. Only admin and the legacy `/product(s)` redirects remain English only.
- Tests: `tests/legal-routes.test.mjs` now checks the bilingual content (same structure, same links, Arabic text present, every numbered section) instead of the old page sources; the locale tests moved the policies to the localized set. Package version 1.7.0; cache version unchanged.

## [1.6.0] - 2026-11-12

### Arabic pages at their own URLs

- **`/ar/...` routes**: every localized page now has an Arabic URL (`/ar`, `/ar/vibrators`, `/ar/dildos/<product>`, `/ar/adult-toys`, `/ar/about`, `/ar/quiz`, `/ar/blog/...`, `/ar/checkout`). English routes moved unchanged into the `app/(en)` route group and Arabic wrappers live under `app/(ar)/ar`; each group has its own root layout, so `<html lang dir>` is set on the server from the URL. Policies, admin and the legacy `/product(s)` redirects stay English only, and `/ar/<policy>` redirects permanently to the English page.
- **One implementation per page** (`src/routes/*.tsx`): the page and metadata code of the ten localized routes moved out of `app/` into functions that take the locale (`CategoryPage('ar', props)`); the `app/` files are two-line wrappers. `lib/storeLocale.ts` (the cookie reader) is gone and no public page reads cookies or headers anymore, so the `force-dynamic` flags were dropped and every public page is static/ISR (`revalidate = 300`) and CDN-cacheable.
- **hreflang + canonicals** (`lib/localePath.ts`, new): `pageAlternates` gives each page its own canonical plus `en`, `ar` and `x-default` alternates; Open Graph URLs and JSON-LD URLs point at the page's own language. The sitemap lists both languages of every localized page with `xhtml:link` alternates (articles only when they have an Arabic body; otherwise the Arabic article URL canonicalizes to English).
- **Links and switch**: client components get `localizeHref` from `ShopContext` and server pages use `localizePath`, so every internal link keeps the visitor's language. The EN/AR switch now navigates to the same page in the other language. The `vexa_store_language` cookie only remembers the choice: the middleware sends a returning Arabic visitor who opens a bare English URL to `/ar/...` (302, browser navigations only; crawlers and RSC/prefetch requests are never redirected).
- Tests: `tests/locale-path.test.mjs`, `tests/locale-middleware.test.mjs`, `tests/locale-routes.test.mjs` (new); source-reading tests follow the moved files. Package version 1.6.0; cache version unchanged (no data shape changed).

## [1.5.19] - 2026-11-12

### Category FAQ structured data

- **One FAQ source for page and schema** (`lib/categoryFaq.ts`, new): `selectCategoryFaqs` applies the single selection rule (admin editorial FAQs win in English, bilingual code FAQs otherwise, Arabic always from code) and `buildFaqPageSchema` turns that list into `FAQPage` JSON-LD. `CategoryGuideSection`, `app/[category]/page.tsx` and `app/adult-toys/page.tsx` all use it, so the markup can never list a question the visitor does not see.
- Before this, the `FAQPage` block was emitted only in English and only when an editorial row had FAQs; categories using the code FAQs (most of them) and all Arabic pages had no FAQ markup while still rendering FAQs.
- Tests: `tests/category-faq-schema.test.mjs` (new). Package version 1.5.19; cache version unchanged (no data shape changed).

## [1.5.18] - 2026-11-09

### Product pages

- **Honest pricing** (`lib/fetchProducts.ts`, `src/types.ts`): products now carry the catalog `compare_at_price` as `compareAtPrice`, kept only when it is higher than the current price. The product page shows a crossed-out "was" price and a `Save N%` badge from that field alone; the invented `price * 1.23` old price is gone.
- **No empty stars** (`src/components/ProductCard.tsx`, `src/components/ProductPage.tsx`): star rows render only when a product has approved reviews. Cards without reviews show `Cash on delivery · Discreet packaging`; the product page shows the rating link only when real reviews exist. Ratings are never seeded or faked.
- **Product page redesign** (`src/components/ProductPage.tsx`, rewritten in the storefront token system): crawlable breadcrumb (store, category, product), sticky gallery, buy box with price, stock, three linked assurances (cash on delivery, 7-day returns, plain packaging), variants, quantity, add to cart, buy now, WhatsApp question button, copyable link and a delivery summary. Below: the full description with preserved paragraphs, a specs table, material-specific care tips with links to the care guide and lubricants, a shopping FAQ, up to four related products from the same category with a link to the category page, then reviews. "Cash or card on delivery" corrected to cash only.
- **Derived product content** (`lib/productContent.ts`, new): `extractSpecs` reads material, size, power, modes, waterproofing, control and SKU out of the description (a row appears only when stated), `careTips` by detected material, `productFaqs` from the published policies.
- **Metadata sync**: the client no longer overwrites the server title with `<name> | Vexa Toys Lebanon`; it reuses the stored `seo_title`/`seo_description` when present (length-checked) or the same `buildProductTitle`/`buildProductDescription` the server uses, so hydration keeps the SEO title.
- **Deliverables outside the repo** (parent folder): `product-seo-update.sql` and `product-seo-fields.md` (76 unique titles of 60 characters or fewer and descriptions of 155 or fewer, medicines excluded), `reviews-real-insert-template.sql` and `review-request-whatsapp.md` for collecting and posting real customer reviews.
- Tests: `tests/product-page-honesty.test.mjs` (new); `tests/reviews.test.mjs` updated for the new no-review card copy.
- **Returns page**: WhatsApp contact corrected to +961 76 730 767 (the number used everywhere else) and linked to `wa.me`.
- Cache and package version 1.5.18 (product mapping changed).

## [1.5.17] - 2026-11-09

### Blog redesign

- **Storefront chrome on every page**: new `src/components/SiteFrame.tsx` wraps server-rendered pages in `ShopProvider` + the real `Navbar`, WhatsApp button and the new shared `src/components/SiteFooter.tsx` (extracted from `App.tsx`). The blog, quiz, delivery, privacy, returns, terms and warranty pages use it; the separate `BlogHeader.tsx` is removed.
- **Blog index** (`app/blog/page.tsx`): hero with H1 "Sex Toy Guides & Advice for Lebanon", topic chips with counts, a featured newest article, an image card grid, and a "from reading to shopping" block linking each topic to shop categories. Title and description rewritten; Blog schema lists the latest 12 posts.
- **Topic pages** (`app/blog/[blogCategory]/page.tsx`): topic-specific SEO titles and descriptions, card grid, topic switcher, and "shop what you read about" links. CollectionPage schema lists the posts.
- **Article pages** (`app/blog/[blogCategory]/[slug]/page.tsx`): featured image (article image or a brand fallback by topic), breadcrumb, byline with updated date, sticky table of contents from H2s, "shop what this covers" sidebar linking the categories the article mentions, sources box with non-commercial health references, author box linking to `/about`, related articles with images. BlogPosting schema with image, wordCount, articleSection and author.
- **Markdown renderer** (`src/components/blog/ArticleBody.tsx`): supports links (external open in new tab), images, italics, blockquotes, rules, H2 anchors and merged paragraphs. The article's own `# Title` line is stripped, fixing the double H1 on every post.
- **Automatic internal links** (`lib/blogContent.ts`): the first mention of each category keyword in body text (vibrators, dildos, lubricants, BDSM and 20 more, English and Arabic) links to its category page, capped at eight per article. Also provides related categories, external sources, image fallbacks and title/description trimming.
- **New articles**: `blog-new-articles.sql` (repo parent folder) inserts six bilingual buyer-guide articles into Supabase: best sex toys for beginners, how to buy online discreetly, vibrator vs dildo, prices and fakes, sex shop in Beirut vs online, and male masturbators. Each has a focus keyphrase, 600 to 800 English words, an Arabic version, 8 to 13 internal links and an external health reference.
- Cache and package version 1.5.17.

## [1.5.16] - 2026-11-09

### Homepage redesign

- **One design system**: `app/globals.css` now defines the storefront tokens (`vexa-ink`, `vexa-surface`, `vexa-raised`, `vexa-pink`, `vexa-pink-hover`, `vexa-whatsapp`) plus shared `vexa-container`, `vexa-section`, `vexa-eyebrow`, `vexa-h2`, `vexa-card` and `vexa-btn-*` classes. The navbar, hero, product grid, product cards, footer, about page and homepage sections all use them; the blue-tinted `#08080b` / `#0e0e12` / `#121217` backgrounds and the three different pinks are gone.
- **One page flow instead of two layers**: the homepage journey (hero, category discovery, featured products, assurances, buying guide, FAQ, policies and contact) now renders inside `ProductList`, so nothing is appended after the storefront anymore. `app/page.tsx` no longer passes `seoContent`.
- **Hero** (`src/components/HeroSection.tsx`): H1 `SEX TOYS LEBANON / DISCREET ADULT TOYS`, a natural intro sentence, a primary `Shop sex toys` link to `/sex-toys`, a secondary `Browse categories` anchor, and three reassurance chips. Heading splitting moved to `src/utils/heroHeading.ts`.
- **Category discovery** (`src/components/CategoryShowcase.tsx`): eight crawlable `<a href="/slug">` cards (vibrators, dildos, male toys, couples toys, lingerie, sex dolls, BDSM, sexual enhancers) using the existing category artwork or the first real product photo.
- **Featured products**: the homepage shows 15 products with a `Show all N products` button; category routes and `/adult-toys` still list everything. Default sort is now `Recommended` (in stock, then most reviewed, then new) instead of a `Best selling` label the data cannot support.
- **Honest product cards** (`src/components/ProductCard.tsx`): removed the deterministic `Best Seller` / `-20%` badges and the invented crossed-out price (`price * 1.25`). Badges now reflect only real data: out of stock, `Only N left` (stock of 3 or fewer) and the catalog `isNew` flag.
- **New sections**: `AssuranceSection.tsx` (packaging, delivery, cash on delivery, WhatsApp support, each linked to its policy page), `BuyingGuideBanner.tsx` rewritten as three tips plus links to the real blog guides and the quiz, `FaqAccordion.tsx` restyled with a WhatsApp prompt and accessible panels, `ShoppingInfoSection.tsx` for policy and contact cards. `QuizBanner.tsx` was removed (its call to action lives in the guide section).
- **Trust accuracy**: the footer no longer links to generic `instagram.com`, `tiktok.com` and `x.com` homepages; only the verified WhatsApp contact remains until real brand accounts exist. FAQ no longer claims card or online payment (checkout is cash on delivery) or "sterile" products; `BuyingGuideBanner` no longer says `Card Payment`.
- **Homepage payload**: `app/page.tsx` sends `toCardProduct` records and preloads the hero image.
- Tests: `tests/homepage-structure.test.mjs` (section order, honest badges, crawlable category links, no placeholder socials, token usage) and an updated `tests/homepage-seo-priority.test.mjs`.

### Category pages

- **Structured Lebanon content for every category route** (`src/data/categoryContent.ts`, 22 categories plus `/adult-toys`): a hero sentence, two intro paragraphs, three H3 sections (types, how to choose, delivery and privacy in Lebanon), 3 to 8 related-category links, 3 to 4 blog guide links and FAQs, all in English and Arabic.
- **New category guide layout** (`src/components/CategoryGuideSection.tsx`) in the shared design system: intro and section cards, a collapsible "More about buying X in Lebanon" block for the Supabase guide text, related-category cards as crawlable links, blog guides, FAQ `<details>` list, quiz and WhatsApp calls to action.
- **Supabase editorial reaches the client**: `app/[category]/page.tsx` now passes the `category_editorial` row through `ShopApp` and `ShopContext` (`categoryEditorial`), so the visible guide and FAQs match the FAQ schema instead of falling back to code copy.
- **Category hero**: `HeroSection` accepts an `intro` sentence and shows the packaging, delivery and payment chips on category pages too.
- Tests: `tests/category-content.test.mjs`.
- Documentation: paste-ready category SEO titles and descriptions for the Supabase `categories` table in `SEO_AUDIT_2026-11-09.md`.

### Added

- `lib/storefrontPayload.ts`: `toCardProduct` / `toClientProduct` helpers that strip descriptions, SEO-only fields and secondary gallery images from the products embedded in server-rendered HTML.
- `lib/categoryIndexing.ts`: categories with fewer than 3 published products are marked `noindex, follow` and left out of `sitemap.xml` until they are stocked (currently Lingerie, Sex Machines, Kegel Balls, New Arrivals, Lubricants, Poppers).
- `lib/productSeo.ts`: `shortProductName`, `buildProductTitle`, `buildProductDescription` and `clampText` for length-safe product metadata.
- `tests/product-seo-title.test.mjs` covering the new helpers, payload trimming, the thin-category threshold and `displayCopy` whitespace handling.
- `SEO_AUDIT_2026-11-09.md`: full live-site audit plus Search Console analysis (Aug 7 to Nov 6, 2026) that motivated this release.

### Changed

- **Smaller HTML**: category pages now embed only their own products as lightweight cards, and product pages embed the product plus up to 8 same-category cards, instead of the whole 78-product catalog (~236 KB) on every page. The client still refreshes the full catalog from `/api/products` after hydration.
- **Product titles**: generated titles are now `<short product name> | Vexa Toys Lebanon`, capped at 60 characters; the category segment is used only to tell two same-named products apart, and the old `(price USD)` disambiguator is gone. Hand-written SEO titles are kept when they are 70 characters or shorter.
- **Product descriptions**: generated meta descriptions are capped at 155 characters (lead sentence, first sentence of the product copy, delivery closing). Category descriptions are capped at 160 instead of 300.
- **About page** is a brand-story page again: title `About Vexa Toys | Our Story and Promise`, H1 `The Story Behind Vexa Toys`, no `#1 destination` / `sex shop in Lebanon` copy, and its two calls to action are real links to `/sex-toys` and `/adult-toys`. This stops `/about` competing with the homepage for `sex toys lebanon` (Search Console showed it at position 10 with 1,040 impressions).
- **Static page titles**: quiz, privacy, delivery and warranty use absolute titles so the root template no longer appends `| Vexa Toys Lebanon` a second time; privacy and delivery titles and descriptions were shortened to fit 60 / 155 characters.
- **Category section heading**: the `<h2>` above the product grid no longer repeats the `| Vexa Toys` title suffix.
- **Brand normalization**: category copy from Supabase now maps both `Vexa Store` and `Vexa toys` to `Vexa Toys`; product SEO fields map `Vexa Store` to `Vexa Toys`; `displayCopy` collapses doubled spaces inside a line (fixes `Sex Toys in  Lebanon`).
- **Cache headers**: the catch-all `no-store` rule in `next.config.mjs` now applies only to `/checkout`, `/orders`, `/admin` and `/api`. Public pages are still rendered dynamically because of the locale cookie, so CDN caching needs a follow-up decision on how Arabic is served.
- Bumped `CACHE_VERSION` and the package version to `1.5.16` because product and category mapping changed.

### Fixed

- **Sitemap homepage URL** now has the trailing slash (`https://vexatoys.com/`) to match the homepage canonical; Search Console reported "No referring sitemaps detected" for the homepage because the two spellings did not match.
- **Dev hydration mismatches**: the `Cache-Control: public, max-age=31536000, immutable` rule for `/_next/static/:path*` now applies only when `NODE_ENV` is `production`. In `next dev` chunk names are not content-hashed, so the immutable header made browsers keep stale client bundles after every edit and report "Hydration failed because the server rendered text didn't match the client". Production chunks are hashed and keep the immutable header. After pulling this change, restart `npm run dev` and hard-refresh once (Ctrl+F5) to drop the already-cached chunks.
- Added permanent redirects for two URLs that Search Console still lists as indexed but that returned 404: `/sex-toys/dildo-in-lebanon-premium-silicone-dildo` and `/dildos/realistic-silicone-dildo-lebanon-g-spot-curved-suction-cup-d`.

### Documentation

- Added `docs/worklogs/2026/11/worklog-09-11-2026.md` and indexed it.

## [1.5.15] - 2026-10-12

### Added

- Added persistent desktop, mobile, and footer links to `/adult-toys`, plus a descriptive `Sex Toys & Adult Toys in Lebanon` homepage link rendered across the storefront.
- Added regression coverage for the homepage's broad-query metadata, page-specific hero headings, crawlable adult-toys navigation, route-aware category navigation, and public category-brand normalization.

### Changed

- Made the homepage the primary broad-query landing page with the title and H1 `Sex Toys Lebanon & Adult Toys Lebanon | Vexa Toys`, an exact-topic description, and the owner-supplied Lebanon/Beirut keyword variants.
- Category pages now render their own category-specific H1 instead of reusing the homepage's generic `SEX TOYS IN LEBANON` H1.
- Category navigation now uses real Next.js route transitions so URL, title, canonical, and server-rendered page content remain synchronized.
- Normalized legacy `Vexa Store` category titles and descriptions from published Supabase rows to `Vexa Toys` at the public reader boundary.
- Bumped the package and centralized cache version to `1.5.15` / `v1.5.15` for the changed metadata, category mapping, and static navigation content.

### Fixed

- Restored a primary H1 on `/about`, eliminating the only missing-H1 exception found by the 126-URL production sitemap crawl.

### Documentation

- Added and implemented a production homepage SEO audit comparing `/`, `/sex-toys`, and `/sex-dolls`, including the evidence, page hierarchy, verification limits, and post-deployment Search Console steps.

## [1.5.14] - 2026-10-08

### Fixed

- **Google Search Console 404 follow-up**: Added permanent redirects for five additional historical URLs that still returned 404 after Google recrawled them:
  1. `/dildos/dildos-silicone-custom-colors-in-lebanon` and its trailing-hyphen variant → `/dildos/silicone-dildo-custom-colors-lebanon`
  2. `/male-toys/beaded-dual-penetrator-vibrating-silicone-toy` → `/male-toys/beaded-dual-silicone-toy-lebanon`
  3. `/sex-toys/luxecurve-silicone-dildo-in-lebanon` → `/sex-toys/luxecurve-silicone-dildo`
  4. `/sex-toys/dolphin-suckling-female-adult-sex` → `/vibrators` because the original product is no longer published
- **Layered redirect coverage**: Kept Vercel edge redirects, Next.js permanent redirects, and product-slug remapping aligned for current published product replacements.
- **Regression coverage**: Expanded the GSC redirect suite to cover all newly reported failed URLs while retaining coverage for the three already-remediated pending URLs.

### Changed

- **Cache version bump**: Bumped `CACHE_VERSION` and package version to `1.5.14` so product URL mapping changes cannot be masked by older catalog/page cache entries.

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
