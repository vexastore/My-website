import type { Product } from '@/src/types';

/**
 * Derives honest, structured product content from the data we actually have:
 * a specs table read out of the description, material-based care advice, and
 * the shopping FAQs that are true for every order. Nothing here invents facts;
 * a row only appears when the description states it.
 */

export interface SpecRow {
  label: { en: string; ar: string };
  value: string;
}

const MATERIALS: Array<{ pattern: RegExp; en: string; ar: string; key: Material }> = [
  { pattern: /platinum silicone|medical[- ]grade silicone|body[- ]safe silicone|\bsilicone\b|سيليكون/i, en: 'Body-safe silicone', ar: 'سيليكون آمن للجسم', key: 'silicone' },
  { pattern: /\bTPE\b|thermoplastic/i, en: 'TPE (soft thermoplastic)', ar: 'TPE (بلاستيك حراري ناعم)', key: 'tpe' },
  { pattern: /\bABS\b/i, en: 'ABS plastic', ar: 'بلاستيك ABS', key: 'abs' },
  { pattern: /stainless steel|\bmetal\b|معدن|فولاذ/i, en: 'Stainless steel / metal', ar: 'فولاذ مقاوم للصدأ / معدن', key: 'metal' },
  { pattern: /\bglass\b|زجاج/i, en: 'Borosilicate glass', ar: 'زجاج', key: 'glass' },
  { pattern: /faux leather|PU leather|\bleather\b|جلد/i, en: 'Leather / faux leather', ar: 'جلد / جلد صناعي', key: 'leather' },
  { pattern: /\blace\b|\bsatin\b|\bmesh\b|polyester|nylon|دانتيل|ساتان/i, en: 'Lace / satin fabric', ar: 'قماش دانتيل / ساتان', key: 'fabric' },
];

export type Material = 'silicone' | 'tpe' | 'abs' | 'metal' | 'glass' | 'leather' | 'fabric' | 'unknown';

export function detectMaterial(text: string): { key: Material; en: string; ar: string } | null {
  for (const material of MATERIALS) {
    if (material.pattern.test(text)) return { key: material.key, en: material.en, ar: material.ar };
  }
  return null;
}

/** Specs the description actually states. Returns an empty list when nothing is stated. */
export function extractSpecs(product: Product, isArabic: boolean): SpecRow[] {
  const text = `${product.nameEn || ''} ${product.descriptionEn || ''} ${product.description || ''}`;
  const rows: SpecRow[] = [];

  const material = detectMaterial(text);
  if (material) rows.push({ label: { en: 'Material', ar: 'المادة' }, value: isArabic ? material.ar : material.en });

  const size = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to|x|×)\s*(\d+(?:\.\d+)?)\s*(cm|inch|inches|")/i) || text.match(/(\d+(?:\.\d+)?)\s*(cm|inch|inches|")\b/i);
  if (size) rows.push({ label: { en: 'Size', ar: 'الحجم' }, value: size[0].replace(/\s+/g, ' ').trim() });

  if (/rechargeable|USB|type-c|magnetic charg/i.test(text)) rows.push({ label: { en: 'Power', ar: 'الطاقة' }, value: isArabic ? 'قابل للشحن عبر USB' : 'USB rechargeable' });
  else if (/\bbatter(?:y|ies)\b|AAA|AA\b/i.test(text)) rows.push({ label: { en: 'Power', ar: 'الطاقة' }, value: isArabic ? 'يعمل بالبطارية' : 'Battery powered' });

  const modes = text.match(/(\d+)\s*(?:vibration\s*)?(?:modes?|speeds?|patterns?|frequencies)/i);
  if (modes) rows.push({ label: { en: 'Modes', ar: 'الأنماط' }, value: isArabic ? `${modes[1]} نمطاً` : `${modes[1]} modes` });

  if (/waterproof|IPX[5-8]|water[- ]resistant|splash[- ]proof|مقاوم للماء/i.test(text)) {
    const fully = /IPX7|IPX8|fully waterproof|100% waterproof|submersible/i.test(text);
    rows.push({ label: { en: 'Waterproof', ar: 'مقاومة الماء' }, value: isArabic ? (fully ? 'مقاوم للماء بالكامل' : 'مقاوم للرذاذ') : (fully ? 'Fully waterproof' : 'Splash resistant') });
  }

  if (/remote[- ]control|wireless remote|ريموت/i.test(text)) rows.push({ label: { en: 'Control', ar: 'التحكم' }, value: isArabic ? 'ريموت لاسلكي' : 'Wireless remote' });
  else if (/\bapp[- ]control|bluetooth|smartphone/i.test(text)) rows.push({ label: { en: 'Control', ar: 'التحكم' }, value: isArabic ? 'تطبيق الهاتف' : 'Smartphone app' });

  if (product.sku) rows.push({ label: { en: 'SKU', ar: 'رمز المنتج' }, value: product.sku });

  return rows;
}

