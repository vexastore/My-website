import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';

// Brand-story page. It must not compete with the homepage or /sex-toys for
// "sex toys lebanon" queries, so the title and copy stay about the company.
const pageTitle = 'About Vexa Toys | Our Story and Promise';
const pageDescription =
  'Vexa Toys is a Lebanese online store for adult products. Read how we started, how discreet delivery works across Lebanon and why customers trust us.';

const baseMetadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://vexatoys.com/about',
    siteName: 'Vexa Toys Lebanon',
    type: 'website',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  if (await getStoreLocale() === 'en') return baseMetadata;
  const title = 'عن متجر فيكسا لبنان';
  const description = 'تعرف على متجر فيكسا للمنتجات الزوجية في لبنان. توصيل سري ودفع عند الاستلام.';
  return { ...baseMetadata, title: { absolute: title }, description, openGraph: { ...baseMetadata.openGraph, title, description, locale: 'ar_LB' } };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Vexa Toys Lebanon',
  url: 'https://vexatoys.com/about',
  description: 'About Vexa Toys in Lebanon, its product categories and ordering options.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vexa Toys', item: 'https://vexatoys.com' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://vexatoys.com/about' },
    ],
  },
};

export default async function AboutPage() {
  const locale = await getStoreLocale();

  return (
    <>
      <link rel="preload" as="image" href="/images/mockup/about-hero-bg.webp" fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Client-side interactive app (user-facing) */}
      <ShopApp initialLocale={locale} initialCategory="Sex Toys" initialView="about" />
    </>
  );
}

