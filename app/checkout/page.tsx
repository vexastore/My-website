import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';

export const metadata: Metadata = {
  title: 'إتمام الطلب | Checkout — Vexa Store',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <ShopApp initialCategory="Sex Toys" initialView="checkout" />;
}
