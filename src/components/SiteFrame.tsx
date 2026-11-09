'use client';
import React, { lazy, Suspense } from 'react';
import { ShopProvider } from '../context/ShopContext';
import { Navbar } from './Navbar';
import { OpenInBrowserBanner } from './OpenInBrowserBanner';
import { SiteFooter } from './SiteFooter';
import type { StoreLocale } from '@/lib/storeLocaleShared';

const FloatingWhatsApp = lazy(() => import('./FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })));
const VexaToast = lazy(() => import('./VexaToast').then(m => ({ default: m.VexaToast })));

interface SiteFrameProps {
  initialLocale?: StoreLocale;
  children: React.ReactNode;
}

/**
 * The storefront chrome (navbar, cart, language switch, WhatsApp button and
 * footer) around any server-rendered page: blog, policies, quiz.
 *
 * Server components pass their rendered content as children, so the article
 * or policy text is still in the HTML for crawlers while the navbar keeps the
 * cart, orders and language state from ShopContext.
 */
export function SiteFrame({ initialLocale = 'en', children }: SiteFrameProps) {
  return (
    <ShopProvider initialLocale={initialLocale} initialCategory="" initialView="shop">
      <div className="flex min-h-screen flex-col bg-vexa-ink font-sans text-white" dir={initialLocale === 'ar' ? 'rtl' : 'ltr'}>
        <OpenInBrowserBanner />
        <Navbar />
        <Suspense fallback={null}><FloatingWhatsApp /></Suspense>
        <Suspense fallback={null}><VexaToast /></Suspense>
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </div>
    </ShopProvider>
  );
}
