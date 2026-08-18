'use client';
import { ShopProvider } from './context/ShopContext';
import { AppContent } from './App';
import { Product } from './types';

interface ShopAppProps {
  initialProducts?: Product[];
  initialCategory?: string;
  initialView?: 'shop' | 'checkout' | 'admin' | 'orders' | 'about' | 'product';
  initialProductSlug?: string;
  seoHeading?: string;
}

export function ShopApp({ initialProducts, initialCategory, initialView, initialProductSlug, seoHeading }: ShopAppProps) {
  return (
    <ShopProvider
      initialProducts={initialProducts}
      initialCategory={initialCategory}
      initialView={initialView}
      initialProductSlug={initialProductSlug}
      seoHeading={seoHeading}
    >
      <AppContent />
    </ShopProvider>
  );
}
