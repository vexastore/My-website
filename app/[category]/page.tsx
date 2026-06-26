import { Metadata } from 'next';
  import { fetchProductsServer } from '@/lib/fetchProducts';
  import { fetchImages } from '@/lib/fetchImages';
  import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
  import { ShopApp } from '@/src/ShopApp';
  import { notFound } from 'next/navigation';

  const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml', 'robots.txt'];

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
        title: meta.titleEn,
        description: meta.descEn,
        url: pageUrl,
        siteName: 'Vexa Store Lebanon',
        locale: 'ar_LB',
        type: 'website',
        images: [{ url: DEFAULT_OG_IMAGE, alt: meta.titleEn, width: 512, height: 512 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.titleEn,
        description: meta.descEn,
        images: [DEFAULT_OG_IMAGE],
      },
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

    // Load products and images in parallel from server (cached 24h — zero repeated Firebase reads)
    const [allProducts, imageMap] = await Promise.all([
      fetchProductsServer(),
      fetchImages().catch(() => ({} as Record<string, { image: string; images: string[] }>)),
    ]);

    // Merge image URLs into products so the listing page renders with real images immediately
    const productsWithImages = allProducts.map(p => {
      const img = imageMap[p.id];
      if (img && (img.image || (img.images && img.images.length > 0))) {
        return {
          ...p,
          image: img.image || p.image,
          images: img.images && img.images.length > 0 ? img.images : p.images,
        };
      }
      return p;
    });

    const jsonLdProducts = productsWithImages
      .filter(p => p.categorySlug === slug || p.category === categoryId)
      .slice(0, 8)
      .map(p => ({
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
              offers: {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: 'USD',
                availability: p.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                seller: { '@type': 'Organization', name: 'Vexa Store Lebanon' },
              },
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
        <ShopApp initialProducts={productsWithImages} initialCategory={categoryId} initialView="shop" />
      </>
    );
  }
  