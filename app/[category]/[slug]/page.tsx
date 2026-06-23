import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const products = await fetchProductsServer();
  const product = products.find(p => p.slug === slug || p.id === slug);
  const meta = getCategoryMeta(category);
  if (!product) return { title: meta.titleEn, robots: { index: false, follow: false } };

  const name = product.nameEn || product.name || slug;
  const desc = (product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut. Cash on delivery.`).slice(0, 160);
  const img = product.image || '';

  return {
    title: `${name} | Vexa Store Lebanon`,
    description: desc,
    openGraph: {
      title: `${name} | Vexa Store Lebanon`,
      description: desc,
      url: `https://vexatoys.com/${category}/${slug}`,
      images: img ? [{ url: img, alt: name }] : [],
      type: 'website',
    },
    alternates: { canonical: `https://vexatoys.com/${category}/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const categoryId = SLUG_TO_CATEGORY[category];
  if (!categoryId) notFound();

  const products = await fetchProductsServer();
  const product = products.find(p => p.slug === slug || p.id === slug);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
          { '@type': 'ListItem', position: 2, name: categoryId, item: `https://vexatoys.com/${category}` },
          { '@type': 'ListItem', position: 3, name: product.nameEn || product.name, item: `https://vexatoys.com/${category}/${slug}` },
        ],
      },
      {
        '@type': 'Product',
        '@id': `https://vexatoys.com/${category}/${slug}`,
        name: product.nameEn || product.name,
        description: product.descriptionEn || product.description,
        image: [product.image, ...(product.images || [])].filter(Boolean),
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
        offers: {
          '@type': 'Offer',
          url: `https://vexatoys.com/${category}/${slug}`,
          price: product.price,
          priceCurrency: 'USD',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: '5', currency: 'USD' },
            deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' } },
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'LB' },
          },
        },
        aggregateRating: product.reviewsCount > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      },
    ],
  } : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ShopApp initialProducts={products} initialCategory={categoryId} initialView="product" initialProductSlug={slug} />
    </>
  );
}
