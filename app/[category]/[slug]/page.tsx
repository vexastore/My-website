import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound, permanentRedirect } from 'next/navigation';

import { fetchProductsServer } from '@/lib/fetchProducts';
import { SLUG_TO_CATEGORY, getCategoryMeta } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';
import type { Product } from '@/src/types';

import {
  canonicalProductPath,
  canonicalProductSlug,
  findProduct,
  resolveProductCategorySlug,
  SITE_BASE_URL,
  SLUG_REMAPS,
  toProductSlug,
} from '@/lib/productSeo';
import { generateProductJsonLd } from '@/lib/productSchema';
import { fetchProductReviewsServer } from '@/lib/productReviews';

const DEFAULT_OG_IMAGE = 'https://vexatoys.com/opengraph.jpg';

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/**
 * Returns a valid HTTPS image URL for Schema.org / Open Graph.
 */
function schemaImageUrl(product: Product): string {
  const candidates = [product.image, ...(product.images || [])];

  for (const candidate of candidates) {
    if (!candidate || candidate.startsWith('data:')) {
      continue;
    }

    try {
      const url = new URL(candidate, SITE_BASE_URL);

      if (url.protocol === 'http:') {
        url.protocol = 'https:';
      }

      if (url.protocol === 'https:') {
        return url.toString();
      }
    } catch {
      // Ignore invalid image URLs.
    }
  }

  return DEFAULT_OG_IMAGE;
}


/**
 * Returns the main product image.
 */
function productImage(product: Product): string {
  return schemaImageUrl(product);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const locale = await getStoreLocale();
  const { category, slug } = await params;

  const products = await fetchProductsServer();
  const product = findProduct(products, slug);

  if (!product) {
    return {
      title: 'Product Not Found | Vexa Toys',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = (
    (locale === 'ar' ? product.name : product.nameEn) ||
    product.name ||
    ''
  ).trim();

  const productCategorySlug =
    product.categorySlug &&
    SLUG_TO_CATEGORY[product.categorySlug]
      ? product.categorySlug
      : category;

  const catMeta = getCategoryMeta(productCategorySlug);

  const categoryLabel = (locale === 'ar' ? catMeta.titleAr : catMeta.titleEn)
    .split('|')[0]
    .trim();

  const sameNameCount = products.filter(item => (locale === 'ar' ? item.name : item.nameEn) === name).length;
  const priceLabel = `${product.price.toFixed(2)} ${product.currency || 'USD'}`;
  const title = (locale === 'ar' ? product.seoTitleAr : product.seoTitleEn) ||
    `${name}${sameNameCount > 1 ? ` (${priceLabel})` : ''} | ${categoryLabel} | ${locale === 'ar' ? 'متجر فيكسا لبنان' : 'Vexa Toys Lebanon'}`;

  const sourceDescription = ((locale === 'ar' ? product.description : product.descriptionEn) || product.description || '').replace(/\s+/g, ' ').trim();
  const listingName = sameNameCount > 1 ? `${name} (${product.slug.replaceAll('-', ' ')})` : name;
  const description = ((locale === 'ar' ? product.seoDescriptionAr : product.seoDescriptionEn) ||
    (sourceDescription ? `${listingName}. ${sourceDescription}` : '') ||
    (locale === 'ar' ? `تسوق ${name} في لبنان من متجر فيكسا.` : `Shop ${name} in Lebanon at Vexa Toys.`)).slice(0, 300);

  const canonical = product.canonicalUrlOverride || `${SITE_BASE_URL}${canonicalProductPath(
    product
  )}`;

  const image = product.ogImageUrl || productImage(product);

  return {
    title: {
      absolute: title,
    },

    description,

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Vexa Toys Lebanon',
      locale: locale === 'ar' ? 'ar_LB' : 'en_US',
      type: 'website',
      images: [
        {
          url: image,
          alt: name,
          width: 800,
          height: 800,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@vexatoys',
      title,
      description,
      images: [image],
    },

    alternates: { canonical },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 300;

export const dynamicParams = true;

export async function generateStaticParams(): Promise<
  Array<{
    category: string;
    slug: string;
  }>
> {
  const products = await fetchProductsServer();

  const seen = new Set<string>();

  return products.flatMap((product) => {
    const category = resolveProductCategorySlug(product);
    const slug = canonicalProductSlug(product);

    if (!category || !slug) {
      return [];
    }

    const key = `${category}/${slug}`;

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);

    return [
      {
        category,
        slug,
      },
    ];
  });
}

export default async function ProductPage({
  params,
}: Props) {
  const locale = await getStoreLocale();
  const { category, slug } = await params;

  /**
   * Only allow valid category slugs.
   */
  if (!SLUG_TO_CATEGORY[category]) {
    notFound();
  }

  const allProducts = await fetchProductsServer();

  const product = findProduct(allProducts, slug);

  if (!product) {
    notFound();
  }

  const name = (
    (locale === 'ar' ? product.name : product.nameEn) ||
    product.name ||
    ''
  ).trim();

  const canonicalPath = canonicalProductPath(product);
  if (`/${category}/${slug}` !== canonicalPath) permanentRedirect(canonicalPath);

  const canonicalUrl = `${SITE_BASE_URL}${canonicalPath}`;

  /**
   * Resolve the real category from the product first.
   */
  const catSlug = resolveProductCategorySlug(
    product,
    category
  );

  const catMeta = getCategoryMeta(catSlug);

  const categoryLabel = (locale === 'ar' ? catMeta.titleAr : catMeta.titleEn)
    .split('|')[0]
    .trim();

  const description = (
    (locale === 'ar' ? product.description : product.descriptionEn) ||
    product.description ||
    ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  /**
   * Remove Base64 images before sending products
   * to the client.
   */
  const productsWithImages = allProducts.map(
    (currentProduct) => ({
      ...currentProduct,

      image:
        currentProduct.image &&
        !currentProduct.image.startsWith('data:')
          ? currentProduct.image
          : '',

      images: (currentProduct.images || []).filter(
        (currentImage) =>
          currentImage &&
          !currentImage.startsWith('data:')
      ),
    })
  );

  const images = [...new Set((product.images || []).filter(value => /^https:\/\//.test(value)))];

  const inStock = (product.stock ?? 0) > 0;

  /**
   * Schema.org structured data using real approved reviews from database.
   */
  const approvedReviews = await fetchProductReviewsServer(product.id);
  const jsonLd = generateProductJsonLd(product, {
    locale,
    canonicalUrl: product.canonicalUrlOverride || canonicalUrl,
    catSlug,
    categoryLabel,
    name,
    description,
    images,
    reviews: approvedReviews,
  });

  return (
    <>
      <script
        id="vexa-product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ShopApp
        initialLocale={locale}
        initialProducts={productsWithImages}
        initialCategory={
          catMeta
            ? SLUG_TO_CATEGORY[catSlug]
            : undefined
        }
        initialView="product"
        initialProductSlug={slug}
      />
    </>
  );
          }
