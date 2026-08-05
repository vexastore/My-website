/**
 * /adult-toys — Standalone static page.
 *
 * Named static route takes ABSOLUTE priority over app/[category]/page.tsx.
 * This guarantees Next.js always resolves /adult-toys to this file.
 *
 * IMPORTANT: This page shows ALL products across all categories — making it
 * a true "all adult toys" catalog page, not a duplicate of /sex-toys.
 *
 * Target keywords: "adult toys in Lebanon", "adult toys Lebanon",
 *                  "العاب جنسيه في لبنان", "ألعاب للكبار في لبنان"
 */
import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { ShopApp } from '@/src/ShopApp';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: 'Adult Toys in Lebanon | All Categories | Vexa Store' },
  description: 'Shop 500+ adult toys in Lebanon. Discreet plain-box delivery, same-day Beirut, cash on delivery. العاب جنسيه في لبنان — تغليف سري بدون شعار.',
  alternates: { canonical: 'https://vexatoys.com/adult-toys' },
  openGraph: {
    title: 'Adult Toys in Lebanon | All Categories | Vexa Store',
    description: 'Shop all adult toys in Lebanon — 500+ products with 100% discreet delivery. Same-day Beirut delivery, cash on delivery.',
    url: 'https://vexatoys.com/adult-toys',
    siteName: 'Vexa Store Lebanon',
    locale: 'ar_LB',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Adult Toys Lebanon — Vexa Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    title: 'Adult Toys in Lebanon | All Categories | Vexa Store',
    description: 'Shop all adult toys in Lebanon — 500+ products with 100% discreet delivery.',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true },
};

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
      name: 'Adult Toys in Lebanon — All Categories | Vexa Store',
      description: 'Browse all 500+ adult toys in Lebanon across every category. 100% discreet delivery, cash on delivery.',
      url: 'https://vexatoys.com/adult-toys',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Do you deliver adult toys discreetly in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every order ships in a plain sealed box — no logo, no branding. Same-day delivery in Beirut. Cash on delivery available.' } },
        { '@type': 'Question', name: 'هل توصلون ألعاب للكبار بشكل سري في لبنان؟', acceptedAnswer: { '@type': 'Answer', text: 'نعم. كل طلب يُشحن في صندوق مغلق عادي بدون شعار. توصيل في نفس اليوم في بيروت. دفع عند الاستلام.' } },
        { '@type': 'Question', name: 'What adult toys are available in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Vexa Store carries 500+ adult toys in Lebanon across all categories: vibrators, dildos, male masturbators, BDSM kits, lingerie, anal toys, butt plugs, cock rings, lubricants, sex machines, and more. All shipped discreetly.' } },
        { '@type': 'Question', name: 'Is cash on delivery available for adult toys in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cash on delivery (COD) is available for all adult toy orders across Lebanon. No credit card or online payment required.' } },
      ],
    },
  ],
};

export default async function AdultToysPage() {
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
    // Include everything else — cross-category and non-sex-toys products
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Interactive shop — all categories, no pre-filter */}
      <ShopApp
        initialProducts={productsWithImages}
        initialCategory=""
        initialView="shop"
      />

      {/* ── SEO content block — server-rendered ─────────────────────────── */}
      <article className="bg-[#050101] text-white border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-14 space-y-10">

          {/* Hero text */}
          <header className="space-y-3">
            <h2 className="text-3xl font-black text-white">
              Adult Toys in Lebanon | ألعاب للكبار في لبنان
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed max-w-3xl">
              Vexa Store is Lebanon&apos;s #1 destination for <strong>adult toys in Lebanon</strong> —
              500+ products across every category, delivered in plain sealed boxes with no logo.
              <strong> Same-day delivery in Beirut</strong>. Cash on delivery everywhere.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed max-w-3xl">
              متجر فيكسا — الوجهة الأولى للألعاب للكبار في لبنان. <strong>العاب جنسيه في لبنان</strong> بتغليف سري 100% بدون شعار.
              توصيل في نفس اليوم في بيروت. دفع عند الاستلام في كل لبنان.
            </p>
          </header>

          {/* Buying guide */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4">
              Buying Guide — Adult Toys in Lebanon
            </p>
            <div className="text-stone-300 text-sm leading-[1.85] space-y-4">
              <p>
                Vexa Store is Lebanon&apos;s #1 shop for <strong>adult toys in Lebanon</strong> — delivering 500+ products
                with 100% discreet packaging across Beirut and all Lebanese regions. Every order arrives in a plain
                sealed box with no logo, no branding, and zero indication of the contents.
              </p>
              <p>
                Our full adult toy range covers every category: vibrators (bullet, wand, rabbit, G-spot, suction),
                body-safe silicone dildos, male masturbators and penis pumps, BDSM and bondage kits for couples,
                luxury lingerie, anal toys and butt plugs, cock rings, lubricants, sex machines, poppers, and more.
                All products use certified medical-grade body-safe materials.
              </p>
              <p>
                Buying <strong>adult toys in Lebanon</strong> is now completely private. Browse, add to cart, and pay
                cash on delivery — no credit card, no online payment required. We deliver same-day in Beirut
                and within 24–72 hours across all of Lebanon.
              </p>
              <p className="text-stone-400">
                <strong>ألعاب للكبار في لبنان</strong> — اشتر من أكبر مجموعة العاب جنسيه في لبنان.
                تغليف خاص بدون شعار، توصيل سريع في كل لبنان، دفع عند الاستلام بدون بطاقة ائتمان.
              </p>
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-xl font-black text-white mb-4">
              Shop Adult Toys by Category in Lebanon
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { en: 'Vibrators Lebanon', slug: 'vibrators' },
                { en: 'Dildos Lebanon', slug: 'dildos' },
                { en: 'Male Toys Lebanon', slug: 'male-toys' },
                { en: 'Lingerie Lebanon', slug: 'lingerie' },
                { en: 'BDSM in Lebanon', slug: 'bdsm' },
                { en: 'Anal Toys Lebanon', slug: 'anal-toys' },
                { en: 'Lubricants Lebanon', slug: 'lubricants' },
                { en: 'Sex Machines Lebanon', slug: 'sex-machines' },
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
              Frequently Asked Questions — Adult Toys Lebanon
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Do you deliver adult toys discreetly in Lebanon? | هل التوصيل سري؟',
                  a: 'Yes. Every order ships in a plain sealed box with no logo and no indication of contents. Same-day delivery in Beirut. نعم، كل طلب بصندوق مغلق بدون شعار. توصيل سريع في بيروت.',
                },
                {
                  q: 'Can I pay cash on delivery for adult toys? | هل الدفع عند الاستلام متاح؟',
                  a: 'Yes. Cash on delivery (COD) is available across all Lebanon. No online payment needed. نعم، الدفع عند الاستلام متاح في كل لبنان.',
                },
                {
                  q: 'What adult toys do you have in Lebanon? | ما هي ألعاب الكبار المتوفرة؟',
                  a: '500+ adult toys across all categories: vibrators, dildos, male masturbators, BDSM kits, lingerie, anal toys, butt plugs, cock rings, lubricants, sex machines and more. 500+ منتج في كل الكاتيغوريات.',
                },
                {
                  q: 'How fast is adult toy delivery in Beirut? | كم يستغرق التوصيل؟',
                  a: 'Same-day in Beirut and suburbs. 24–72 hours for all other Lebanese regions. توصيل في نفس اليوم في بيروت. 24–72 ساعة لباقي لبنان.',
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
