import type { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';
import { toCardProduct } from '@/lib/storefrontPayload';
import { FAQ_DATA } from '@/src/data/faq';

export const revalidate = 300;

const SITE_URL = 'https://vexatoys.com';

/**
 * Homepage SEO. Focus query: "sex toys lebanon".
 * The title, description, H1 (see HeroSection) and intro copy all target it
 * naturally; the rest of the page is a real shopping journey, not keyword copy.
 */
const SEO_TITLE = 'Sex Toys Lebanon | Discreet Adult Toys | Vexa Toys';
const SEO_DESCRIPTION =
  'Shop sex toys in Lebanon at Vexa Toys. Explore vibrators, adult toys and lingerie with discreet packaging, delivery across Lebanon and cash on delivery.';

/** Hero H1 lines, split on "|" by HeroSection: "SEX TOYS LEBANON" / "DISCREET ADULT TOYS". */
const HERO_HEADING_EN = 'Sex Toys Lebanon | Discreet Adult Toys';
const HERO_HEADING_AR = 'ألعاب جنسية في لبنان | منتجات للكبار بسرية';

export async function generateMetadata(): Promise<Metadata> {
  const isAr = (await getStoreLocale()) === 'ar';
  const title = isAr
    ? 'متجر ألعاب زوجية في لبنان | توصيل سري | Vexa Toys'
    : SEO_TITLE;
  const description = isAr
    ? 'تسوّق الألعاب الزوجية ومنتجات العناية الحميمية واللانجري من Vexa Toys في لبنان، مع تغليف سري وخيارات توصيل والدفع عند الاستلام.'
    : SEO_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: {
      type: 'website',
      locale: isAr ? 'ar_LB' : 'en_US',
      url: `${SITE_URL}/`,
      siteName: 'Vexa Toys',
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph.jpg`,
          width: 1200,
          height: 630,
          alt: 'Vexa Toys, adult toys and intimate wellness in Lebanon',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage() {
  const locale = await getStoreLocale();
  const isAr = locale === 'ar';

  let allProducts: Awaited<ReturnType<typeof fetchProductsServer>> = [];
  try {
    allProducts = await fetchProductsServer();
  } catch {
    // The storefront can still render if the product service is unavailable.
  }

  // Lightweight cards only: descriptions and gallery images are not needed
  // for the grid, and the client refreshes the full catalog after hydration.
  const initialProducts = allProducts.map(toCardProduct);

  // FAQ structured data mirrors the FAQ section rendered on the page.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: isAr ? item.qAr : item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: isAr ? item.aAr : item.a,
      },
    })),
  };

  return (
    <>
      <link rel="preload" as="image" href="/images/mockup/hero-bg-right.webp" fetchPriority="high" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/*
        The whole homepage journey (hero, categories, featured products,
        assurances, buying guide, FAQ, policies) renders inside ProductList so
        it shares one design system with the storefront. Nothing is appended
        after the shop anymore.
      */}
      <ShopApp
        initialLocale={locale}
        initialProducts={initialProducts}
        initialCategory=""
        initialView="shop"
        seoHeading={isAr ? HERO_HEADING_AR : HERO_HEADING_EN}
      />
    </>
  );
}
