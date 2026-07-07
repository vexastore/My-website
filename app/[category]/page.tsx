import { Metadata } from 'next';
  import { fetchProductsServer } from '@/lib/fetchProducts';
  import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
  import { ShopApp } from '@/src/ShopApp';
  import { notFound } from 'next/navigation';

  const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml', 'robots.txt', 'blog'];

  interface Props { params: Promise<{ category: string }> }

  const DEFAULT_OG_IMAGE = 'https://vexatoys.com/vexa-logo.jpg';

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: slug } = await params;
    const meta = getCategoryMeta(slug);
    const pageUrl = `https://vexatoys.com/${slug}`;
    return {
      title: meta.titleEn,
      description: meta.descEn,
      openGraph: {
        title: meta.titleEn, description: meta.descEn, url: pageUrl,
        siteName: 'Vexa Store Lebanon', locale: 'ar_LB', type: 'website',
        images: [{ url: DEFAULT_OG_IMAGE, alt: meta.titleEn, width: 512, height: 512 }],
      },
      twitter: { card: 'summary_large_image', title: meta.titleEn, description: meta.descEn, images: [DEFAULT_OG_IMAGE] },
      alternates: { canonical: pageUrl },
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
    const allProducts = await fetchProductsServer();

    const jsonLdProducts = allProducts
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
        // Use ItemList (not Product) so Google doesn't flag missing merchant fields
        // (hasMerchantReturnPolicy, shippingDetails, validFrom) on the category page.
        // Full Product schema with all required fields lives on each individual product page.
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

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ShopApp initialProducts={allProducts} initialCategory={categoryId} initialView="shop" />
      </>
    );
  }
  