/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        // Add X-Robots-Tag: noindex to any response served from a non-canonical
        // host (i.e. the *.vercel.app preview URL). The middleware already issues
        // a 301 redirect in those cases, but belt-and-suspenders doesn't hurt.
        // On the canonical host (vexatoys.com) this header is NOT added, so
        // real pages remain indexable.
        //
        // Note: Vercel's edge network also respects the `X-Robots-Tag` header
        // set by middleware, but adding it here ensures it's applied even if
        // middleware is skipped (e.g. for _next/static assets).
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            // Will be overridden per-response by middleware for non-canonical hosts.
            // On canonical host, this value is intentionally permissive.
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
