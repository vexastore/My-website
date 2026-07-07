export interface BlogPost {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  readingTime: number; // minutes
  image?: string;
  keywords?: string[];
  keywordsAr?: string[];
}

export interface BlogCategory {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'guides',
    name: 'Product Guides',
    nameAr: 'دليل المنتجات',
    description: 'Comprehensive guides to help you choose the right products',
    descriptionAr: 'أدلة شاملة لمساعدتك في اختيار المنتج المناسب',
  },
  {
    slug: 'relationships',
    name: 'Relationships & Intimacy',
    nameAr: 'العلاقات والحميمية',
    description: 'Tips and advice for a healthy intimate relationship',
    descriptionAr: 'نصائح وإرشادات لعلاقة حميمة صحية',
  },
  {
    slug: 'tips',
    name: 'Tips & Care',
    nameAr: 'نصائح وعناية',
    description: 'How to use and care for your products safely',
    descriptionAr: 'كيفية استخدام المنتجات والعناية بها بأمان',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'vibrator-guide-lebanon',
    slug: 'vibrator-guide-lebanon',
    categorySlug: 'guides',
    title: 'Complete Vibrator Guide: How to Choose the Best One in Lebanon',
    titleAr: 'دليل الهزازات الشامل: كيف تختار الأفضل في لبنان',
    excerpt: 'Not sure which vibrator to choose? Our guide covers types, materials, and what to look for when buying your first or next vibrator in Lebanon.',
    excerptAr: 'لست متأكداً من أي هزاز تختار؟ دليلنا يغطي الأنواع والمواد وما يجب مراعاته عند شراء أول هزاز أو الهزاز القادم في لبنان.',
    content: `
## Why Choosing the Right Vibrator Matters

Finding the right vibrator can transform your intimate experience. Whether you're buying for the first time or looking to upgrade, understanding the key differences helps you make the best choice.

## Types of Vibrators Available

### 1. Bullet Vibrators
Compact and discreet, bullet vibrators are perfect for beginners. They target specific areas with precision and are easy to control. Great for solo play or couple play.

### 2. Wand Vibrators
Wand vibrators are powerful and versatile. They deliver broad, deep vibrations and are excellent for full-body massage and external stimulation.

### 3. Rabbit Vibrators
These dual-action vibrators stimulate internally and externally simultaneously. They are a popular choice for maximum pleasure.

### 4. G-Spot Vibrators
Curved specifically to reach the G-spot, these vibrators provide targeted internal stimulation with precision.

### 5. Clitoral Vibrators
Designed specifically for clitoral stimulation, often with different patterns and intensities.

## What Materials Are Safe?

When choosing a vibrator, always look for body-safe materials:

- **Silicone**: The gold standard. Non-porous, hypoallergenic, easy to clean.
- **ABS Plastic**: Hard, non-porous, and body-safe.
- **Glass**: Non-porous and can be temperature-played. Easy to clean.
- **Stainless Steel**: Durable, non-porous, and great for temperature play.

**Always avoid**: PVC, rubber, latex, or jelly materials — these are porous and can harbor bacteria.

## Key Features to Look For

1. **Waterproof/Splashproof**: Easier to clean and can be used in the shower.
2. **Rechargeable**: More eco-friendly and cost-effective than batteries.
3. **Quiet motor**: Important for discretion.
4. **Multiple vibration patterns**: Lets you explore different sensations.
5. **Body-safe material**: Non-negotiable for your health.

## Buying in Lebanon: What to Expect

At Vexa Store Lebanon, all vibrators are:
- 100% body-safe and certified
- Shipped in plain, unmarked boxes
- Available with cash on delivery
- Delivered same-day in Beirut

Start with a mid-range option if you're a beginner, and don't hesitate to contact our support team for personalized recommendations.
    `,
    contentAr: `
## لماذا يهم اختيار الهزاز الصحيح

إيجاد الهزاز المناسب يمكن أن يحوّل تجربتك الحميمة تحويلاً كبيراً. سواء كنت تشتري لأول مرة أو تبحث عن ترقية، فإن فهم الاختلافات الرئيسية يساعدك على اتخاذ القرار الأفضل.

## أنواع الهزازات المتوفرة

### 1. الهزاز النحيل (Bullet)
صغير وسهل الإخفاء، مثالي للمبتدئين. يستهدف مناطق محددة بدقة وسهل التحكم. رائع للاستخدام الفردي أو مع الشريك.

### 2. هزاز العصا (Wand)
قوي ومتعدد الاستخدامات. يوفر اهتزازات عميقة وواسعة، ممتاز لتدليك الجسم كله والتحفيز الخارجي.

### 3. الهزاز المزدوج (Rabbit)
هذا الهزاز ثنائي الحركة يحفز داخلياً وخارجياً في آنٍ واحد. خيار شائع لأقصى قدر من المتعة.

### 4. هزاز نقطة G
منحنٍ خصيصاً للوصول إلى نقطة G، يوفر تحفيزاً داخلياً دقيقاً ومتعمداً.

### 5. هزاز البظر
مصمم خصيصاً لتحفيز البظر، غالباً بأنماط وشدات مختلفة.

## ما هي المواد الآمنة؟

عند اختيار هزاز، ابحث دائماً عن المواد الآمنة للجسم:

- **السيليكون**: المعيار الذهبي. غير مسامي، مضاد للحساسية، سهل التنظيف.
- **البلاستيك ABS**: صلب، غير مسامي، وآمن للجسم.
- **الزجاج**: غير مسامي ويمكن استخدامه في لعب الحرارة. سهل التنظيف.
- **الفولاذ المقاوم للصدأ**: متين، غير مسامي، رائع للعب الحرارة.

**تجنب دائماً**: PVC والمطاط واللاتكس ومواد الهلام — هذه مسامية وقد تحتوي على بكتيريا.

## الميزات الأساسية للبحث عنها

1. **مقاوم للماء**: أسهل في التنظيف ويمكن استخدامه في الدش.
2. **قابل لإعادة الشحن**: أكثر صداقة للبيئة وأقل تكلفة من البطاريات.
3. **محرك هادئ**: مهم للخصوصية.
4. **أنماط اهتزاز متعددة**: يتيح لك استكشاف أحاسيس مختلفة.
5. **مواد آمنة للجسم**: غير قابل للتفاوض لصحتك.

## الشراء في لبنان: ماذا تتوقع

في متجر فيكسا لبنان، جميع الهزازات:
- آمنة 100% للجسم ومعتمدة
- تُشحن في علب عادية غير مميزة
- متاحة مع الدفع عند الاستلام
- توصيل في نفس اليوم في بيروت
    `,
    publishedAt: '2025-01-15',
    author: 'Vexa Store Team',
    readingTime: 6,
    keywords: ['vibrator guide', 'vibrators lebanon', 'sex toys guide', 'buy vibrator lebanon'],
    keywordsAr: ['دليل الهزازات', 'هزازات في لبنان', 'ألعاب زوجية', 'شراء هزاز في لبنان'],
  },
  {
    id: 'couples-intimacy-tips',
    slug: 'couples-intimacy-tips',
    categorySlug: 'relationships',
    title: '7 Ways Couples Can Deepen Intimacy and Connection in Lebanon',
    titleAr: '7 طرق يمكن للأزواج تعميق الحميمية والتواصل في لبنان',
    excerpt: 'Strong intimate connections are built on communication, trust, and exploration. Discover seven proven ways to deepen your bond as a couple.',
    excerptAr: 'تُبنى الروابط الحميمة القوية على التواصل والثقة والاستكشاف. اكتشف سبع طرق مُثبتة لتعميق رابطتك كزوجين.',
    content: `
## Building a Deeper Connection as a Couple

Intimacy is more than just physical closeness — it's emotional vulnerability, trust, and genuine understanding between partners. Here are seven evidence-based ways to deepen your connection.

## 1. Open Communication About Desires

The foundation of intimacy is honest conversation. Many couples struggle because they never discuss what they truly want. Start with low-pressure conversations about:
- What you enjoy most
- What you've always been curious about
- Any concerns or boundaries you have

Use "I feel" statements to express needs without blame.

## 2. Try New Experiences Together

Novelty activates the brain's reward system, creating excitement similar to early relationship stages. This could be:
- A new restaurant or activity
- Travel to a new destination
- Exploring new intimate products together

## 3. Prioritize Quality Time Without Screens

In Lebanon's busy lifestyle, carving out intentional time together is crucial. Even 30 minutes of undistracted time daily can significantly strengthen your bond.

## 4. Express Appreciation Daily

Research shows couples who regularly express gratitude have higher relationship satisfaction. Simple acknowledgments — "I appreciate how hard you work" or "Thank you for listening today" — create powerful positive cycles.

## 5. Physical Touch Beyond Intimacy

Non-sexual physical touch — holding hands, hugs, massage — releases oxytocin, the bonding hormone. Make it a daily practice.

## 6. Explore Together Safely

Introducing intimacy products can reignite excitement and create new shared experiences. The key is:
- Approaching it as an adventure, not a fix for problems
- Starting with something both partners feel comfortable with
- Going at a pace that feels right for both of you

## 7. Invest in Your Own Well-being

You can only give what you have. Exercise, adequate sleep, and stress management make you a better partner. Couples who both prioritize self-care report higher relationship satisfaction.

## Getting Started

Small, consistent actions build the deepest intimacy. Start with one item from this list today.
    `,
    contentAr: `
## بناء علاقة أعمق كزوجين

الحميمية أكثر من مجرد قرب جسدي — إنها الانكشاف العاطفي والثقة والتفاهم الحقيقي بين الشريكين. إليك سبع طرق مبنية على أدلة لتعميق رابطتك.

## 1. التواصل المفتوح حول الرغبات

أساس الحميمية هو المحادثة الصريحة. يعاني كثير من الأزواج لأنهم لا يناقشون أبداً ما يريدونه حقاً. ابدأ بمحادثات خفيفة الضغط حول:
- ما تستمتع به أكثر
- ما كنت فضولياً حياله دائماً
- أي مخاوف أو حدود لديك

استخدم عبارات "أشعر" للتعبير عن الاحتياجات دون لوم.

## 2. جرّب تجارب جديدة معاً

الجدة تنشّط نظام المكافأة في الدماغ، مما يخلق إثارة مماثلة للمراحل المبكرة من العلاقة. يمكن أن يكون هذا:
- مطعم أو نشاط جديد
- السفر إلى وجهة جديدة
- استكشاف منتجات حميمة جديدة معاً

## 3. أولوية لوقت جودة بدون شاشات

في نمط الحياة اللبناني المشغول، من الضروري تخصيص وقت متعمد معاً. حتى 30 دقيقة يومياً من الوقت غير المشتت يمكن أن تعزز رابطتك بشكل كبير.

## 4. عبّر عن التقدير يومياً

تظهر الأبحاث أن الأزواج الذين يعبرون بانتظام عن الامتنان يتمتعون برضا أعلى في العلاقة. الاعترافات البسيطة — "أقدر مجهودك" أو "شكراً لاستماعك اليوم" — تخلق دورات إيجابية قوية.

## 5. اللمس الجسدي خارج الحميمية

اللمس الجسدي غير الجنسي — مسك اليدين، الأحضان، التدليك — يطلق الأوكسيتوسين، هرمون الترابط. اجعله ممارسة يومية.

## 6. الاستكشاف معاً بأمان

يمكن أن يُعيد إدخال منتجات الحميمية الإثارة ويخلق تجارب مشتركة جديدة. المفتاح هو:
- التعامل معها كمغامرة، ليس كإصلاح للمشاكل
- البدء بشيء يشعر كلا الشريكين بالراحة معه
- المضي بالوتيرة المناسبة لكليكما

## 7. استثمر في صحتك الشخصية

يمكنك فقط أن تعطي ما تملكه. التمرين والنوم الكافي وإدارة التوتر تجعلك شريكاً أفضل. الأزواج الذين يُولون الاهتمام الذاتي أولوية يُبلّغون عن رضا أعلى في العلاقة.

## البدء

الأفعال الصغيرة والمتسقة تبني أعمق الروابط. ابدأ بعنصر واحد من هذه القائمة اليوم.
    `,
    publishedAt: '2025-02-10',
    author: 'Vexa Store Team',
    readingTime: 5,
    keywords: ['couples intimacy', 'relationship tips lebanon', 'deepen connection couple'],
    keywordsAr: ['حميمية الأزواج', 'نصائح العلاقات لبنان', 'تعميق الارتباط'],
  },
  {
    id: 'sex-toy-cleaning-care',
    slug: 'sex-toy-cleaning-care',
    categorySlug: 'tips',
    title: 'How to Clean and Store Your Intimate Products: A Complete Guide',
    titleAr: 'كيفية تنظيف وتخزين منتجاتك الحميمة: دليل شامل',
    excerpt: 'Proper cleaning and storage of intimate products is essential for your health and the longevity of your products. Learn the right methods for different materials.',
    excerptAr: 'التنظيف والتخزين السليم للمنتجات الحميمة ضروري لصحتك وطول عمر منتجاتك. تعلم الطرق الصحيحة للمواد المختلفة.',
    content: `
## Why Proper Cleaning Matters

Intimate products come into contact with sensitive body parts. Improper cleaning can lead to bacterial growth, infections, and product degradation. Here's everything you need to know.

## Cleaning by Material

### Silicone Products (Non-Motorized)
The easiest to clean. You can:
- Boil for 3 minutes
- Run through dishwasher (top rack, no detergent)
- Wash with mild soap and warm water

### Silicone Products (With Motor/Battery)
Never submerge in water unless the product is explicitly waterproof.
- Wipe with a damp cloth
- Use a mild antibacterial soap on the surface
- Do not soak

### ABS Plastic Products
- Wash with mild soap and warm water
- Wipe thoroughly dry
- Can use a toy cleaner spray

### Glass and Metal Products
- Can be boiled or put in dishwasher if no motor
- Wash with soap and water
- Excellent material for easy sterilization

### Products to Never Boil or Soak
- Battery-operated (unless waterproof)
- Any product with a charging port unless rated waterproof
- Leather or fabric components

## When to Use Toy Cleaner

Specialized toy cleaners are convenient and safe for all materials. Spray or pump directly onto the product, let it sit for 30 seconds, then rinse or wipe off. Great for between full washes.

## Drying Properly

Always dry completely before storage:
- Pat dry with a clean lint-free towel
- Allow to air dry fully (lay on a clean towel)
- Never store damp — this promotes mold and bacteria

## Storage Tips

Proper storage extends the life of your products significantly:

1. **Store separately**: Keep different products separated — some silicones can react with each other
2. **Use storage pouches**: Dust and debris can collect on stored products
3. **Keep away from direct sunlight**: UV can degrade materials
4. **Avoid extreme temperatures**: Store at room temperature
5. **Check batteries**: Remove batteries from battery-operated toys during storage

## How Often to Clean

- **Before first use**: Always
- **After every use**: Always
- **Before using with a different partner**: Always
- **After storage (if stored for a long time)**: Recommended

## Quick Reference

| Material | Safe to Boil | Dishwasher Safe | Soap & Water |
|----------|-------------|-----------------|--------------|
| Silicone (no motor) | ✅ | ✅ | ✅ |
| Silicone (motorized) | ❌ | ❌ | ✅ (wipe only) |
| ABS Plastic | ❌ | ❌ | ✅ |
| Glass | ✅ | ✅ | ✅ |
| Stainless Steel | ✅ | ✅ | ✅ |
    `,
    contentAr: `
## لماذا يهم التنظيف الصحيح

تلامس المنتجات الحميمة أجزاء حساسة من الجسم. التنظيف غير الصحيح يمكن أن يؤدي إلى نمو البكتيريا والعدوى وتدهور المنتج. إليك كل ما تحتاج معرفته.

## التنظيف حسب المادة

### منتجات السيليكون (بدون محرك)
الأسهل في التنظيف. يمكنك:
- الغلي لمدة 3 دقائق
- الوضع في غسالة الأطباق (الرف العلوي، بدون منظف)
- الغسل بصابون خفيف وماء دافئ

### منتجات السيليكون (مع محرك/بطارية)
لا تغمر في الماء أبداً ما لم يكن المنتج مقاوماً للماء صراحةً.
- امسح بقطعة قماش مبللة
- استخدم صابوناً خفيفاً مضاداً للبكتيريا على السطح
- لا تنقع

### منتجات البلاستيك ABS
- اغسل بصابون خفيف وماء دافئ
- جفف جيداً
- يمكن استخدام رذاذ منظف الألعاب

### منتجات الزجاج والمعدن
- يمكن غليها أو وضعها في غسالة الأطباق إذا لم يكن هناك محرك
- اغسل بالصابون والماء
- مادة ممتازة للتعقيم السهل

### منتجات لا يجب غليها أو نقعها أبداً
- تعمل بالبطارية (ما لم تكن مقاومة للماء)
- أي منتج به منفذ شحن ما لم يكن مصنفاً مقاوماً للماء
- مكونات الجلد أو القماش

## متى تستخدم منظف الألعاب

منظفات الألعاب المتخصصة مريحة وآمنة لجميع المواد. رش أو ضخ مباشرة على المنتج، اتركه 30 ثانية، ثم اشطفه أو امسحه. رائع بين الغسيل الكامل.

## التجفيف الصحيح

جفف دائماً بالكامل قبل التخزين:
- جفف بمنشفة نظيفة خالية من الوبر
- اترك يجف في الهواء بالكامل (ضعه على منشفة نظيفة)
- لا تخزن رطباً أبداً — هذا يعزز نمو العفن والبكتيريا

## نصائح التخزين

التخزين الصحيح يمدد عمر منتجاتك بشكل كبير:

1. **خزن بشكل منفصل**: احتفظ بالمنتجات المختلفة مفصولة — بعض أنواع السيليكون يمكن أن تتفاعل مع بعضها
2. **استخدم أكياس التخزين**: يمكن أن يتجمع الغبار والأوساخ على المنتجات المخزنة
3. **تجنب أشعة الشمس المباشرة**: الأشعة فوق البنفسجية يمكن أن تُدهور المواد
4. **تجنب درجات الحرارة القصوى**: خزن في درجة حرارة الغرفة
5. **تحقق من البطاريات**: أزل البطاريات من الألعاب التي تعمل بالبطارية أثناء التخزين

## عدد مرات التنظيف

- **قبل الاستخدام الأول**: دائماً
- **بعد كل استخدام**: دائماً
- **قبل الاستخدام مع شريك مختلف**: دائماً
- **بعد التخزين (إذا تم تخزينه لفترة طويلة)**: موصى به
    `,
    publishedAt: '2025-03-01',
    author: 'Vexa Store Team',
    readingTime: 5,
    keywords: ['clean sex toys', 'intimate products care', 'toy cleaning guide lebanon'],
    keywordsAr: ['تنظيف ألعاب جنسية', 'العناية بالمنتجات الحميمة', 'دليل تنظيف الألعاب لبنان'],
  },
  {
    id: 'lingerie-guide-lebanon',
    slug: 'lingerie-guide-lebanon',
    categorySlug: 'guides',
    title: 'Lingerie Buying Guide for Lebanon: What to Look for in Quality Lingerie',
    titleAr: 'دليل شراء اللانجري في لبنان: ما الذي تبحث عنه في اللانجري عالي الجودة',
    excerpt: 'From sizing to fabrics, our expert guide helps you choose lingerie that looks beautiful, feels comfortable, and lasts. Available with discreet delivery in Lebanon.',
    excerptAr: 'من المقاسات إلى الأقمشة، يساعدك دليلنا الخبير على اختيار لانجري يبدو جميلاً ومريحاً ودائماً. متاح مع التوصيل السري في لبنان.',
    content: `
## Finding the Perfect Lingerie

Great lingerie combines beauty, comfort, and fit. Whether you're buying for yourself or as a gift, knowing what to look for makes all the difference.

## Understanding Lingerie Types

### Bra and Panty Sets
The classic choice. Look for matching sets in quality fabrics. Consider:
- Underwire vs. wire-free based on your preference
- Lace, satin, mesh, or microfiber
- Full coverage vs. demi-cup vs. plunge

### Babydolls and Chemises
Flowing, flattering styles that work for all body types. Typically paired with matching panties or thongs.

### Corsets and Bustiers
Structured pieces that create an hourglass silhouette. Modern options use flexible boning for comfort.

### Bodysuits
Sleek and versatile. Can be worn as lingerie or styled with outerwear.

### Robes and Wraps
Perfect for completing a lingerie look. Silk and lace robes add elegance and warmth.

## Getting the Size Right

Sizing is crucial for both comfort and aesthetics. Here's how to measure:

**Bra Size:**
1. Measure your band size: measure just below your bust, parallel to the floor
2. Measure your cup size: measure at the fullest point of your bust
3. Subtract band from cup to determine cup letter (1" = A, 2" = B, etc.)

**Panty/Bottom Size:**
Measure around the fullest part of your hips. Compare to the brand's size chart.

## Materials Guide

### Lace
Beautiful and romantic. Look for stretch lace for better fit and comfort. Check that it doesn't irritate sensitive skin.

### Satin
Smooth and luxurious. Provides a polished, elegant look. Choose quality satin with a tight weave.

### Silk
The premium option. Natural temperature regulation. Hand wash only.

### Microfiber
Smooth, comfortable, and often seamless. Great for everyday wear under clothing.

### Mesh and Sheer
Available in many patterns. Creates a sensual look while remaining light and breathable.

## Quality Indicators

When evaluating lingerie quality, check:

1. **Stitching**: Should be even, tight, and not pulling
2. **Hardware**: Clasps and rings should feel solid
3. **Elastic**: Should be firm but flexible, not overly tight
4. **Fabric finish**: No loose threads or rough edges
5. **Lining**: Intimate areas should always be lined

## Caring for Your Lingerie

- **Hand wash or delicate cycle** in cold water
- Use a gentle detergent
- Never wring — press gently to remove water
- Lay flat or hang to dry (never tumble dry)
- Store folded or hung, not compressed

## Shopping in Lebanon

At Vexa Store Lebanon, all lingerie is:
- Shipped in completely plain packaging
- Available in multiple sizes
- Delivered same-day in Beirut
- Payment collected on delivery (no online payment needed)
    `,
    contentAr: `
## إيجاد اللانجري المثالي

اللانجري الرائع يجمع بين الجمال والراحة والملاءمة. سواء كنت تشتري لنفسك أو كهدية، فإن معرفة ما تبحث عنه تحدث الفرق.

## فهم أنواع اللانجري

### طقم الحمالة والملابس الداخلية
الخيار الكلاسيكي. ابحث عن أطقم متطابقة من أقمشة عالية الجودة. ضع في اعتبارك:
- مع أو بدون أسلاك بناءً على تفضيلك
- دانتيل، ساتان، شبكة، أو مايكروفايبر
- تغطية كاملة أو نصف كوب أو قنديل

### بابي دول وشيميز
أساليب منسابة تناسب جميع أشكال الجسم. عادةً ما تقترن بملابس داخلية أو ثونج متطابقة.

### كورسيه وبوستيه
قطع منظمة تخلق شكل الرمل. الخيارات الحديثة تستخدم عظاماً مرنة للراحة.

### بودي سوت
أنيق ومتعدد الاستخدامات. يمكن ارتداؤه كلانجري أو تنسيقه مع الملابس الخارجية.

### روب وحمّالات
مثالية لإكمال إطلالة اللانجري. الروب الحريري والدانتيل يضيفان أناقة ودفئاً.

## الحصول على المقاس الصحيح

المقاس بالغ الأهمية للراحة والجماليات. إليك كيفية القياس:

**مقاس الحمالة:**
1. قس حجم الحزام: قس مباشرة تحت نهديك، موازياً للأرض
2. قس حجم الكوب: قس عند أكمل نقطة في نهديك
3. اطرح الحزام من الكوب لتحديد حرف الكوب (2.5 سم = A، 5 سم = B، إلخ)

**مقاس السروال الداخلي:**
قس حول أكمل جزء من وركيك. قارن بجدول المقاسات الخاص بالعلامة التجارية.

## دليل المواد

### الدانتيل
جميل ورومانسي. ابحث عن دانتيل مرن لملاءمة وراحة أفضل. تحقق من أنه لا يهيج البشرة الحساسة.

### الساتان
ناعم وفاخر. يوفر مظهراً منصقاً وأنيقاً. اختر ساتاناً عالي الجودة بحياكة ضيقة.

### الحرير
الخيار المميز. تنظيم طبيعي لدرجة الحرارة. غسيل يدوي فقط.

### المايكروفايبر
ناعم ومريح وغالباً بدون درزات. رائع للارتداء اليومي تحت الملابس.

### شبكة وشفاف
متاح بأنماط عديدة. يخلق مظهراً حسياً مع الحفاظ على الخفة والتهوية.

## مؤشرات الجودة

عند تقييم جودة اللانجري، تحقق من:

1. **الخياطة**: يجب أن تكون متساوية وضيقة وغير مشدودة
2. **الأجهزة**: يجب أن تشعر المشابك والحلقات بالمتانة
3. **المطاط**: يجب أن يكون قوياً لكن مرناً، وليس ضيقاً بشكل مفرط
4. **إنهاء القماش**: لا خيوط فضفاضة أو حواف خشنة
5. **البطانة**: يجب دائماً أن تكون المناطق الحميمة مبطنة

## الشراء في لبنان

في متجر فيكسا لبنان، جميع اللانجري:
- يُشحن في تغليف عادي تماماً
- متوفر بمقاسات متعددة
- يُوصَّل في نفس اليوم في بيروت
- الدفع عند الاستلام (لا حاجة للدفع الإلكتروني)
    `,
    publishedAt: '2025-03-20',
    author: 'Vexa Store Team',
    readingTime: 6,
    keywords: ['lingerie guide', 'buy lingerie lebanon', 'lingerie sizes beirut'],
    keywordsAr: ['دليل اللانجري', 'شراء لانجري في لبنان', 'مقاسات اللانجري بيروت'],
  },
  {
    id: 'lubricants-guide',
    slug: 'lubricants-guide',
    categorySlug: 'tips',
    title: 'A Complete Guide to Lubricants: Types, Uses, and Safety',
    titleAr: 'دليل شامل للمزلقات: الأنواع والاستخدامات والسلامة',
    excerpt: 'Not all lubricants are created equal. Learn about water-based, silicone-based, and oil-based options, and how to choose the right one for your needs.',
    excerptAr: 'ليست جميع المزلقات متساوية. تعلم عن الخيارات المائية والسيليكون والزيتية، وكيفية اختيار المناسب لاحتياجاتك.',
    content: `
## Why Lubricants Matter

Lubrication reduces friction, increases comfort, and enhances sensation for all kinds of intimate activity. Using the right lubricant also protects your products and your body.

## Types of Lubricants

### Water-Based Lubricants

**The most versatile option.**

✅ Pros:
- Safe with all toy materials including silicone
- Easy to clean — washes off with water
- Won't stain sheets
- Safe with latex condoms
- Available in many formulas (sensitive, warming, flavored)

❌ Cons:
- Absorbs into skin, may need reapplication
- Not ideal for use in water (bath, pool)

**Best for**: All toys, latex condoms, everyday use, sensitive skin.

### Silicone-Based Lubricants

**Long-lasting and waterproof.**

✅ Pros:
- Lasts much longer than water-based
- Doesn't absorb into skin
- Great for use in water
- Very smooth feel

❌ Cons:
- Can degrade silicone toys
- Harder to wash off
- Not safe with silicone toy materials

**Best for**: Non-silicone toys, water play, when longevity is needed.

### Oil-Based Lubricants

**Natural and moisturizing.**

✅ Pros:
- Long-lasting
- Natural options available (coconut oil)
- Very moisturizing

❌ Cons:
- Not safe with latex condoms (breaks down latex)
- Can degrade silicone and latex toys
- Can cause bacterial infections in some people
- Harder to clean

**Best for**: Non-latex condoms, massage, external use only.

## Compatibility Guide

| Lubricant Type | Silicone Toys | Latex Condoms | Non-Latex Condoms |
|----------------|---------------|---------------|-------------------|
| Water-Based | ✅ Safe | ✅ Safe | ✅ Safe |
| Silicone-Based | ⚠️ Avoid | ✅ Safe | ✅ Safe |
| Oil-Based | ⚠️ Avoid | ❌ Unsafe | ✅ Safe |

## Ingredients to Avoid

Some lubricant ingredients can cause irritation or disrupt natural balance:

- **Glycerin**: Can cause yeast infections in some people
- **Parabens**: Potential hormone disruptors
- **Propylene Glycol**: Can cause irritation
- **Fragrances**: Common irritant, especially with sensitive skin
- **Petroleum (Petrolatum)**: Not body-safe for internal use

Look for formulas labeled: "paraben-free," "glycerin-free," "body-safe."

## How to Use Lubricant Safely

1. Apply a small amount and add more as needed
2. For toy use: apply to both yourself and the toy
3. Reapply water-based lubricants as needed
4. Store in a cool, dry place away from sunlight
5. Check expiration dates — expired lubricants can cause infections

## Choosing for Sensitive Skin

If you have sensitive skin, look for:
- Unflavored, unscented formulas
- Short, simple ingredient lists
- Formulas labeled "sensitive" or "for sensitive skin"
- pH-balanced formulas

Always patch test a new lubricant on your inner wrist before use.
    `,
    contentAr: `
## لماذا تهم مواد التشحيم

التشحيم يقلل الاحتكاك ويزيد الراحة ويعزز الإحساس لجميع أنواع النشاط الحميم. استخدام المزلق الصحيح يحمي أيضاً منتجاتك وجسمك.

## أنواع مواد التشحيم

### مواد التشحيم المائية

**الخيار الأكثر تنوعاً.**

✅ المميزات:
- آمن مع جميع مواد الألعاب بما في ذلك السيليكون
- سهل التنظيف — يُغسل بالماء
- لن يترك بقعاً على الشراشف
- آمن مع الواقيات الذكرية اللاتكسية
- متاح بصيغ عديدة (للحساسية، للتدفئة، بنكهات)

❌ العيوب:
- يمتصه الجلد، قد يحتاج إلى إعادة التطبيق
- ليس مثالياً للاستخدام في الماء (حمام، مسبح)

**الأفضل لـ**: جميع الألعاب، الواقيات اللاتكسية، الاستخدام اليومي، البشرة الحساسة.

### مواد التشحيم بالسيليكون

**دائمة ومقاومة للماء.**

✅ المميزات:
- تدوم أطول بكثير من المائية
- لا يمتصها الجلد
- رائعة للاستخدام في الماء
- إحساس ناعم جداً

❌ العيوب:
- يمكن أن تُدهور ألعاب السيليكون
- أصعب في الغسيل
- ليست آمنة مع مواد ألعاب السيليكون

**الأفضل لـ**: الألعاب غير السيليكونية، اللعب بالماء، عند الحاجة للديمومة.

### مواد التشحيم الزيتية

**طبيعية ومرطبة.**

✅ المميزات:
- دائمة
- خيارات طبيعية متاحة (زيت جوز الهند)
- مرطبة جداً

❌ العيوب:
- غير آمنة مع الواقيات اللاتكسية (تكسر اللاتكس)
- يمكن أن تُدهور ألعاب السيليكون واللاتكس
- قد تسبب التهابات بكتيرية لدى بعض الأشخاص
- أصعب في التنظيف

**الأفضل لـ**: الواقيات غير اللاتكسية، التدليك، الاستخدام الخارجي فقط.

## دليل المكونات التي يجب تجنبها

بعض مكونات مواد التشحيم يمكن أن تسبب تهيجاً أو تعطل التوازن الطبيعي:

- **الجليسرين**: قد يسبب عدوى الخميرة لدى بعض الأشخاص
- **البارابين**: مواد مخل محتملة بالهرمونات
- **بروبيلين غليكول**: قد يسبب تهيجاً
- **العطور**: مهيّج شائع، خاصةً مع البشرة الحساسة
- **البترول**: غير آمن للجسم للاستخدام الداخلي

ابحث عن صيغ مصنّفة: "خالي من البارابين"، "خالي من الجليسرين"، "آمن للجسم".

## كيفية استخدام مواد التشحيم بأمان

1. ضع كمية صغيرة وأضف المزيد حسب الحاجة
2. للاستخدام مع الألعاب: ضع على نفسك وعلى اللعبة
3. أعد تطبيق مواد التشحيم المائية حسب الحاجة
4. خزن في مكان بارد وجاف بعيداً عن أشعة الشمس
5. تحقق من تواريخ انتهاء الصلاحية — مواد التشحيم المنتهية يمكن أن تسبب التهابات
    `,
    publishedAt: '2025-04-05',
    author: 'Vexa Store Team',
    readingTime: 7,
    keywords: ['lubricant guide', 'lube types', 'water based lubricant lebanon', 'safe lubricant'],
    keywordsAr: ['دليل المزلقات', 'أنواع المزلقات', 'مزلق مائي في لبنان', 'مزلق آمن'],
  },
  {
    id: 'bdsm-beginners-guide',
    slug: 'bdsm-beginners-guide',
    categorySlug: 'guides',
    title: 'Beginner\'s Guide to BDSM: Safety, Communication, and Getting Started',
    titleAr: 'دليل المبتدئين للـ BDSM: السلامة والتواصل والبدء',
    excerpt: 'Curious about BDSM? Our beginner-friendly guide explains the basics of safe, consensual exploration — from communication to choosing your first products.',
    excerptAr: 'فضولي بشأن BDSM؟ دليلنا الصديق للمبتدئين يشرح أساسيات الاستكشاف الآمن والمتوافق — من التواصل إلى اختيار منتجاتك الأولى.',
    content: `
## What is BDSM?

BDSM stands for Bondage & Discipline, Dominance & Submission, Sadism & Masochism. It refers to a variety of consensual intimate practices involving power exchange, restraint, sensation, and role play.

The key word is **consensual** — all BDSM activities must be fully agreed upon by all participants.

## The Foundation: SSC and RACK

Two important frameworks guide safe BDSM practice:

**SSC (Safe, Sane, Consensual)**
- **Safe**: Taking proper precautions to minimize risk
- **Sane**: Acting with good judgment and awareness
- **Consensual**: All parties enthusiastically agree

**RACK (Risk-Aware Consensual Kink)**
Acknowledges that some activities carry inherent risk, but emphasizes that participants should be fully informed and consenting.

## Communication First

Before any exploration, have an honest conversation with your partner about:

1. **What you're curious about**: Share fantasies and interests without pressure
2. **Hard limits**: Things you're absolutely not comfortable with
3. **Soft limits**: Things you're unsure about but might try carefully
4. **Safe words**: A word or signal to immediately stop everything

**Choose a clear safe word**: Common options include "Red" (stop), "Yellow" (slow down), or any word unlikely to come up naturally in play.

## Starting Simple

For beginners, start with low-intensity exploration:

### Sensation Play
- Soft massage
- Temperature (ice cubes, warm water)
- Feather ticklers
- Blindfolds (removes one sense, heightens others)

### Light Restraint
- Soft restraint cuffs (velcro or fabric — not metal for beginners)
- Tying with soft scarves
- Bondage tape

### Role Play
- Power dynamic exploration without physical restraint
- Using costumes or scenarios

## Essential Safety Rules

1. **Never leave a restrained partner alone**
2. **Establish and respect safe words before you start**
3. **Check in regularly** — ask how your partner is doing
4. **Have safety scissors** if using restraints
5. **Never restrict breathing** under any circumstances
6. **Avoid wrists and ankles** for complex restraints as beginners
7. **Aftercare** — emotional and physical care after intense scenes

## Aftercare: Non-Negotiable

Aftercare is the period of care, comfort, and connection after BDSM play. It might include:
- Cuddling and physical warmth
- Gentle conversation
- Water and light snacks
- Reassurance and positive affirmation

Both partners may need aftercare — it's not just for the submissive partner.

## First Products to Explore

For beginners, start with:

- **Soft blindfold**: Simple, powerful, reversible
- **Velcro cuffs**: Easy to release in an emergency
- **Feather tickler**: Gentle sensation play
- **Massage candles**: Warm wax play with low-temp candles specifically designed for this
- **Light paddle or flogger**: For those curious about impact play

All available at Vexa Store Lebanon with discreet delivery.
    `,
    contentAr: `
## ما هو BDSM؟

BDSM اختصار لـ Bondage & Discipline, Dominance & Submission, Sadism & Masochism. يشير إلى مجموعة متنوعة من الممارسات الحميمة المتوافقة التي تتضمن تبادل القوة والتقييد والإحساس ولعب الأدوار.

الكلمة الأساسية هي **المتوافق** — يجب الاتفاق الكامل على جميع أنشطة BDSM من قبل جميع المشاركين.

## الأساس: SSC و RACK

إطاران مهمان يوجهان ممارسة BDSM الآمنة:

**SSC (آمن، عاقل، متوافق)**
- **آمن**: اتخاذ الاحتياطات المناسبة لتقليل المخاطر
- **عاقل**: التصرف بحكم جيد ووعي
- **متوافق**: يوافق جميع الأطراف بحماس

**RACK (الكينك المتوافق المدرك للمخاطر)**
يُقرّ بأن بعض الأنشطة تنطوي على مخاطر متأصلة، لكنه يؤكد أن المشاركين يجب أن يكونوا مُبلَّغين ومتوافقين بالكامل.

## التواصل أولاً

قبل أي استكشاف، أجرِ محادثة صادقة مع شريكك حول:

1. **ما الذي تشعر بالفضول حياله**: شارك الخيال والاهتمامات دون ضغط
2. **الحدود الصارمة**: أشياء لست مرتاحاً لها على الإطلاق
3. **الحدود اللينة**: أشياء لست متأكداً منها لكن قد تجربها بعناية
4. **الكلمات الآمنة**: كلمة أو إشارة لوقف كل شيء فوراً

**اختر كلمة آمنة واضحة**: الخيارات الشائعة تشمل "أحمر" (توقف)، "أصفر" (تباطأ)، أو أي كلمة من غير المرجح أن تظهر بشكل طبيعي في اللعب.

## البدء ببساطة

للمبتدئين، ابدأ باستكشاف منخفض الحدة:

### لعب الإحساس
- تدليك ناعم
- درجة الحرارة (مكعبات الثلج، الماء الدافئ)
- ريشة مُدغدغة
- غطاء العيون (يُزيل حاسة واحدة، يُعزز الحواس الأخرى)

### التقييد الخفيف
- أصفاد تقييد ناعمة (فيلكرو أو قماش — ليس معدناً للمبتدئين)
- الربط بالأوشحة الناعمة
- شريط التقييد

### لعب الأدوار
- استكشاف ديناميكية القوة دون تقييد جسدي
- استخدام الأزياء أو السيناريوهات

## قواعد السلامة الأساسية

1. **لا تترك شريكاً مقيداً وحيداً أبداً**
2. **أنشئ واحترم الكلمات الآمنة قبل البدء**
3. **تحقق بانتظام** — اسأل كيف حال شريكك
4. **احتفظ بمقص السلامة** عند استخدام القيود
5. **لا تقيد التنفس** تحت أي ظرف كان
6. **تجنب المعصمين والكاحلين** للقيود المعقدة كمبتدئين
7. **الرعاية اللاحقة** — الرعاية العاطفية والجسدية بعد المشاهد المكثفة

## الرعاية اللاحقة: غير قابل للتفاوض

الرعاية اللاحقة هي فترة الاهتمام والراحة والتواصل بعد لعب BDSM. قد تشمل:
- المعانقة والدفء الجسدي
- المحادثة اللطيفة
- الماء والوجبات الخفيفة
- الطمأنة والتأكيد الإيجابي

كلا الشريكين قد يحتاجان رعاية لاحقة — إنها ليست فقط للشريك الخاضع.

## المنتجات الأولى للاستكشاف

للمبتدئين، ابدأ بـ:

- **غطاء عيون ناعم**: بسيط وقوي وعكسي
- **أصفاد فيلكرو**: سهلة الفك في حالات الطوارئ
- **ريشة مدغدغة**: لعب إحساس لطيف
- **شمع التدليك**: لعب الشمع الدافئ بشموع منخفضة الحرارة مصممة خصيصاً لهذا الغرض

جميعها متوفرة في متجر فيكسا لبنان مع توصيل سري.
    `,
    publishedAt: '2025-04-15',
    author: 'Vexa Store Team',
    readingTime: 8,
    keywords: ['bdsm beginners guide', 'bdsm safe', 'bdsm lebanon', 'bondage guide'],
    keywordsAr: ['دليل BDSM للمبتدئين', 'BDSM آمن', 'BDSM في لبنان', 'دليل التقييد'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(c => c.slug === slug);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter(p => p.categorySlug === categorySlug);
}
