# Features

Checkout confirms database persistence before offering a customer-sent WhatsApp order summary. The customer sends it manually to the store and keeps a copy in the chat. See [flow](02-architecture/flows/whatsapp-checkout.md).
# Supabase storefront release 1.1.0

The storefront shows the imported Supabase product catalog and blog content. Cart checkout retains items when the order write fails, and a saved order can be handed to WhatsApp by the customer. The administrator interface lives at `admin.vexatoys.com`. The production cutover is live; a first real order still needs verification.

After real order persistence, checkout opens the store WhatsApp chat with the order prefilled. A development mock instead displays a clear local-test notice and leaves the cart intact.

A guarded staging mode lets a local storefront submit real test transactions to an isolated Supabase branch without changing live customer orders.
