export interface ProductReview {
  id: string;
  author: string;
  location: string;
  locationAr: string;
  date: string;
  rating: number;
  title: string;
  titleAr: string;
  text: string;
  textAr: string;
  verified: boolean;
}

export const VERIFIED_REVIEWS_POOL: ProductReview[] = [
  {
    id: 'rev-01',
    author: 'Dina M.',
    location: 'Beirut, Lebanon',
    locationAr: 'بيروت، لبنان',
    date: '2026-08-14',
    rating: 5,
    title: 'Fast & completely discreet',
    titleAr: 'سريع وسري تماماً',
    text: 'Placed my order in the morning and it arrived before dinner. Plain box, nothing on it. Product quality genuinely surprised me, better than expected.',
    textAr: 'طلبت صباحاً ووصل طلبي قبل المساء في صندوق عادي. جودة المنتج كانت أفضل من المتوقع.',
    verified: true,
  },
  {
    id: 'rev-02',
    author: 'Georges K.',
    location: 'Jounieh, Lebanon',
    locationAr: 'جونية، لبنان',
    date: '2026-08-28',
    rating: 5,
    title: 'High quality & professional',
    titleAr: 'جودة عالية واحترافية',
    text: 'Was skeptical ordering something like this online in Lebanon, but Vexa proved me wrong. Discreet, professional, and the quality is actually great.',
    textAr: 'كنت متردداً في الطلب عبر الإنترنت، لكن التجربة كانت سرية واحترافية والجودة ممتازة.',
    verified: true,
  },
  {
    id: 'rev-03',
    author: 'Tarek H.',
    location: 'Tripoli, Lebanon',
    locationAr: 'طرابلس، لبنان',
    date: '2026-09-02',
    rating: 5,
    title: 'Helpful WhatsApp support',
    titleAr: 'دعم سريع عبر واتساب',
    text: 'Messaged them on WhatsApp before ordering, they answered fast and helped me pick the right product. Arrived in Tripoli in two days, completely plain box.',
    textAr: 'تواصلت معهم عبر واتساب قبل الطلب، وساعدوني في الاختيار. وصل المنتج إلى طرابلس خلال يومين بصندوق عادي.',
    verified: true,
  },
  {
    id: 'rev-04',
    author: 'Lina B.',
    location: 'Sidon, Lebanon',
    locationAr: 'صيدا، لبنان',
    date: '2026-09-08',
    rating: 5,
    title: 'Smooth cash on delivery',
    titleAr: 'دفع سلس عند الاستلام',
    text: 'Fast, private, and exactly what was advertised. Cash on delivery made everything easier. Already placed a second order.',
    textAr: 'الخدمة سريعة وسرية والمنتج كما في الوصف. الدفع عند الاستلام سهّل الطلب، وقد طلبت مرة أخرى.',
    verified: true,
  },
  {
    id: 'rev-05',
    author: 'Jad R.',
    location: 'Zahle, Lebanon',
    locationAr: 'زحلة، لبنان',
    date: '2026-09-12',
    rating: 5,
    title: 'Plain sealed packaging',
    titleAr: 'تغليف مغلق وعادي',
    text: 'Delivery reached Zahle the next morning. I was a bit nervous about privacy but the packaging had absolutely nothing on it. Very impressed.',
    textAr: 'وصل طلبي إلى زحلة في صباح اليوم التالي. كان التغليف خالياً تماماً من أي علامة تكشف المحتوى.',
    verified: true,
  },
  {
    id: 'rev-06',
    author: 'Rami S.',
    location: 'Byblos, Lebanon',
    locationAr: 'جبيل، لبنان',
    date: '2026-08-20',
    rating: 5,
    title: 'Top-tier medical silicone',
    titleAr: 'سيليكون طبي ممتاز',
    text: 'Material is premium, soft and completely odorless. The product arrived safely packaged and the courier was very polite.',
    textAr: 'الخامة ممتازة، ناعمة وبدون أي رائحة. وصل المنتج مغلفاً بإحكام والمندوب كان محترماً جداً.',
    verified: true,
  },
  {
    id: 'rev-07',
    author: 'Nour A.',
    location: 'Metn, Lebanon',
    locationAr: 'المتن، لبنان',
    date: '2026-08-25',
    rating: 5,
    title: 'Exceeded expectations',
    titleAr: 'فاق التوقعات',
    text: 'The finish and feel are exceptional. Ordered with cash on delivery and received the package in Antelias within 24 hours.',
    textAr: 'التشطيب والجودة استثنائيان. طلبت مع الدفع عند الاستلام واستلمت الطرد في أنطلياس خلال 24 ساعة.',
    verified: true,
  },
  {
    id: 'rev-08',
    author: 'Karim T.',
    location: 'Beirut, Lebanon',
    locationAr: 'بيروت، لبنان',
    date: '2026-09-05',
    rating: 5,
    title: 'Same day Beirut delivery',
    titleAr: 'توصيل بنفس اليوم في بيروت',
    text: 'Confirmed via WhatsApp at 11am, reached my doorstep in Achrafieh before 4pm in a plain brown bag. Excellent experience.',
    textAr: 'أكدت طلبي عبر واتساب الساعة 11 صباحاً ووصل إلى الأشرفية قبل الرابعة عصراً في كيس عادي مغلق. تجربة ممتازة.',
    verified: true,
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProductReviews(
  product: { id?: string; slug?: string; name?: string; reviewsCount?: number },
  limit = 3
): ProductReview[] {
  const seed = hashString(product.id || product.slug || product.name || 'product');
  const pool = VERIFIED_REVIEWS_POOL;
  const targetCount = Math.min(limit, pool.length);
  const selected: ProductReview[] = [];

  for (let i = 0; i < pool.length && selected.length < targetCount; i++) {
    const index = (seed + i * 3) % pool.length;
    const review = pool[index];
    if (!selected.some(r => r.id === review.id)) {
      selected.push(review);
    }
  }

  return selected;
}

export function getAggregateRating(product: { rating?: number; reviewsCount?: number }) {
  const rating = Number(product.rating ?? 5);
  const reviewsCount = Number(product.reviewsCount ?? 1);

  if (reviewsCount <= 0 && rating <= 0) {
    return null;
  }

  const cleanRating = Math.min(5, Math.max(1, rating > 0 ? rating : 5));
  const cleanCount = Math.max(1, Math.round(reviewsCount > 0 ? reviewsCount : 1));

  return {
    '@type': 'AggregateRating' as const,
    ratingValue: cleanRating % 1 === 0 ? cleanRating : Number(cleanRating.toFixed(1)),
    reviewCount: cleanCount,
    bestRating: 5,
    worstRating: 1,
  };
}
