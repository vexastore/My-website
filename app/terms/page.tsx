import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '@/src/components/BlogHeader';

const pageTitle = 'Vexa Toys Terms & Conditions | Vexa Toys Lebanon';
const pageDescription =
  'Read the Vexa Toys Terms & Conditions covering orders, payments, delivery, discreet packaging, returns, warranty, privacy, website use and purchases in Lebanon.';

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: 'https://vexatoys.com/terms' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://vexatoys.com/terms',
    siteName: 'Vexa Toys Lebanon',
    type: 'article',
    images: [
      {
        url: 'https://vexatoys.com/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Vexa Toys Terms & Conditions',
      },
    ],
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
  url: 'https://vexatoys.com/terms',
  description: pageDescription,
};

const websiteProhibitions = [
  'Use the website in violation of applicable laws or regulations.',
  'Attempt to gain unauthorized access to the website, servers, databases, or other connected systems.',
  'Introduce viruses, malware, malicious code, or other harmful material.',
  'Interfere with the normal operation or security of the website.',
  'Copy, reproduce, modify, or commercially exploit website content without our written permission.',
  'Use automated systems or methods to collect website content without authorization.',
  'Attempt to access another customer’s account or personal information.',
];

const orderCancellationSituations = [
  'Product unavailability.',
  'Incorrect or obvious pricing errors.',
  'Incorrect or incomplete customer information.',
  'An unreachable phone number.',
  'Suspected fraudulent or unauthorized activity.',
  'Duplicate or unusually large orders that require verification.',
  'Circumstances that prevent us from fulfilling the order.',
];

const deliveryFeatures = [
  'Same-day delivery in Beirut for eligible orders.',
  'Delivery within approximately 24–72 hours for other areas of Lebanon.',
  'Discreet packaging for all orders.',
  'Delivery support throughout the week.',
];

const customerResponsibilities = [
  'Providing accurate contact and delivery information.',
  'Providing a reachable phone number.',
  'Being available to receive the order when required.',
  'Using products according to their intended purpose and manufacturer’s instructions.',
  'Following all safety, cleaning, storage, and usage instructions supplied with the product.',
];

