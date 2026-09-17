# Testing

Run `node --test tests/whatsapp.test.mjs` for link encoding, order details, and optional fields. The storefront-wide TypeScript check now passes locally; a successful checkout transaction remains unverified before production release.
# Local Supabase cutover verification

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. On `localhost:3000`, check `/api/products` count and mappings, `/api/articles`, `/api/store-settings`, a product page, blog, cart, and checkout failure retention. `/api/orders` should return 403 for a foreign origin, 400 for malformed input, and 503 without its server-only secret. Before production, test a successful order and idempotent replay in an isolated database or rollback transaction, stock and variant-price behavior, abuse protection, image availability, and absence of the retired Firebase/Vercel API routes. Do not run a real test customer order against the live store dataset.

The current production dependency audit reports one critical, three high, and one moderate advisory. Review and patch these before a public cutover.

Run `node --test tests/*.test.mjs`, `npx tsc --noEmit`, and `npm run build`. In isolated mock mode, verify the checkout notice says no order was saved, the cart remains, and WhatsApp does not open. For real local checkout, configure the server-only key, apply and validate the variant-price migration, and verify the committed order in the admin before any storefront deployment.

For isolated checkout tests, create a Supabase branch, apply the staged option-pricing migration, run `supabase/seeds/staging_checkout.sql` on that branch, and populate `.env.staging.local` from `.env.staging.example`. `npm run dev:staging` starts the storefront on port 3001 and refuses the live Supabase hostname. The separate admin repository has a corresponding staging command on port 3002. Production admin will not show staging orders. Test Small/Medium pricing, persisted order, stock decrement, idempotent retry, failed-write cart retention, and WhatsApp handoff without pressing Send.

For the 1.1.0 production smoke check, confirm catalog/article reads, image redirects, canonicals, sitemap, removed privileged routes returning 404, anonymous checkout rejection, and a valid-format order with a nonexistent product returning 409 without a write. The owner then places one real checkout, verifies its order in admin, and checks that WhatsApp opens with the prefilled message. Do not press Send during automated testing. Production dependency audit should report zero known findings.
