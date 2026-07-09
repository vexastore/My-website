import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { fetchProductsServer } from '@/lib/fetchProducts';

export const metadata: Metadata = {
  title: 'About Vexa Store | #1 Sex Toys Lebanon',
  description: 'About Vexa Store — The #1 Sex Toys store in Lebanon. Discreet packaging, same-day delivery in Beirut, cash on delivery. Shop sex toys, vibrators, dildos, lingerie & more.',
  alternates: { canonical: 'https://vexatoys.com/about' },
  openGraph: {
    title: 'About Vexa Store | #1 Sex Toys Lebanon',
    description: 'The #1 Sex Toys store in Lebanon. Discreet packaging, same-day delivery in Beirut, cash on delivery.',
    url: 'https://vexatoys.com/about',
  },
};

export default async function AboutPage() {
  const allProducts = await fetchProductsServer();
  return <ShopApp initialProducts={allProducts} initialCategory="Sex Toys" initialView="about" />;
}
