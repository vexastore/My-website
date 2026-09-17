# Architecture

The public checkout persists orders before showing the WhatsApp send link. WhatsApp is a customer-initiated handoff; the admin PWA Web Push pipeline independently alerts subscribed staff about committed Supabase orders. See [flow](02-architecture/flows/whatsapp-checkout.md).
# Supabase storefront production architecture (17 September 2026)

The Next.js storefront reads published catalog rows, article content, and public settings through Supabase's publishable key and RLS. `/api/orders` is the customer write boundary; it calls the transactional `create_order` RPC with a server-only secret. The client receives a receipt and WhatsApp handoff only after the RPC succeeds. `/admin` sends administrators to the separate admin application. This is the production cutover architecture. A real storefront order has since been observed confirmed in Supabase and admin.

Legacy Firebase-backed Vercel functions under `api/`, the old local admin component, and the Firebase client package are retired in production. Historical standalone migration scripts remain under `scripts/`; they are not imported by the runtime. The two imported size-option sets have zero price delta today, but the live RPC validates options and calculates nonzero deltas when configured.

A successful real RPC response is the only trigger for the browser to navigate to `wa.me`. Before leaving, the receipt and emptied cart are written to local storage. `LOCAL_CHECKOUT_MOCK=true` is a development-only marker for isolated UI tests; simulated orders do not alter local order history or reach the admin.

Staging runs the storefront and admin locally against one isolated Supabase branch. Production `admin.vexatoys.com` remains connected to the live project and therefore cannot display staging orders. The staging startup scripts reject the live project hostname.

The 1.2.0 order response reads the committed delivery fee and timestamp after `create_order`, so the browser receipt and WhatsApp draft use persisted values. Catalog reads include product and option SKUs; the WhatsApp image line is a link to existing public media, with no file upload or WhatsApp API.

In 1.2.1, My Orders keeps the local receipt but refreshes its status through a server-only lookup. A same-origin POST supplies a bounded batch of saved reference and checkout-phone pairs; the server reads Supabase with its secret key and returns only status for exact matches. The browser checks on hydration, focus/visibility return, and once per minute while open. The lookup never returns addresses, line items, or customer details.
