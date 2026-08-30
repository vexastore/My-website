import { redirect, notFound } from 'next/navigation';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { canonicalProductPath, canonicalProductSlug } from '@/lib/productSeo';

// Legacy route: the old React/Vite SPA also served products at /products/:slug (plural).
// The current Next.js app serves them at /[category]/[slug]. Google still
// has ~15+ of these old URLs indexed/crawled (see GSC "Redirect error"),
// and until now they had NO matching route at all -> hard 404.
// This route 301-redirects them to the current canonical URL so Google
// can finally resolve them in a single hop instead of erroring.
export const revalidate = 3600;

export default async function LegacyProductRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const products = await fetchProductsServer();
  const match = products.find((p) => canonicalProductSlug(p) === slug || p.id === slug);

  if (!match) {
    // Product no longer exists — a real 404 is correct and expected here,
    // better than leaving Google stuck on a route that doesn't resolve.
    notFound();
  }

  redirect(canonicalProductPath(match));
}
