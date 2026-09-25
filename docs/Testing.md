# Testing

For 1.5.12, run `node --test --experimental-strip-types tests/*.test.mjs`, `npx tsc --noEmit --incremental false`, `npm run lint`, and `npm run build`. At a mobile viewport, verify a zero-review product has no `0/5` label, displays `No reviews yet`, and links to `#reviews-section`. Seed a cart locally, enter a three-character address, and verify the form displays `Address must be at least 4 characters.` without issuing `POST /api/orders`. Do not use a valid production item in automated checkout tests because that would create a real order and decrement stock.

For Merchant listings `validFrom` and `offers` schema, run `node --test tests/product-schema.test.mjs`. Verify that Schema.org Product structured data outputs `validFrom` in ISO 8601 `YYYY-MM-DD` format, `priceValidUntil >= validFrom`, and `itemCondition: 'https://schema.org/NewCondition'` across all product pages, specifically verifying all 26 affected URLs reported by Google Search Console.

For the Terms & Conditions policy, run `node --test tests/legal-routes.test.mjs` and `npm run build`. Confirm `/terms` is generated as a static/dynamic route, returns HTTP 200 locally, includes all 18 numbered sections and required legal links, is linked from the storefront footer and age verification banner, and that `/terms-and-conditions` 301-redirects to `/terms`.

For the warranty policy, run `npm run build` and confirm `/warranty` is generated, returns HTTP 200 locally, includes the policy title and warranty sections, and is linked from the storefront footer.

For the delivery policy, run `npm run build` and confirm `/delivery` is generated, returns HTTP 200 locally, includes the policy title and delivery sections, and is linked from the storefront footer.

For the privacy policy, run `npm run build` and confirm `/privacy` is generated, returns HTTP 200 locally, includes the policy title and privacy sections, and is linked from the storefront footer.

For 1.5.3, run `npm run lint` and `npm run build`. Confirm the homepage source contains no rendered `/city/*` links and that the homepage still returns HTTP 200 in a local dev smoke test.

For 1.5.2, run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Start the production server and request `/`; the response must be HTTP 200 and the server log must not contain `Event handlers cannot be passed to Client Component props`. Browser validation must confirm the home page renders without a Next.js Server Components error. `tests/meta-pixel.test.mjs` guards the server-rendered Meta Pixel component against JSX event-handler props while retaining its production-only, deferred loading behavior.

For 1.4.3, run `node --test tests/*.test.mjs` including `tests/product-schema.test.mjs`. Verify that Schema.org Product structured data outputs valid `aggregateRating` and `review` arrays across all products and specifically for the three Google Search Console reported URLs (`/male-toys/manual-penis-vacuum-pump-compact-hand-pump`, `/dildos/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic`, `/male-toys/wearable-double-strap-on-set-realistic-silicone-massager-adj`). Confirm the server-rendered HTML contains the `<script id="vexa-product-jsonld">` on initial load and that the Customer Reviews section displays matching ratings, dates, and reviewer details. Run TypeScript check, linter, and production build.

For 1.4.2, check the English and Arabic storefront overlay menus: Products, Find My Product, Blog, and About Us remain available, while no Admin entry or admin subdomain link appears. Run lint, TypeScript, unit tests, and the production build after the navigation change.

For SEO changes, run the full unit suite, TypeScript, lint, and production build. Start the production build locally, fetch every sitemap URL, and confirm each returns 200 with one self-canonical, one title/description, and one H1. Check representative English and Arabic HTML/JSON-LD, alias redirects, true 404s, checkout noindex, robots.txt, sitemap membership, and duplicate metadata. The technical checks do not establish that Google indexed any page; that requires Search Console URL Inspection and coverage evidence. See the [audit record](09-project/seo-remediation-2026-09-18.md).

For 1.4.0 run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. In a browser, check English and Arabic home catalog toolbar, Products submenu and menu transition, one homepage FAQ, blog index/category/article direction and header, quiz, about, and empty order history. With a `vexa_store_language=ar` request cookie, server HTML must render `lang="ar" dir="rtl"`; without it, HTML must render English/LTR. Verify product and article names containing stored em dashes render without them while stored database values remain unchanged. Do not submit checkout orders during UI regression testing.

Run `node --test tests/whatsapp.test.mjs` for link encoding, order details, and optional fields. The storefront-wide TypeScript check now passes locally; a real customer order has been observed confirmed in the live database.

# Supabase cutover verification

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. On `localhost:3000`, check `/api/products` count and mappings, `/api/articles`, `/api/store-settings`, a product page, blog, cart, and checkout failure retention. `/api/orders` should return 403 for a foreign origin, 400 for malformed input, and 503 without its server-only secret. The order RPC, idempotency, stock, and option pricing passed a rollback-only database fixture. The owner completed a controlled real order; automated tests should not write to the live customer dataset.

The 1.1.0 production dependency audit reports zero known findings.

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. In isolated mock mode, verify the checkout notice says no order was saved, the cart remains, and WhatsApp does not open. For real local checkout, configure the server-only key against an isolated project and verify the committed order in the matching staging admin.

For isolated checkout tests, create a Supabase branch, apply the option-pricing migration, run `supabase/seeds/staging_checkout.sql` on that branch, and populate `.env.staging.local` from `.env.staging.example`. `npm run dev:staging` starts the storefront on port 3001 and refuses the live Supabase hostname. The separate admin repository has a corresponding staging command on port 3002. Production admin will not show staging orders. Test Small/Medium pricing, persisted order, stock decrement, idempotent retry, failed-write cart retention, and WhatsApp handoff without pressing Send.

For the 1.1.0 production smoke check, confirm catalog/article reads, image redirects, canonicals, sitemap, removed privileged routes returning 404, anonymous checkout rejection, and a valid-format order with a nonexistent product returning 409 without a write. The owner then places one real checkout, verifies its order in admin, and checks that WhatsApp opens with the prefilled message. Do not press Send during automated testing. Production dependency audit should report zero known findings.

For 1.2.0, `node --test tests/*.test.mjs` compares complete English and Arabic WhatsApp drafts, including Lebanon date, size price, option SKU, public image link, missing notes, and totals. TypeScript and production build cover Supabase SKU selection and the optional committed-order metadata response. A real WhatsApp draft still needs owner browser verification; automated tests do not send customer messages.

For 1.2.1, `node --test tests/*.test.mjs` covers confirmed-status updates, unrelated/invalid statuses, reference format, and checkout-phone matching. TypeScript and build checks cover the new route and client refresh. Local HTTP checks exercise 403 cross-origin, 400 invalid input, and 503 when no local server secret is configured. Production smoke checks must verify 200 with an unmatched synthetic receipt and no disclosed data, without creating an order; a headless browser test confirmed the navbar panel and full detail update with a mocked status response, and checked the failure warning. The owner should verify their real confirmed receipt in their browser.

For 1.3.0, run the storefront unit suite, TypeScript, and production build. The editorial parser rejects malformed data; generated `/sex-toys` and `/adult-toys` pages must contain a buying guide, visible FAQ, and FAQ structured data. Anonymous REST access must read all 23 seeded editorial rows. The admin repo separately verifies non-admin write denial and admin update in a rollback transaction. Product image migration is not complete until all old Blob records have verified Supabase bytes and retained rollback URLs.

For 1.3.1, compare all published Supabase base prices with the live `/api/products` response and confirm archived products are absent. The local production endpoint must return `Cache-Control: private, no-store, max-age=0`. In a browser test, mock a changed catalog price after the product page SSR render, then verify the visible price updates on hydration and again after a tab visibility event. The server-rendered page remains subject to the documented five-minute regeneration period.
