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

  return <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white" dir={ar ? 'rtl' : 'ltr'}>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setOpen(value => !value)}
          aria-label={open ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link href="/" aria-label={ar ? 'العودة إلى المتجر' : 'Vexa Toys home'} className="flex flex-col select-none">
          <span className="text-xl font-black tracking-wider text-[#ff2d78] sm:text-2xl">VEXA</span>
          <span className="-mt-0.5 text-[9px] font-bold tracking-[0.32em] text-[#ff2d78] sm:text-[10px]">TOYS</span>
        </Link>
      </div>

      <nav className="hidden items-center gap-7 text-sm font-medium text-stone-300 md:flex" aria-label={ar ? 'القائمة الرئيسية' : 'Main navigation'}>
        <Link href="/" className="transition hover:text-white">{ar ? 'المتجر' : 'Shop'}</Link>
        <Link href="/blog" className="font-semibold text-white transition">{ar ? 'المدونة' : 'Blog'}</Link>
        <Link href="/about" className="transition hover:text-white">{ar ? 'عن المتجر' : 'About'}</Link>
      </nav>

      <button
        type="button"
        onClick={switchLanguage}
        className="flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-[11px] font-semibold text-stone-400 transition hover:bg-white/10 hover:text-white"
        aria-label={ar ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        {ar ? 'EN' : 'عربي'}
      </button>
    </div>

    <nav className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} aria-label={ar ? 'القائمة الرئيسية' : 'Main navigation'} inert={!open}>
      <div className="min-h-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-5 text-sm font-semibold">
          <Link href="/" onClick={() => setOpen(false)}>{ar ? 'المتجر' : 'Shop'}</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="text-[#ff2d78]">{ar ? 'المدونة' : 'Blog'}</Link>
          <Link href="/about" onClick={() => setOpen(false)}>{ar ? 'عن المتجر' : 'About'}</Link>
        </div>
      </div>
    </nav>
  </header>;
}
