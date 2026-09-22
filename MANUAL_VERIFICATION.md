# Production Manual Verification Runbook

This document details external verification gates and procedures that cannot be validated purely within Git repositories or CI test runners. These require access to third-party services, production dashboards, or physical devices.

---

## 1. Remote Supabase Migration Execution

- **Item:** Application of database migration `20260922223000_product_reviews_and_seo_overrides.sql`.
- **Location:** `admin-vexatoys/supabase/migrations/20260922223000_product_reviews_and_seo_overrides.sql`.
- **Components Created:**
  1. `public.product_reviews` table with foreign keys to `products` and `orders`.
  2. `canonical_url_override` (text, check HTTPS/localhost) and `og_image_url` (text, check HTTPS/storage) on `products`, `categories`, and `articles`.
  3. `sync_product_review_rating` trigger on `product_reviews` invoking `private.recalculate_product_rating` to recalculate `products.rating` and `products.reviews_count` automatically upon review approval/update/deletion.
  4. `public.submit_product_review` stored procedure verifying purchase authenticity against confirmed orders.
  5. Strict RLS policies allowing public read of approved reviews only, authenticated insert via RPC, and administrator-only full CRUD.
- **Verification Steps:**
  1. Open the [Supabase Dashboard](https://supabase.com/dashboard) for project `sneihqexrinsjtzazbus`.
  2. Navigate to **SQL Editor**.
  3. Paste the contents of `20260922223000_product_reviews_and_seo_overrides.sql` and click **Run**.
  4. Verify the table `product_reviews` appears in **Table Editor** with RLS enabled.
  5. Verify that `products` table now includes columns `canonical_url_override` and `og_image_url`.

---

## 2. Google Search Console & Rich Results Live Validation

- **Items:**
  - Product Rich Results (valid `Product`, `offers`, `validFrom`, `hasMerchantReturnPolicy`).
  - Legal WebPage Rich Results for `/returns`, `/terms`, `/privacy`, `/delivery`, `/warranty`.
  - Merchant Listings verification.
- **Verification Steps:**
  1. Navigate to [Google Rich Results Test](https://search.google.com/test/rich-results).
  2. Test a live product URL (e.g. `https://vexatoys.com/male-toys/chasity-cage-in-lebanon`):
     - Confirm Schema.org `Product` graph detects zero errors.
     - Confirm `offers.validFrom` is recognized as a valid ISO date.
     - Confirm `offers.hasMerchantReturnPolicy` links to `https://vexatoys.com/returns`.
     - Confirm that products with 0 reviews cleanly omit `aggregateRating` and `review` without failing validation.
     - Confirm that products with approved reviews display valid `AggregateRating` and `Review` nodes.
  3. Test `https://vexatoys.com/returns`:
     - Confirm valid `WebPage` structured data.
  4. In [Google Search Console](https://search.google.com/search-console):
     - Submit updated sitemap: `https://vexatoys.com/sitemap.xml` (contains `/returns` and all canonical URLs).
     - Under **Merchant listings**, click **Validate Fix** on any historical `validFrom` or return policy warnings.

---

## 3. Real Device Web Push Delivery

- **Item:** Browser background Web Push delivery to physical devices via Apple APNs and Google FCM.
- **Verification Steps:**
  1. Open the Admin Console on a physical mobile device (Safari on iOS 16.4+ or Chrome on Android) or macOS/Windows desktop.
  2. On iOS, ensure the PWA has been added to the Home Screen ("Add to Home Screen").
  3. Sign in to an approved administrator account and navigate to **Notifications**.
  4. Click **Enable on this device** and accept the native browser permission prompt.
  5. Click **Send test**.
  6. Confirm the system banner notification appears on the operating system desktop / lock screen with title "Vexa Toys Admin: Test notification".

---

## 4. Customer-Side WhatsApp Order Handoff

- **Item:** Customer WhatsApp deep-link generation and pre-filled message handoff.
- **Verification Steps:**
  1. On the storefront (`https://vexatoys.com`), add any product to the cart.
  2. Proceed to checkout, enter test customer details (e.g. Beirut, Lebanon), and click **Complete Order**.
  3. Confirm the order reference is generated (e.g., `VEXA-XXXX`) and stored in Supabase with status `pending`.
  4. Tap the **Send Order via WhatsApp** button.
  5. Verify that WhatsApp opens with the pre-filled template containing:
     - Order reference number.
     - Product title and selected options / SKUs.
     - Total price in USD (and LBP if auto-convert enabled).
     - Customer name, phone number, and delivery city/address.
  6. Verify no external server credentials or private keys are exposed in the client payload.

---

## 5. Domain DNS, SSL, and Canonical Overrides

- **Item:** HTTPS certificate validity, redirect aliases, and canonical headers.
- **Verification Steps:**
  1. Request `http://vexatoys.com/` and verify immediate 308 permanent redirect to `https://vexatoys.com/`.
  2. Request `https://vexatoys.com/refund-returns` and `https://vexatoys.com/returns-policy`:
     - Confirm 308 permanent redirect to `https://vexatoys.com/returns`.
  3. In the Admin product editor, set a custom `Canonical URL override` (e.g. `https://vexatoys.com/vibrators/toy-custom-canonical`).
  4. Open the public page and inspect `<link rel="canonical" href="...">`:
     - Confirm it outputs the exact override URL.
     - Inspect Schema.org JSON-LD and confirm `@graph[].url` matches the override URL.
     - Open `https://vexatoys.com/sitemap.xml` and verify the sitemap lists the override URL instead of the default path.
