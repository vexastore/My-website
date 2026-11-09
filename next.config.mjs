/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'sneihqexrinsjtzazbus.supabase.co' },
      // Allow vexatoys.com domain for Next.js Image optimisation of local images
      { protocol: 'https', hostname: 'vexatoys.com' },
    ],
    // Serve modern formats (AVIF/WebP) — reduces image payload 30-50% (LCP improvement)
    formats: ['image/webp'],
    // Cache optimised images for 24 h at the CDN edge
    minimumCacheTTL: 86400,
  },
  // Strip X-Powered-By header — minor security hardening
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Strict mode for better React hydration consistency (prevents CLS from mismatches)
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/refund-returns',
        destination: '/returns',
        permanent: true,
      },
      {
        source: '/returns-policy',
        destination: '/returns',
        permanent: true,
      },
      // Google Search Console 404 historical redirect resolutions
      {
        // Still indexed in Nov 2026 (Search Console Pages report) but 404
        source: '/sex-toys/dildo-in-lebanon-premium-silicone-dildo',
        destination: '/dildos/dildo-in-lebanon-premium-silicone-dildo-prod-g7v7fpyt8',
        permanent: true,
      },
      {
        // Still indexed in Nov 2026 (Search Console Pages report) but 404
        source: '/dildos/realistic-silicone-dildo-lebanon-g-spot-curved-suction-cup-d',
        destination: '/dildos/realcock-premium-realistic-dildo-in-lebanon-hyper-realistic',
        permanent: true,
      },
      {
        source: '/dildos/dildos-silicone-custom-colors-in-lebanon',
        destination: '/dildos/silicone-dildo-custom-colors-lebanon',
        permanent: true,
      },
      {
        source: '/dildos/dildos-silicone-custom-colors-in-lebanon-',
        destination: '/dildos/silicone-dildo-custom-colors-lebanon',
        permanent: true,
      },
      {
        source: '/male-toys/beaded-dual-penetrator-vibrating-silicone-toy',
        destination: '/male-toys/beaded-dual-silicone-toy-lebanon',
        permanent: true,
      },
      {
        source: '/sex-toys/luxecurve-silicone-dildo-in-lebanon',
        destination: '/sex-toys/luxecurve-silicone-dildo',
        permanent: true,
      },
      {
        source: '/sex-toys/dolphin-suckling-female-adult-sex',
        destination: '/vibrators',
        permanent: true,
      },
      {
        source: '/dildos/premium-adjustable-strap-on-harness-with-interchangeable-rin',
        destination: '/sex-toys/premium-strap-on-harness-set-interchangeable-o-ring-system-f',
        permanent: true,
      },
      {
        source: '/sex-toys/premium-adjustable-strap-on-harness-with-interchangeable-rin',
        destination: '/sex-toys/premium-strap-on-harness-set-interchangeable-o-ring-system-f',
        permanent: true,
      },
      {
        source: '/sex-toys/silicone-vibrating-cock-ring-comfortable-adjustable-cock-rin',
        destination: '/sex-toys/zoro-vibrating-cock-ring-delay-control-ring',
        permanent: true,
      },
      {
        source: '/dildos/silicone-strap-on-dildo-in-lebanon-',
        destination: '/dildos/strap-on-harness-kit-with-silicone-dildo',
        permanent: true,
      },
      {
        source: '/dildos/silicone-strap-on-dildo-in-lebanon',
        destination: '/dildos/strap-on-harness-kit-with-silicone-dildo',
        permanent: true,
      },
      {
        source: '/dildos/silicone-strap-on-dildo',
        destination: '/dildos/strap-on-harness-kit-with-silicone-dildo',
        permanent: true,
      },
      {
        source: '/sex-toys/penis-sleeve-reusable-silicone-extender-enhancer',
        destination: '/sex-toys/silicone-textured-enhancement-sleeve',
        permanent: true,
      },
      {
        source: '/sex-toys/double-ended-flexible-silicone-intimate-wellness-toy-ultra-s',
        destination: '/male-toys/beaded-dual-silicone-toy-lebanon',
        permanent: true,
      },
      {
        source: '/sex-toys/lingerie-in-lebanon-luxury-sexy-lingerie-collection-vexa-sto',
        destination: '/lingerie',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Only personal or admin responses are forced to `no-store`. Public
      // storefront pages are left to Next.js so they can become CDN-cacheable
      // once rendering no longer depends on the locale cookie.
      ...['/checkout/:path*', '/orders/:path*', '/admin/:path*', '/api/:path*'].map((source) => ({
        source,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      })),
      // Content-hashed production chunks can be cached immutably. In `next dev`
      // chunk names are NOT hashed (e.g. /_next/static/chunks/app/page.js), so
      // an immutable header there makes browsers keep stale client code and
      // triggers hydration mismatches after every edit. Production only.
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/_next/static/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
