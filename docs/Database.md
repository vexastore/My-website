# Database

The prior Firebase checkout waited for its order document write before clearing the cart or offering WhatsApp. The live Supabase checkout replaces that write with a server-side transaction; the Firebase behavior is historical.
# Supabase production status

The imported Supabase project currently supplies 109 published products, 22 categories, 311 category links, 427 media references, 13 articles, and 5 historical orders to the admin dataset. The storefront reads published products and articles from that project. Existing product media references still point mostly to Vercel Blob; binary migration to Supabase Storage is separate from the Firestore data migration. The live `create_order` RPC now validates selected options, applies price deltas, and decrements option stock atomically; a rollback-only integration fixture passed. A first committed production customer order has since been verified as confirmed.

The initial cutover snapshot contained five `source=import` rows and no `source=storefront` rows; a later read-only check found one confirmed storefront order. The mock RPC used for browser tests writes to memory only. The variant validation and price-delta migration is applied to the live project.

Use the synthetic seed at `admin-vexatoys/supabase/seeds/staging_checkout.sql` only on a disposable branch. It adds one published test product with required Size options, Small at $10 and Medium at $15, each with option stock. Do not apply this seed to production.

On 17 September 2026, a read-only live check found one `source=storefront` order with status `confirmed`; no customer data was exported. The 1.2.1 status endpoint adds no table or policy changes and returns only a matched order status via a server-side service key.

## Category editorial and media transition

The shared Supabase project now has 23 `category_editorial` rows, seeded from the former bundled guide text. RLS grants anonymous read and admin-only updates. `product_media.legacy_source_url` is the rollback reference for each verified Vercel Blob-to-Supabase Storage binary copy. Old Blob objects remain available until the rollback window closes.

## Product reviews and SEO overrides schema (Migration 20260922223000)

The migration `supabase/migrations/20260922223000_product_reviews_and_seo_overrides.sql` introduces:

1. **`public.product_reviews` Table**:
   - `id` (UUID PK default `gen_random_uuid()`)
   - `product_id` (UUID NOT NULL FK `products(id)` ON DELETE CASCADE)
   - `order_id` (UUID NULL FK `orders(id)` ON DELETE SET NULL)
   - `order_item_id` (UUID NULL FK `order_items(id)` ON DELETE SET NULL)
   - `customer_name` (TEXT NOT NULL)
   - `customer_phone` (TEXT NULL) — private verification reference, never returned publicly
   - `rating` (INTEGER NOT NULL CHECK `rating >= 1 AND rating <= 5`)
   - `title` (TEXT NULL)
   - `body` (TEXT NOT NULL)
   - `locale` (TEXT NOT NULL DEFAULT 'en')
   - `status` (TEXT NOT NULL DEFAULT 'pending' CHECK `status IN ('pending', 'approved', 'rejected')`)
   - `verified_purchase` (BOOLEAN NOT NULL DEFAULT FALSE)
   - `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())
   - `updated_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())
   - `approved_at` (TIMESTAMPTZ NULL)
   - `approved_by` (UUID NULL)
2. **Postgres Triggers**:
   - `trg_product_reviews_aggregate`: Executes `recalculate_product_rating()` upon any INSERT, UPDATE (rating or status), or DELETE on `product_reviews`. Atomically updates `products.rating` (`ROUND(AVG(rating), 2)`) and `products.review_count` (`COUNT(*)`) for all rows with `status = 'approved'`.
   - `trg_product_reviews_updated_at`: Automatically sets `updated_at = NOW()`.
3. **Stored Procedure (`submit_product_review`)**:
   - Security DEFINER function callable by anonymous / authenticated clients.
   - Validates rating range (1–5) and product existence.
   - If `p_order_reference` and `p_customer_phone` are provided, performs lookup on `orders` and `order_items`. If an order matches the phone and contains the target product, sets `verified_purchase = TRUE`.
   - Inserts review with status `pending`.
4. **RLS & Security Policies**:
   - Anonymous/authenticated users can SELECT rows where `status = 'approved'`.
   - Admin users (`app_metadata.role = 'admin'`) have full SELECT, UPDATE, and DELETE privileges.
   - Public users cannot directly INSERT or UPDATE rows outside the `submit_product_review` RPC.
5. **Product SEO Overrides**:
   - Added `canonical_url_override` (TEXT NULL) with check constraint `^https?://`.
   - Added `og_image_url` (TEXT NULL) with check constraint `^https?://`.