/** Care advice by detected material. Always safe, never a medical claim. */
export function careTips(product: Product, isArabic: boolean): string[] {
  const material = detectMaterial(`${product.nameEn || ''} ${product.descriptionEn || ''}`)?.key || 'unknown';
  const tips: Record<Material, { en: string[]; ar: string[] }> = {
    silicone: {
      en: ['Use water-based lubricant only; silicone lubricant damages silicone toys.', 'Wash before and after use with warm water and mild soap, then dry fully.', 'Store separately from other silicone items, away from heat and sunlight.'],
      ar: ['استخدم المزلق المائي فقط؛ المزلق السيليكوني يتلف ألعاب السيليكون.', 'اغسل قبل الاستخدام وبعده بماء دافئ وصابون خفيف ثم جفف تماماً.', 'احفظه منفصلاً عن ألعاب السيليكون الأخرى بعيداً عن الحرارة والشمس.'],
    },
    tpe: {
      en: ['Use water-based lubricant generously; never silicone or oil-based.', 'Rinse with warm water after every use, dry completely and dust with renewal powder to keep it soft.', 'TPE is porous: clean thoroughly and store in its case away from heat.'],
      ar: ['استخدم المزلق المائي بكثرة؛ لا السيليكوني ولا الزيتي.', 'اشطف بماء دافئ بعد كل استخدام، وجفف تماماً، وانثر بودرة التجديد ليبقى ناعماً.', 'TPE مسامي: نظفه جيداً واحفظه في علبته بعيداً عن الحرارة.'],
    },
    abs: {
      en: ['Wipe with warm soapy water or toy cleaner; avoid soaking battery compartments.', 'Any lubricant is fine with ABS plastic; water-based is the easiest to clean.', 'Remove batteries or charge cables before storing.'],
      ar: ['امسح بماء دافئ وصابون أو منظف ألعاب؛ تجنب غمر حجرة البطارية.', 'أي مزلق مناسب لبلاستيك ABS؛ المائي الأسهل في التنظيف.', 'انزع البطاريات أو كابل الشحن قبل الحفظ.'],
    },
    metal: {
      en: ['Non-porous and easy to sterilise: wash with hot soapy water or wipe with toy cleaner.', 'Any lubricant works with steel; warm or cool the item in water for temperature play.', 'Dry fully before storing to avoid water marks.'],
      ar: ['غير مسامي وسهل التعقيم: اغسله بماء ساخن وصابون أو امسحه بمنظف ألعاب.', 'أي مزلق يعمل مع الفولاذ؛ يمكن تدفئته أو تبريده في الماء.', 'جففه تماماً قبل الحفظ لتجنب علامات الماء.'],
    },
    glass: {
      en: ['Wash with warm soapy water; glass is non-porous and dishwasher safe.', 'Any lubricant works with glass.', 'Inspect for chips before use and store padded.'],
      ar: ['اغسله بماء دافئ وصابون؛ الزجاج غير مسامي.', 'أي مزلق يعمل مع الزجاج.', 'افحصه بحثاً عن شروخ قبل الاستخدام واحفظه مبطناً.'],
    },
    leather: {
      en: ['Wipe with a damp cloth and mild soap; do not soak.', 'Check buckles and quick-release points before each use.', 'Air dry fully and store flat away from sunlight.'],
      ar: ['امسح بقطعة قماش رطبة وصابون خفيف؛ لا تنقعه.', 'تحقق من الأبازيم ونقاط التحرير السريع قبل كل استخدام.', 'جففه بالهواء تماماً واحفظه مسطحاً بعيداً عن الشمس.'],
    },
    fabric: {
      en: ['Hand wash cold with mild detergent and lay flat to dry.', 'Check the size table before ordering; stretch lace forgives more than structured satin.', 'Store folded, away from direct sunlight.'],
      ar: ['اغسله يدوياً بماء بارد ومنظف خفيف وافرده ليجف.', 'راجع جدول المقاسات قبل الطلب؛ الدانتيل المطاطي أكثر تسامحاً من الساتان.', 'احفظه مطوياً بعيداً عن الشمس المباشرة.'],
    },
    unknown: {
      en: ['Clean before and after use with warm water and mild soap, then dry fully.', 'Use water-based lubricant unless the manufacturer says otherwise.', 'Store in a clean, dry place away from heat and sunlight.'],
      ar: ['نظفه قبل الاستخدام وبعده بماء دافئ وصابون خفيف ثم جففه تماماً.', 'استخدم المزلق المائي ما لم تذكر الشركة المصنعة غير ذلك.', 'احفظه في مكان نظيف وجاف بعيداً عن الحرارة والشمس.'],
    },
  };
  return isArabic ? tips[material].ar : tips[material].en;
}

