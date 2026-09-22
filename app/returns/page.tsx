import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '@/src/components/BlogHeader';

const pageTitle = 'Refund & Returns Policy | Vexa Toys Lebanon';
const pageDescription =
  'Read the Vexa Toys Refund & Returns Policy covering 7-day unopened returns, 48-hour damaged delivery reporting, hygiene standards, replacements, and discreet returns in Lebanon.';

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: 'https://vexatoys.com/returns' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://vexatoys.com/returns',
    siteName: 'Vexa Toys Lebanon',
    type: 'article',
    images: [
      {
        url: 'https://vexatoys.com/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Vexa Toys Refund & Returns Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexatoys',
    title: pageTitle,
    description: pageDescription,
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 pt-8">
      <h2 className="mb-4 text-xl font-black text-white sm:text-2xl">{title}</h2>
      <div className="space-y-4 text-sm leading-7 text-stone-300">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="list-disc space-y-2 ps-5 marker:text-[#ff2d78]">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageTitle,
  url: 'https://vexatoys.com/returns',
  description: pageDescription,
  publisher: {
    '@type': 'Organization',
    name: 'Vexa Toys Lebanon',
    url: 'https://vexatoys.com',
  },
};

const hygieneItems = [
  'Adult wellness products, vibrators, and intimate toys that have been opened or removed from their factory packaging.',
  'Items with broken hygiene seals, torn protective plastic, or missing tamper-evident wrapping.',
  'Products that have come into direct contact with the body or intimate areas.',
  'Lubricants, cleaning solutions, liquids, or gels with opened caps or broken security seals.',
  'Lingerie, underwear, or wearable intimate garments once the sealed protective bag has been opened.',
];

const eligibleReturnItems = [
  'The product is completely unopened and unused in its original, sealed manufacturer packaging.',
  'All tamper-evident seals, protective wrappers, accessories, and manuals are intact and undamaged.',
  'The return is requested within 7 calendar days of delivery.',
  'Proof of purchase (order reference number or customer phone number) is provided.',
];

const damagedReportingSteps = [
  'Contact Vexa Toys via WhatsApp or email within 48 hours of delivery.',
  'Provide your order number and customer details.',
  'Provide clear photos or a short video demonstrating the defect, transit damage, or incorrect item received.',
  'Keep the original box and discreet shipping packaging until customer support has evaluated the claim.',
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <script
        id="returns-webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHeader locale="en" />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="mb-10 text-center sm:text-start">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff2d78]">Customer Care &amp; Transparency</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">Refund &amp; Returns Policy</h1>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            At Vexa Toys, customer satisfaction, privacy, and hygiene are our highest priorities. Because we offer personal and intimate wellness products, our return policy balances strict public health standards with fair protection against defective items.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            This Refund &amp; Returns Policy should be read together with our{' '}
            <Link href="/terms" className="text-[#ff2d78] underline hover:text-white">
              Terms &amp; Conditions
            </Link>
            ,{' '}
            <Link href="/warranty" className="text-[#ff2d78] underline hover:text-white">
              Warranty Policy
            </Link>
            , and{' '}
            <Link href="/delivery" className="text-[#ff2d78] underline hover:text-white">
              Delivery Policy
            </Link>
            .
          </p>
        </header>

        <div className="space-y-8">
          <PolicySection title="1. Hygiene and Health Safety Standards">
            <p>
              Due to the personal and intimate nature of adult wellness products, strict health, safety, and hygiene standards apply under Lebanese commercial norms and international wellness trade practices.
            </p>
            <p>
              Once a product packaging has been opened, unsealed, or used, it cannot be returned, exchanged, or refunded under any circumstances unless it arrives defective from the manufacturer.
            </p>
            <p>Non-returnable opened items include:</p>
            <BulletList items={hygieneItems} />
          </PolicySection>

          <PolicySection title="2. 7-Day Unopened Returns Window">
            <p>
              If you change your mind about an order, you may request a return within <strong>7 calendar days</strong> from the date of delivery, provided the following conditions are fully met:
            </p>
            <BulletList items={eligibleReturnItems} />
            <p>
              Returns must be pre-authorized by Vexa Toys customer support before any package is handed over to a courier. Unauthorized returns cannot be processed.
            </p>
          </PolicySection>

          <PolicySection title="3. Damaged, Defective, or Incorrect Items (48-Hour Notice)">
            <p>
              We take great care to inspect items and package them in neutral, heavy-duty plain boxes. If your order arrives damaged during transit, defective out of the box, or incorrect, you must report it within <strong>48 hours of delivery</strong>.
            </p>
            <p>To report a damaged or defective item:</p>
            <BulletList items={damagedReportingSteps} />
            <p>
              Once verified, Vexa Toys will arrange a free replacement of the item or issue an exchange at no additional delivery cost to you.
            </p>
          </PolicySection>

          <PolicySection title="4. Manufacturing Defects & Ongoing Warranty Claims">
            <p>
              If a product stops working after the initial 48-hour delivery period due to an internal manufacturing defect (such as motor or battery failure under normal use), it is handled under our dedicated{' '}
              <Link href="/warranty" className="text-[#ff2d78] underline hover:text-white">
                Warranty Policy
              </Link>
              .
            </p>
            <p>
              The primary remedy under warranty is repair or replacement with a brand new unit of the same model. Warranty coverage does not automatically entitle the customer to a cash refund.
            </p>
          </PolicySection>

          <PolicySection title="5. Return Courier & Collection Process in Lebanon">
            <p>
              To maintain our 100% privacy commitment, authorized returns are collected by our discreet local delivery couriers across Lebanon in plain packaging:
            </p>
            <BulletList
              items={[
                'Our team will schedule a discreet courier pickup at your preferred address in Beirut or across Lebanon.',
                'The package must be sealed securely inside an unbranded outer box or bag before handover.',
                'The courier will inspect the outer seal before issuing a collection receipt.',
                'For standard change-of-mind returns on unopened items, a round-trip delivery fee ($3–$5 depending on region) may be deducted from the store credit or refund.',
                'For confirmed defective or incorrect items, Vexa Toys covers all delivery and collection fees.',
              ]}
            />
          </PolicySection>

          <PolicySection title="6. Refund Methods and Store Credit">
            <p>
              Once your returned unopened item is received and inspected at our logistics center:
            </p>
            <BulletList
              items={[
                'Store Credit: Customers may receive store credit voucher codes immediately upon inspection approval, valid on any catalog item with no expiration date.',
                'Cash Refund: For cash-on-delivery orders eligible for refund, refunds are issued via authorized cash transfer services (e.g., OMT / Whish) or direct courier handover within 3–7 business days.',
                'Delivery fees from the original order are non-refundable unless the return was caused by our error or a confirmed defective product.',
              ]}
            />
          </PolicySection>

          <PolicySection title="7. Discretion & Privacy Assurance">
            <p>
              All return inquiries, courier communications, and handovers remain 100% confidential. Neither the courier nor external delivery logs will display product names, photos, or descriptions.
            </p>
          </PolicySection>

          <PolicySection title="8. Contact Customer Care">
            <p>
              To submit a return request, inquire about an exchange, or report a delivery issue, reach out to our dedicated support team:
            </p>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-stone-300">
              <p><strong>Store:</strong> Vexa Toys Lebanon</p>
              <p><strong>WhatsApp Support:</strong> +961 76 669 821 (Fastest response)</p>
              <p><strong>Website:</strong> https://vexatoys.com</p>
              <p><strong>Support Hours:</strong> Monday – Saturday, 10:00 AM – 8:00 PM Beirut Time</p>
            </div>
          </PolicySection>
        </div>
      </div>
    </main>
  );
}
