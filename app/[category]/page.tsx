import { Metadata } from 'next';
  import { fetchProductsServer } from '@/lib/fetchProducts';
  import { fetchImages } from '@/lib/fetchImages';
  import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
  import { ShopApp } from '@/src/ShopApp';
  import { notFound } from 'next/navigation';

  const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml', 'robots.txt', 'blog'];

  interface Props { params: Promise<{ category: string }> }

  const DEFAULT_OG_IMAGE = 'https://vexatoys.com/vexa-logo.png';

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

  // ISR: regenerate every 5 minutes, same cadence as the product page.
  // Without this the listing page is a static page built once at deploy time —
  // images uploaded after the last deploy never appear because fetchProductsServer()
  // is never called again. The product page has revalidate=300 and shows new
  // images within 5 min; the listing page must do the same.
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
    // Fetch products and images in parallel.
    // fetchImages() uses per-product individual REST calls (not a bulk fetch),
    // is cached for 24 hours, and is far more reliable than the bulk
    // fetchAllDocs('product_images') inside fetchProductsServer — which tries
    // to download all 70+ product images in one ~22 MB REST response and
    // consistently times out even at the 20-second threshold.
    //
    // We strip base64 data URIs from the SSR props (they would make the HTML
    // 5–20 MB and overwhelm mobile bandwidth). Products whose image IS a
    // base64 string keep image:"" in initialProducts and are served via the
    // /api/img/{id} CDN proxy, which converts base64 → JPEG and caches 24 h.
    // Products with short HTTPS URLs get them embedded directly.
    const [allProducts, imageMap] = await Promise.all([
      fetchProductsServer(),
      fetchImages(),
    ]);

    const productsWithImages = allProducts.map(p => {
      // If fetchProductsServer already resolved an image (e.g. an HTTPS URL
      // from a recent admin edit), keep it. Otherwise try fetchImages.
      const resolved = (p.image && p.image.length > 5 && !p.image.startsWith('data:'))
        ? p
        : (() => {
            const img = imageMap[p.id];
            if (!img) return p;
            // Only embed short HTTPS URLs — never base64. Base64 strings can
            // be hundreds of KB each; embedding 70 of them makes the HTML huge.
            const url = img.image && !img.image.startsWith('data:') && img.image.length > 5
              ? img.image : '';
            const urls = (img.images || []).filter(s => s && !s.startsWith('data:') && s.length > 5);
            return (url || urls.length > 0) ? { ...p, image: url || p.image, images: urls.length > 0 ? urls : p.images } : p;
          })();
      return resolved;
    });

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
        <ShopApp initialProducts={productsWithImages} initialCategory={categoryId} initialView="shop" />
      </>
    );
  }
  