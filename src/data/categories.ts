export interface CategoryDef {
  id: string;
  name: { ar: string; en: string };
  titlePage: { ar: string; en: string };
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'Sex Toys',
    name: { ar: 'ألعاب زوجية', en: 'Sex Toys' },
    titlePage: { ar: 'ألعاب زوجية في لبنان - مجموعة جديدة متوفرة', en: 'Sex Toys Lebanon - New Collection Available' }
  },
  {
    id: 'Vibrators',
    name: { ar: 'هزازات', en: 'Vibrators' },
    titlePage: { ar: 'هزازات فاخرة - مجموعة مميزة متوفرة', en: 'Vibrators - Premium Collection Available' }
  },
  {
    id: 'Male Toys',
    name: { ar: 'ألعاب رجالية', en: 'Male Toys' },
    titlePage: { ar: 'ألعاب رجالية - وصلت حديثاً', en: 'Male Toys - New Arrivals Available' }
  },
  {
    id: 'Dildos',
    name: { ar: 'ديلدو', en: 'Dildos' },
    titlePage: { ar: 'ديلدو - منتجات آمنة وفاخرة', en: 'Dildos - Premium Body-Safe Collection' }
  },
  {
    id: 'Lingerie',
    name: { ar: 'لانجري', en: 'Lingerie' },
    titlePage: { ar: 'لانجري - مجموعة جديدة ومثيرة', en: 'Lingerie - New Sensual Collection' }
  },
  {
    id: 'BDSM',
    name: { ar: 'ألعاب القوة', en: 'BDSM' },
    titlePage: { ar: 'ألعاب القوة - أساسيات ناعمة وآمنة', en: 'BDSM - Soft Play Essentials' }
  },
  {
    id: 'Holiday Collection',
    name: { ar: 'مجموعة الأعياد', en: 'Holiday' },
    titlePage: { ar: 'مجموعة الأعياد - هدايا محدودة', en: 'Holiday Collection - Limited Gifts' }
  },
  {
    id: 'New Arrivals',
    name: { ar: 'وصل حديثاً', en: 'New Arrivals' },
    titlePage: { ar: 'وصل حديثاً - أحدث منتجات Vexa', en: 'New Arrivals - Fresh Vexa Drops' }
  }
];

export const getCategoryById = (id: string) => CATEGORIES.find(c => c.id === id);

export const getCategoryName = (id: string, lang: 'ar' | 'en') => {
  const cat = getCategoryById(id);
  return cat ? cat.name[lang] : id;
};

export const getCategoryTitle = (id: string, lang: 'ar' | 'en') => {
  const cat = getCategoryById(id);
  return cat ? cat.titlePage[lang] : id;
};

export const getProductCategories = (product: { category?: string; categories?: string[] }): string[] => {
  if (product.categories && product.categories.length > 0) return product.categories;
  if (product.category) return [product.category];
  return [];
};

export const productMatchesCategory = (
  product: { category?: string; categories?: string[] },
  activeCategory: string
): boolean => {
  const cats = getProductCategories(product);
  return cats.includes(activeCategory);
};
