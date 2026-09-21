import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '@/src/components/BlogHeader';

const pageTitle = 'Vexa Toys Privacy Policy | Privacy & Discreet Shopping Lebanon';
const pageDescription = 'Read the Vexa Toys Privacy Policy to learn how we collect, use and protect customer information, including orders, payments, delivery and discreet shopping in Lebanon.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: 'https://vexatoys.com/privacy' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://vexatoys.com/privacy',
    siteName: 'Vexa Toys Lebanon',
    type: 'article',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Toys Privacy Policy' }],
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
  url: 'https://vexatoys.com/privacy',
  description: pageDescription,
};

const contactOrderItems = [
  'Name',
  'Phone number',
  'Email address, when provided',
  'Delivery address',
  'Order details',
  'Products purchased',
  'Order value',
  'Order history',
  'Information necessary to process or deliver your order',
];

const technicalItems = [
  'IP address',
  'Browser type',
  'Device type',
  'Operating system',
  'Pages visited',
  'Referring pages',
  'General website usage information',
  'Cookies and similar technologies',
];

const useItems = [
  'Process and confirm your orders.',
  'Prepare and deliver your purchases.',
  'Contact you regarding your order.',
  'Provide delivery updates when necessary.',
  'Respond to customer questions and requests.',
  'Provide customer support.',
  'Process payments through available payment providers.',
  'Improve our website, products, and services.',
  'Maintain website security and prevent fraudulent or unauthorized activity.',
  'Manage customer records and order history.',
  'Comply with applicable legal or regulatory requirements.',
  'Send promotional offers or updates where you have agreed to receive them.',
];