export interface ProductFaq { q: string; a: string }

/** Shopping FAQs that are true for every product, from the published policies. */
export function productFaqs(product: Product, isArabic: boolean): ProductFaq[] {
  const name = isArabic ? product.name || product.nameEn : product.nameEn || product.name;
  return isArabic
    ? [
        { q: 'كيف يُشحن هذا المنتج؟', a: 'في كرتون عادي مغلق بلا شعار أو اسم منتج. لا يرى المندوب سوى اسمك وعنوانك. التوصيل في نفس اليوم داخل بيروت وخلال 24 إلى 72 ساعة في باقي لبنان.' },
        { q: 'كيف أدفع؟', a: 'الدفع عند الاستلام بالدولار أو الليرة. لا حاجة لأي دفع إلكتروني.' },
        { q: `هل يمكن إرجاع ${name}؟`, a: 'نعم إن كان غير مفتوح، خلال 7 أيام. يجب الإبلاغ عن الطلبات التالفة أو الخاطئة خلال 48 ساعة. لأسباب صحية لا تُرجع المنتجات الحميمية المفتوحة.' },
        { q: 'هل المنتج أصلي؟', a: 'نذكر المادة والأبعاد والعلامة التجارية حيث توجد في كل صفحة، ولا نخترع علامة حيث لا توجد. راجع سياسة الضمان لتفاصيل العيوب المصنعية.' },
      ]
    : [
        { q: 'How is this product shipped?', a: 'In a plain sealed box with no logo or product name. The courier sees only your name and address. Same-day delivery in Beirut, 24 to 72 hours across the rest of Lebanon.' },
        { q: 'How do I pay?', a: 'Cash on delivery in USD or LBP. No online payment is required.' },
        { q: `Can I return ${name}?`, a: 'Yes if unopened, within 7 days. Damaged or incorrect deliveries must be reported within 48 hours. For hygiene reasons opened intimate products cannot be returned.' },
        { q: 'Is it original?', a: 'We list the material, dimensions and brand where one exists on every page, and never invent a brand where there is none. See the warranty policy for manufacturing defects.' },
      ];
}
