# Vexa Store storefront

The public storefront serves the catalog and checkout. The separate administrator app is maintained in `admin-vexatoys`.

## Customer-sent WhatsApp orders

The Supabase storefront uses the imported catalog, categories, media references, articles, and public store settings. Checkout opens a prepared WhatsApp chat only after the server confirms an order transaction. A failed write leaves the cart intact and shows an error. The customer must tap Send inside WhatsApp. The English or Arabic message includes the order reference, Lebanon time, customer details, size-aware lines, SKU when available, image links when public, and subtotal/delivery/total. WhatsApp opens a text draft with image URLs; it does not attach image files. Existing imported products currently have no SKU values, so the SKU line appears only after a SKU is entered in admin.

Production uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for catalog reads and a sensitive server-only `SUPABASE_SECRET_KEY` for checkout. Set the same names in `.env.local` for local tests; never prefix the secret with `NEXT_PUBLIC_`. The first real committed order, admin appearance, and WhatsApp handoff still need owner verification. The old Firebase-backed runtime endpoints and local admin component are retired in production; historical migration scripts remain under `scripts/`.

The local checkout now opens a prefilled WhatsApp chat automatically after a real committed order. The customer still presses Send inside WhatsApp. Local mock checkout is explicitly labeled and does not create an admin order or open WhatsApp.

## Isolated staging checkout

Copy `.env.staging.example` to `.env.staging.local`, fill the isolated branch URL, publishable key, and **server-only** secret, then run `npm run dev:staging`. The guarded script refuses the live Vexa Toys Supabase project and serves the staging storefront at `http://127.0.0.1:3001`. Staging orders will not appear in the production admin; use the local staging admin or inspect the staging database. Do not commit `.env.staging.local`.

Catalog pages refresh within about five minutes after admin changes. Unused public IndexNow and revalidation endpoints were removed. The first real order should be placed by the store owner; the release smoke check can verify invalid orders without creating one.
