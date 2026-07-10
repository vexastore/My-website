import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        // Block only admin/checkout/API — remove the broad /*?* rule that was
        // causing 28 "redirect error" and 8 "blocked by robots.txt" issues in GSC.
        // Broad query-string blocking prevented Google from following ?category= redirects
        // and caused legitimate product pages reached via query-string links to be blocked.
        disallow: [
          '/admin',
          '/checkout',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://vexatoys.com/sitemap.xml',
    host: 'https://vexatoys.com',
  };
}
