/**
 * /adult-toys, Standalone static page.
 *
 * Named static route takes ABSOLUTE priority over app/[category]/page.tsx.
 * This guarantees Next.js always resolves /adult-toys to this file.
 *
 * IMPORTANT: This page shows ALL products across all categories, making it
 * a true "all adult toys" catalog page, not a duplicate of /sex-toys.
 *
 * Target keywords: "adult toys in Lebanon", "adult toys Lebanon",
 *                  "العاب جنسيه في لبنان", "ألعاب للكبار في لبنان"
 */
import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';
import { CATEGORY_META as CATEGORIES } from '@/lib/categoryMeta';

export const revalidate = 300;

const baseMetadata: Metadata = {
  title: { absolute: 'Adult Toys in Lebanon | All Categories | Vexa Store' },
  description: 'Shop 500+ adult toys in Lebanon. Discreet plain-box delivery, same-day Beirut, cash on delivery. العاب جنسيه في لبنان, تغليف سري بدون شعار.',
  alternates: { canonical: 'https://vexatoys.com/adult-toys' },
  openGraph: {
    title: 'Adult Toys in Lebanon | All Categories | Vexa Store',
    description: 'Shop all adult toys in Lebanon, 500+ products with 100% discreet delivery. Same-day Beirut delivery, cash on delivery.',
    url: 'https://vexatoys.com/adult-toys',
    siteName: 'Vexa Store Lebanon',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Adult Toys Lebanon, Vexa Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    title: 'Adult Toys in Lebanon | All Categories | Vexa Store',
    description: 'Shop all adult toys in Lebanon, 500+ products with 100% discreet delivery.',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  if (await getStoreLocale() === 'en') return baseMetadata;
  const title = 'منتجات للكبار في لبنان | متجر فيكسا';
  const description = 'تصفح منتجات متجر فيكسا لجميع الفئات مع تغليف سري ودفع عند الاستلام في لبنان.';
  return { ...baseMetadata, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, title, description, locale: 'ar_LB' } };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
        { '@type': 'ListItem', position: 2, name: 'Adult Toys Lebanon', item: 'https://vexatoys.com/adult-toys' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Adult Toys in Lebanon, All Categories | Vexa Store',
      description: 'Browse all 500+ adult toys in Lebanon across every category. 100% discreet delivery, cash on delivery.',
      url: 'https://vexatoys.com/adult-toys',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Do you deliver adult toys discreetly in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every order ships in a plain sealed box, no logo, no branding. Same-day delivery in Beirut. Cash on delivery available.' } },
        { '@type': 'Question', name: 'هل توصلون ألعاب للكبار بشكل سري في لبنان؟', acceptedAnswer: { '@type': 'Answer', text: 'نعم. كل طلب يُشحن في صندوق مغلق عادي بدون شعار. توصيل في نفس اليوم في بيروت. دفع عند الاستلام.' } },
        { '@type': 'Question', name: 'What adult toys are available in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Vexa Store carries 500+ adult toys in Lebanon across all categories: vibrators, dildos, male masturbators, BDSM kits, lingerie, anal toys, butt plugs, cock rings, lubricants, sex machines, and more. All shipped discreetly.' } },
        { '@type': 'Question', name: 'Is cash on delivery available for adult toys in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cash on delivery (COD) is available for all adult toy orders across Lebanon. No credit card or online payment required.' } },
      ],
    },
  ],
};

