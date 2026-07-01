import type { Metadata } from 'next';
  import './globals.css';
  import MetaPixel from '@/src/components/MetaPixel';
import { Analytics } from '@vercel/analytics/next';

  export const metadata: Metadata = {
    metadataBase: new URL('https://vexatoys.com'),
    title: {
      default: 'ÙØªØ¬Ø± ÙÙÙØ³Ø§ | Ø±ÙÙ 1 ÙÙ ÙØ¨ÙØ§Ù ÙÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ²ÙØ¬ÙØ© ÙØ§ÙÙØ§ÙØ¬Ø±Ù',
      template: '%s | ÙØªØ¬Ø± ÙÙÙØ³Ø§ ÙØ¨ÙØ§Ù',
    },
    description: 'ÙØªØ¬Ø± ÙÙÙØ³Ø§ â Ø§ÙØ£ÙØ«Ø± Ø®ØµÙØµÙØ© ÙØ£ÙØ§ÙØ§Ù ÙØ´Ø±Ø§Ø¡ Ø£ÙØ¹Ø§Ø¨ Ø²ÙØ¬ÙØ©Ø ÙØ²Ø§Ø²Ø§ØªØ ÙØ§ÙØ¬Ø±Ù ÙÙ ÙØ¨ÙØ§Ù. ØªÙØµÙÙ Ø³Ø±Ù ÙÙ ÙÙØ³ Ø§ÙÙÙÙ ÙÙ Ø¨ÙØ±ÙØª. Ø¯ÙØ¹ Ø¹ÙØ¯ Ø§ÙØ§Ø³ØªÙØ§Ù. ØªØºÙÙÙ Ø³Ø±Ù 100%.',
    keywords: 'Ø£ÙØ¹Ø§Ø¨ Ø²ÙØ¬ÙØ© ÙØ¨ÙØ§Ù, ÙØ²Ø§Ø²Ø§Øª, ÙØ§ÙØ¬Ø±Ù, sex toys lebanon, vibrators, lingerie beirut, vexa store',
    authors: [{ name: 'Vexa Store Lebanon' }],
    creator: 'Vexa Store',
    openGraph: {
      type: 'website',
      locale: 'ar_LB',
      alternateLocale: 'en_US',
      url: 'https://vexatoys.com',
      siteName: 'Vexa Store Lebanon',
      title: 'ÙØªØ¬Ø± ÙÙÙØ³Ø§ | Ø£ÙØ¹Ø§Ø¨ Ø²ÙØ¬ÙØ© ÙÙØ§ÙØ¬Ø±Ù ÙÙ ÙØ¨ÙØ§Ù',
      description: 'ØªÙØµÙÙ Ø³Ø±Ù ÙÙ ÙÙØ³ Ø§ÙÙÙÙ. Ø¯ÙØ¹ Ø¹ÙØ¯ Ø§ÙØ§Ø³ØªÙØ§Ù. ØªØºÙÙÙ Ø³Ø±Ù 100%.',
    },
    twitter: { card: 'summary_large_image', site: '@vexastore' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: 'https://vexatoys.com' },
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
        logo: { '@type': 'ImageObject', url: `${BASE}/vexa-logo.jpg` },
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
        description: 'ÙØªØ¬Ø± ÙÙÙØ³Ø§ â Ø±ÙÙ 1 ÙÙ ÙØ¨ÙØ§Ù ÙÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ²ÙØ¬ÙØ© ÙØ§ÙÙØ§ÙØ¬Ø±Ù. ØªÙØµÙÙ Ø³Ø±Ù ÙÙ Ø¨ÙØ±ÙØª.',
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
          <link rel="icon" href="/favicon.ico" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="bg-[#050101]">
          {children}
          <MetaPixel />
        </body>
      </html>
    );
  }
  