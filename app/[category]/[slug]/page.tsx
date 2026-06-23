import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const products = await fetchProductsServer();
  const product = products.find(p => p.slug === slug || p.id === slug);
  if (!product) {
    const meta = getCategoryMeta(category);
    return { title: meta.titleEn };
  }
  const name = product.nameEn || product.name || slug;
  const img = product.image || '';
  return {
    title: `${name} | متجر فيكسا لبنان - Vexa Store`,
    description: (product.descriptionEn || product.description || `Buy ${name} in Lebanon. Discreet delivery Beirut.`).slice(0, 160),
    openGraph: {
      title: `${name} | Vexa Store Lebanon`,
      description: (product.descriptionEn || '').slice(0, 160),
      url: `https://vexatoys.com/${category}/${slug}`,
      images: img ? [{ url: img }] : [],
      type: 'website',
    },
    alternates: { canonical: `https://vexatoys.com/${category}/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const categoryId = SLUG_TO_CATEGORY[category];
  if (!categoryId) notFound();

  const products = await fetchProductsServer();

  return (
    <ShopApp
      initialProducts={products}
      initialCategory={categoryId}
      initialView="product"
      initialProductSlug={slug}
    />
  );
}
