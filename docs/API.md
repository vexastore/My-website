# API

The public Telegram `/api/notify-order` relay and `/api/test-telegram` diagnostic were removed. Unused public `/api/indexnow`, `/api/revalidate`, `/api/product-revalidate`, and `/revalidate` routes were also removed. WhatsApp uses a client-side `wa.me` link after an acknowledged order write; it has no server API.
# Local Supabase storefront endpoints

- `GET /api/products`: published products, categories, images, and options from Supabase public RLS.
- `GET /api/articles`: published advice articles.
- `GET /api/store-settings`: public currency, delivery fee, ordering status, and support number.
- `GET /api/img/:id`: 307 redirect to the primary imported media URL for a published product.
- `POST /api/orders`: same-origin JSON request; validates customer, items, and idempotency UUID, then calls the server-only `create_order` RPC. Returns 201 only for a confirmed order, 400/403 for malformed or cross-origin input, and 503 when checkout is unavailable. This route is part of the production cutover; dedicated abuse controls remain future work.

During local development only, `LOCAL_CHECKOUT_MOCK=true` causes `POST /api/orders` success responses to include `testMode: true`. The client then suppresses the WhatsApp handoff and does not record a local receipt. Never enable this marker for a live database connection.

`POST /api/orders` uses the same transactional RPC in staging. The staging launcher requires a branch URL and server-only secret, and refuses the live project hostname.
