/**
 * Bilingual policy pages (terms, privacy, delivery, warranty, returns).
 *
 * Each policy is plain data in both languages, rendered by
 * `src/components/policy/PolicyPage.tsx`. Paragraph and list text accepts a
 * tiny inline markup: `**bold**` and `[label](href)`. Internal hrefs (`/terms`)
 * are localized to the page language when rendered; absolute hrefs
 * (`https://wa.me/...`) are rendered as plain external links.
 */

export type PolicyBlock =
  | string
  | { ul: string[] }
  | { ol: string[] }
  | { h3: string }
  | { address: string[] }
  | { box: string[] };

export interface PolicySection {
  title: string;
  blocks: PolicyBlock[];
}

export interface PolicyText {
  /** `<title>`, absolute. */
  seoTitle: string;
  description: string;
  /** Small label above the H1. */
  eyebrow: string;
  title: string;
  intro: PolicyBlock[];
  sections: PolicySection[];
}

export type PolicySlug = 'terms' | 'privacy' | 'delivery' | 'warranty' | 'returns';

export interface PolicyDocument {
  slug: PolicySlug;
  /** Open Graph image alt text (English, brand asset). */
  ogAlt: string;
  en: PolicyText;
  ar: PolicyText;
}
