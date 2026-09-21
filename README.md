# Vexa Toys storefront

Version 1.5.4 fully unifies brand identity under Vexa Toys / Vexa Toys Lebanon across all customer-facing surfaces, page metadata, OpenGraph/Twitter cards, Schema.org structured data, category and city metadata, blog posts, static fallback products, customer-sent WhatsApp templates, static generators, and test suites. Version 1.5.3 unified legal policies at `/terms`, `/warranty`, `/delivery`, and `/privacy`, provided a 301 redirect from `/terms-and-conditions` to `/terms`, and ensured clean navigation paths. Version 1.5.2 restored production page rendering after the Meta Pixel integration passed a browser event handler through a React Server Component boundary.

Public SEO metadata, canonicals, sitemap, and structured data follow the published Supabase catalog and articles. Admin SEO overrides are used when present; otherwise pages derive metadata from their content. Product pages render Schema.org `Product` structured data including `aggregateRating`, verified `review` entries, and full `Offer` properties (`validFrom`, `priceValidUntil`, `itemCondition`, `shippingDetails`, `hasMerchantReturnPolicy`), satisfying Google Search Console rich result and Merchant listings requirements. The current English and Arabic views share URLs, so Arabic does not yet have separate indexable pages. See the [SEO audit and remediation record](docs/09-project/seo-remediation-2026-09-18.md).

The public storefront defaults to English. Use the EN/AR switch in the shop header or blog header to change languages; the selection persists across pages. The storefront uses an editorial dark theme (`bg-black`) with vibrant `#ff2d78` accents. The homepage layout features a full-bleed ambient hero (`HeroSection`), 5-card category showcase (`CategoryShowcase`), buying guide banner with trust badges (`BuyingGuideBanner`), interactive quiz teaser (`QuizBanner`), horizontal category navigation (`RelatedCategories`), and an expandable FAQ accordion (`FaqAccordion`). All interior views—including the Product Page, Checkout, My Orders, About, and Quiz—follow the unified dark design system with WCAG AA-compliant contrast ratios. High-resolution raster mockup assets are served in modern WebP format with preloading for Largest Contentful Paint (LCP) performance. Each product page features verified customer reviews with delivery locations across Lebanon, star breakdown, and privacy trust badges.

The public storefront serves the catalog and checkout. The separate administrator app is maintained in `admin-vexatoys`.

Category buying guides and FAQ lists now come from Supabase editorial rows rather than bundled source text. Administrators edit them under Content → Category guides & FAQs. The visible FAQ answers and FAQ structured data use the same records and refresh within about five minutes.

## Caching & Cache Versioning

Server responses from Supabase (products, categories, editorial FAQs, and blog articles) are cached via Next.js `unstable_cache` with a 5-minute TTL and on-demand revalidation tags. Cache keys across both server fetchers and client translation storage are centralized and versioned in `lib/cacheVersion.ts`. Whenever data models, queries, or static definitions change, bump `CACHE_VERSION` in `lib/cacheVersion.ts` to instantly invalidate stale cached payloads. See the [Caching architecture guide](docs/02-architecture/components/cache.md).

## Customer-sent WhatsApp orders

The Supabase storefront uses the imported catalog, categories, media references, articles, and public store settings. Checkout opens a prepared WhatsApp chat only after the server confirms an order transaction. A failed write leaves the cart intact and shows an error. The customer must tap Send inside WhatsApp. The English or Arabic message includes the order reference, Lebanon time, customer details, size-aware lines, SKU when available, image links when public, and subtotal/delivery/total. WhatsApp opens a text draft with image URLs; it does not attach image files. Existing imported products currently have no SKU values, so the SKU line appears only after a SKU is entered in admin.

Production uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for catalog reads and a sensitive server-only `SUPABASE_SECRET_KEY` for checkout. Set the same names in `.env.local` for local tests; never prefix the secret with `NEXT_PUBLIC_`. A real storefront order is now confirmed in Supabase and visible in admin; WhatsApp delivery still depends on the customer tapping Send. The old Firebase-backed runtime endpoints and local admin component are retired in production; historical migration scripts remain under `scripts/`.

The local checkout now opens a prefilled WhatsApp chat automatically after a real committed order. The customer still presses Send inside WhatsApp. Local mock checkout is explicitly labeled and does not create an admin order or open WhatsApp.

## Isolated staging checkout

Copy `.env.staging.example` to `.env.staging.local`, fill the isolated branch URL, publishable key, and **server-only** secret, then run `npm run dev:staging`. The guarded script refuses the live Vexa Toys Supabase project and serves the staging storefront at `http://127.0.0.1:3001`. Staging orders will not appear in the production admin; use the local staging admin or inspect the staging database. Do not commit `.env.staging.local`.

My Orders refreshes saved receipt statuses from Supabase on load, on return to the tab, and every minute while open. Status lookups use the order reference plus the checkout phone; only a matching status is returned. The navbar order panel also links to the full My Orders detail. Receipts remain in this browser.

Published catalog changes refresh from Supabase when a customer opens or returns to a storefront tab. Server-rendered catalog and SEO pages can still take up to five minutes to regenerate. Archived products are intentionally excluded from public catalog reads. Unused public IndexNow and revalidation endpoints were removed. A real storefront order has already been confirmed in Supabase; safe release smoke checks use synthetic unmatched or invalid orders without creating another one.
All 426 imported Vercel Blob product images now use checksum-verified, Sharp-processed Supabase Storage copies. Original Blob URLs remain recorded for rollback.
