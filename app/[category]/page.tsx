import { Metadata } from 'next';
  import { fetchProductsServer } from '@/lib/fetchProducts';
  import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
  import { ShopApp } from '@/src/ShopApp';
  import { notFound } from 'next/navigation';

  const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml', 'robots.txt'];

  interface Props { params: Promise<{ category: string }> }

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: slug } = await params;
    const meta = getCategoryMeta(slug);
    return {
      title: meta.titleEn,
      description: meta.descEn,
      openGraph: {
        title: meta.titleAr,
        description: meta.descAr,
        url: `https://vexatoys.com/${slug}`,
        siteName: 'Vexa Store',
        locale: 'ar_LB',
        type: 'website',
      },
      alternates: { canonical: `https://vexatoys.com/${slug}` },
      robots: { index: true, follow: true },
    };
  }

  export function generateStaticParams() {
    return CATEGORY_META.map(c => ({ category: c.slug }));
  }

  export default async function CategoryPage({ params }: Props) {
    const { category: slug } = await params;
    if (RESERVED.includes(slug)) notFound();
    const categoryId = SLUG_TO_CATEGORY[slug];
    if (!categoryId) notFound();

    const meta = getCategoryMeta(slug);

    // Fetch ALL products server-side — passed to client so no second Firebase fetch
    let allProducts: Awaited<ReturnType<typeof fetchProductsServer>> = [];
    try {
      allProducts = await fetchProductsServer();
    } catch { /* non-blocking */ }

    const categoryProducts = allProducts.filter(
      p => p.categorySlug === slug || p.category === categoryId
    );

    const jsonLdProducts = categoryProducts.slice(0, 8).map(p => ({
      name: p.nameEn || p.name,
      url: `https://vexatoys.com/${slug}/${p.slug}`,
      image: p.image || '',
      price: p.price,
      stock: p.stock,
    }));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
            { '@type': 'ListItem', position: 2, name: meta.titleEn.split('|')[0].trim(), item: `https://vexatoys.com/${slug}` },
          ],
        },
        {
          '@type': 'CollectionPage',
          name: meta.titleEn,
          description: meta.descEn,
          url: `https://vexatoys.com/${slug}`,
          ...(jsonLdProducts.length > 0 && {
            hasPart: jsonLdProducts.map(p => ({
              '@type': 'Product',
              name: p.name,
              url: p.url,
              image: p.image,
              offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: 'Vexa Store Lebanon' } },
            })),
          }),
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Do you deliver discreetly in Lebanon?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Plain sealed box, no logo, same-day delivery in Beirut.' } },
            { '@type': 'Question', name: 'Can I pay cash on delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cash on delivery (COD) is available. No online payment required.' } },
            { '@type': 'Question', name: 'How fast is delivery?', acceptedAnswer: { '@type': 'Answer', text: 'Same-day in Beirut, 48-72 hours for other regions.' } },
          ],
        },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Pass ALL products server-side — client skips Firebase fetch entirely */}
        <ShopApp initialProducts={allProducts} initialCategory={categoryId} initialView="shop" />
      </>
    );
  }
  