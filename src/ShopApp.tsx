'use client';
import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { AppContent } from './App';
import { Product } from './types';
import type { StoreLocale } from '@/lib/storeLocaleShared';

interface ShopAppProps {
  initialProducts?: Product[];
  initialCategory?: string;
  initialCategorySlug?: string;
  initialView?: 'shop' | 'checkout' | 'admin' | 'orders' | 'about' | 'product';
  initialProductSlug?: string;
  seoHeading?: string;
  initialLocale?: StoreLocale;
  seoContent?: React.ReactNode;
}

export function ShopApp({
  initialProducts,
  initialCategory,
  initialCategorySlug,
  initialView,
  initialProductSlug,
  seoHeading,
  initialLocale,
  seoContent,
}: ShopAppProps) {
  return (
    <ShopProvider
      initialProducts={initialProducts}
      initialCategory={initialCategory}
      initialCategorySlug={initialCategorySlug}
      initialView={initialView}
      initialProductSlug={initialProductSlug}
      seoHeading={seoHeading}
      initialLocale={initialLocale}
    >
      <AppContent seoContent={seoContent} />
    </ShopProvider>
  );
}
