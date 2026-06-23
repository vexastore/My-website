import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const meta = getCategoryMeta(category);
  try {
    const products = await fetchProductsServer();
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return { title: meta.titleEn, robots: { index: false, follow: false } };
    const name = product.nameEn || product.name || slug;
    const desc = (product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut.`).slice(0, 160);
    return {
      title: `${name} | Vexa Store Lebanon`,
      description: desc,
      openGraph: { title: `${name} | Vexa Store Lebanon`, description: desc, url: `https://vexatoys.com/${category}/${slug}`, images: product.image ? [{ url: product.image, alt: name }] : [], type: 'website' },
      alternates: { canonical: `https://vexatoys.com/${category}/${slug}` },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: meta.titleEn };
  }
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const categoryId = SLUG_TO_CATEGORY[category];
  if (!categoryId) notFound();

  // Fetch single product for JSON-LD only
  let jsonLd = null;
  try {
    const products = await fetchProductsServer();
    const p = products.find(pr => pr.slug === slug || pr.id === slug);
    if (p) {
      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' }, { '@type': 'ListItem', position: 2, name: categoryId, item: `https://vexatoys.com/${category}` }, { '@type': 'ListItem', position: 3, name: p.nameEn || p.name, item: `https://vexatoys.com/${category}/${slug}` }] },
          {
            '@type': 'Product',
            name: p.nameEn || p.name,
            description: (p.descriptionEn || p.description || '').slice(0, 500),
            image: p.image ? [p.image] : [],
            sku: p.id,
            brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
            offers: { '@type': 'Offer', url: `https://vexatoys.com/${category}/${slug}`, price: p.price, priceCurrency: 'USD', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', itemCondition: 'https://schema.org/NewCondition', seller: { '@type': 'Organization', name: 'Vexa Store Lebanon', url: 'https://vexatoys.com' } },
            ...(p.reviewsCount > 0 && { aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewsCount, bestRating: 5, worstRating: 1 } }),
          },
        ],
      };
    }
  } catch { /* non-blocking */ }

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {/* No initialProducts — keeps HTML small, Firebase fetches client-side */}
      <ShopApp initialCategory={categoryId} initialView="product" initialProductSlug={slug} />
    </>
  );
}
