'use client';
import React from 'react';
import { useShop } from '../context/ShopContext';

const FOOTER_CATEGORIES = [
  { id: 'Adult Toys',        slug: 'adult-toys',        ar: 'كل منتجات الكبار',        en: 'Adult Toys Lebanon' },
  { id: 'Sex Toys',          slug: 'sex-toys',          ar: 'ألعاب زوجية',            en: 'Sex Toys' },
  { id: 'Vibrators',         slug: 'vibrators',         ar: 'هزازات',                  en: 'Vibrators' },
  { id: 'Dildos',            slug: 'dildos',            ar: 'ديلدو',                   en: 'Dildos' },
  { id: 'Lingerie',          slug: 'lingerie',          ar: 'لانجري',                  en: 'Lingerie' },
  { id: 'Male Toys',         slug: 'male-toys',         ar: 'ألعاب رجالية',            en: 'Male Toys' },
  { id: 'BDSM',              slug: 'bdsm',              ar: 'ألعاب القوة',             en: 'BDSM' },
  { id: 'Butt Plugs',        slug: 'butt-plugs',        ar: 'سدادة شرجية',             en: 'Butt Plugs' },
  { id: 'Anal Toys',         slug: 'anal-toys',         ar: 'ألعاب الشرج',             en: 'Anal Toys' },
  { id: 'Bondage',           slug: 'bondage',           ar: 'عبودية',                  en: 'Bondage' },
  { id: 'Sex Dolls',         slug: 'sex-dolls',         ar: 'دمى جنسية',              en: 'Sex Dolls' },
  { id: 'Strap Ons',         slug: 'strap-ons',         ar: 'أحزمة',                   en: 'Strap-ons' },
  { id: 'Kegel Balls',       slug: 'kegel-balls',       ar: 'كرات كيجل',               en: 'Kegel Balls' },
  { id: 'Sexual Enhancers',  slug: 'sexual-enhancers',  ar: 'معززات جنسية',            en: 'Sexual Enhancers' },
  { id: 'Penis Pumps',       slug: 'penis-pumps',       ar: 'مضخات القضيب',            en: 'Penis Pumps' },
  { id: 'Cock Rings',        slug: 'cock-rings',        ar: 'حلقات القضيب',            en: 'Cock Rings' },
  { id: 'Masturbators',      slug: 'masturbators',      ar: 'أدوات الاستمناء',          en: 'Masturbators' },
  { id: 'Chastity',          slug: 'chastity',          ar: 'العفة',                   en: 'Chastity' },
  { id: 'Sex Machines',      slug: 'sex-machines',      ar: 'ماكينات الجنس',           en: 'Sex Machines' },
  { id: 'Lubricants',        slug: 'lubricants',        ar: 'مواد التشحيم',             en: 'Lubricants' },
  { id: 'Poppers',           slug: 'poppers',           ar: 'بوبرز',                   en: 'Poppers' },
  { id: 'New Arrivals',      slug: 'new-arrivals',      ar: 'وصل حديثاً',              en: 'New Arrivals' },
  { id: 'Holiday Collection',slug: 'holiday-collection',ar: 'مجموعة الأعياد',           en: 'Holiday Collection' },
];

const LEGAL_LINKS = [
  { href: '/about', en: 'About', ar: 'عن المتجر' },
  { href: '/blog', en: 'Blog', ar: 'المدونة' },
  { href: 'https://wa.me/96176730767', en: 'Contact', ar: 'اتصل بنا', external: true },
  { href: '/privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  { href: '/terms', en: 'Terms', ar: 'الشروط والأحكام' },
  { href: '/warranty', en: 'Warranty', ar: 'الضمان' },
  { href: '/delivery', en: 'Delivery', ar: 'التوصيل' },
  { href: '/returns', en: 'Returns', ar: 'سياسة الاسترجاع' },
];

/**
 * Storefront footer, shared by the shop views (via AppContent) and by every
 * server-rendered page wrapped in SiteFrame (blog, policies, quiz).
 *
 * Every link is a real anchor. Category links upgrade to a client route
 * transition through setActiveCategory, which falls back to router.push when
 * the current page is not the shop.
 */
export const SiteFooter: React.FC = () => {
  const { language, setActiveCategory, localizeHref } = useShop();
  const isArabic = language === 'ar';

  const handleCatLink = (event: React.MouseEvent<HTMLAnchorElement>, catId: string) => {
    if (catId === 'Adult Toys') return;
    event.preventDefault();
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-white/10 bg-vexa-ink text-stone-300" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="vexa-container py-12">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-white/10 pb-10 text-center lg:flex-row lg:items-start lg:text-start">
          <div className="flex flex-col items-center lg:items-start">
            <a href={localizeHref('/')} className="group flex select-none flex-col">
              <span className="text-2xl font-black leading-none tracking-wider text-vexa-pink transition group-hover:brightness-110">VEXA</span>
              <span className="mt-0.5 text-[10px] font-bold leading-none tracking-[0.32em] text-vexa-pink transition group-hover:brightness-110">TOYS</span>
            </a>
            <a href={localizeHref('/')} className="mt-3 text-xs font-medium text-stone-400 transition hover:text-white">
              {isArabic ? 'ألعاب ومنتجات للكبار في لبنان' : 'Sex Toys & Adult Toys in Lebanon'}
            </a>
          </div>

          {/* Verified contact only. Social icons return once real brand accounts exist. */}
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-start">
              <span className="text-[11px] font-semibold text-stone-400">{isArabic ? 'خدمة العملاء' : 'Customer care'}</span>
              <span className="text-xs text-stone-300">{isArabic ? 'واتساب فقط، بسرية تامة' : 'WhatsApp only, in confidence'}</span>
            </div>

            <a
              href="https://wa.me/96176730767"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-vexa-whatsapp px-4 py-2.5 text-black shadow-lg transition-all hover:brightness-95 active:scale-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <svg className="h-4 w-4 fill-black" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z"/>
                </svg>
              </span>
              <span className="flex flex-col text-start leading-tight">
                <span className="text-[10px] font-bold text-black/80">{isArabic ? 'واتساب فقط' : 'WhatsApp Only'}</span>
                <span className="text-xs font-black text-black" dir="ltr">+961 76 730 767</span>
              </span>
            </a>
          </div>
        </div>

        {/* Category links (crawlable) */}
        <nav className="border-b border-white/5 py-6" aria-label={isArabic ? 'فئات المتجر' : 'Shop categories'}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-stone-400">
            {FOOTER_CATEGORIES.map(cat => (
              <a
                key={cat.slug}
                href={localizeHref(`/${cat.slug}`)}
                onClick={event => handleCatLink(event, cat.id)}
                className="transition-colors hover:text-white"
              >
                {isArabic ? cat.ar : cat.en}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-[11px] text-stone-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Vexa Toys Lebanon. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium">
            {LEGAL_LINKS.map(link => (
              <a
                key={link.href}
                href={localizeHref(link.href)}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="transition hover:text-white"
              >
                {isArabic ? link.ar : link.en}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
