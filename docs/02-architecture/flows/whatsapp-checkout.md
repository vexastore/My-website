# Customer-sent WhatsApp checkout

The storefront first persists an order. Only after the database acknowledges it does the confirmation screen offer a prefilled `wa.me` link to the existing store support number. The customer must press Send in WhatsApp; opening the link is not proof of message delivery. The sent message appears in both participants' chat histories. No WhatsApp API, webhook, template, bot credential, or automated delivery worker is involved.

For the current Firebase implementation, checkout awaits `placeOrder`; failed writes leave the cart intact. During the Supabase cutover, the trusted server order endpoint must return the committed order reference before the link is built. The app cannot observe whether the customer actually sends the message, so the persisted order remains authoritative. The admin PWA Web Push outbox is a separate automatic order alert.

After a real confirmed order, the storefront navigates to the prepared WhatsApp chat automatically and retains a retry link on the receipt. The customer must still press Send in WhatsApp. Isolated mock responses are labeled and never navigate to WhatsApp or create an admin order.
