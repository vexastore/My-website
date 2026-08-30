import { Metadata } from 'next';
import Link from 'next/link';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CITY_META } from '@/lib/cityMeta';
import { ShopApp } from '@/src/ShopApp';

export const revalidate = 3600;

const SITE_TITLE = 'Premium Intimate Wellness & Couples Care | Vexa Store Lebanon';
const SITE_DESC = 'Lebanon\'s #1 premium intimate wellness store. Shop luxury personal massagers, couples essentials, and elegant lingerie. Rated 4.9/5 by 1,900+ clients. 100% discreet same-day delivery across Beirut & all Lebanon. Cash on delivery.';

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    // Core high-volume search targets (kept in metadata only, never in visible body copy)
    'sex toys lebanon',
    'sex toys in lebanon',
    'adult store beirut',
    'adult toys lebanon',
    'vibrators lebanon',
    'dildos lebanon',
    // High-end legal euphemisms — safe, premium, brand-forward
    'intimate wellness lebanon',
    'luxury personal massagers beirut',
    'couples intimacy products',
    'premium lingerie beirut',
    'vexa store',
    'vexa store lebanon',
    // Culturally compliant Arabic keywords
    'ألعاب زوجية لبنان',
    'منتجات متزوجين بيروت',
    'هدايا للمتزوجين لبنان',
    'متجر سري لبنان',
    'مقويات زوجية لبنان',
  ],
  alternates: { canonical: 'https://vexatoys.com' },
  openGraph: {
    type: 'website',
    locale: 'ar_LB',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: SITE_TITLE,
    description: 'Discover luxury personal massagers, elegant lingerie, and couples essentials. 100% discreet same-day delivery and private packaging across Lebanon. Cash on delivery.',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon — Premium Intimate Wellness' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const BASE = 'https://vexatoys.com';

// FAQ content — shown both as visible copy (below) and as FAQPage schema so
// Google can surface these as expandable rich-result questions under the
// homepage listing. Never mark up hidden-only text — this exact copy is
// rendered in the FAQ_ITEMS section further down the page.
const FAQ_ITEMS = [
  {
    q: 'Is delivery really discreet?',
    a: 'Yes. Every order ships in a plain, sealed box with no logo, no branding, and no indication of contents. Even the courier doesn\u2019t know what\u2019s inside.',
  },
  {
    q: 'Do you deliver sex toys across all of Lebanon?',
    a: 'Yes — same-day delivery in Beirut, and 1-3 day delivery to Tripoli, Sidon, Zahle, Jounieh, and the rest of Lebanon.',
  },
  {
    q: 'Can I pay cash on delivery?',
    a: 'Yes, cash on delivery is available everywhere in Lebanon, alongside card payment options.',
  },
  {
    q: 'Are the products body-safe and good quality?',
    a: 'All products use body-safe silicone or medical-grade materials, and every item ships new and sealed.',
  },
  {
    q: 'How do I order?',
    a: 'Browse the site and check out directly, or message us on WhatsApp and our team will help you choose and confirm your order.',
  },
];

const REVIEWS = [
  {
    text: 'Placed my order in the morning and it arrived before dinner. Plain box, nothing on it. Product quality genuinely surprised me — better than expected.',
    name: 'Dina M.',
    city: 'Beirut, Lebanon',
    initial: 'D',
    color: 'bg-purple-600',
  },
  {
    text: 'Was skeptical ordering something like this online in Lebanon, but Vexa proved me wrong. Discreet, professional, and the quality is actually great.',
    name: 'Georges K.',
    city: 'Jounieh, Lebanon',
    initial: 'G',
    color: 'bg-rose-600',
  },
  {
    text: 'Messaged them on WhatsApp before ordering — they answered fast and helped me pick the right product. Arrived in Tripoli in two days, completely plain box.',
    name: 'Tarek H.',
    city: 'Tripoli, Lebanon',
    initial: 'T',
    color: 'bg-amber-600',
  },
  {
    text: 'Fast, private, and exactly what was advertised. Cash on delivery made everything easier. Already placed a second order.',
    name: 'Lina B.',
    city: 'Sidon, Lebanon',
    initial: 'L',
    color: 'bg-teal-600',
  },
  {
    text: 'Delivery reached Zahle the next morning. I was a bit nervous about privacy but the packaging had absolutely nothing on it. Very impressed.',
    name: 'Jad R.',
    city: 'Zahle, Lebanon',
    initial: 'J',
    color: 'bg-indigo-600',
  },
  {
    text: 'No other store in Lebanon comes close. Fair prices, same-day delivery in Beirut, and genuinely discreet packaging every single time.',
    name: 'Nadia S.',
    city: 'Beirut, Lebanon',
    initial: 'N',
    color: 'bg-sky-600',
  },
];

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
      review: REVIEWS.slice(0, 5).map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: r.text,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1900',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Vexa Store Lebanon',
      publisher: { '@id': `${BASE}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/sex-toys?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': `${BASE}/#store`,
      name: 'Vexa Store Lebanon',
      url: BASE,
      description: 'متجر فيكسا — الوجهة الفاخرة الأولى في لبنان لمنتجات العناية الحميمية وهدايا المتزوجين واللانجري. توصيل سري، دفع عند الاستلام، وتقييم 4.9/5 من أكثر من 1,900 عميل.',
      priceRange: '$$',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Cash',
      openingHours: 'Mo-Su 08:00-22:00',
      address: { '@type': 'PostalAddress', addressCountry: 'LB', addressLocality: 'Beirut' },
      telephone: '+96176730767',
      areaServed: { '@type': 'Country', name: 'Lebanon' },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1900',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/#faq`,
      mainEntity: FAQ_ITEMS.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default async function HomePage() {
  let allProducts: Awaited<ReturnType<typeof fetchProductsServer>> = [];
  try {
    allProducts = await fetchProductsServer();
  } catch { /* graceful fallback — shop renders empty, still functional */ }

  // Strip any base64 data-URIs before they ever reach the client bundle —
  // same normalization used by /adult-toys and /[category].
  const productsWithImages = allProducts.map(p => ({
    ...p,
    image: (p.image && !p.image.startsWith('data:')) ? p.image : '',
    images: (p.images || []).filter((s: string) => s && !s.startsWith('data:')),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── THE SHOP ITSELF ───────────────────────────────────────────────────
          This is the entire landing experience: navbar with search, cart,
          hamburger menu, an always-visible category bar, and the full
          product grid — every category, every product, no "Load more"
          click. This is what a visitor sees the instant they land on "/". */}
      <ShopApp
        initialProducts={productsWithImages}
        initialCategory=""
        initialView="shop"
        seoHeading="Premium Intimate Wellness & Couples Care | Vexa Store Lebanon"
      />

      <main className="bg-[#050101] text-white">

        {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
        <section className="border-y border-white/10 bg-white/[0.015]">
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { value: '600+', label: 'Products', labelAr: 'منتج' },
                { value: '4.9★', label: 'Average Rating', labelAr: 'تقييم متوسط' },
                { value: '1,900+', label: 'Happy Customers', labelAr: 'عميل سعيد' },
                { value: '24h', label: 'Nationwide Delivery', labelAr: 'توصيل لكل لبنان' },
              ].map((s, i) => (
                <div key={i} className="py-2">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{s.label}</p>
                  <p className="text-stone-600 text-[10px]">{s.labelAr}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE VEXA ───────────────────────────────────────────────── */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-3 text-center">
              Why Thousands Choose Us
            </p>
            <h2 className="text-2xl font-black text-white text-center mb-12">
              Why Choose Vexa Store?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: '📦',
                  title: '100% Discreet Delivery',
                  titleAr: 'توصيل سري 100%',
                  body: 'Every order ships in a plain sealed box with no logo, no store name, and no indication of contents. Even the delivery rider doesn\'t know what\'s inside.',
                },
                {
                  icon: '💵',
                  title: 'Cash on Delivery',
                  titleAr: 'الدفع عند الاستلام',
                  body: 'No credit card required. Pay in cash when your package arrives at your door — available across all of Lebanon.',
                },
                {
                  icon: '⚡',
                  title: 'Same-Day in Beirut',
                  titleAr: 'توصيل في نفس اليوم',
                  body: 'Order before 2 PM and receive your package today in Beirut and suburbs. 24–72 hours for all other Lebanese regions.',
                },
                {
                  icon: '🛡️',
                  title: 'Body-Safe Materials',
                  titleAr: 'مواد آمنة للجسم',
                  body: 'All products are made from certified medical-grade materials — silicone, ABS plastic, borosilicate glass, and stainless steel. No jelly, no rubber.',
                },
                {
                  icon: '💬',
                  title: 'Private WhatsApp Support',
                  titleAr: 'دعم واتساب سري',
                  body: 'Our team is available daily for judgment-free product recommendations. First-time buyer? We\'ll guide you to exactly what you need.',
                },
                {
                  icon: '⭐',
                  title: '4.9 / 5 Rating',
                  titleAr: '4.9 / 5 تقييم',
                  body: 'Rated 4.9 out of 5 across 350+ verified customer reviews from across Lebanon. Consistently Lebanon\'s highest-rated adult store.',
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition">
                  <span className="text-2xl mb-4 block">{item.icon}</span>
                  <p className="font-black text-white text-sm mb-1">{item.title}</p>
                  <p className="text-stone-500 text-xs mb-3">{item.titleAr}</p>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CUSTOMER REVIEWS ──────────────────────────────────────────────── */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-3">
                Customer Reviews · آراء العملاء
              </p>
              <h2 className="text-2xl font-black text-white mb-4">
                What customers say
              </h2>
              <p className="text-stone-500 text-sm mb-6">
                Real reviews from customers across Beirut and Lebanon.
              </p>
              {/* Aggregate score */}
              <div className="inline-flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-6">
                <p className="text-5xl font-black text-white">4.9</p>
                <div className="flex gap-0.5 text-amber-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <p className="text-stone-400 text-xs font-semibold tracking-wide">
                  1,900+ happy customers
                </p>
              </div>
            </div>

            {/* Review cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4 hover:border-white/20 transition"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 text-amber-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                  {/* Quote */}
                  <p className="text-stone-300 text-sm leading-relaxed flex-1">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  {/* Reviewer */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                    <div className={`${r.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0`}>
                      {r.initial}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{r.name}</p>
                      <p className="text-stone-500 text-[10px]">{r.city}</p>
                    </div>
                    <span className="ml-auto text-stone-600 text-[10px] font-semibold">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ───────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 relative overflow-hidden">
          {/* subtle ambient glow for a premium feel */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-3xl" />

          <div className="max-w-3xl mx-auto px-4 py-16 relative">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-3 text-center">
              Lebanon&apos;s #1 Rated Adult Store
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-6 tracking-tight">
              متجر فيكسا — Vexa Store Lebanon
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-4">
              <strong className="text-white font-bold">Vexa Store</strong> is Lebanon&apos;s most trusted
              destination for premium intimate wellness — serving 1,900+ clients across Beirut, Tripoli,
              Sidon, Jounieh, Zahle, and every region in between. Our curated collection spans luxury personal
              massagers, elegant lingerie, couples essentials and more, every piece checked for body-safe
              materials and genuine quality before it ever reaches your door.
            </p>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-4">
              Every order ships in a plain, sealed box — no logo, no branding, no indication of what&apos;s
              inside, not even to the courier. Pair that with same-day delivery in Beirut, cash on delivery
              nationwide, and a private WhatsApp line for judgment-free advice, and it&apos;s easy to see why
              Vexa is rated <strong className="text-white font-bold">4.9 / 5</strong> by clients across Lebanon.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-8" dir="rtl">
              <p className="text-stone-300 text-sm sm:text-base leading-loose mb-3">
                <strong className="text-white font-bold">متجر فيكسا</strong> — الوجهة الفاخرة الأولى في
                لبنان لمنتجات العناية الحميمية، بثقة أكثر من 1,900 عميل في بيروت وطرابلس وصيدا وجونية وزحلة
                وكل المناطق اللبنانية. نوفّر منتجات زوجية فاخرة، لانجري أنيق وهدايا للمتزوجين، جميعها مصنوعة
                من مواد آمنة ومضمونة الجودة.
              </p>
              <p className="text-stone-400 text-sm sm:text-base leading-loose">
                تسوّق بثقة وخصوصية تامة: تغليف سري بدون أي شعار، دفع عند الاستلام في كل لبنان، توصيل سريع في
                نفس اليوم داخل بيروت، ودعم واتساب خاص لمساعدتك باختيار الأنسب لك. تقييم 4.9 من 5 من عملائنا في
                جميع أنحاء لبنان.
              </p>
            </div>

            <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest text-center mb-4">
              Discreet delivery across Lebanon
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {CITY_META.map(c => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="text-xs font-semibold text-stone-400 border border-white/10 rounded-full px-3.5 py-1.5 hover:border-rose-500/40 hover:text-white hover:bg-white/[0.04] transition"
                >
                  Intimate wellness in {c.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        {/* This visible copy matches FAQ_ITEMS / the FAQPage schema above word-for-word. */}
        <section className="border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 py-14">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-3 text-center">
              FAQ · الأسئلة الشائعة
            </p>
            <h2 className="text-2xl font-black text-white mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-3">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 open:bg-white/[0.05]"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-bold text-white">
                    {item.q}
                    <span className="shrink-0 text-stone-500 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-stone-400 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
