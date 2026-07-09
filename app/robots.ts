import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // Allow legacy ?category= links so bots follow the 301 redirect
          // to the correct category page instead of being blocked before redirect.
          '/*?category=*',
        ],
        disallow: [
          '/admin',
          '/checkout',
          '/orders',
          // Block all other query-string variants — prevents duplicate indexing.
          // Must come AFTER the allow rule for ?category= above.
          '/*?*',
        ],
      },
    ],
    sitemap: 'https://vexatoys.com/sitemap.xml',
    host: 'https://vexatoys.com',
  };
}
