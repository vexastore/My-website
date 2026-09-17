export interface CategoryEditorial {
  guide: string;
  faqs: Array<{ q: string; a: string }>;
}

export function parseCategoryEditorial(value: unknown): CategoryEditorial | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as { guide?: unknown; faqs?: unknown };
  if (typeof row.guide !== 'string' || !Array.isArray(row.faqs)) return null;
  const faqs = row.faqs.filter((faq): faq is { q: string; a: string } =>
    typeof faq === 'object' && faq !== null && typeof faq.q === 'string' && typeof faq.a === 'string'
  );
  return { guide: row.guide, faqs };
}
