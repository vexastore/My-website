export interface CategoryMeta {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

/**
 * CATEGORY_META — canonical list of all routed category pages.
 *
 * IMPORTANT: Each entry must have a UNIQUE id.
 * /adult-toys is handled by app/adult-toys/page.tsx (a static standalone route)
 * and must NOT appear here — adding it caused duplicate id='Sex Toys' entries
 * which corrupted CATEGORY_TO_SLUG (making 'Sex Toys' → 'adult-toys') and
 * caused ~38 "Redirect Error" reports in Google Search Console because product
 * pages under /adult-toys/<slug> were redirecting to /sex-toys/<slug>.
 */
export const CATEGORY_META: CategoryMeta[] = [
  { id: 'Sex Toys', slug: 'sex-toys', titleAr: 'ألعاب جنسية في لبنان | العاب جنسيه | متجر فيكسا', titleEn: 'Sex Toys Lebanon | #1 Adult Store | Vexa Store', descAr: '500+ لعبة جنسية وزوجية في لبنان تُشحن بسرية تامة — صناديق مغلقة بدون شعار. هزازات، ديلدو، ألعاب رجالية والمزيد. توصيل في نفس اليوم في بيروت، دفع عند الاستلام. خصوصيتك مضمونة.', descEn: '500+ sex toys shipped discreetly across Lebanon — plain sealed boxes, no logo. Vibrators, Dildos, Male Toys & more. Same-day Beirut delivery, cash on delivery.' },
  { id: 'Vibrators', slug: 'vibrators', titleAr: 'هزازات فاخرة في لبنان | متجر فيكسا', titleEn: 'Vibrators Lebanon | Vexa Store', descAr: 'تسوّق 100+ هزاز في لبنان — نحيل، عصا، أرنب ونقطة G. سيليكون آمن للجسم. توصيل سري في نفس اليوم في بيروت. دفع عند الاستلام. خصوصيتك مضمونة.', descEn: 'Shop 100+ vibrators in Lebanon — bullet, wand, rabbit & G-spot styles. Body-safe silicone. Same-day discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Male Toys', slug: 'male-toys', titleAr: 'ألعاب رجالية في لبنان | متجر فيكسا', titleEn: 'Male Toys Lebanon | Vexa Store', descAr: 'تسوّق ألعاب رجالية في لبنان — أدوات استمناء، مضخات قضيب، حلقات وأكثر. توصيل سري في صندوق عادي في بيروت. دفع عند الاستلام. سريع وخاص.', descEn: 'Shop male sex toys in Lebanon — masturbators, penis pumps, cock rings & more. Discreet plain-box delivery in Beirut. Cash on delivery. Fast & 100% private.' },
  { id: 'Dildos', slug: 'dildos', titleAr: 'ديلدو في لبنان | سيليكون آمن | متجر فيكسا', titleEn: 'Dildo in Lebanon | Body-Safe Silicone | Vexa Store', descAr: 'اشتر ديلدو في لبنان — سيليكون آمن وواقعي بأحجام وأشكال متعددة. توصيل سري في نفس اليوم في بيروت. دفع عند الاستلام. تغليف 100% خاص بدون شعار.', descEn: 'Buy a dildo in Lebanon — body-safe silicone & realistic styles in every size. Same-day discreet delivery in Beirut. Cash on delivery. 100% private packaging.' },
  { id: 'Lingerie', slug: 'lingerie', titleAr: 'لانجري فاخر في لبنان | متجر فيكسا', titleEn: 'Lingerie Lebanon | Vexa Store', descAr: 'لانجري فاخر في لبنان — دانتيل، ساتان، بدلات جسم وأطقم حميمية أنيقة للنساء. توصيل سري وسريع في بيروت. دفع عند الاستلام.', descEn: 'Luxury lingerie in Lebanon — lace, satin sets, bodysuits & intimate kits for women. Elegant & sexy styles. Discreet fast delivery in Beirut. Cash on delivery.' },
  { id: 'BDSM', slug: 'bdsm', titleAr: 'BDSM في لبنان | ألعاب للأزواج | متجر فيكسا', titleEn: 'BDSM in Lebanon | Restraints, Blindfolds & More | Vexa Store', descAr: 'تسوّق BDSM في لبنان للمبتدئين والمحترفين — قيود، عصابات عين، مجاديف، ريش، أطقم أزواج وأكثر. مواد آمنة. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Shop BDSM in Lebanon — restraints, blindfolds, paddles & couples kits. Beginner to advanced. Body-safe materials. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Holiday Collection', slug: 'holiday-collection', titleAr: 'مجموعة الأعياد | هدايا للكبار في لبنان | متجر فيكسا', titleEn: 'Holiday Collection | Adult Gift Sets Lebanon | Vexa Store', descAr: 'هدايا للكبار في لبنان — أطقم أزواج، هدايا مميزة وعروض موسمية. تغليف سري وتوصيل سريع. مثالية لكل مناسبة.', descEn: 'Adult gift sets in Lebanon — couples kits, luxury bundles & seasonal deals. Discreet gift packaging, fast delivery. Perfect for any occasion.' },
  { id: 'New Arrivals', slug: 'new-arrivals', titleAr: 'منتجات جديدة في لبنان | متجر فيكسا', titleEn: 'New Arrivals Lebanon | Latest Adult Toys | Vexa Store', descAr: 'اكتشف أحدث المنتجات في متجر فيكسا — ألعاب جنسية جديدة، لانجري، ألعاب رجالية وأكثر. متاحة للتوصيل السري في لبنان. دفع عند الاستلام.', descEn: 'Discover the latest arrivals at Vexa Store Lebanon — new sex toys, lingerie, male toys & more. Available for discreet delivery in Lebanon. Cash on delivery.' },
  { id: 'Butt Plugs', slug: 'butt-plugs', titleAr: 'إضمامة شرجية في لبنان | متجر فيكسا', titleEn: 'Butt Plugs Lebanon | Vexa Store', descAr: 'تسوّق إضمامات شرجية في لبنان — سيليكون طبي، معدن وأشكال مختلفة للمبتدئين والمتقدمين. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Shop butt plugs in Lebanon — medical silicone, metal & various sizes for beginners & advanced. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Anal Toys', slug: 'anal-toys', titleAr: 'ألعاب شرجية في لبنان | متجر فيكسا', titleEn: 'Anal Toys Lebanon | Vexa Store', descAr: 'ألعاب شرجية في لبنان — خرز شرجي، دواخل وأكثر. مواد آمنة للجسم. توصيل سري وسريع في بيروت. دفع عند الاستلام.', descEn: 'Anal toys in Lebanon — anal beads, dildos, plugs & more. Body-safe materials. Discreet fast delivery in Beirut. Cash on delivery.' },
  { id: 'Bondage', slug: 'bondage', titleAr: 'أدوات البوندج في لبنان | متجر فيكسا', titleEn: 'Bondage Lebanon | Restraints & Kits | Vexa Store', descAr: 'أدوات بوندج في لبنان — قيود، حبال، عصابات عين وأكثر. للمبتدئين والمحترفين. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Bondage gear in Lebanon — restraints, ropes, blindfolds & more. Beginner to advanced. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Sex Dolls', slug: 'sex-dolls', titleAr: 'دمى جنسية في لبنان | متجر فيكسا', titleEn: 'Sex Dolls Lebanon | Vexa Store', descAr: 'دمى جنسية في لبنان — تورسو واقعية وأشكال متعددة بمواد آمنة. توصيل سري في بيروت وكل لبنان. دفع عند الاستلام.', descEn: 'Sex dolls in Lebanon — realistic torsos & multiple styles using body-safe materials. Discreet delivery in Beirut & all Lebanon. Cash on delivery.' },
  { id: 'Strap Ons', slug: 'strap-ons', titleAr: 'strap-on في لبنان | متجر فيكسا', titleEn: 'Strap Ons Lebanon | Vexa Store', descAr: 'تسوّق strap-on في لبنان — أطقم كاملة، مسخّرات وأحزمة بأحجام مختلفة. مواد آمنة. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Shop strap-ons in Lebanon — full kits, harnesses & dildos in various sizes. Body-safe materials. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Kegel Balls', slug: 'kegel-balls', titleAr: 'كرات كيجل في لبنان | متجر فيكسا', titleEn: 'Kegel Balls Lebanon | Vexa Store', descAr: 'كرات كيجل في لبنان — سيليكون طبي معتمد لتقوية عضلات الحوض. توصيل سري وسريع في بيروت. دفع عند الاستلام.', descEn: 'Kegel balls in Lebanon — certified medical silicone for pelvic floor strengthening. Discreet fast delivery in Beirut. Cash on delivery.' },
  { id: 'Sexual Enhancers', slug: 'sexual-enhancers', titleAr: 'معززات جنسية في لبنان | متجر فيكسا', titleEn: 'Sexual Enhancers Lebanon | Vexa Store', descAr: 'معززات جنسية في لبنان — كريمات تأخير، جلات تشحيم وأكثر لتعزيز المتعة والأداء. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Sexual enhancers in Lebanon — delay creams, enhancement gels & more to boost pleasure & performance. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Penis Pumps', slug: 'penis-pumps', titleAr: 'مضخات القضيب في لبنان | متجر فيكسا', titleEn: 'Penis Pumps Lebanon | Vexa Store', descAr: 'تسوّق مضخات القضيب في لبنان — يدوية وكهربائية بجودة طبية. لتعزيز الأداء والانتصاب. توصيل سري وسريع في بيروت. دفع عند الاستلام.', descEn: 'Shop penis pumps in Lebanon — manual & electric, medical-grade quality. Enhance performance & erection. Discreet fast delivery in Beirut. Cash on delivery.' },
  { id: 'Cock Rings', slug: 'cock-rings', titleAr: 'حلقات القضيب في لبنان | متجر فيكسا', titleEn: 'Cock Rings Lebanon | Vexa Store', descAr: 'تسوّق حلقات قضيب في لبنان — سيليكون طبي، معدن وأنواع مهتزة لتعزيز المتعة والأداء. مواد آمنة. توصيل سري في بيروت. دفع عند الاستلام.', descEn: 'Shop cock rings in Lebanon — medical silicone, metal & vibrating styles for enhanced pleasure. Body-safe. Discreet delivery in Beirut. Cash on delivery.' },
  { id: 'Masturbators', slug: 'masturbators', titleAr: 'أدوات الاستمناء في لبنان | متجر فيكسا', titleEn: 'Masturbators Lebanon | Vexa Store', descAr: 'أدوات استمناء رجالية فاخرة في لبنان — ملمس واقعي، أنماط متعددة وأكثر. توصيل سري في بيروت وكل لبنان. دفع عند الاستلام.', descEn: 'Premium male masturbators in Lebanon — realistic texture, multiple modes, pocket-style & more. Discreet delivery in Beirut & all Lebanon. Cash on delivery.' },
  { id: 'Chastity', slug: 'chastity', titleAr: 'أجهزة العفة في لبنان | متجر فيكسا', titleEn: 'Chastity Devices Lebanon | Vexa Store', descAr: 'تسوّق أجهزة عفة في لبنان — معدن، سيليكون وبلاستيك للأزواج واللعب المنفرد. توصيل سري في صندوق عادي في بيروت. دفع عند الاستلام.', descEn: 'Chastity cages & devices in Lebanon — metal, silicone & plastic styles for couples & solo play. Discreet plain-box delivery in Beirut. Cash on delivery.' },
  { id: 'Sex Machines', slug: 'sex-machines', titleAr: 'ماكينات الجنس في لبنان | متجر فيكسا', titleEn: 'Sex Machines Lebanon | Vexa Store', descAr: 'ماكينات جنس أوتوماتيكية في لبنان — اهتزاز ودفع للاستخدام المنفرد والأزواج. قوية وقابلة للشحن. توصيل سري في كل لبنان. دفع عند الاستلام.', descEn: 'Automatic sex machines in Lebanon — thrusting & vibrating for solo & couples play. Powerful & rechargeable. Discreet delivery across Lebanon. Cash on delivery.' },
  { id: 'Lubricants', slug: 'lubricants', titleAr: 'مواد التشحيم في لبنان | متجر فيكسا', titleEn: 'Lubricants Lebanon | Vexa Store', descAr: 'مواد تشحيم مائية وسيليكون في لبنان — آمنة للجسم، طويلة الأمد ولطيفة على البشرة. متوافقة مع جميع الألعاب. توصيل سري وسريع في بيروت.', descEn: 'Water-based & silicone lubricants in Lebanon — body-safe, long-lasting & skin-friendly. Compatible with all toys. Discreet fast delivery in Beirut. COD.' },
  { id: 'Poppers', slug: 'poppers', titleAr: 'بوبرز في لبنان | متجر فيكسا', titleEn: 'Poppers Lebanon | Vexa Store', descAr: 'اشتر بوبرز أونلاين في لبنان — Rush، Amsterdam، Jungle Juice وماركات أكثر. توصيل سري وسريع في بيروت وكل لبنان. دفع عند الاستلام.', descEn: 'Buy poppers online in Lebanon — Rush, Amsterdam, Jungle Juice & more top brands. Discreet fast delivery in Beirut & all Lebanon. Cash on delivery available.' },
];

export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  CATEGORY_META.map(c => [c.slug, c.id])
);

export const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORY_META.map(c => [c.id, c.slug])
);

export function getCategoryMeta(slug: string): CategoryMeta {
  return CATEGORY_META.find(c => c.slug === slug) || CATEGORY_META[0];
}
