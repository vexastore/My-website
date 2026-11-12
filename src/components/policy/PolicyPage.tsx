import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { SiteFrame } from '@/src/components/SiteFrame';
import { localizePath, pageAlternates, SITE_BASE_URL } from '@/lib/localePath';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import type { PolicyBlock, PolicyDocument, PolicySlug } from '@/src/content/policies/types';

const OG_IMAGE = `${SITE_BASE_URL}/opengraph.jpg`;

/** Quick links shown at the bottom of every policy page. */
export const POLICY_NAV: Array<{ slug: PolicySlug; en: string; ar: string }> = [
  { slug: 'terms', en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
  { slug: 'privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  { slug: 'delivery', en: 'Delivery Policy', ar: 'سياسة التوصيل' },
  { slug: 'warranty', en: 'Warranty Policy', ar: 'سياسة الضمان' },
  { slug: 'returns', en: 'Refund & Returns Policy', ar: 'سياسة الاسترجاع والاستبدال' },
];

export function policyMetadata(policy: PolicyDocument, locale: StoreLocale): Metadata {
  const text = policy[locale];
  const alternates = pageAlternates(`/${policy.slug}`, locale);
  return {
    title: { absolute: text.seoTitle },
    description: text.description,
    alternates,
    openGraph: {
      title: text.seoTitle,
      description: text.description,
      url: alternates.canonical,
      siteName: 'Vexa Toys Lebanon',
      type: 'article',
      locale: locale === 'ar' ? 'ar_LB' : 'en_US',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: policy.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vexatoys',
      title: text.seoTitle,
      description: text.description,
      images: [OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

const LINK_CLASS = 'text-[#ff2d78] underline hover:text-white';

/** `**bold**` and `[label](href)`; internal hrefs follow the page language. */
function renderInline(text: string, locale: StoreLocale): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let key = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[3].startsWith('/')) {
      parts.push(<Link key={key++} href={localizePath(match[3], locale)} className={LINK_CLASS}>{match[2]}</Link>);
    } else {
      parts.push(<a key={key++} href={match[3]} className="text-[#ff2d78] hover:text-white">{match[2]}</a>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

function Block({ block, locale }: { block: PolicyBlock; locale: StoreLocale }) {
  if (typeof block === 'string') return <p>{renderInline(block, locale)}</p>;
  if ('ul' in block) {
    return (
      <ul className="list-disc space-y-2 ps-5 marker:text-[#ff2d78]">
        {block.ul.map((item, index) => <li key={index}>{renderInline(item, locale)}</li>)}
      </ul>
    );
  }
  if ('ol' in block) {
    return (
      <ol className="list-decimal space-y-2 ps-5 marker:font-bold marker:text-[#ff2d78]">
        {block.ol.map((item, index) => <li key={index}>{renderInline(item, locale)}</li>)}
      </ol>
    );
  }
  if ('h3' in block) return <h3 className="pt-2 text-base font-black text-white">{block.h3}</h3>;
  if ('address' in block) {
    return (
      <address className="not-italic text-stone-200">
        {block.address.map((line, index) => (
          <React.Fragment key={index}>
            {index > 0 && <br />}
            {renderInline(line, locale)}
          </React.Fragment>
        ))}
      </address>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-6 text-stone-300">
      {block.box.map((line, index) => <p key={index}>{renderInline(line, locale)}</p>)}
    </div>
  );
}

export function PolicyPage({ policy, locale }: { policy: PolicyDocument; locale: StoreLocale }) {
  const text = policy[locale];
  const pageUrl = `${SITE_BASE_URL}${localizePath(`/${policy.slug}`, locale)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: text.seoTitle,
    url: pageUrl,
    description: text.description,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'Vexa Toys Lebanon', url: SITE_BASE_URL },
  };

  return (
    <SiteFrame initialLocale={locale}>
      <div className="min-h-screen bg-vexa-ink text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <header className="mb-10 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff2d78]">{text.eyebrow}</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{text.title}</h1>
            <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300">
              {text.intro.map((block, index) => <Block key={index} block={block} locale={locale} />)}
            </div>
          </header>

          <div className="space-y-8">
            {text.sections.map(section => (
              <section key={section.title} className="border-t border-white/10 pt-8">
                <h2 className="mb-4 text-xl font-black text-white sm:text-2xl">{section.title}</h2>
                <div className="space-y-4 text-sm leading-7 text-stone-300">
                  {section.blocks.map((block, index) => <Block key={index} block={block} locale={locale} />)}
                </div>
              </section>
            ))}
          </div>

          <nav aria-label={locale === 'ar' ? 'السياسات والشؤون القانونية' : 'Legal and policies'} className="mt-14 border-t border-white/10 pt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              {locale === 'ar' ? 'السياسات والشؤون القانونية' : 'Policies & Legal'}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-300">
              {POLICY_NAV.map(item => (
                <Link
                  key={item.slug}
                  href={localizePath(`/${item.slug}`, locale)}
                  aria-current={item.slug === policy.slug ? 'page' : undefined}
                  className={item.slug === policy.slug ? 'font-bold text-[#ff2d78]' : 'transition hover:text-white'}
                >
                  {item[locale]}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </SiteFrame>
  );
}
