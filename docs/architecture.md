# Architecture

The public SEO readers map published Supabase products, categories, articles, and product-media alt fields into server metadata and schema. Sitemap generation uses the same canonical product-path helper as links and product pages, and database update timestamps instead of a daily synthetic timestamp. Alias paths use permanent redirects. The locale cookie controls rendered metadata and document direction, but both languages currently share the English-default canonical URL; no hreflang is emitted until distinct Arabic routes exist. See the [SEO remediation record](09-project/seo-remediation-2026-09-18.md).

Storefront language is a preference stored in the `vexa_store_language` same-site cookie. Server components read it through `getStoreLocale`; the client provider receives `initialLocale`, and language controls update the cookie before reloading. English is the default. This keeps root `lang`/`dir`, rendered copy, and locale-specific metadata aligned. Category and blog detail routes resolve the cookie at request time while their data readers retain the existing five-minute Supabase cache. Locale choice does not change the URL, so canonical URLs stay unchanged and no hreflang alternate is advertised. Admin-managed category editorial currently has English-only guide/FAQ fields; Arabic category pages show Arabic category metadata and a general delivery answer until translated editorial fields are added.

The public checkout persists orders before showing the WhatsApp send link. WhatsApp is a customer-initiated handoff; the admin PWA Web Push pipeline independently alerts subscribed staff about committed Supabase orders. See [flow](02-architecture/flows/whatsapp-checkout.md).
# Supabase storefront production architecture (17 September 2026)

The Next.js storefront reads published catalog rows, article content, and public settings through Supabase's publishable key and RLS. `/api/orders` is the customer write boundary; it calls the transactional `create_order` RPC with a server-only secret. The client receives a receipt and WhatsApp handoff only after the RPC succeeds. `/admin` sends administrators to the separate admin application. This is the production cutover architecture. A real storefront order has since been observed confirmed in Supabase and admin.

Category pages read guide text and ordered FAQs from the public-read, admin-write `category_editorial` table. The page reuses those FAQs for visible content and JSON-LD, caches for up to five minutes, and has no bundled guide fallback. Product image reads prefer Supabase Storage paths after verified migration and continue to accept existing Vercel Blob URLs during the rollback window.

Legacy Firebase-backed Vercel functions under `api/`, the old local admin component, and the Firebase client package are retired in production. Historical standalone migration scripts remain under `scripts/`; they are not imported by the runtime. The two imported size-option sets have zero price delta today, but the live RPC validates options and calculates nonzero deltas when configured.

A successful real RPC response is the only trigger for the browser to navigate to `wa.me`. Before leaving, the receipt and emptied cart are written to local storage. `LOCAL_CHECKOUT_MOCK=true` is a development-only marker for isolated UI tests; simulated orders do not alter local order history or reach the admin.

Staging runs the storefront and admin locally against one isolated Supabase branch. Production `admin.vexatoys.com` remains connected to the live project and therefore cannot display staging orders. The staging startup scripts reject the live project hostname.

The 1.2.0 order response reads the committed delivery fee and timestamp after `create_order`, so the browser receipt and WhatsApp draft use persisted values. Catalog reads include product and option SKUs; the WhatsApp image line is a link to existing public media, with no file upload or WhatsApp API.

In 1.2.1, My Orders keeps the local receipt but refreshes its status through a server-only lookup. A same-origin POST supplies a bounded batch of saved reference and checkout-phone pairs; the server reads Supabase with its secret key and returns only status for exact matches. The browser checks on hydration, focus/visibility return, and once per minute while open. The lookup never returns addresses, line items, or customer details.

## Catalog freshness

The admin writes product rows to the same Supabase project the storefront reads. The public `GET /api/products` route reads published rows directly with a no-store response so a page load or tab return receives current values. The client replaces both its catalog and any selected product with the refreshed row, or clears a selected product that has been archived. Server-rendered category/product HTML and SEO metadata still use a five-minute incremental cache. No cross-repository push invalidation is installed.
