# Database

The prior Firebase checkout waited for its order document write before clearing the cart or offering WhatsApp. The local Supabase cutover replaces that write with a server-side transaction; the earlier behavior remains historical context until the storefront is deployed.
# Supabase local cutover status

The imported Supabase project currently supplies 109 published products, 22 categories, 311 category links, 427 media references, 13 articles, and 5 historical orders to the admin dataset. The storefront reads published products and articles from that project. Existing product media references still point mostly to Vercel Blob; binary migration to Supabase Storage is separate from the Firestore data migration. The live `create_order` RPC now validates selected options, applies price deltas, and decrements option stock atomically; a rollback-only integration fixture passed. A first committed production customer order remains to be verified.

Live order verification on 17 September 2026 returned five `source=import` rows and no `source=storefront` rows. The mock RPC used for browser tests writes to memory only. The variant validation and price-delta migration is staged in the admin repository but not applied to the live project.

Use the synthetic seed at `admin-vexatoys/supabase/seeds/staging_checkout.sql` only on a disposable branch. It adds one published test product with required Size options, Small at $10 and Medium at $15, each with option stock. Do not apply this seed to production.
