import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '@/src/components/BlogHeader';

export const metadata: Metadata = {
  title: 'Vexa Toys Warranty Policy | Product Warranty in Lebanon',
  description: 'Learn about the Vexa Toys warranty policy in Lebanon, including warranty periods, eligible products, exclusions, defective items, and replacement claims.',
  alternates: { canonical: 'https://vexatoys.com/warranty' },
  openGraph: {
    title: 'Vexa Toys Warranty Policy | Product Warranty in Lebanon',
    description: 'Learn about the Vexa Toys warranty policy in Lebanon, including warranty periods, eligible products, exclusions, defective items, and replacement claims.',
    url: 'https://vexatoys.com/warranty',
    siteName: 'Vexa Toys Lebanon',
    type: 'article',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Toys Warranty Policy' }],
  },
  robots: { index: true, follow: true },
};

const coverageItems = [
  'Defects in materials or workmanship.',
  'Internal mechanism failure caused by a manufacturing defect.',
  'Charging or electronic failure caused by a manufacturing defect.',
  'Motor or functional failure caused by a manufacturing defect.',
];

const exclusions = [
  'Misuse, improper handling, accidents, or dropping the product.',
  'Failure to follow the product\'s instructions.',
  'Incorrect chargers, adapters, batteries, or accessories.',
  'Water or liquid exposure beyond the product\'s stated water-resistance rating.',
  'Improper cleaning, storage, or maintenance.',
  'Use of incompatible lubricants, cleaning products, or other substances.',
  'Normal wear and tear.',
  'Gradual battery capacity loss caused by normal use and aging.',
  'Scratches, discoloration, or other cosmetic changes that do not affect functionality.',
  'Opening, disassembling, modifying, or attempting to repair the product.',
  'Repairs or modifications performed by an unauthorized person.',
  'Change of mind, incorrect product selection, or products that are no longer wanted.',
];

const ineligibleProducts = [
  'Lingerie and apparel.',
  'Certain accessories.',
  'Consumable products.',
  'Single-use products.',
  'Other hygiene-sensitive products.',
];

