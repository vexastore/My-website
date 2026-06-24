import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY, CATEGORY_META } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ category: string; slug: string }> }

export const revalidate = 3600;

const STORE_LOGO = 'https://vexatoys.com/vexa-logo.jpg';

/** Returns a valid https:// URL. Falls back to the store logo for base64 data URIs or empty values. */
function toImageUrl(raw: string | undefined | null): string {
  if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) return raw;
  return STORE_LOGO;
}

/** Strips newlines and collapses whitespace — safe for og:description / twitter:description. */
function cleanText(raw: string): string {
  return raw.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export async function generateStaticParams() {
  try {
    const products = await fetchProductsServer();
    return products
      .filter(p => p.slug && p.categorySlug)
      .map(p => ({ category: p.categorySlug, slug: p.slug }));
  } catch {
    return CATEGORY_META.map(c => ({ category: c.slug, slug: 'index' }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const meta = getCategoryMeta(category);

  try {
    const products = await fetchProductsServer();
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return { title: meta.titleEn, robots: { index: false, follow: false } };

    const name = cleanText(product.nameEn || product.name || slug);
    const rawDesc = product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut.`;
    const desc = cleanText(rawDesc).slice(0, 160);
    const imgUrl = toImageUrl(product.image);
    const pageUrl = `https://vexatoys.com/${category}/${slug}`;

    return {
      title: `${name} | Vexa Store Lebanon`,
      description: desc,
      openGraph: {
        title: `${name} | Vexa Store Lebanon`,
        description: desc,
        url: pageUrl,
        siteName: 'Vexa Store Lebanon',
        images: [{ url: imgUrl, alt: name, width: 800, height: 800 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} | Vexa Store Lebanon`,
        description: desc,
        images: [imgUrl],
      },
      alternates: { canonical: pageUrl },
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

  const meta = getCategoryMeta(category);
  const categoryLabel = meta.titleEn.split('|')[0].trim();
  const productUrl = `https://vexatoys.com/${category}/${slug}`;

  let jsonLd = null;
  let initialProducts = undefined;

  try {
    const products = await fetchProductsServer();
    const p = products.find(pr => pr.slug === slug || pr.id === slug);

    if (p) {
      initialProducts = [p];

      const productName = cleanText(p.nameEn || p.name || slug);
      const productDesc = cleanText(p.descriptionEn || p.description || '').slice(0, 500);
      // JSON-LD image must be a real URL — omit base64 data URIs
      const hasRealImage = p.image && (p.image.startsWith('http://') || p.image.startsWith('https://'));

      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Vexa Store', item: 'https://vexatoys.com' },
              { '@type': 'ListItem', position: 2, name: categoryLabel, item: `https://vexatoys.com/${category}` },
              { '@type': 'ListItem', position: 3, name: productName, item: productUrl },
            ],
          },
          {
            '@type': 'Product',
            name: productName,
            url: productUrl,
            description: productDesc,
            ...(hasRealImage && { image: [p.image] }),
            sku: p.id,
            brand: { '@type': 'Brand', name: 'Vexa Store Lebanon' },
            offers: {
              '@type': 'Offer',
              url: productUrl,
              price: p.price,
              priceCurrency: 'USD',
              availability: p.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
              seller: {
                '@type': 'Organization',
                name: 'Vexa Store Lebanon',
                url: 'https://vexatoys.com',
              },
            },
            ...(p.reviewsCount > 0 && p.rating > 0 && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: Number(p.rating.toFixed(1)),
                reviewCount: p.reviewsCount,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          },
        ],
      };
    }
  } catch { /* non-blocking */ }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ShopApp
        initialProducts={initialProducts}
        initialCategory={categoryId}
        initialView="product"
        initialProductSlug={slug}
      />
    </>
  );
}
