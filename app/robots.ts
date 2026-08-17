import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Keep legacy category URLs crawlable so Google can follow their
        // single 301 redirect to the clean category page.
        allow: ['/', '/?category='],
        // Block admin/internal routes.
        // /api/img/ is now disallowed: every product exposes direct Vercel Blob
        // image URLs in its markup + Product schema, so crawlers don't need the
        // serverless proxy — blocking it cuts unnecessary function invocations.
        disallow: [
          '/api/img/',
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
