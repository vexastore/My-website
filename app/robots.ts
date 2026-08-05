import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/img/', // product image proxy — crawlable for Merchant Listings
        ],
        // Block admin/internal routes only.
        // /api/img/ is explicitly listed first with allow, so Google honours the
        // more-specific /api/img/ allow over the broader /api/ disallow.
        // Using specific paths here (not just /api/) avoids any parser ambiguity.
        disallow: [
          '/admin',
          '/checkout',
          '/revalidate',
          '/api/products',
          '/api/revalidate',
          '/api/notify-order',
          '/api/upload',
          '/api/indexnow',
          '/api/test-telegram',
          '/api/deploy',
        ],
      },
    ],
    sitemap: 'https://vexatoys.com/sitemap.xml',
    host: 'https://vexatoys.com',
  };
}
