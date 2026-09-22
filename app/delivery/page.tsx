import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '@/src/components/BlogHeader';

const pageTitle = 'Vexa Toys Delivery Policy | 24/7 Discreet Delivery in Lebanon';
const pageDescription = 'Vexa Toys offers 24/7 discreet delivery across Lebanon, including same-day delivery in Beirut and 24–72 hour nationwide delivery. Learn about our delivery guarantee, fees and order process.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: 'https://vexatoys.com/delivery' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://vexatoys.com/delivery',
    siteName: 'Vexa Toys Lebanon',
    type: 'article',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Toys Delivery Policy' }],
  },
  robots: { index: true, follow: true },
};

const deliveryDelays = [
  'Severe weather conditions.',
  'Road closures or exceptional traffic.',
  'Incorrect or incomplete delivery information.',
  'An unreachable phone number.',
  'Customer unavailability at the agreed delivery location.',
  'Unexpected courier or operational issues.',
  'Other circumstances outside our reasonable control.',
];

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 pt-8">
      <h2 className="mb-4 text-xl font-black text-white sm:text-2xl">{title}</h2>
      <div className="space-y-4 text-sm leading-7 text-stone-300">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 ps-5 marker:text-[#ff2d78]">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageTitle,
  url: 'https://vexatoys.com/delivery',
  description: pageDescription,
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[#050101] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale="en" />

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78]">Vexa Toys Lebanon</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Delivery Policy</h1>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            At Vexa Toys, we provide fast, reliable, and discreet delivery across Lebanon, with 24/7 delivery service and a delivery guarantee for eligible orders.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Your privacy is important to us. Every order is prepared in discreet packaging with no indication of the products inside.
          </p>
        </header>

        <div className="space-y-8">
          <PolicySection title="24/7 Delivery Across Lebanon">
            <p>Vexa Toys offers 24/7 delivery, including weekends and holidays, subject to courier availability and the delivery conditions applicable to your location.</p>
            <p>Our delivery service is designed to make ordering from Vexa Toys convenient, private, and reliable wherever you are in Lebanon.</p>
          </PolicySection>

          <PolicySection title="Delivery Areas & Timing">
            <h3 className="text-base font-black text-white">Beirut — Same-Day Delivery</h3>
            <p>Orders placed in Beirut are generally eligible for same-day delivery when the product is in stock and the order is confirmed within our same-day delivery window.</p>
            <p>Our team will confirm the expected delivery time when your order is processed.</p>
            <h3 className="pt-2 text-base font-black text-white">Outside Beirut — Nationwide Delivery</h3>
            <p>We deliver across Lebanon, including major cities, towns, and surrounding areas.</p>
            <p>Orders outside Beirut are generally delivered within 24–72 hours after confirmation, depending on the delivery location and courier route.</p>
          </PolicySection>

          <PolicySection title="Delivery Guarantee">
            <p>We stand behind our delivery service and provide a delivery guarantee for eligible orders.</p>
            <p>If your order cannot be delivered within the applicable guaranteed delivery timeframe due to an issue under our control, please contact us so our team can review the order and assist you.</p>
            <p>The delivery guarantee does not apply to delays caused by circumstances outside our reasonable control, including incorrect delivery information, an unreachable phone number, refusal or unavailability at the delivery address, severe road conditions, or other exceptional circumstances.</p>
          </PolicySection>

          <PolicySection title="Discreet Packaging">
            <p>Every Vexa Toys order is prepared in 100% discreet packaging.</p>
            <p>Our packages do not display explicit product names or descriptions, and the outside of the package does not identify the nature of your purchase.</p>
            <p>We take reasonable steps to protect your privacy throughout the delivery process.</p>
          </PolicySection>

          <PolicySection title="Delivery Fees">
            <p>Delivery fees depend on the delivery location and order.</p>
            <p>The applicable delivery fee will be communicated or displayed before your order is confirmed.</p>
            <p>Promotional offers, including free delivery offers, may have their own terms and conditions.</p>
          </PolicySection>

          <PolicySection title="Order Processing">
            <p>After you place an order, our team confirms the order details and prepares the available products for delivery.</p>
            <p>Once confirmed:</p>
            <ol className="list-decimal space-y-2 ps-5 marker:font-bold marker:text-[#ff2d78]">
              <li>Your products are prepared.</li>
              <li>Your order is securely and discreetly packaged.</li>
              <li>The order is assigned for delivery.</li>
              <li>The courier may contact you to coordinate delivery.</li>
              <li>Your order is delivered to the agreed location.</li>
            </ol>
            <p>Delivery times are calculated from the time your order is confirmed.</p>
          </PolicySection>

          <PolicySection title="Receiving Your Order">
            <p>Please make sure that the phone number provided with your order is reachable and that someone is available to receive the package.</p>
            <p>If the courier cannot reach you, we will attempt to contact you to arrange delivery.</p>
            <p>Providing an accurate address and reachable phone number helps us complete your delivery as quickly as possible.</p>
          </PolicySection>

          <PolicySection title="Changing Your Delivery Information">
            <p>If you need to change your delivery address or contact information after placing an order, contact Vexa Toys as soon as possible.</p>
            <p>Once an order has been dispatched, changes may not always be possible and could affect the delivery time.</p>
          </PolicySection>

          <PolicySection title="Delivery Delays">
            <p>Our 24/7 delivery service allows us to process and deliver orders throughout the week. However, exceptional circumstances may occasionally affect delivery times.</p>
            <p>These may include:</p>
            <BulletList items={deliveryDelays} />
            <p>If an issue affects your order, our team will work with you to arrange delivery as soon as possible.</p>
          </PolicySection>

          <PolicySection title="Delivery Support">
            <p>For questions about your order or delivery, contact Vexa Toys:</p>
            <address className="not-italic text-stone-200">
              WhatsApp: <a className="text-[#ff2d78] hover:text-white" href="https://wa.me/96176730767">+961 76 730 767</a><br />
              Business Hours: Available 24/7 for delivery-related orders and support.
            </address>
            <p>Please provide your order number when contacting us so we can assist you quickly.</p>
          </PolicySection>

          <PolicySection title="Discreet Delivery Across Lebanon">
            <p>Vexa Toys provides discreet delivery across Lebanon, with privacy-focused packaging and a convenient online ordering experience.</p>
            <p>Our goal is to make every order simple, private, and reliable from the moment it is placed until it reaches you.</p>
            <p>
              By placing an order with Vexa Toys, you acknowledge and agree to this Delivery Policy together with our{' '}
              <Link href="/returns" className="text-[#ff2d78] underline hover:text-white">
                Refund &amp; Returns Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-[#ff2d78] underline hover:text-white">
                Terms &amp; Conditions
              </Link>.
            </p>
          </PolicySection>
        </div>

        {/* Storewide Policy Quick Links */}
        <nav aria-label="Legal and policies" className="mt-14 border-t border-white/10 pt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            Policies &amp; Legal
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-300">
            <Link href="/terms" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/delivery" className="font-bold text-[#ff2d78]">
              Delivery Policy
            </Link>
            <Link href="/warranty" className="hover:text-white transition">
              Warranty Policy
            </Link>
            <Link href="/returns" className="hover:text-white transition">
              Refund &amp; Returns Policy
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