export default async function AdultToysPage() {
  const locale = await getStoreLocale();
  const localizedJsonLd = JSON.parse(JSON.stringify(jsonLd));
  const faqSchema = localizedJsonLd['@graph'].find((item: { '@type': string }) => item['@type'] === 'FAQPage');
  faqSchema.mainEntity = (locale === 'ar' ? [
    ['هل التوصيل سري؟', 'نعم. يصل كل طلب في صندوق عادي مغلق دون شعار.'],
    ['هل يمكنني الدفع عند الاستلام؟', 'نعم. الدفع عند الاستلام متاح في جميع أنحاء لبنان.'],
    ['كم يستغرق التوصيل؟', 'توصيل في اليوم نفسه داخل بيروت وإلى جميع المناطق اللبنانية.'],
  ] : [
    ['Is delivery discreet?', 'Yes. Every order ships in a plain sealed box without a logo.'],
    ['Can I pay on delivery?', 'Yes. Cash on delivery is available across Lebanon.'],
    ['How fast is delivery?', 'Same-day delivery in Beirut and delivery across Lebanon.'],
  ]).map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  const allProducts = await fetchProductsServer();

  // /adult-toys shows products from all categories EXCEPT the core 'Sex Toys' category.
  // This prevents content duplication with /sex-toys which targets the 'Sex Toys' category.
  // Unique product set = unique page = no 'Duplicate canonical' issues in Google Search Console.
  const NON_SEX_TOY_CATEGORIES = new Set([
    'Vibrators', 'Male Toys', 'Dildos', 'Lingerie', 'BDSM', 'Anal Toys',
    'Butt Plugs', 'New Arrivals', 'Sexual Enhancers', 'Penis Pumps', 'Cock Rings',
    'Masturbators', 'Chastity', 'Sex Machines', 'Lubricants', 'Poppers',
    'Holiday Collection',
  ]);

  const adultToysProducts = allProducts.filter(p => {
    const cat = (p.category || '').trim();
    const slug = (p.categorySlug || '').trim();
    // Exclude products that are ONLY in the 'Sex Toys' category
    if (cat === 'Sex Toys' && slug === 'sex-toys') return false;
    // Include everything else, cross-category and non-sex-toys products
    const extraCats = (p.categories || []);
    if (extraCats.length > 0 && extraCats.some((c: string) => NON_SEX_TOY_CATEGORIES.has(c))) return true;
    return cat !== 'Sex Toys';
  });

  const productsWithImages = adultToysProducts.map(p => ({
    ...p,
    image:  (p.image  && !p.image.startsWith('data:'))  ? p.image  : '',
    images: (p.images || []).filter((s: string) => s && !s.startsWith('data:')),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }} />

      {/* Interactive shop, all categories, no pre-filter */}
      <ShopApp
        initialLocale={locale}
        initialProducts={productsWithImages}
        initialCategory=""
        initialView="shop"
        seoHeading={locale === 'ar' ? 'منتجات للكبار في لبنان | كل الفئات' : 'Adult Toys in Lebanon | All Categories'}
      />

      {/* ── SEO content block, server-rendered ─────────────────────────── */}
      <article className="border-t border-white/10 bg-[#050101] text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-5xl space-y-10 px-4 py-14">
          <header className="space-y-3">
            <h2 className="text-3xl font-black">{locale === 'ar' ? 'منتجات للكبار في لبنان' : 'Adult Toys in Lebanon'}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-stone-300">
              {locale === 'ar'
                ? 'تصفح منتجات متجر فيكسا للفئات المختلفة. تصل الطلبات في صناديق عادية مغلقة دون شعار، مع توصيل سريع ودفع عند الاستلام في جميع أنحاء لبنان.'
                : 'Explore Vexa Store products across every category. Orders arrive in plain sealed boxes without a logo, with fast delivery and cash on delivery across Lebanon.'}
            </p>
          </header>
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-black">{locale === 'ar' ? 'دليل التسوق' : 'Buying Guide'}</h2>
            <p className="text-sm leading-relaxed text-stone-300">
              {locale === 'ar'
                ? 'اختر الفئة المناسبة، قارن بين المنتجات والمواد والمقاسات، ثم أكمل الطلب من الموقع. يمكنك التواصل معنا عبر واتساب إذا احتجت إلى مساعدة قبل الشراء.'
                : 'Choose a category, compare products, materials, and sizes, then place your order on the site. Contact us on WhatsApp if you need help before buying.'}
            </p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-black">{locale === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category'}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['vibrators', 'dildos', 'male-toys', 'lingerie', 'bdsm', 'anal-toys', 'lubricants', 'sex-machines'].map(slug => {
                const category = CATEGORIES.find(item => item.slug === slug);
                return <a key={slug} href={`/${slug}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-stone-300 hover:border-white/30 hover:text-white">{locale === 'ar' ? category?.titleAr.split('|')[0].trim() : category?.titleEn.split('|')[0].trim()}</a>;
              })}
            </div>
          </section>
          <section>
            <h2 className="mb-6 text-xl font-black">{locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
            <div className="space-y-3">
              {[
                { en: 'Is delivery discreet?', ar: 'هل التوصيل سري؟', answerEn: 'Yes. Every order ships in a plain sealed box without a logo.', answerAr: 'نعم. يصل كل طلب في صندوق عادي مغلق دون شعار.' },
                { en: 'Can I pay on delivery?', ar: 'هل يمكنني الدفع عند الاستلام؟', answerEn: 'Yes. Cash on delivery is available across Lebanon.', answerAr: 'نعم. الدفع عند الاستلام متاح في جميع أنحاء لبنان.' },
                { en: 'How fast is delivery?', ar: 'كم يستغرق التوصيل؟', answerEn: 'Same-day delivery in Beirut and delivery across Lebanon.', answerAr: 'توصيل في اليوم نفسه داخل بيروت وإلى جميع المناطق اللبنانية.' },
              ].map(item => <details key={item.en} className="rounded-xl border border-white/10 p-5">
                <summary className="cursor-pointer text-sm font-black">{locale === 'ar' ? item.ar : item.en}</summary>
                <p className="mt-3 text-xs leading-relaxed text-stone-400">{locale === 'ar' ? item.answerAr : item.answerEn}</p>
              </details>)}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
