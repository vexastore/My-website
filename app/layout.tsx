import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vexatoys.com'),
  title: {
    default: 'متجر فيكسا | رقم 1 في لبنان للألعاب الزوجية واللانجري',
    template: '%s | متجر فيكسا لبنان',
  },
  description: 'متجر فيكسا – الأكثر خصوصية وأماناً لشراء ألعاب زوجية، هزازات، لانجري في لبنان. توصيل سري في نفس اليوم في بيروت. دفع عند الاستلام. تغليف سري 100%.',
  keywords: 'ألعاب زوجية لبنان, هزازات, لانجري, sex toys lebanon, vibrators, lingerie beirut, vexa store',
  authors: [{ name: 'Vexa Store Lebanon' }],
  creator: 'Vexa Store',
  openGraph: {
    type: 'website',
    locale: 'ar_LB',
    alternateLocale: 'en_US',
    url: 'https://vexatoys.com',
    siteName: 'Vexa Store Lebanon',
    title: 'متجر فيكسا | ألعاب زوجية ولانجري في لبنان',
    description: 'توصيل سري في نفس اليوم. دفع عند الاستلام. تغليف سري 100%.',
  },
  twitter: { card: 'summary_large_image', site: '@vexastore' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://vexatoys.com' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://vexatoys.com/#organization',
      name: 'Vexa Store Lebanon',
      url: 'https://vexatoys.com',
      logo: { '@type': 'ImageObject', url: 'https://vexatoys.com/vexa-logo.jpg' },
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
      '@id': 'https://vexatoys.com/#website',
      url: 'https://vexatoys.com',
      name: 'Vexa Store Lebanon',
      publisher: { '@id': 'https://vexatoys.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://vexatoys.com/sex-toys?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': 'https://vexatoys.com/#store',
      name: 'Vexa Store Lebanon',
      url: 'https://vexatoys.com',
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
      </body>
    </html>
  );
}