const importantInformation = [
  'This warranty applies to eligible products purchased directly from Vexa Toys.',
  'Proof of purchase may be required for warranty claims.',
  'Warranty coverage applies to genuine manufacturing defects.',
  'Normal wear and tear is not considered a manufacturing defect.',
  'Warranty coverage does not include damage caused by misuse, improper maintenance, unauthorized repairs, or accidents.',
  'Vexa Toys may request photos or videos before approving a warranty replacement.',
  'Warranty coverage is subject to the specific terms stated on the relevant product page.',
  'This Warranty Policy should be read together with our Refund & Returns Policy and Terms & Conditions.',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Vexa Toys Warranty Policy',
  url: 'https://vexatoys.com/warranty',
  description: 'Vexa Toys product warranty policy for eligible products purchased in Lebanon.',
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

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-[#050101] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader locale="en" />

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78]">Vexa Toys Lebanon</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Warranty Policy</h1>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            At Vexa Toys, we want you to shop with confidence. This Warranty Policy explains the warranty coverage available for eligible products purchased from Vexa Toys in Lebanon, including what is covered, what is not covered, and how to request a warranty replacement.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            This policy should be read together with our{' '}
            <Link href="/returns" className="text-[#ff2d78] underline hover:text-white">
              Refund &amp; Returns Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-[#ff2d78] underline hover:text-white">
              Terms &amp; Conditions
            </Link>.
          </p>
        </header>

        <div className="space-y-8">
          <PolicySection title="Warranty Coverage">
            <p>Eligible Vexa Toys products are covered against genuine manufacturing defects in materials and workmanship during the applicable warranty period.</p>
            <p>If an eligible product stops working because of a manufacturing defect while being used normally and according to the product instructions, we will review the claim and, where approved, arrange a replacement.</p>
            <p>For electronic and rechargeable products, including items containing motors, batteries, or charging systems, the warranty may cover failures caused by a manufacturing defect affecting the product&apos;s normal operation.</p>
          </PolicySection>

          <PolicySection title="Warranty Period">
            <p>The warranty period depends on the product and will be stated on the relevant product page or at checkout.</p>
            <p>Where applicable, eligible products may include a 6-month or 12-month warranty from the date of delivery.</p>
            <p>The warranty applies only to products specifically identified as eligible for warranty coverage.</p>
          </PolicySection>

          <PolicySection title="Products Arriving Damaged or Defective">
            <p>If an item arrives damaged or a product is defective when you receive it, please contact Vexa Toys within 48 hours of delivery.</p>
            <p>Please provide your order number along with clear photos or a short video showing the damage or defect.</p>
            <p>Claims reported after this period may still be considered under an applicable manufacturer&apos;s warranty where the product has an ongoing warranty.</p>
          </PolicySection>

          <PolicySection title="What the Warranty Covers">
            <p>Where applicable, the warranty covers genuine manufacturing defects, including:</p>
            <BulletList items={coverageItems} />
            <p>The product must have been used normally and according to the manufacturer&apos;s instructions.</p>
          </PolicySection>

          <PolicySection title="What the Warranty Does Not Cover">
            <p>The warranty does not cover damage or problems resulting from:</p>
            <BulletList items={exclusions} />
          </PolicySection>

          <PolicySection title="Products Without an Ongoing Warranty">
            <p>Some products are not eligible for an ongoing warranty because of their nature, hygiene requirements, or intended use.</p>
            <p>These may include:</p>
            <BulletList items={ineligibleProducts} />
            <p>If one of these products arrives damaged or defective, it must be reported within 48 hours of delivery, unless a different warranty period is specifically stated on the product page.</p>
          </PolicySection>

          <PolicySection title="How to Submit a Warranty Claim">
            <p>If you believe your product has a manufacturing defect:</p>
            <ol className="list-decimal space-y-2 ps-5 marker:font-bold marker:text-[#ff2d78]">
              <li>Contact Vexa Toys through WhatsApp or email within the applicable warranty period.</li>
              <li>Provide your order number or proof of purchase.</li>
              <li>Explain the issue and when you first noticed it.</li>
              <li>Send clear photos or a video demonstrating the problem when requested.</li>
              <li>Do not open, disassemble, modify, or attempt to repair the product.</li>
            </ol>
            <p>Our team may request additional information or a video to help determine whether the issue is covered by the warranty.</p>
            <p>Once the claim has been reviewed and approved, we will arrange a replacement for the same product where available.</p>
            <p>If the original product is no longer available, we may offer a suitable alternative of equal value or store credit.</p>
          </PolicySection>

          <PolicySection title="Warranty Replacement">
            <p>The standard remedy for an approved warranty claim is a replacement.</p>
            <p>
              Warranty claims do not automatically qualify for a refund. Any refund or return request is handled according to our separate{' '}
              <Link href="/returns" className="text-[#ff2d78] underline hover:text-white">
                Refund &amp; Returns Policy
              </Link>.
            </p>
            <p>Replacement products may be subject to the warranty terms applicable to the replacement item.</p>
          </PolicySection>

          <PolicySection title="Important Information">
            <BulletList items={importantInformation} />
          </PolicySection>

          <PolicySection title="Contact Vexa Toys">
            <p>For warranty claims or questions, please contact us:</p>
            <address className="not-italic text-stone-200">
              WhatsApp: <a className="text-[#ff2d78] hover:text-white" href="https://wa.me/96176730767">+961 76 730 767</a><br />
              Email: Contact Vexa Toys through our website<br />
              Business Hours: Monday–Saturday, 10:00 AM–8:00 PM
            </address>
            <p>Please include your order number when contacting us so we can assist you as quickly as possible.</p>
          </PolicySection>

          <PolicySection title="Shop Vexa Toys in Lebanon">
            <p>Vexa Toys provides discreet online shopping and delivery across Lebanon, with discreet packaging and customer privacy throughout the ordering and delivery process.</p>
            <p>
              By purchasing from Vexa Toys, you acknowledge and agree to this Warranty Policy together with our{' '}
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
            <Link href="/delivery" className="hover:text-white transition">
              Delivery Policy
            </Link>
            <Link href="/warranty" className="font-bold text-[#ff2d78]">
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
