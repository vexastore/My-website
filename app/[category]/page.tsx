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
  const products = await fetchProductsServer();
  const catProducts = products.filter(p => p.categorySlug === slug || p.category === categoryId).slice(0, 10);

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
        '@id': `https://vexatoys.com/${slug}`,
        name: meta.titleEn,
        description: meta.descEn,
        url: `https://vexatoys.com/${slug}`,
        publisher: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
        ...(catProducts.length > 0 && {
          hasPart: catProducts.map(p => ({
            '@type': 'Product',
            name: p.nameEn || p.name,
            url: `https://vexatoys.com/${p.categorySlug}/${p.slug}`,
            image: p.image,
            offers: {
              '@type': 'Offer',
              price: p.price,
              priceCurrency: 'USD',
              availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: 'Vexa Store Lebanon' },
            },
          })),
        }),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do you deliver discreetly in Lebanon?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. All orders arrive in a plain sealed box with no store logo or product name for full privacy. Same-day delivery in Beirut.' },
          },
          {
            '@type': 'Question',
            name: 'Can I pay cash on delivery?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cash on delivery (COD) is available. No online payment required.' },
          },
          {
            '@type': 'Question',
            name: 'How fast is delivery?',
            acceptedAnswer: { '@type': 'Answer', text: 'Same-day delivery in Beirut. Within 48-72 hours for other regions in Lebanon.' },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopApp initialProducts={products} initialCategory={categoryId} initialView="shop" />
    </>
  );
}
