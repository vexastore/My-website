import { Metadata } from 'next';
import { CATEGORY_META } from '@/lib/categoryMeta';

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: 'متجر فيكسا | رقم 1 في لبنان للألعاب الزوجية واللانجري',
  description: '500+ adult products shipped discreetly across Lebanon — plain sealed boxes, no logo. Vibrators, Dildos, Lingerie & more. Same-day Beirut delivery, cash on delivery. Your privacy is guaranteed.',
  keywords: 'sex toys lebanon, vibrators lebanon, dildos lebanon, masturbators lebanon, adult toys lebanon, lingerie beirut, vexa store, ألعاب زوجية لبنان, هزازات لبنان, العاب جنسيه لبنان',
  alternates: { canonical: 'https://vexatoys.com' },
  openGraph: {
    type: 'website',
    locale: 'ar_LB',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: 'متجر فيكسا | ألعاب زوجية ولانجري في لبنان',
    description: '500+ adult products shipped discreetly across Lebanon — plain sealed boxes, no logo. Same-day Beirut delivery, cash on delivery.',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon' }],
  },
  twitter: { card: 'summary_large_image', site: '@vexastore', images: ['https://vexatoys.com/opengraph.jpg'] },
  robots: { index: true, follow: true },
};

const BASE = 'https://vexatoys.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Vexa Store Lebanon',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/vexa-logo.png` },
      contactPoint: { '@type': 'ContactPoint', telephone: '+96176730767', contactType: 'customer service', availableLanguage: ['Arabic', 'English'] },
      sameAs: ['https://wa.me/96176730767'],
      address: { '@type': 'PostalAddress', addressCountry: 'LB', addressLocality: 'Beirut' },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Vexa Store Lebanon',
      publisher: { '@id': `${BASE}/#organization` },
    },
  ],
};

const TOP_CATEGORIES = [
  { slug: 'sex-toys',    label: 'Sex Toys',       labelAr: 'ألعاب جنسية' },
  { slug: 'vibrators',   label: 'Vibrators',      labelAr: 'هزازات' },
  { slug: 'dildos',      label: 'Dildos',         labelAr: 'ديلدو' },
  { slug: 'male-toys',   label: 'Male Toys',      labelAr: 'ألعاب رجالية' },
  { slug: 'lingerie',    label: 'Lingerie',       labelAr: 'لانجري' },
  { slug: 'bdsm',        label: 'BDSM',           labelAr: 'BDSM' },
  { slug: 'anal-toys',   label: 'Anal Toys',      labelAr: 'ألعاب شرجية' },
  { slug: 'adult-toys',  label: 'Adult Toys',     labelAr: 'ألعاب للكبار' },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#050101] text-white">

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-14 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-500 mb-5">
            Lebanon&apos;s #1 Adult Store
          </p>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-6">
            متجر فيكسا لبنان
            <span className="block text-2xl sm:text-3xl text-stone-400 font-bold mt-2">
              Vexa Store Lebanon
            </span>
          </h1>
          <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            500+ adult products shipped discreetly across Lebanon.
            Plain sealed boxes — no logo, no branding.
            Same-day delivery in Beirut. Cash on delivery.
            <span className="block mt-1 text-stone-500 text-sm">
              خصوصيتك مضمونة · التوصيل سري · الدفع عند الاستلام
            </span>
          </p>
          <a
            href="/sex-toys"
            className="inline-flex items-center gap-2 bg-white text-black font-black text-sm px-8 py-3.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.97]"
          >
            تسوّق الآن · Shop Now →
          </a>
        </section>

        {/* Categories */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6 text-center">
            Shop by Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOP_CATEGORIES.map(cat => (
              <a
                key={cat.slug}
                href={`/${cat.slug}`}
                className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center hover:border-white/25 hover:bg-white/[0.06] transition"
              >
                <p className="font-black text-white text-sm">{cat.label}</p>
                <p className="text-stone-500 text-xs mt-0.5">{cat.labelAr}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-10 text-center">
              Why Vexa Store?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: '100% Discreet Delivery', titleAr: 'توصيل سري 100%', body: 'Plain sealed box — no logo, no indication of contents. Nobody knows what\'s inside.' },
                { title: 'Cash on Delivery', titleAr: 'الدفع عند الاستلام', body: 'No credit card needed. Pay cash when your order arrives at your door.' },
                { title: 'Same-Day in Beirut', titleAr: 'توصيل يوم التوصيل في بيروت', body: 'Order before 2 PM and receive your package today in Beirut and suburbs.' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <p className="font-black text-white text-sm mb-1">{item.title}</p>
                  <p className="text-stone-500 text-xs mb-3">{item.titleAr}</p>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO text */}
        <section className="border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 py-14">
            <h2 className="text-xl font-black text-white mb-4">
              Sex Toys Lebanon — متجر فيكسا لبنان
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              Vexa Store is Lebanon&apos;s largest online adult store, delivering 500+ premium sex toys and lingerie
              discreetly across Lebanon. Whether you&apos;re in Beirut, Tripoli, Sidon, or any other region,
              we ship same-day or within 24–72 hours in a plain sealed box with no logo.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              متجر فيكسا هو أكبر متجر للألعاب الجنسية في لبنان. نوصّل 500+ منتج بشكل سري تام في صندوق مغلق
              بدون شعار إلى بيروت وكل لبنان. الدفع عند الاستلام متاح دون الحاجة لبطاقة ائتمان.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
