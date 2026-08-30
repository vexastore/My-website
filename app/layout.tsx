import type { Metadata } from 'next';
import './globals.css';
import MetaPixel from '@/src/components/MetaPixel';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: {
    default: 'Sex Toys in Lebanon | #1 Premium Store — Vexa Store',
    template: '%s | متجر فيكسا لبنان',
  },
  description: 'Sex toys in Lebanon, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery across Beirut & all Lebanon, cash on delivery.',
  keywords: 'sex toys lebanon, sex toys in lebanon, vibrators lebanon, dildos lebanon, masturbators lebanon, sex dolls lebanon, lingerie beirut, adult toys lebanon, vexa store, ألعاب زوجية لبنان, هزازات لبنان',
  authors: [{ name: 'Vexa Store Lebanon' }],
  creator: 'Vexa Store',
  openGraph: {
    type: 'website',
    locale: 'ar_LB',
    alternateLocale: 'en_US',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: 'Sex Toys in Lebanon | #1 Premium Store — Vexa Store',
    description: 'Sex toys in Lebanon, done right. Premium vibrators, dildos, lingerie, masturbators & sex dolls. Rated 4.9/5 by 1,900+ customers. Same-day discreet delivery, cash on delivery.',
    images: [{ url: 'https://vexatoys.com/opengraph.jpg', width: 1200, height: 630, alt: 'Vexa Store Lebanon — Sex Toys & Lingerie' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vexastore',
    images: ['https://vexatoys.com/opengraph.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: { rating: 'adult' },
};

const BASE = 'https://vexatoys.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Vexa Store Lebanon',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/vexa-logo.png` },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+96176730767',
        contactType: 'customer service',
        availableLanguage: ['Arabic', 'English'],
      },
      sameAs: ['https://wa.me/96176730767'],
      address: { '@type': 'PostalAddress', addressCountry: 'LB', addressLocality: 'Beirut' },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Vexa Store Lebanon',
      publisher: { '@id': `${BASE}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/sex-toys?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': `${BASE}/#store`,
      name: 'Vexa Store Lebanon',
      url: BASE,
      description: 'متجر فيكسا — رقم 1 في لبنان للألعاب الزوجية واللانجري. توصيل سري في بيروت.',
      priceRange: '$$',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Cash, Credit Card',
      openingHours: 'Mo-Sa 08:00-18:00',
      address: { '@type': 'PostalAddress', addressCountry: 'LB', addressLocality: 'Beirut' },
      telephone: '+96176730767',
      hasMap: 'https://maps.google.com/?q=Beirut,Lebanon',
      areaServed: { '@type': 'Country', name: 'Lebanon' },
    },
    {
      '@type': 'ItemList',
      '@id': `${BASE}/#category-list`,
      name: 'Vexa Store Product Categories',
      description: 'Browse all adult product categories at Vexa Store Lebanon',
      numberOfItems: 8,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Sex Toys Lebanon',   url: `${BASE}/sex-toys` },
        { '@type': 'ListItem', position: 2, name: 'Vibrators Lebanon',  url: `${BASE}/vibrators` },
        { '@type': 'ListItem', position: 3, name: 'Male Toys Lebanon',  url: `${BASE}/male-toys` },
        { '@type': 'ListItem', position: 4, name: 'Dildos Lebanon',     url: `${BASE}/dildos` },
        { '@type': 'ListItem', position: 5, name: 'Lingerie Lebanon',   url: `${BASE}/lingerie` },
        { '@type': 'ListItem', position: 6, name: 'BDSM Toys Lebanon',  url: `${BASE}/bdsm` },
        { '@type': 'ListItem', position: 7, name: 'New Arrivals',       url: `${BASE}/new-arrivals` },
        { '@type': 'ListItem', position: 8, name: 'Holiday Collection', url: `${BASE}/holiday-collection` },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050101]">
        {children}
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
