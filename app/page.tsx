import { Metadata } from 'next';
import Link from 'next/link';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CITY_META } from '@/lib/cityMeta';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';
import { FAQ_DATA } from '@/src/data/faq';

export const revalidate = 300;

const SITE_TITLE = 'Premium Intimate Wellness & Couples Care | Vexa Store Lebanon';
const SITE_DESC = 'Lebanon\'s #1 premium intimate wellness store. Shop luxury personal massagers, couples essentials, and elegant lingerie. 100% discreet same-day delivery across Beirut & all Lebanon. Cash on delivery.';

const baseMetadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    'sex toys lebanon',
    'sex toys in lebanon',
    'adult store beirut',
    'adult toys lebanon',
    'vibrators lebanon',
    'dildos lebanon',
    'intimate wellness lebanon',
    'luxury personal massagers beirut',
    'couples intimacy products',
    'premium lingerie beirut',
    'vexa store',
    'vexa store lebanon',
    'ألعاب زوجية لبنان',
    'منتجات متزوجين بيروت',
    'هدايا للمتزوجين لبنان',
    'متجر سري لبنان',
    'مقويات زوجية لبنان',
  ],
  alternates: { canonical: 'https://vexatoys.com' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: SITE_TITLE,
    description: 'Discover luxury personal massagers, elegant lingerie, and couples essentials. 100% discreet same-day delivery and private packaging across Lebanon. Cash on delivery.',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon, Premium Intimate Wellness' }],
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

export async function generateMetadata(): Promise<Metadata> {
  if (await getStoreLocale() === 'en') return baseMetadata;
  const title = 'متجر فيكسا لبنان | منتجات زوجية وتوصيل سري';
  const description = 'تسوق منتجات العناية الحميمية واللانجري في لبنان بخصوصية تامة. توصيل سري ودفع عند الاستلام.';
  return {
    ...baseMetadata,
    title,
    description,
    openGraph: { ...baseMetadata.openGraph, title, description, locale: 'ar_LB' },
    twitter: { ...baseMetadata.twitter, title, description },
  };
}

const BASE = 'https://vexatoys.com';

const REVIEWS = [
  {
    text: 'Placed my order in the morning and it arrived before dinner. Plain box, nothing on it. Product quality genuinely surprised me, better than expected.',
    textAr: 'طلبت صباحاً ووصل طلبي قبل المساء في صندوق عادي. جودة المنتج كانت أفضل من المتوقع.',
    name: 'Dina M.',
    city: 'Beirut, Lebanon',
    cityAr: 'بيروت، لبنان',
    initial: 'D',
    color: 'bg-purple-600',
  },
  {
    text: 'Was skeptical ordering something like this online in Lebanon, but Vexa proved me wrong. Discreet, professional, and the quality is actually great.',
    textAr: 'كنت متردداً في الطلب عبر الإنترنت، لكن التجربة كانت سرية واحترافية والجودة ممتازة.',
    name: 'Georges K.',
    city: 'Jounieh, Lebanon',
    cityAr: 'جونية، لبنان',
    initial: 'G',
    color: 'bg-rose-600',
  },
  {
    text: 'Messaged them on WhatsApp before ordering, they answered fast and helped me pick the right product. Arrived in Tripoli in two days, completely plain box.',
    textAr: 'تواصلت معهم عبر واتساب قبل الطلب، وساعدوني في الاختيار. وصل المنتج إلى طرابلس خلال يومين بصندوق عادي.',
    name: 'Tarek H.',
    city: 'Tripoli, Lebanon',
    cityAr: 'طرابلس، لبنان',
    initial: 'T',
    color: 'bg-amber-600',
  },
  {
    text: 'Fast, private, and exactly what was advertised. Cash on delivery made everything easier. Already placed a second order.',
    textAr: 'الخدمة سريعة وسرية والمنتج كما في الوصف. الدفع عند الاستلام سهّل الطلب، وقد طلبت مرة أخرى.',
    name: 'Lina B.',
    city: 'Sidon, Lebanon',
    cityAr: 'صيدا، لبنان',
    initial: 'L',
    color: 'bg-teal-600',
  },
  {
    text: 'Delivery reached Zahle the next morning. I was a bit nervous about privacy but the packaging had absolutely nothing on it. Very impressed.',
    textAr: 'وصل طلبي إلى زحلة في صباح اليوم التالي. كان التغليف خالياً تماماً من أي علامة تكشف المحتوى.',
    name: 'Jad R.',
    city: 'Zahle, Lebanon',
    cityAr: 'زحلة، لبنان',
    initial: 'J',
    color: 'bg-indigo-600',
  },
  {
    text: 'No other store in Lebanon comes close. Fair prices, same-day delivery in Beirut, and genuinely discreet packaging every single time.',
    textAr: 'أسعار مناسبة وتوصيل في اليوم نفسه داخل بيروت وتغليف سري في كل مرة.',
    name: 'Nadia S.',
    city: 'Beirut, Lebanon',
    cityAr: 'بيروت، لبنان',
    initial: 'N',
    color: 'bg-sky-600',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${BASE}/#faq`,
  mainEntity: FAQ_DATA.map(item => ({
    '@type': 'Question', name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default async function HomePage() {
  const locale = await getStoreLocale();
  const localizedJsonLd = locale === 'ar'
    ? {
        ...jsonLd,
        mainEntity: FAQ_DATA.map(item => ({
          '@type': 'Question',
          name: item.qAr,
          acceptedAnswer: { '@type': 'Answer', text: item.aAr },
        })),
      }
    : jsonLd;

  let allProducts: Awaited<ReturnType<typeof fetchProductsServer>> = [];
  try {
    allProducts = await fetchProductsServer();
  } catch {
    // fallback
  }

  const productsWithImages = allProducts.map(p => ({
    ...p,
    image: (p.image && !p.image.startsWith('data:')) ? p.image : '',
    images: (p.images || []).filter((s: string) => s && !s.startsWith('data:')),
  }));

  const isAr = locale === 'ar';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }}
      />

      <ShopApp
        initialLocale={locale}
        initialProducts={productsWithImages}
        initialCategory=""
        initialView="shop"
        seoHeading={isAr ? 'ألعاب جنسية في لبنان | متجر فيكسا' : 'Sex Toys in Lebanon | Vexa Store'}
        seoContent={
          <div key="seo-content" className="bg-black text-white" dir={isAr ? 'rtl' : 'ltr'}>
            {/* ── CUSTOMER REVIEWS ────────────────────────────────────── */}
            <section className="border-t border-white/10 py-12 sm:py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78] mb-2">
                    {isAr ? 'آراء العملاء الموثقة' : 'Verified Reviews'}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
                    {isAr ? 'ماذا يقول عملاؤنا في لبنان' : 'What Our Customers Say'}
                  </h2>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 mt-2">
                    <span className="text-xl font-black text-white">4.9</span>
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-stone-400 text-xs">
                      {isAr ? 'أكثر من ١,٩٠٠ عميل راضٍ' : '1,900+ Happy Clients'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {REVIEWS.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 flex flex-col justify-between hover:border-white/20 transition"
                    >
                      <div>
                        <div className="flex text-amber-400 text-xs mb-3">★★★★★</div>
                        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                          &ldquo;{isAr ? r.textAr : r.text}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/10">
                        <div className={`${r.color} w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0`}>
                          {r.initial}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">{r.name}</p>
                          <p className="text-stone-500 text-[10px]">{isAr ? r.cityAr : r.city}</p>
                        </div>
                        <span className="ms-auto text-emerald-500 text-[10px] font-bold">
                          {isAr ? '✓ موثّق' : '✓ Verified'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SEO CITY LINKS ──────────────────────────────────────── */}
            <section className="border-t border-white/10 py-10 bg-black/50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-4">
                  {isAr ? 'توصيل سري وسريع إلى جميع المناطق اللبنانية' : 'Discreet Same-Day Delivery Across All Lebanon'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CITY_META.map(c => (
                    <Link
                      key={c.slug}
                      href={`/city/${c.slug}`}
                      className="text-xs font-medium text-stone-400 border border-white/10 rounded-full px-3 py-1 hover:border-[#ff2d78] hover:text-white transition"
                    >
                      {isAr ? `توصيل سري إلى ${c.nameAr || c.nameEn}` : `Intimate wellness in ${c.nameEn}`}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        }
      />
    </>
  );
}