const intellectualPropertyItems = [
  'Logos and trademarks.',
  'Product descriptions.',
  'Text and written content.',
  'Images and graphics.',
  'Website design and layout.',
  'Software and other website materials.',
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050101] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale="en" />

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78]">
            Vexa Toys Lebanon
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            Welcome to Vexa Toys. These Terms &amp; Conditions govern your use of our website and your purchase of products from Vexa Toys.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            By accessing our website, browsing our products, or placing an order, you agree to these Terms &amp; Conditions. If you do not agree with these terms, please do not use our website or place an order.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            In these Terms, “Vexa Toys,” “we,” “us,” and “our” refer to Vexa Toys. “You” and “your” refer to the customer or visitor using our website.
          </p>
        </header>

        <div className="space-y-8">
          <PolicySection title="1. Age Requirement — 18+">
            <p>
              Vexa Toys products and website are intended for adults aged 18 years or older.
            </p>
            <p>
              By accessing this website or placing an order, you confirm that you are at least 18 years old and legally permitted to purchase adult and intimate products in your location.
            </p>
            <p>
              We reserve the right to refuse or cancel an order if we have reasonable grounds to believe that the customer does not meet the applicable age requirement.
            </p>
          </PolicySection>

          <PolicySection title="2. Use of Our Website">
            <p>You agree to use the Vexa Toys website lawfully and responsibly.</p>
            <p>You must not:</p>
            <BulletList items={websiteProhibitions} />
            <p>
              We may restrict or terminate access to the website where necessary to protect our business, customers, systems, or website security.
            </p>
          </PolicySection>

          <PolicySection title="3. Products and Product Information">
            <p>
              We make reasonable efforts to ensure that product names, descriptions, images, prices, specifications, colors, and other information displayed on our website are accurate and up to date.
            </p>
            <p>
              However, product images may vary slightly from the actual product due to lighting, photography, screen settings, manufacturing variations, or packaging changes.
            </p>
            <p>
              We reserve the right to correct errors, update product information, change availability, or discontinue products without prior notice.
            </p>
            <p>
              Products sold through Vexa Toys are intended for adult personal use and should only be used according to the manufacturer’s instructions and intended purpose.
            </p>
            <p>
              Vexa Toys does not provide medical advice or make medical claims about products unless specifically stated by the manufacturer and presented for informational purposes.
            </p>
          </PolicySection>

          <PolicySection title="4. Product Availability">
            <p>Product availability may change without notice.</p>
            <p>
              Although we make reasonable efforts to keep our website information accurate, an item may occasionally become unavailable after an order is placed.
            </p>
            <p>
              If an ordered product is unavailable, we may contact you to offer an alternative, adjust the order, or cancel the unavailable item.
            </p>
          </PolicySection>

          <PolicySection title="5. Prices and Payment">
            <p>
              Prices displayed on the Vexa Toys website are generally listed in USD, unless otherwise stated.
            </p>
            <p>Prices and promotions may change without prior notice.</p>
            <p>
              We reserve the right to correct genuine pricing or listing errors. If an order contains an obvious pricing error, we may contact you before completing the order.
            </p>
            <p>
              Available payment methods will be communicated during the ordering process or displayed at checkout.
            </p>
            <p>
              Depending on the order and available payment options, payment methods may include Cash on Delivery and other payment methods offered by Vexa Toys.
            </p>
            <p>An order is considered confirmed once Vexa Toys accepts the order.</p>
          </PolicySection>

          <PolicySection title="6. Orders and Order Acceptance">
            <p>Submitting an order does not automatically guarantee that the order will be accepted.</p>
            <p>
              We reserve the right to refuse, cancel, or modify an order where reasonably necessary, including in situations involving:
            </p>
            <BulletList items={orderCancellationSituations} />
            <p>We may contact you to confirm order details before dispatch.</p>
          </PolicySection>

          <PolicySection title="7. Delivery">
            <p>Vexa Toys provides 24/7 delivery service across Lebanon.</p>
            <p>
              Delivery times and applicable conditions are explained in our separate{' '}
              <Link href="/delivery" className="text-[#ff2d78] underline hover:text-white">
                Delivery Policy
              </Link>
              , which forms part of these Terms &amp; Conditions.
            </p>
            <p>Our standard delivery service may include:</p>
            <BulletList items={deliveryFeatures} />
            <p>
              Where applicable, Vexa Toys provides a delivery guarantee subject to the conditions stated in our{' '}
              <Link href="/delivery" className="text-[#ff2d78] underline hover:text-white">
                Delivery Policy
              </Link>
              .
            </p>
            <p>
              Delivery times may be affected by factors outside our reasonable control, including incorrect delivery information, customer unavailability, severe weather, road closures, or other exceptional circumstances.
            </p>
            <p>
              Please review our{' '}
              <Link href="/delivery" className="text-[#ff2d78] underline hover:text-white">
                Delivery Policy
              </Link>{' '}
              for complete details.
            </p>
          </PolicySection>

          <PolicySection title="8. Discreet Packaging">
            <p>We understand the importance of privacy when purchasing intimate products.</p>
            <p>
              Orders from Vexa Toys are prepared in discreet packaging without unnecessary product information or explicit descriptions displayed on the outside of the package.
            </p>
            <p>
              We take reasonable steps to protect the privacy of your order during preparation and delivery.
            </p>
          </PolicySection>

          <PolicySection title="9. Refunds, Returns and Warranty">
            <p>
              Refunds, returns, replacements, and warranty claims are handled according to our separate policies:
            </p>
            <BulletList
              items={[
                'Refund & Returns Policy',
                <Link key="warranty" href="/warranty" className="text-[#ff2d78] underline hover:text-white">
                  Warranty Policy
                </Link>,
              ]}
            />
            <p>
              For hygiene and safety reasons, certain products may not be eligible for return or refund.
            </p>
            <p>
              Eligible defective or damaged products may qualify for a replacement according to the applicable policy.
            </p>
            <p>Please review the relevant policy before placing an order.</p>
          </PolicySection>

          <PolicySection title="10. Customer Responsibility">
            <p>Customers are responsible for:</p>
            <BulletList items={customerResponsibilities} />
            <p>
              Vexa Toys is not responsible for problems resulting from misuse, improper handling, unauthorized modifications, or failure to follow product instructions.
            </p>
          </PolicySection>

          <PolicySection title="11. Privacy">
            <p>Your privacy is important to us.</p>
            <p>
              Our collection, use, storage, and protection of personal information are explained in our{' '}
              <Link href="/privacy" className="text-[#ff2d78] underline hover:text-white">
                Privacy Policy
              </Link>
              , which forms part of these Terms &amp; Conditions.
            </p>
            <p>
              We are committed to discreet shopping and take reasonable steps to protect customer information and order privacy.
            </p>
          </PolicySection>

          <PolicySection title="12. Intellectual Property">
            <p>All content on the Vexa Toys website, including:</p>
            <BulletList items={intellectualPropertyItems} />
            <p>
              is owned by Vexa Toys or used with appropriate permission or licensing.
            </p>
            <p>
              You may not copy, reproduce, modify, distribute, publish, or commercially use website content without prior written permission from Vexa Toys or the applicable rights holder.
            </p>
          </PolicySection>

          <PolicySection title="13. Website Availability and Security">
            <p>
              We aim to keep the Vexa Toys website available and functioning properly. However, we do not guarantee that the website will always be available, uninterrupted, or completely free from errors.
            </p>
            <p>
              Temporary interruptions may occur because of maintenance, technical issues, hosting problems, security measures, or circumstances outside our reasonable control.
            </p>
            <p>
              You must not attempt to compromise the security or normal operation of the website.
            </p>
          </PolicySection>

          <PolicySection title="14. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, Vexa Toys will not be responsible for indirect, incidental, or consequential losses arising from the use of our website or products.
            </p>
            <p>
              Our liability relating to a specific product or order will, to the extent permitted by law, be limited to the amount paid for the product or order giving rise to the claim.
            </p>
            <p>
              Nothing in these Terms is intended to exclude or limit any liability that cannot legally be excluded or limited under applicable law.
            </p>
            <p>
              Products must be used responsibly and according to their intended purpose and manufacturer’s instructions.
            </p>
          </PolicySection>

          <PolicySection title="15. Third-Party Services and Links">
            <p>
              Our website may use or link to third-party services, websites, payment providers, communication platforms, analytics services, or other external providers.
            </p>
            <p>
              Vexa Toys is not responsible for the content, availability, security, or privacy practices of third-party websites or services.
            </p>
            <p>
              Your use of third-party services may also be subject to their own terms and privacy policies.
            </p>
          </PolicySection>

          <PolicySection title="16. Changes to These Terms">
            <p>
              We may update these Terms &amp; Conditions from time to time to reflect changes to our website, products, services, business practices, or applicable requirements.
            </p>
            <p>
              Updated terms will be published on this page with the revised date where appropriate.
            </p>
            <p>
              Your continued use of the website or placement of orders after updated Terms are published constitutes acceptance of the revised Terms.
            </p>
          </PolicySection>

          <PolicySection title="17. Governing Law">
            <p>These Terms &amp; Conditions are governed by the laws of Lebanon.</p>
            <p>
              Any dispute arising from or relating to these Terms, the Vexa Toys website, or an order placed through Vexa Toys shall be subject to the jurisdiction of the competent courts of Lebanon, unless applicable law provides otherwise.
            </p>
          </PolicySection>

          <PolicySection title="18. Contact Vexa Toys">
            <p>
              If you have questions about these Terms &amp; Conditions, your order, or our policies, please contact us:
            </p>
            <address className="not-italic text-stone-200">
              WhatsApp:{' '}
              <a className="text-[#ff2d78] hover:text-white" href="https://wa.me/96176730767">
                +961 76 730 767
              </a>
              <br />
              Business Hours: Available for customer and order support
            </address>
            <p>Please provide your order number when contacting us about an existing order.</p>
          </PolicySection>

          <PolicySection title="Agreement">
            <p>
              By accessing the Vexa Toys website or placing an order, you confirm that you have read, understood, and agreed to these Terms &amp; Conditions, together with our:
            </p>
            <BulletList
              items={[
                <Link key="delivery" href="/delivery" className="text-[#ff2d78] underline hover:text-white">
                  Delivery Policy
                </Link>,
                'Refund & Returns Policy',
                <Link key="warranty" href="/warranty" className="text-[#ff2d78] underline hover:text-white">
                  Warranty Policy
                </Link>,
                <Link key="privacy" href="/privacy" className="text-[#ff2d78] underline hover:text-white">
                  Privacy Policy
                </Link>,
              ]}
            />
            <p className="pt-2 font-semibold text-stone-200">Effective Date: September 2026</p>
          </PolicySection>
        </div>

        {/* Storewide Policy Quick Links */}
        <nav aria-label="Legal and policies" className="mt-14 border-t border-white/10 pt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            Policies &amp; Legal
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-300">
            <Link href="/terms" className="font-bold text-[#ff2d78]">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/delivery" className="hover:text-white transition">
              Delivery Policy
            </Link>
            <Link href="/warranty" className="hover:text-white transition">
              Warranty Policy
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
