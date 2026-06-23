import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';

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

export default function AboutPage() {
  return <ShopApp initialCategory="Sex Toys" initialView="about" />;
}
