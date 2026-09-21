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
    ];
  },
  async headers() {
    return [
      {
        // Prevent browsers & intermediate proxies from caching HTML documents; guarantees fresh renders on reload
        source: '/((?!_next/static|_next/image|favicon|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)',
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
      },
      {
        // Content-hashed static JavaScript and CSS chunks can safely be cached immutably
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
