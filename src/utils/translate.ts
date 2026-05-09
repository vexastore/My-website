const LS_KEY = 'vexa_ar_translations_v1';

export interface ArTranslation {
  name: string;
  description: string;
}

export const loadArCache = (): Record<string, ArTranslation> => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveArCache = (cache: Record<string, ArTranslation>) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cache)); } catch {}
};

const googleTranslate = async (text: string): Promise<string> => {
  if (!text || !text.trim()) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json() as unknown[][];
    return (data[0] as unknown[][])?.map(item => item[0] as string).join('') || text;
  } catch {
    return text;
  }
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const translateProducts = async (
  products: Array<{ id: string; nameEn?: string; name: string; descriptionEn?: string; description: string }>,
  existing: Record<string, ArTranslation>,
  onProgress: (updated: Record<string, ArTranslation>) => void
): Promise<Record<string, ArTranslation>> => {
  const cache = { ...existing };

  const missing = products.filter(p => {
    const src = p.nameEn || p.name;
    if (!cache[p.id]) return true;
    // Re-translate if original changed
    return false;
  });

  if (missing.length === 0) return cache;

  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    const srcName = p.nameEn || p.name;
    const srcDesc = p.descriptionEn || p.description;

    const [arName, arDesc] = await Promise.all([
      googleTranslate(srcName),
      googleTranslate(srcDesc),
    ]);

    cache[p.id] = { name: arName, description: arDesc };

    // Persist after every 3 products or last one
    if ((i + 1) % 3 === 0 || i === missing.length - 1) {
      saveArCache(cache);
      onProgress({ ...cache });
    }

    // Small delay to avoid rate limiting
    if (i < missing.length - 1) await sleep(120);
  }

  return cache;
};
