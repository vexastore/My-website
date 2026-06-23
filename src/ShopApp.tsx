'use client';
import { ShopProvider } from './context/ShopContext';
import { AppContent } from './App';
import { Product } from './types';

interface ShopAppProps {
  initialProducts?: Product[];
  initialCategory?: string;
  initialView?: 'shop' | 'checkout' | 'admin' | 'orders' | 'about' | 'product';
  initialProductSlug?: string;
}

export function ShopApp({ initialProducts, initialCategory, initialView, initialProductSlug }: ShopAppProps) {
  return (
    <ShopProvider
      initialProducts={initialProducts}
      initialCategory={initialCategory}
      initialView={initialView}
      initialProductSlug={initialProductSlug}
    >
      <AppContent />
    </ShopProvider>
  );
}
