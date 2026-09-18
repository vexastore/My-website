'use client';
import { ShopProvider } from './context/ShopContext';
import { AppContent } from './App';
import { Product } from './types';
import type { StoreLocale } from '@/lib/storeLocaleShared';

interface ShopAppProps {
  initialProducts?: Product[];
  initialCategory?: string;
  initialView?: 'shop' | 'checkout' | 'admin' | 'orders' | 'about' | 'product';
  initialProductSlug?: string;
  seoHeading?: string;
  initialLocale?: StoreLocale;
}

export function ShopApp({ initialProducts, initialCategory, initialView, initialProductSlug, seoHeading, initialLocale }: ShopAppProps) {
  return (
    <ShopProvider
      initialProducts={initialProducts}
      initialCategory={initialCategory}
      initialView={initialView}
      initialProductSlug={initialProductSlug}
      seoHeading={seoHeading}
      initialLocale={initialLocale}
    >
      <AppContent />
    </ShopProvider>
  );
}
