# Features

Checkout confirms database persistence before offering a customer-sent WhatsApp order summary. The customer sends it manually to the store and keeps a copy in the chat. See [flow](02-architecture/flows/whatsapp-checkout.md).
# Supabase storefront release 1.3.0

The storefront shows the imported Supabase product catalog and blog content. Cart checkout retains items when the order write fails, and a saved order can be handed to WhatsApp by the customer. The administrator interface lives at `admin.vexatoys.com`. The production cutover is live; a real storefront order is now confirmed in the database and visible in admin.

After real order persistence, checkout opens the store WhatsApp chat with the order prefilled. A development mock instead displays a clear local-test notice and leaves the cart intact.

A guarded staging mode lets a local storefront submit real test transactions to an isolated Supabase branch without changing live customer orders.

The English and Arabic WhatsApp drafts group order reference/date, customer, product lines, optional SKU and public image URL, then subtotal, delivery, and total. Product image links are text links and are omitted when the product has no HTTPS image.

My Orders now displays the authoritative order status, including Confirmed, instead of retaining the status from checkout. It refreshes when the page opens, when the tab becomes active, and every minute while open. If the check fails, the customer sees a retry notice and the last known status. The navbar order panel has a button for the full order detail view.

Category buying guides and FAQs are read from the RLS-protected Supabase `category_editorial` table, including `/adult-toys`. The admin editor owns the content. Visible FAQs and FAQ structured data use the same ordered pairs; category pages refresh within five minutes.
