import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { fetchProductsServer } from '@/lib/fetchProducts';

export const metadata: Metadata = {
  title: 'About Vexa Store | #1 Sex Toys Lebanon',
  description: 'About Vexa Store — The #1 Sex Toys store in Lebanon. 500+ discreet products. Same-day delivery in Beirut, cash on delivery. Vibrators, dildos, lingerie, BDSM & more.',
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: 'About Vexa Store | #1 Sex Toys Lebanon',
    description: 'The #1 Sex Toys store in Lebanon. 500+ discreet products. Same-day delivery in Beirut, cash on delivery.',
    url: 'https://vexatoys.com/about',
    siteName: 'Vexa Store Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Vexa Store Lebanon',
  url: 'https://vexatoys.com/about',
  description: 'Vexa Store is Lebanon\'s #1 discreet adult toy store. 500+ body-safe products. Same-day delivery in Beirut. Cash on delivery.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://vexatoys.com/about' },
    ],
  },
};

export default async function AboutPage() {
  const allProducts = await fetchProductsServer();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Client-side interactive app (user-facing) */}
      <ShopApp initialProducts={allProducts} initialCategory="Sex Toys" initialView="about" />

      {/*
       * ── Server-rendered SEO block ─────────────────────────────────────────
       * This section is rendered as static HTML, fully visible to Google in the
       * initial response — no JavaScript required.
       * The ShopApp above handles the interactive UI for users; this block
       * ensures search engines can read the page content.
       */}
      <article
        aria-label="About Vexa Store Lebanon"
        className="bg-[#070707] text-white border-t border-white/10"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 space-y-12">

          {/* About Hero */}
          <header className="space-y-4">
            <h1 className="text-3xl font-black text-white">
              Vexa Store Lebanon — متجر فيكسا لبنان
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed max-w-3xl">
              Vexa Store is Lebanon&apos;s #1 destination for adult toys, vibrators, dildos, lingerie, and BDSM products.
              We ship 500+ products with 100% discreet packaging across Lebanon — plain sealed boxes, no logo, no indication of contents.
              Same-day delivery in Beirut. Cash on delivery available everywhere.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed max-w-3xl">
              متجر فيكسا هو الوجهة الأولى في لبنان للألعاب الزوجية والهزازات والديلدو واللانجري ومنتجات BDSM.
              نشحن أكثر من 500 منتج بتغليف سري 100% — صناديق مغلقة عادية بدون شعار أو أي إشارة للمحتوى.
              توصيل في نفس اليوم في بيروت. دفع عند الاستلام متاح في كل لبنان.
            </p>
          </header>

          {/* Why Vexa */}
          <section>
            <h2 className="text-xl font-black text-white mb-6">
              Why Choose Vexa Store? | لماذا تختار متجر فيكسا؟
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: '100% Discreet Packaging | تغليف سري 100%',
                  body: 'Every order ships in a plain sealed box with zero indication of its contents or our store name. خصوصيتك مضمونة في متجر فيكسا لبنان.',
                },
                {
                  title: 'Same-Day Delivery in Beirut | توصيل في نفس اليوم',
                  body: 'Same-day delivery within Beirut and suburbs. 24–72 hours across all Lebanon. توصيل سريع لكل لبنان بسرية تامة.',
                },
                {
                  title: 'Cash on Delivery | دفع عند الاستلام',
                  body: 'No online payment needed. Pay in cash when your order arrives. ادفع نقداً عند استلام طلبك.',
                },
                {
                  title: 'Body-Safe Products | منتجات آمنة طبياً',
                  body: 'All products are made from certified medical-grade, body-safe materials. منتجات أصلية 100% آمنة طبياً.',
                },
                {
                  title: "Lebanon's Widest Selection | أكبر تشكيلة في لبنان",
                  body: '500+ sex toys, vibrators, dildos, lingerie, BDSM, and more. شيء لكل الأذواق في متجر فيكسا لبنان.',
                },
                {
                  title: 'WhatsApp Support | دعم على واتساب',
                  body: 'Private WhatsApp support for all questions. دعم خاص عبر واتساب للإجابة على كل استفساراتك بسرية تامة.',
                },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-black text-white text-sm mb-2">{item.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-xl font-black text-white mb-4">
              Shop by Category in Lebanon | تسوق حسب الفئة في لبنان
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              Vexa Store carries Lebanon&apos;s most complete collection of adult products, all available with discreet delivery.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { en: 'Sex Toys Lebanon', slug: 'sex-toys' },
                { en: 'Vibrators Lebanon', slug: 'vibrators' },
                { en: 'Dildos Lebanon', slug: 'dildos' },
                { en: 'Lingerie Lebanon', slug: 'lingerie' },
                { en: 'BDSM Toys Lebanon', slug: 'bdsm' },
                { en: 'Male Toys Lebanon', slug: 'male-toys' },
                { en: 'Lubricants Lebanon', slug: 'lubricants' },
                { en: 'Anal Toys Lebanon', slug: 'anal-toys' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={`/${cat.slug}`}
                    className="block rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-bold text-stone-300 hover:text-white hover:border-white/20 transition"
                  >
                    {cat.en}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-black text-white mb-6">
              Frequently Asked Questions | أسئلة شائعة
            </h2>
            <div className="space-y-5">
              {[
                {
                  q: 'Do you deliver discreetly in Lebanon? | هل التوصيل سري في لبنان؟',
                  a: 'Yes. Every order ships in a plain sealed box with no logo and no indication of contents. توصيل سري 100% في كل لبنان.',
                },
                {
                  q: 'Can I pay cash on delivery in Lebanon? | هل يمكنني الدفع عند الاستلام؟',
                  a: 'Yes. Cash on delivery (COD) is available across all Lebanon. No online payment required. دفع عند الاستلام متاح في كل لبنان.',
                },
                {
                  q: 'How fast is delivery in Beirut? | كم يستغرق التوصيل في بيروت؟',
                  a: 'Same-day delivery in Beirut and suburbs. 24–72 hours for other Lebanese regions. توصيل في نفس اليوم في بيروت.',
                },
                {
                  q: 'Are your products body-safe? | هل المنتجات آمنة للجسم؟',
                  a: 'Yes. All Vexa Store products are made from certified medical-grade, body-safe materials. كل منتجاتنا من مواد طبية آمنة ومعتمدة.',
                },
                {
                  q: 'Do you ship outside Beirut? | هل تشحنون خارج بيروت؟',
                  a: 'Yes. We ship to all regions of Lebanon including Tripoli, Sidon, Tyre, Zahle, and all other areas. نشحن لكل لبنان.',
                },
              ].map((faq, i) => (
                <details key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <summary className="font-black text-white text-sm cursor-pointer">{faq.q}</summary>
                  <p className="text-stone-400 text-xs leading-relaxed mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
