import { Metadata } from 'next';
import { fetchProductsServer } from '@/lib/fetchProducts';
import { CATEGORY_META, getCategoryMeta, SLUG_TO_CATEGORY } from '@/lib/categoryMeta';
import { ShopApp } from '@/src/ShopApp';
import { notFound } from 'next/navigation';

const RESERVED = ['about', 'checkout', 'admin', 'orders', 'advice', 'sitemap.xml'];

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const meta = getCategoryMeta(slug);
  return {
    title: meta.titleEn,
    description: meta.descEn,
    openGraph: {
      title: meta.titleAr,
      description: meta.descAr,
      url: `https://vexatoys.com/${slug}`,
      siteName: 'Vexa Store',
      locale: 'ar_LB',
      type: 'website',
    },
    alternates: { canonical: `https://vexatoys.com/${slug}` },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return CATEGORY_META.map(c => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  if (RESERVED.includes(slug)) notFound();
  const categoryId = SLUG_TO_CATEGORY[slug];
  if (!categoryId) notFound();

  const products = await fetchProductsServer();

  return (
    <ShopApp
      initialProducts={products}
      initialCategory={categoryId}
      initialView="shop"
    />
  );
}
