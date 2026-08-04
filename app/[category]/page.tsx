import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { CATEGORY_CONTENT } from '@/lib/categoryContent';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

  const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml', 'robots.txt', 'blog', 'quiz'];

  interface Props { params: Promise<{ category: string }> }

  const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: slug } = await params;
    const meta = getCategoryMeta(slug);
    const pageUrl = `https://vexatoys.com/${slug}`;
    return {
      title: { absolute: meta.titleEn },
      description: meta.descEn,
      openGraph: {
        title: meta.titleEn, description: meta.descEn, url: pageUrl,
        siteName: 'Vexa Store Lebanon', locale: 'ar_LB', type: 'website',
        images: [{ url: DEFAULT_OG_IMAGE, alt: meta.titleEn, width: 1200, height: 630 }],
      },
      twitter: { card: 'summary_large_image', site: '@vexastore', title: meta.titleEn, description: meta.descEn, images: [DEFAULT_OG_IMAGE] },
      alternates: { canonical: pageUrl },
      robots: { index: true, follow: true },
    };
  }

  export const revalidate = 300;

  export function generateStaticParams() {
    return CATEGORY_META.map(c => ({ category: c.slug }));
  }

  export default async function CategoryPage({ params }: Props) {
    const { category: slug } = await params;
    if (RESERVED.includes(slug)) notFound();
    const categoryId = SLUG_TO_CATEGORY[slug];
    if (!categoryId) notFound();

    const meta = getCategoryMeta(slug);
    const allProducts = await fetchProductsServer();

    const productsWithImages = allProducts.map(p => ({
      ...p,
      image:  (p.image  && !p.image.startsWith('data:'))  ? p.image  : '',
      images: (p.images || []).filter(s => s && !s.startsWith('data:')),
    }));

    const jsonLdProducts = productsWithImages
      .filter(p => p.categorySlug === slug || p.category === categoryId)
      .slice(0, 8)
      .map(p => ({
        name: p.nameEn || p.name,
        url: `https://vexatoys.com/${slug}/${p.slug}`,
        image: `https://vexatoys.com/api/img/${p.id}`,
        price: p.price, stock: p.stock,
      }));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
          { '@type': 'ListItem', position: 2, name: meta.titleEn.split('|')[0].trim(), item: `https://vexatoys.com/${slug}` },
        ]},
        { '@type': 'CollectionPage', name: meta.titleEn, description: meta.descEn, url: `https://vexatoys.com/${slug}` },
        ...(jsonLdProducts.length > 0 ? [{
          '@type': 'ItemList',
          name: meta.titleEn,
          url: `https://vexatoys.com/${slug}`,
          numberOfItems: jsonLdProducts.length,
          itemListElement: jsonLdProducts.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: p.url,
            name: p.name,
          })),
        }] : []),
        { '@type': 'FAQPage', mainEntity: [
          { '@type': 'Question', name: 'Do you deliver discreetly in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Plain sealed box, no logo, same-day delivery in Beirut.' } },
          { '@type': 'Question', name: 'Can I pay cash on delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cash on delivery (COD) is available. No online payment required.' } },
          { '@type': 'Question', name: 'How fast is delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Same-day in Beirut, 48-72 hours for other regions.' } },
        ]},
      ],
    };

    // Rich guide content for SEO — server-rendered so Google reads it immediately.
    const content = CATEGORY_CONTENT[slug];

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ShopApp initialProducts={productsWithImages} initialCategory={categoryId} initialView="shop" />

        {/* ── SEO Content Block ─────────────────────────────────────────── */}
        {/* Rendered server-side so Google sees it in the initial HTML.     */}
        {/* Positioned below the product grid — users can scroll to it.    */}
        {content && (
          <section className="bg-[#050101] border-t border-white/10">
            <div className="mx-auto max-w-5xl px-4 py-14 space-y-10">

              {/* Buying Guide */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4">
                  Buying Guide
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <p className="text-stone-300 text-sm leading-[1.85] whitespace-pre-line">
                    {content.guide}
                  </p>
                </div>
              </div>

              {/* FAQs */}
              {content.faqs.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-4">
                    Frequently Asked Questions
                  </p>
                  <div className="space-y-3">
                    {content.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                      >
                        <p className="font-black text-white text-sm mb-2 leading-snug">
                          {faq.q}
                        </p>
                        <p className="text-stone-400 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-black text-white mb-1">Not sure where to start?</p>
                  <p className="text-stone-400 text-sm">Take our 3-question quiz and get a personalised recommendation.</p>
                </div>
                <a
                  href="/quiz"
                  className="shrink-0 inline-flex items-center gap-2 bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-stone-200 transition active:scale-[0.98]"
                >
                  Find my product →
                </a>
              </div>

            </div>
          </section>
        )}
      </>
    );
  }
