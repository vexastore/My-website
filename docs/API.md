# API

The published `/api/products` response now includes locale-specific admin SEO title/description overrides, the product currency and update timestamp, and ordered `imageAltsEn`/`imageAltsAr` arrays paired with `images`. These are published catalog fields; private admin fields remain excluded. The article reader also maps published SEO overrides for server-rendered article metadata. No write endpoint or database schema changed in this SEO pass.

The public Telegram `/api/notify-order` relay and `/api/test-telegram` diagnostic were removed. Unused public `/api/indexnow`, `/api/revalidate`, `/api/product-revalidate`, and `/revalidate` routes were also removed. WhatsApp uses a client-side `wa.me` link after an acknowledged order write; it has no server API.
# Supabase storefront endpoints

- `GET /api/products`: current published products, categories, images, and options from Supabase public RLS. This route reads directly and responds with `Cache-Control: private, no-store, max-age=0`; archived products are omitted.
- `GET /api/articles`: published advice articles.
- `GET /api/store-settings`: public currency, delivery fee, ordering status, and support number.
- `GET /api/img/:id`: 307 redirect to the primary imported media URL for a published product.
- `POST /api/orders`: same-origin JSON request; validates customer, items, and idempotency UUID, then calls the server-only `create_order` RPC. Returns 201 only for a confirmed order, 400/403 for malformed or cross-origin input, and 503 when checkout is unavailable. This route is part of the production cutover; dedicated abuse controls remain future work.

During local development only, `LOCAL_CHECKOUT_MOCK=true` causes `POST /api/orders` success responses to include `testMode: true`. The client then suppresses the WhatsApp handoff and does not record a local receipt. Never enable this marker for a live database connection.

`POST /api/orders` uses the same transactional RPC in staging. The staging launcher requires a branch URL and server-only secret, and refuses the live project hostname.

In 1.2.0, successful `POST /api/orders` responses also include `deliveryFee` and `placedAt` from the committed order when the follow-up read succeeds. The existing `total` and order reference remain authoritative; the client falls back to its current delivery fee and confirmation time if those optional fields are unavailable. Public product reads include product and variant-option SKU values.

`POST /api/orders/status` accepts a same-origin JSON body `{ "orders": [{ "reference": "VX-...", "phone": "..." }] }` with 1–20 receipts and a 4 KiB body limit. It uses the server-only Supabase key to find storefront orders, matches the checkout phone exactly, and responds `{ "orders": [{ "reference": "VX-...", "status": "confirmed" }] }` for matching rows only. Unknown or mismatched receipts are omitted. It returns 400 for invalid input, 403 for a foreign origin, 413 for oversized input, and 503 if status is unavailable. Responses are `no-store` and contain no customer or item data. The `GET` method is not offered.

## Category editorial read

Category pages query `category_editorial` through Supabase REST with the publishable key and anonymous RLS. They read one slug at a time, validate FAQ pairs, and cache the result for up to five minutes. Writes occur only in the separate admin app through an authenticated Server Action.

## Product reviews API

- `GET /api/reviews?productId=<uuid>`: Returns array of approved reviews (`status = 'approved'`) for a product ordered by `created_at DESC`. Public endpoint; response includes `id`, `productId`, `customerName`, `rating`, `title`, `body`, `verifiedPurchase`, `createdAt`. Private customer contact fields are omitted. Returns `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
- `POST /api/reviews`: Submits a new customer product review for moderation. Same-origin JSON request bounded to 16 KiB.
  - Request body: `{ productId: string, customerName: string, rating: number (1-5), title?: string, body: string, locale?: string, orderReference?: string, customerPhone?: string }`.
  - Behavior: Calls Supabase stored function `submit_product_review`. Validates rating (1–5), product existence, and non-empty body. Verifies order and item match if `orderReference` and `customerPhone` are supplied, setting `verified_purchase: true` if valid; otherwise `false`. The review is placed into `status: 'pending'` awaiting admin approval.
  - Response: 201 `{ success: true, reviewId: string, verifiedPurchase: boolean, status: "pending" }`. Returns 400 for validation failure, 403 for foreign origin, and 500 on database failure.

