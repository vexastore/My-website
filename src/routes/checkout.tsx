import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';
import type { StoreLocale } from '@/lib/storeLocaleShared';

export const checkoutMetadata: Metadata = {
  title: 'Checkout | Vexa Toys',
  robots: { index: false, follow: false },
};

export async function CheckoutPage(locale: StoreLocale) {
  return <ShopApp initialLocale={locale} initialCategory="Sex Toys" initialView="checkout" />;
}
