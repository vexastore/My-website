import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getStoreLocale } from '@/lib/storeLocale';
import { CATEGORY_META as CATEGORIES } from '@/lib/categoryMeta';

const baseMetadata: Metadata = {
  title: 'About Vexa Store | Intimate Wellness Lebanon',
  description: 'Learn about Vexa Store in Lebanon, its product categories, discreet packaging, and cash on delivery.',
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: 'About Vexa Store | Intimate Wellness Lebanon',
    description: 'Learn about Vexa Store in Lebanon, its product categories, discreet packaging, and cash on delivery.',
    url: 'https://vexatoys.com/about',
    siteName: 'Vexa Store Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  if (await getStoreLocale() === 'en') return baseMetadata;
  const title = 'عن متجر فيكسا لبنان';
  const description = 'تعرف على متجر فيكسا للمنتجات الزوجية في لبنان. توصيل سري ودفع عند الاستلام.';
  return { ...baseMetadata, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, title, description, locale: 'ar_LB' } };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Vexa Store Lebanon',
  url: 'https://vexatoys.com/about',
  description: 'About Vexa Store in Lebanon, its product categories and ordering options.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://vexatoys.com/about' },
    ],
  },
};

export default async function AboutPage() {
  const locale = await getStoreLocale();
  const allProducts = await fetchProductsServer();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Client-side interactive app (user-facing) */}
      <ShopApp initialLocale={locale} initialProducts={allProducts} initialCategory="Sex Toys" initialView="about" />

      {/*
       * ── Server-rendered SEO block ─────────────────────────────────────────
       * This section is rendered as static HTML, fully visible to Google in the
       * initial response, no JavaScript required.
       * The ShopApp above handles the interactive UI for users; this block
       * ensures search engines can read the page content.
       */}
      <article aria-label={locale === 'ar' ? 'عن متجر فيكسا لبنان' : 'About Vexa Store Lebanon'} className="bg-[#070707] text-white border-t border-white/10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-5xl px-4 py-14 space-y-12">
          <header className="space-y-4">
            <h1 className="text-3xl font-black">{locale === 'ar' ? 'عن متجر فيكسا لبنان' : 'About Vexa Store Lebanon'}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-stone-300">
              {locale === 'ar'
                ? 'يوفر متجر فيكسا منتجات زوجية ولانجري ومنتجات عناية حميمية في لبنان مع تغليف سري، توصيل سريع، ودفع عند الاستلام.'
                : 'Vexa Store offers couples products, lingerie, and intimate wellness essentials in Lebanon with discreet packaging, fast delivery, and cash on delivery.'}
            </p>
          </header>
          <section>
            <h2 className="mb-6 text-xl font-black">{locale === 'ar' ? 'لماذا تختار متجر فيكسا؟' : 'Why Choose Vexa Store?'}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { en: 'Discreet packaging', ar: 'تغليف سري', detailEn: 'Every order arrives in a plain sealed box without a store logo.', detailAr: 'يصل كل طلب في صندوق عادي مغلق دون شعار المتجر.' },
                { en: 'Fast delivery', ar: 'توصيل سريع', detailEn: 'Same-day delivery in Beirut and delivery across Lebanon.', detailAr: 'توصيل في اليوم نفسه داخل بيروت وإلى جميع المناطق اللبنانية.' },
                { en: 'Cash on delivery', ar: 'الدفع عند الاستلام', detailEn: 'Pay when your order arrives. No online payment is required.', detailAr: 'ادفع عند وصول طلبك دون الحاجة إلى الدفع عبر الإنترنت.' },
                { en: 'Private support', ar: 'دعم بخصوصية تامة', detailEn: 'Our team can help you choose through WhatsApp.', detailAr: 'يمكن لفريقنا مساعدتك في الاختيار عبر واتساب.' },
              ].map(item => <div key={item.en} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="mb-2 text-sm font-black">{locale === 'ar' ? item.ar : item.en}</h3>
                <p className="text-xs leading-relaxed text-stone-400">{locale === 'ar' ? item.detailAr : item.detailEn}</p>
              </div>)}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-black">{locale === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category'}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['sex-toys', 'vibrators', 'dildos', 'lingerie', 'bdsm', 'male-toys', 'lubricants', 'anal-toys'].map(slug => {
                const category = CATEGORIES.find(item => item.slug === slug);
                return <a key={slug} href={`/${slug}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-stone-300 hover:border-white/30 hover:text-white">{locale === 'ar' ? category?.titleAr.split('|')[0].trim() : category?.titleEn.split('|')[0].trim()}</a>;
              })}
            </div>
          </section>
          <section>
            <h2 className="mb-6 text-xl font-black">{locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
            <div className="space-y-3">
              {[
                { en: 'Is delivery discreet?', ar: 'هل التوصيل سري؟', answerEn: 'Yes. Orders arrive in plain sealed boxes without a logo.', answerAr: 'نعم. تصل الطلبات في صناديق عادية مغلقة دون شعار.' },
                { en: 'Can I pay on delivery?', ar: 'هل يمكنني الدفع عند الاستلام؟', answerEn: 'Yes. Cash on delivery is available across Lebanon.', answerAr: 'نعم. الدفع عند الاستلام متاح في جميع أنحاء لبنان.' },
                { en: 'Do you deliver outside Beirut?', ar: 'هل توصلون خارج بيروت؟', answerEn: 'Yes. We deliver throughout Lebanon.', answerAr: 'نعم. نوصل إلى جميع المناطق اللبنانية.' },
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
