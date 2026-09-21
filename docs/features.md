# Features

SEO metadata for products, categories, and articles uses published admin overrides when populated, with localized content fallbacks. Canonical product links and the sitemap come from the current Supabase catalog; alternate URLs redirect permanently. Product image alt text uses the admin media fields with a product-name fallback. Schema.org Product structured data outputs `aggregateRating`, verified `review` arrays, and full `Offer` properties (`validFrom`, `priceValidUntil`, `itemCondition`, shipping details, and merchant return policy) unified across SSR and CSR (`lib/productSchema.ts`), satisfying Google Search Console Merchant listings requirements. Each product page displays a visible Customer Reviews section (`src/components/ProductReviews.tsx`) with ratings, Lebanese delivery locations, verified buyer badges, and trust signals. See the [SEO remediation record](09-project/seo-remediation-2026-09-18.md) for limits and validation.

The public storefront defaults to English and offers Arabic through the EN/AR switch. The selection persists across catalog, product, checkout, orders, blog, about, and quiz views. Page direction and server-rendered copy follow the selected language. The catalog toolbar combines a category dropdown, search field, and filter action; the customer-only main navigation has a Products submenu and animated overlay. The homepage has one FAQ section.

The homepage does not expose links to the reserved `/city/*` routes until dedicated city landing pages are implemented, so customers are not sent to city-page 404 responses.

The storefront includes a public `/terms` Terms & Conditions page covering age requirement (18+), lawful website usage, products and product information, availability, pricing, payment (including Cash on Delivery), order acceptance, delivery, discreet packaging, refunds/returns/warranty, customer responsibilities, privacy, intellectual property, website availability, limitation of liability, third-party services, changes, Lebanese governing law, contact channels, and customer agreement. The page is linked from the storefront footer, age verification modal, and policy navigation bar, and includes canonical, JSON-LD WebPage, and Open Graph metadata.

The storefront includes a public `/warranty` policy page covering eligible products, warranty periods, exclusions, damaged or defective arrivals, claim submission, and replacement remedies. The page is linked from the footer and includes canonical and Open Graph metadata.

The storefront also includes a public `/delivery` policy page covering 24/7 service, Beirut and nationwide timing, delivery guarantees, fees, order processing, delays, support, and discreet packaging. The page is linked from the footer and includes canonical and Open Graph metadata.

The storefront includes a public `/privacy` policy page explaining discreet shopping, personal information collection and use, cookies, analytics, third-party sharing, retention, security, privacy rights, marketing choices, and communication services. The page is linked from the footer and includes canonical and Open Graph metadata.

Checkout confirms database persistence before offering a customer-sent WhatsApp order summary. The customer sends it manually to the store and keeps a copy in the chat. See [flow](02-architecture/flows/whatsapp-checkout.md).
# Supabase storefront release 1.3.0

The storefront shows the imported Supabase product catalog and blog content. Cart checkout retains items when the order write fails, and a saved order can be handed to WhatsApp by the customer. The administrator interface lives at `admin.vexatoys.com`. The production cutover is live; a real storefront order is now confirmed in the database and visible in admin.

After real order persistence, checkout opens the store WhatsApp chat with the order prefilled. A development mock instead displays a clear local-test notice and leaves the cart intact.

A guarded staging mode lets a local storefront submit real test transactions to an isolated Supabase branch without changing live customer orders.

The English and Arabic WhatsApp drafts group order reference/date, customer, product lines, optional SKU and public image URL, then subtotal, delivery, and total. Product image links are text links and are omitted when the product has no HTTPS image.

My Orders now displays the authoritative order status, including Confirmed, instead of retaining the status from checkout. It refreshes when the page opens, when the tab becomes active, and every minute while open. If the check fails, the customer sees a retry notice and the last known status. The navbar order panel has a button for the full order detail view.

Published product prices and other catalog fields refresh from Supabase when the customer opens or returns to the tab; archived products are removed from the client catalog. Server-rendered HTML can take up to five minutes to regenerate.

Category buying guides and FAQs are read from the RLS-protected Supabase `category_editorial` table, including `/adult-toys`. The admin editor owns the content. Visible FAQs and FAQ structured data use the same ordered pairs; category pages refresh within five minutes.
