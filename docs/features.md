# Features

SEO metadata for products, categories, and articles uses published admin overrides (`canonical_url_override` and `og_image_url`) when populated, with localized content fallbacks. Canonical product links and the sitemap respect manual canonical URL overrides when set; alternate URLs redirect permanently. Product image alt text uses admin media alt fields (`alt_en`, `alt_ar`) with a product-name fallback. Schema.org Product structured data outputs `aggregateRating`, verified `review` arrays, and full `Offer` properties (`validFrom`, `priceValidUntil`, `itemCondition`, shipping details, and `hasMerchantReturnPolicy` linking to `https://vexatoys.com/returns`) unified across SSR and CSR (`lib/productSchema.ts`), satisfying Google Search Console Merchant listings requirements. When a product has no approved real reviews, `aggregateRating` and `review` arrays are omitted completely to prevent fabricating fallback ratings. See the [SEO remediation record](09-project/seo-remediation-2026-09-18.md) for limits and validation.

Each product page displays a database-backed Customer Reviews section (`src/components/ProductReviews.tsx`). Reviews are stored in Supabase `product_reviews` and moderated in admin. Verified buyer badges are derived exclusively through server lookup of completed orders matching order reference and customer phone; users cannot arbitrarily claim verified status. An interactive "Write a Review" modal allows customers to submit reviews via `/api/reviews` (calling RPC `submit_product_review`). If no approved reviews exist yet, a clean empty state is displayed inviting the first review.

Catalog cards use the same database aggregate as the product page. A product with no approved reviews displays empty stars and `No reviews yet`; it never receives a fallback score or review count. The product-page summary links to the review section so the submission workflow is discoverable without permitting administrators to type arbitrary product ratings.

The public storefront defaults to English and offers Arabic through the EN/AR switch. The selection persists across catalog, product, checkout, orders, blog, about, quiz, and returns views. Page direction and server-rendered copy follow the selected language. The catalog toolbar combines a category dropdown, search field, and filter action; the customer-only main navigation has a Products submenu and animated overlay. The homepage has one FAQ section.

The homepage does not expose links to the reserved `/city/*` routes until dedicated city landing pages are implemented, so customers are not sent to city-page 404 responses.

The storefront includes a public `/returns` Refund & Returns Policy page covering hygiene and health policy, defective or damaged arrivals, 48-hour return window, reporting procedure via WhatsApp, inspection and replacement/credit remedies, non-returnable items, and return shipping logistics. The page is linked from the storefront footer and policy navigation bar, includes canonical URL (`https://vexatoys.com/returns`), JSON-LD WebPage schema, and Open Graph metadata, and handles redirects from `/refund-returns` and `/returns-policy`.

The storefront includes a public `/terms` Terms & Conditions page covering age requirement (18+), lawful website usage, products and product information, availability, pricing, payment (including Cash on Delivery), order acceptance, delivery, discreet packaging, refunds/returns/warranty (with direct links to `/returns`), customer responsibilities, privacy, intellectual property, website availability, limitation of liability, third-party services, changes, Lebanese governing law, contact channels, and customer agreement. The page is linked from the storefront footer, age verification modal, and policy navigation bar, and includes canonical, JSON-LD WebPage, and Open Graph metadata.

The storefront includes a public `/warranty` policy page covering eligible products, warranty periods, exclusions, damaged or defective arrivals (linking directly to `/returns`), claim submission, and replacement remedies. The page is linked from the footer and includes canonical and Open Graph metadata.

The storefront also includes a public `/delivery` policy page covering 24/7 service, Beirut and nationwide timing, delivery guarantees, fees, order processing, delays, support, returns handoff (linking to `/returns`), and discreet packaging. The page is linked from the footer and includes canonical and Open Graph metadata.

The storefront includes a public `/privacy` policy page explaining discreet shopping, personal information collection and use, cookies, analytics, third-party sharing, retention, security, privacy rights, marketing choices, and communication services. The page is linked from the footer and includes canonical and Open Graph metadata.

Checkout confirms database persistence before offering a customer-sent WhatsApp order summary. The customer sends it manually to the store and keeps a copy in the chat. See [flow](02-architecture/flows/whatsapp-checkout.md).

Checkout and `/api/orders` share the same address boundary (4–500 trimmed characters). Invalid short addresses are rejected locally before submission, while catalog/variant conflicts returned by the server show a cart-refresh instruction and retain the cart.

Checkout country-code and city selection use custom dark popovers rather than native browser selects. Both controls expose combobox/listbox semantics, keyboard navigation, visible selected states, outside-click dismissal, and English/Arabic labels while preserving the same saved phone and city values.
# Supabase storefront release 1.3.0

The storefront shows the imported Supabase product catalog and blog content. Cart checkout retains items when the order write fails, and a saved order can be handed to WhatsApp by the customer. The administrator interface lives at `admin.vexatoys.com`. The production cutover is live; a real storefront order is now confirmed in the database and visible in admin.

After real order persistence, checkout opens the store WhatsApp chat with the order prefilled. A development mock instead displays a clear local-test notice and leaves the cart intact.

A guarded staging mode lets a local storefront submit real test transactions to an isolated Supabase branch without changing live customer orders.

The English and Arabic WhatsApp drafts group order reference/date, customer, product lines, optional SKU and public image URL, then subtotal, delivery, and total. Product image links are text links and are omitted when the product has no HTTPS image.

My Orders now displays the authoritative order status, including Confirmed, instead of retaining the status from checkout. It refreshes when the page opens, when the tab becomes active, and every minute while open. If the check fails, the customer sees a retry notice and the last known status. The navbar order panel has a button for the full order detail view.

Published product prices and other catalog fields refresh from Supabase when the customer opens or returns to the tab; archived products are removed from the client catalog. Server-rendered HTML can take up to five minutes to regenerate.

Category buying guides and FAQs are read from the RLS-protected Supabase `category_editorial` table, including `/adult-toys`. The admin editor owns the content. Visible FAQs and FAQ structured data use the same ordered pairs; category pages refresh within five minutes.
