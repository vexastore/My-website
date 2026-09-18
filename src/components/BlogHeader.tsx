'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { STORE_LOCALE_COOKIE, type StoreLocale } from '@/lib/storeLocaleShared';

export function BlogHeader({ locale }: { locale: StoreLocale }) {
  const [open, setOpen] = useState(false);
  const ar = locale === 'ar';
  const switchLanguage = () => {
    const next = ar ? 'en' : 'ar';
    document.cookie = `${STORE_LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    localStorage.setItem(STORE_LOCALE_COOKIE, next);
    window.location.reload();
  };

  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050101]/95 text-white backdrop-blur" dir={ar ? 'rtl' : 'ltr'}>
    <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-4">
      <Link href="/" aria-label={ar ? 'العودة إلى المتجر' : 'Vexa Store home'} className="flex items-center gap-3 font-black tracking-widest">
        <img src="/vexa-logo.png" alt="" width={48} height={48} className="rounded-full" /> VEXA STORE
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-6 text-sm font-semibold text-white/70 sm:flex" aria-label={ar ? 'القائمة الرئيسية' : 'Main navigation'}>
          <Link href="/" className="hover:text-white">{ar ? 'المتجر' : 'Shop'}</Link>
          <Link href="/blog" className="hover:text-white">{ar ? 'المدونة' : 'Blog'}</Link>
          <Link href="/about" className="hover:text-white">{ar ? 'عن المتجر' : 'About'}</Link>
        </nav>
        <button type="button" onClick={switchLanguage} className="border border-white/20 px-3 py-2 text-xs font-bold hover:bg-white hover:text-black" aria-label={ar ? 'Switch to English' : 'التبديل إلى العربية'}>{ar ? 'EN' : 'AR'}</button>
        <button type="button" className="sm:hidden" onClick={() => setOpen(value => !value)} aria-label={open ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    <nav className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out sm:hidden ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} aria-label={ar ? 'القائمة الرئيسية' : 'Main navigation'} inert={!open}>
      <div className="min-h-0 overflow-hidden"><div className="flex flex-col gap-4 border-t border-white/10 px-4 py-5 text-sm font-semibold">
        <Link href="/" onClick={() => setOpen(false)}>{ar ? 'المتجر' : 'Shop'}</Link>
        <Link href="/blog" onClick={() => setOpen(false)}>{ar ? 'المدونة' : 'Blog'}</Link>
        <Link href="/about" onClick={() => setOpen(false)}>{ar ? 'عن المتجر' : 'About'}</Link>
      </div></div>
    </nav>
  </header>;
}
