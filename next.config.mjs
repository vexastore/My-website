/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Allow vexatoys.com domain for Next.js Image optimisation of local images
      { protocol: 'https', hostname: 'vexatoys.com' },
    ],
    // Serve modern formats (AVIF/WebP) — reduces image payload 30-50% (LCP improvement)
    formats: ['image/avif', 'image/webp'],
    // Cache optimised images for 24 h at the CDN edge
    minimumCacheTTL: 86400,
  },
  // Strip X-Powered-By header — minor security hardening
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Strict mode for better React hydration consistency (prevents CLS from mismatches)
  reactStrictMode: true,
};

export default nextConfig;