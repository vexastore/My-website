# Testing

Run `node --test tests/whatsapp.test.mjs` for link encoding, order details, and optional fields. The storefront-wide TypeScript check now passes locally; a successful customer checkout transaction remains unverified after production release.
# Supabase cutover verification

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. On `localhost:3000`, check `/api/products` count and mappings, `/api/articles`, `/api/store-settings`, a product page, blog, cart, and checkout failure retention. `/api/orders` should return 403 for a foreign origin, 400 for malformed input, and 503 without its server-only secret. The order RPC, idempotency, stock, and option pricing passed a rollback-only database fixture. The owner should test one controlled real order; automated tests should not write to the live customer dataset.

The 1.1.0 production dependency audit reports zero known findings.

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. In isolated mock mode, verify the checkout notice says no order was saved, the cart remains, and WhatsApp does not open. For real local checkout, configure the server-only key against an isolated project and verify the committed order in the matching staging admin.

For isolated checkout tests, create a Supabase branch, apply the option-pricing migration, run `supabase/seeds/staging_checkout.sql` on that branch, and populate `.env.staging.local` from `.env.staging.example`. `npm run dev:staging` starts the storefront on port 3001 and refuses the live Supabase hostname. The separate admin repository has a corresponding staging command on port 3002. Production admin will not show staging orders. Test Small/Medium pricing, persisted order, stock decrement, idempotent retry, failed-write cart retention, and WhatsApp handoff without pressing Send.

For the 1.1.0 production smoke check, confirm catalog/article reads, image redirects, canonicals, sitemap, removed privileged routes returning 404, anonymous checkout rejection, and a valid-format order with a nonexistent product returning 409 without a write. The owner then places one real checkout, verifies its order in admin, and checks that WhatsApp opens with the prefilled message. Do not press Send during automated testing. Production dependency audit should report zero known findings.
