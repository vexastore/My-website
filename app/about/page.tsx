import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { fetchProductsServer } from '@/lib/fetchProducts';

export const metadata: Metadata = {
  title: 'عن متجر فيكسا | ألعاب زوجية ولانجري في لبنان | About Vexa Store',
  description: 'تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية واللانجري في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: 'عن متجر فيكسا | About Vexa Store Lebanon',
    description: 'الأكثر خصوصية وأماناً للمنتجات الزوجية في لبنان.',
    url: 'https://vexatoys.com/about',
  },
};

export default async function AboutPage() {
  // Pre-load products so clicking "SHOP NOW" navigates instantly
  // without showing a loading screen (same pattern as category pages).
  const allProducts = await fetchProductsServer();
  return <ShopApp initialProducts={allProducts} initialCategory="Sex Toys" initialView="about" />;
}