const privacyRights = [
  'Request access to personal information we hold about you.',
  'Request correction of inaccurate or outdated information.',
  'Request deletion of certain personal information where applicable.',
  'Withdraw consent for certain uses of your information.',
  'Opt out of promotional communications.',
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050101] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale="en" />

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78]">Vexa Toys Lebanon</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            At Vexa Toys, we respect your privacy and understand the importance of discretion when shopping online. This Privacy Policy explains what personal information we may collect, how we use it, how we protect it, and the choices available to you.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            By using the Vexa Toys website or placing an order, you acknowledge the practices described in this Privacy Policy.
          </p>
        </header>

        <div className="space-y-8">
          <PolicySection title="Our Commitment to Privacy and Discretion">
            <p>In this policy, “Vexa Toys,” “we,” “us,” and “our” refer to Vexa Toys.</p>
            <p>We understand that the products available through Vexa Toys are personal and sensitive.</p>
            <p>We handle customer information with care and use it only for legitimate business purposes, such as processing orders, arranging delivery, providing customer support, maintaining website security, and improving our services.</p>
            <p>Orders are prepared using discreet packaging without unnecessary information about the products or the nature of your purchase displayed on the outside of the package.</p>
            <p>We do not sell your personal information.</p>
          </PolicySection>

          <PolicySection title="Information We Collect">
            <p>Depending on how you use our website and services, we may collect the following information:</p>
            <h3 className="pt-2 text-base font-black text-white">Contact and Order Information</h3>
            <p>When you place an order or contact us, we may collect:</p>
            <BulletList items={contactOrderItems} />
            <h3 className="pt-2 text-base font-black text-white">Website and Technical Information</h3>
            <p>When you visit our website, certain technical information may be collected automatically, such as:</p>
            <BulletList items={technicalItems} />
            <p>This information may be used to understand how visitors use our website, improve website performance, and maintain security.</p>
            <h3 className="pt-2 text-base font-black text-white">Communications</h3>
            <p>If you contact Vexa Toys through WhatsApp, email, forms, or other communication channels, we may retain information from those communications in order to respond to your request and provide customer support.</p>
          </PolicySection>

          <PolicySection title="How We Use Your Information">
            <p>We may use your information to:</p>
            <BulletList items={useItems} />
            <p>We only use personal information for purposes reasonably connected to operating Vexa Toys and providing our services.</p>
          </PolicySection>

          <PolicySection title="Cookies and Analytics">
            <p>Vexa Toys may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage, and improve the customer experience.</p>
            <p>We may also use analytics services, such as Google Analytics, to understand website traffic and how visitors interact with our website.</p>
            <p>Depending on your browser and device settings, you may be able to control or disable cookies. Disabling certain cookies may affect some website functionality.</p>
          </PolicySection>

          <PolicySection title="Sharing Your Information">
            <p>We do not sell or rent your personal information.</p>
            <p>We may share limited information with trusted third parties when necessary to operate Vexa Toys and provide our services.</p>
            <h3 className="pt-2 text-base font-black text-white">Delivery Providers</h3>
            <p>We may provide the necessary contact and delivery information to couriers or delivery partners so that your order can be delivered.</p>
            <h3 className="pt-2 text-base font-black text-white">Payment Providers</h3>
            <p>When you choose an available electronic payment method, relevant payment information may be processed by the applicable payment provider.</p>
            <h3 className="pt-2 text-base font-black text-white">Website and Technology Providers</h3>
            <p>We may use third-party providers for services such as website hosting, storage, analytics, communications, security, and other technical services required to operate our website.</p>
            <h3 className="pt-2 text-base font-black text-white">Legal Requirements</h3>
            <p>We may disclose information when required by applicable law, legal process, court order, or a lawful request from an authorized authority.</p>
            <p>We only share information that is reasonably necessary for the relevant purpose.</p>
          </PolicySection>

          <PolicySection title="Data Retention">
            <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy.</p>
            <p>Order and transaction information may be retained for customer service, accounting, legal, security, and business record-keeping purposes.</p>
            <p>When information is no longer required, we may delete or securely dispose of it where appropriate.</p>
          </PolicySection>

          <PolicySection title="Data Security">
            <p>We take reasonable technical and organizational measures to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.</p>
            <p>However, no website, electronic transmission, or online storage system can be guaranteed to be completely secure. For this reason, we cannot guarantee absolute security of information transmitted over the internet.</p>
          </PolicySection>

          <PolicySection title="Your Privacy Choices and Rights">
            <p>Depending on applicable law and your circumstances, you may have rights regarding your personal information, including the ability to:</p>
            <BulletList items={privacyRights} />
            <p>To make a privacy-related request, contact Vexa Toys using the contact information below.</p>
          </PolicySection>

          <PolicySection title="Marketing Communications">
            <p>If you choose to receive promotional messages, offers, or updates from Vexa Toys, you may opt out at any time.</p>
            <p>You can unsubscribe from marketing communications by following the unsubscribe instructions where available, replying to a promotional message to request removal, or contacting us directly.</p>
            <p>Opting out of marketing communications does not prevent us from contacting you when necessary to process or support an existing order.</p>
          </PolicySection>

          <PolicySection title="WhatsApp and Other Communication Services">
            <p>Vexa Toys may use WhatsApp or other communication platforms to communicate with customers regarding orders, delivery, customer support, or other services.</p>
            <p>Information shared through these platforms may also be subject to the privacy policies and terms of the relevant platform provider.</p>
            <p>We recommend reviewing the privacy policies of third-party communication services you use.</p>
          </PolicySection>

          <PolicySection title="Third-Party Websites">
            <p>Our website may contain links to third-party websites, services, or platforms.</p>
            <p>Vexa Toys is not responsible for the privacy practices, security, or content of third-party websites.</p>
            <p>We recommend reviewing the privacy policy of any third-party website before providing personal information.</p>
          </PolicySection>

          <PolicySection title="Children&apos;s Privacy">
            <p>Vexa Toys is intended for adults and does not knowingly collect personal information from children.</p>
            <p>If you believe that a child has provided personal information to us, please contact us so that we can review the situation and take appropriate action where necessary.</p>
          </PolicySection>

          <PolicySection title="Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes to our website, services, business practices, or applicable requirements.</p>
            <p>Any updated version will be published on this page with a revised effective date.</p>
            <p>We encourage you to review this page periodically to stay informed about how we handle personal information.</p>
          </PolicySection>

          <PolicySection title="Contact Vexa Toys">
            <p>If you have questions about this Privacy Policy, your personal information, or our privacy practices, please contact us:</p>
            <address className="not-italic text-stone-200">
              WhatsApp: <a className="text-[#ff2d78] hover:text-white" href="https://wa.me/96176730767">+961 76 730 767</a><br />
              Email: Contact Vexa Toys through our website<br />
              Business Hours: Available for customer support and order inquiries
            </address>
            <p>When contacting us about personal information, please provide enough information for us to identify your request and assist you appropriately.</p>
          </PolicySection>

          <PolicySection title="Effective Date">
            <p>September 2026</p>
            <p>By using the Vexa Toys website or placing an order, you acknowledge that you have read and understood this Privacy Policy.</p>
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
            <Link href="/privacy" className="font-bold text-[#ff2d78]">
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
