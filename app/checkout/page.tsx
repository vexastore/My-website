import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import { getStoreLocale } from '@/lib/storeLocale';

export const metadata: Metadata = {
  title: 'Checkout | Vexa Store',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  return <ShopApp initialLocale={await getStoreLocale()} initialCategory="Sex Toys" initialView="checkout" />;
}
