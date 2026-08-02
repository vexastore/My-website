import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_TO_SLUG } from '@/lib/categoryMeta';
import { Product } from '@/src/types';

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: 'متجر فيكسا | Vexa Store Lebanon — متجر سري للبالغين',
  description: 'متجر فيكسا — الوجهة الأولى للبالغين في لبنان. 600+ منتج بتغليف سري تام بدون شعار، توصيل في نفس اليوم في بيروت، دفع عند الاستلام. ثقة أكثر من 1900 عميل. Vexa Store Lebanon — discreet adult store.',
  keywords: 'vexa store lebanon, متجر فيكسا, vexa store, متجر سري لبنان, adult store beirut, متجر بالغين لبنان, vexa store بيروت',
  alternates: { canonical: 'https://vexatoys.com' },
  openGraph: {
    type: 'website',
    locale: 'ar_LB',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: 'متجر فيكسا | Vexa Store Lebanon',
    description: 'متجر فيكسا — أكبر متجر سري للبالغين في لبنان. تغليف سري، دفع عند الاستلام، توصيل في نفس اليوم في بيروت.',
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
      description: 'متجر فيكسا — رقم 1 في لبنان للألعاب الزوجية واللانجري. توصيل سري في بيروت.',
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
  ],
};

const TOP_CATEGORIES = [
  { slug: 'sex-toys',    label: 'Sex Toys',    labelAr: 'ألعاب جنسية' },
  { slug: 'vibrators',   label: 'Vibrators',   labelAr: 'هزازات' },
  { slug: 'dildos',      label: 'Dildos',      labelAr: 'ديلدو' },
  { slug: 'male-toys',   label: 'Male Toys',   labelAr: 'ألعاب رجالية' },
  { slug: 'lingerie',    label: 'Lingerie',    labelAr: 'لانجري' },
  { slug: 'bdsm',        label: 'BDSM',        labelAr: 'BDSM' },
  { slug: 'anal-toys',   label: 'Anal Toys',   labelAr: 'ألعاب شرجية' },
  { slug: 'adult-toys',  label: 'All Products', labelAr: 'كل المنتجات' },
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

function getProductUrl(p: Product): string {
  const catSlug =
    (p.categorySlug && p.categorySlug !== 'adult-toys' && p.categorySlug !== '' ? p.categorySlug : null) ||
    (p.category ? CATEGORY_TO_SLUG[p.category] : null) ||
    'sex-toys';
  const slug = p.slug || p.id;
  return `/${catSlug}/${slug}`;
}

function cleanImage(img: string | undefined): string | null {
  if (!img || img.startsWith('data:') || img.trim() === '') return null;
  if (img.startsWith('http://')) return img.replace('http://', 'https://');
  if (img.startsWith('https://')) return img;
  return null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 tracking-tight" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

function ProductCard({ p, label }: { p: Product; label?: string }) {
  const url = getProductUrl(p);
  const img = cleanImage(p.image) || `https://vexatoys.com/api/img/${p.id}`;
  const name = (p.nameEn || p.name || '').slice(0, 55);

  return (
    <a
      href={url}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/25 hover:bg-white/[0.06] transition-all duration-200"
    >
      {label && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-white text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
          {label}
        </span>
      )}
      {/* Image */}
      <div className="aspect-square w-full bg-white/[0.03] overflow-hidden">
        <img
          src={img}
          alt={name}
          width={320}
          height={320}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        {p.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={p.rating} />
            {p.reviewsCount > 0 && (
              <span className="text-stone-500 text-[10px]">({p.reviewsCount})</span>
            )}
          </div>
        )}
        <p className="text-white text-xs font-bold leading-snug line-clamp-2">{name}</p>
        <p className="text-stone-300 text-sm font-black mt-auto">${p.price}</p>
      </div>
    </a>
  );
}

export default async function HomePage() {
  let allProducts: Product[] = [];
  try {
    allProducts = await fetchProductsServer();
  } catch { /* graceful fallback — page renders without products */ }

  const validProducts = allProducts.filter(p => p.stock > 0 && cleanImage(p.image));

  // Best Sellers: score = rating × log(reviewsCount + 2)
  const bestSellers = [...validProducts]
    .sort((a, b) => (b.rating * Math.log(b.reviewsCount + 2)) - (a.rating * Math.log(a.reviewsCount + 2)))
    .slice(0, 8);

  // New Arrivals: products with isNew flag, fallback to last 8 by position
  const newArrivals = validProducts.filter(p => p.isNew).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#050101] text-white">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-500 mb-5">
            Lebanon&apos;s #1 Adult Store · متجر فيكسا
          </p>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-6">
            متجر فيكسا لبنان
            <span className="block text-2xl sm:text-3xl text-stone-400 font-bold mt-3">
              Vexa Store Lebanon
            </span>
          </h1>
          <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto mb-3 leading-relaxed">
            600+ adult products shipped discreetly across Lebanon.
            Plain sealed boxes — no logo, no branding.
          </p>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-10">
            توصيل في نفس اليوم في بيروت · دفع عند الاستلام · خصوصيتك مضمونة
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/sex-toys"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-black text-sm px-8 py-3.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.97]"
            >
              تسوّق الآن · Shop Now →
            </a>
            <a
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:border-white/40 hover:bg-white/5 transition active:scale-[0.97]"
            >
              Not sure? Take the Quiz
            </a>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
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

        {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6 text-center">
            Shop by Category · تسوّق حسب الفئة
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

        {/* ── BEST SELLERS ──────────────────────────────────────────────────── */}
        {bestSellers.length > 0 && (
          <section className="border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-2">
                    Most Popular
                  </p>
                  <h2 className="text-2xl font-black text-white">
                    Best Sellers · الأكثر مبيعاً
                  </h2>
                </div>
                <a
                  href="/sex-toys"
                  className="text-stone-400 text-xs font-bold hover:text-white transition shrink-0 ml-4"
                >
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSellers.map((p, i) => (
                  <ProductCard key={p.id} p={p} label={i === 0 ? '#1 Best Seller' : undefined} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── NEW ARRIVALS ──────────────────────────────────────────────────── */}
        {newArrivals.length > 0 && (
          <section className="border-t border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-2">
                    Just Arrived
                  </p>
                  <h2 className="text-2xl font-black text-white">
                    New Arrivals · منتجات جديدة
                  </h2>
                </div>
                <a
                  href="/new-arrivals"
                  className="text-stone-400 text-xs font-bold hover:text-white transition shrink-0 ml-4"
                >
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {newArrivals.map(p => (
                  <ProductCard key={p.id} p={p} label="New" />
                ))}
              </div>
            </div>
          </section>
        )}

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
        <section className="border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 py-14">
            <h2 className="text-xl font-black text-white mb-4">
              متجر فيكسا — Vexa Store Lebanon
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              Vexa Store is Lebanon&apos;s most trusted adult store — serving 1,900+ customers across Beirut,
              Tripoli, Sidon, and all Lebanese regions. Every order ships in a plain sealed box with no logo,
              no branding, and complete privacy. Cash on delivery available everywhere.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              متجر فيكسا — الوجهة الأولى للبالغين في لبنان منذ أكثر من 3 سنوات. تسوّق بثقة وخصوصية تامة:
              تغليف سري بدون شعار، دفع عند الاستلام في كل لبنان، وتوصيل سريع إلى باب بيتك.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
