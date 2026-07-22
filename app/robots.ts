import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/img/', // product images via CDN proxy — must be crawlable for Merchant Listings
        ],
        // Block only admin / checkout / API internals.
        // /api/img/ is explicitly allowed above (allow wins over disallow for more-specific paths).
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

