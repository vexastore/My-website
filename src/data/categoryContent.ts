/**
 * Structured, Lebanon-targeted editorial content for every category route.
 *
 * Where this lives and why:
 * - Supabase `category_editorial` holds one free-text guide and a FAQ list per
 *   category. Those still render (guide as a collapsible "full guide", FAQs
 *   in the FAQ block) so nothing written in the admin is lost.
 * - The structured parts below (hero intro, intro paragraphs, titled
 *   sections, related categories, blog guides) need a shape the table does
 *   not have, so they are versioned here. If the table later gains a JSON
 *   column with the same shape, `CategoryGuideSection` can prefer it.
 *
 * Writing rules: one clear topic per page ("<category> in Lebanon"), natural
 * sentences, no invented numbers, ratings or guarantees, links only to routes
 * that exist (category slugs, blog posts, policy pages).
 */

export interface Localized {
  en: string;
  ar: string;
}

export interface CategorySection {
  title: Localized;
  body: Localized;
}

export interface CategoryFaq {
  q: Localized;
  a: Localized;
}

export interface CategoryContent {
  /** One sentence under the H1. */
  heroIntro: Localized;
  /** Two short paragraphs that open the editorial block. */
  intro: [Localized, Localized];
  /** Three titled sub-sections (rendered as H3). */
  sections: CategorySection[];
  /** Category slugs to cross-link. Must exist in CATEGORY_META or be 'adult-toys'. */
  related: string[];
  /** Blog paths (without domain) that are live. */
  guides: Array<{ href: string } & Localized>;
  /** Fallback FAQs, used when the database row has none and always in Arabic. */
  faqs: CategoryFaq[];
}

const DELIVERY = {
  en: 'Every order ships in a plain sealed box with no logo or product name, arrives the same day in Beirut and within 24 to 72 hours across Lebanon, and is paid in cash on delivery. See the delivery policy for areas and timing.',
  ar: 'يصل كل طلب في كرتون عادي مغلق بدون شعار أو اسم منتج، في نفس اليوم داخل بيروت وخلال 24 إلى 72 ساعة في باقي لبنان، مع الدفع عند الاستلام. راجع سياسة التوصيل لمعرفة المناطق والتوقيت.',
};

const PRIVACY_FAQ: CategoryFaq = {
  q: { en: 'Is the order discreet?', ar: 'هل الطلب سري؟' },
  a: {
    en: 'Yes. The box is plain and sealed, the courier only sees a parcel, and your details are used for delivery only. Read the privacy policy for how your information is handled.',
    ar: 'نعم. الكرتون عادي ومغلق، ولا يرى المندوب سوى طرد، وتُستخدم بياناتك للتوصيل فقط. راجع سياسة الخصوصية لمعرفة كيفية التعامل مع معلوماتك.',
  },
};

const PAYMENT_FAQ: CategoryFaq = {
  q: { en: 'How do I pay?', ar: 'كيف أدفع؟' },
  a: {
    en: 'Cash on delivery in USD or LBP anywhere in Lebanon. You pay the courier when the sealed package arrives.',
    ar: 'الدفع عند الاستلام بالدولار أو الليرة في أي منطقة في لبنان. تدفع للمندوب عند وصول الطرد المغلق.',
  },
};

const RETURNS_FAQ: CategoryFaq = {
  q: { en: 'Can I return an item?', ar: 'هل يمكنني إرجاع منتج؟' },
  a: {
    en: 'Unopened items can be returned within 7 days, and damaged or incorrect deliveries must be reported within 48 hours. For hygiene reasons opened intimate products cannot be returned. The returns policy has the details.',
    ar: 'يمكن إرجاع المنتجات غير المفتوحة خلال 7 أيام، ويجب الإبلاغ عن الطلبات التالفة أو الخاطئة خلال 48 ساعة. لأسباب صحية لا يمكن إرجاع المنتجات الحميمية المفتوحة. التفاصيل في سياسة الاسترجاع.',
  },
};

const guide = (href: string, en: string, ar: string) => ({ href, en, ar });

const G = {
  vibrators: guide('/blog/guides/vibrator-guide-lebanon', 'How to choose a vibrator in Lebanon', 'كيف تختار الهزاز في لبنان'),
  dildos: guide('/blog/guides/dildos-lebanon-guide', 'Dildos in Lebanon: types and materials', 'الديلدو في لبنان: الأنواع والمواد'),
  male: guide('/blog/guides/male-sex-toys-lebanon-guide', 'Male sex toys in Lebanon: buying guide', 'ألعاب الرجال في لبنان: دليل الشراء'),
  dolls: guide('/blog/guides/sex-dolls-lebanon-guide', 'Sex dolls in Lebanon: types and features', 'الدمى في لبنان: الأنواع والمزايا'),
  bdsm: guide('/blog/guides/bdsm-beginners-guide', "BDSM beginner's guide", 'دليل المبتدئين في BDSM'),
  lingerie: guide('/blog/guides/lingerie-guide-lebanon', 'Lingerie guide for Lebanon', 'دليل اللانجري في لبنان'),
  couples: guide('/blog/guides/beginners-guide-adult-toys-couples-lebanon', "Beginner's guide for couples", 'دليل المبتدئين للأزواج'),
  app: guide('/blog/guides/app-controlled-vs-remote-controlled-toys', 'App-controlled vs remote-controlled toys', 'التحكم بالتطبيق مقابل الريموت'),
  battery: guide('/blog/guides/rechargeable-vs-battery-vibrators', 'Rechargeable vs battery vibrators', 'الهزازات القابلة للشحن مقابل البطارية'),
  gifts: guide('/blog/guides/couples-gift-guide-lebanon-2026', 'Couples gift guide Lebanon 2026', 'دليل هدايا الأزواج في لبنان 2026'),
  lube: guide('/blog/tips/lubricants-guide', 'Lubricants guide', 'دليل المزلقات'),
  care: guide('/blog/tips/sex-toy-cleaning-care', 'Cleaning and care', 'التنظيف والعناية'),
  privacy: guide('/blog/tips/privacy-guide-buy-adult-toys-lebanon', 'Buying adult toys privately in Lebanon', 'شراء منتجات الكبار بخصوصية في لبنان'),
  delivery: guide('/blog/advice/sex-toy-delivery-lebanon', 'How delivery works in Lebanon', 'كيف يعمل التوصيل في لبنان'),
  faq: guide('/blog/advice/sex-toys-in-lebanon-faq', 'Sex toys in Lebanon: FAQ', 'الألعاب الجنسية في لبنان: أسئلة شائعة'),
  firstCouples: guide('/blog/advice/how-to-choose-the-right-couples-toys-for-the-first-time', 'Choosing couples toys for the first time', 'اختيار ألعاب الأزواج للمرة الأولى'),
  silicone: guide('/blog/advice/the-importance-of-water-based-lubes-and-silicone-care', 'Water-based lube and silicone care', 'المزلق المائي والعناية بالسيليكون'),
};

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'sex-toys': {
    heroIntro: {
      en: 'Vibrators, dildos, couples toys, male toys and accessories, chosen for Lebanon and delivered discreetly to Beirut and every region.',
      ar: 'هزازات وديلدو وألعاب للأزواج وألعاب رجالية وإكسسوارات، مختارة للبنان وتصل بسرية إلى بيروت وكل المناطق.',
    },
    intro: [
      {
        en: 'This is the full sex toys range at Vexa Toys, the online adult store for Lebanon. It brings together vibrators, dildos, couples toys, male toys, anal toys, BDSM gear and the lubricants that go with them, so you can compare everything in one place before you order.',
        ar: 'هذه هي التشكيلة الكاملة للألعاب الجنسية في فيكسا تويز، المتجر الإلكتروني للكبار في لبنان. تجمع الهزازات والديلدو وألعاب الأزواج والألعاب الرجالية والألعاب الشرجية ومنتجات BDSM والمزلقات المناسبة لها، لتقارن كل شيء في مكان واحد قبل الطلب.',
      },
      {
        en: 'Buying sex toys in Lebanon used to mean visiting a shop in Beirut or guessing from an overseas website. Here every product page lists the material, size, power and care instructions, and the order reaches you in a plain sealed box with cash on delivery.',
        ar: 'كان شراء الألعاب الجنسية في لبنان يعني زيارة محل في بيروت أو التخمين من موقع أجنبي. هنا تعرض كل صفحة منتج المادة والحجم والطاقة وطريقة العناية، ويصلك الطلب في كرتون عادي مغلق مع الدفع عند الاستلام.',
      },
    ],
    sections: [
      {
        title: { en: 'Where to start', ar: 'من أين تبدأ' },
        body: {
          en: 'If you are new, a bullet vibrator, a simple silicone dildo or a vibrating couples ring are the easiest first choices. Browse vibrators for external and internal stimulation, dildos for realistic or classic shapes, and male toys for strokers, rings and pumps.',
          ar: 'إذا كنت مبتدئاً، فالهزاز الصغير أو الديلدو السيليكوني البسيط أو حلقة الأزواج المهتزة هي أسهل الخيارات الأولى. تصفّح الهزازات للتحفيز الخارجي والداخلي، والديلدو للأشكال الواقعية أو الكلاسيكية، والألعاب الرجالية للأدوات والحلقات والمضخات.',
        },
      },
      {
        title: { en: 'Materials and safety', ar: 'المواد والسلامة' },
        body: {
          en: 'Look for body-safe silicone, ABS or borosilicate glass, and read the dimensions before ordering. Use a water-based lubricant with silicone toys, clean before and after use, and store each toy separately. Our cleaning guide explains the routine.',
          ar: 'ابحث عن السيليكون الآمن للجسم أو ABS أو الزجاج البوروسيليكات، واقرأ الأبعاد قبل الطلب. استخدم مزلقاً مائياً مع ألعاب السيليكون، ونظّف قبل الاستخدام وبعده، واحفظ كل لعبة على حدة. دليل التنظيف يشرح الروتين.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['vibrators', 'dildos', 'male-toys', 'lingerie', 'bdsm', 'lubricants'],
    guides: [G.couples, G.firstCouples, G.care, G.privacy],
    faqs: [
      {
        q: { en: 'What is the best first sex toy for a couple in Lebanon?', ar: 'ما أفضل لعبة أولى للأزواج في لبنان؟' },
        a: {
          en: 'A vibrating couples ring or a small bullet vibrator suits most couples: both are quiet, simple and inexpensive. Pick a silicone model and add a water-based lubricant.',
          ar: 'حلقة الأزواج المهتزة أو الهزاز الصغير تناسب معظم الأزواج: كلاهما هادئ وبسيط وغير مكلف. اختر طرازاً من السيليكون وأضف مزلقاً مائياً.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  vibrators: {
    heroIntro: {
      en: 'Bullet, wand, rabbit, G-spot and air-pulse vibrators in body-safe silicone, delivered discreetly across Lebanon with cash on delivery.',
      ar: 'هزازات نحيلة وعصا وأرنب ونقطة G ونبض هوائي من السيليكون الآمن للجسم، تصل بسرية إلى كل لبنان مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Vibrators are the most searched sex toy in Lebanon and the easiest place to start. Vexa Toys stocks the main styles in rechargeable, waterproof and body-safe silicone versions, from compact bullets that fit in a pocket to wands with strong, broad vibration.',
        ar: 'الهزازات هي أكثر الألعاب بحثاً في لبنان وأسهل نقطة بداية. يوفر فيكسا تويز الأنواع الرئيسية بنسخ قابلة للشحن ومقاومة للماء ومن السيليكون الآمن للجسم، من الهزازات الصغيرة التي تدخل الجيب إلى العصي ذات الاهتزاز القوي والواسع.',
      },
      {
        en: 'Each product page lists the number of modes, whether it charges by USB, the noise level where known and the exact dimensions, so you can buy a vibrator online in Lebanon with the same confidence as in a store, and without the visit.',
        ar: 'تعرض كل صفحة منتج عدد الأنماط وإن كان يُشحن عبر USB ومستوى الصوت عند توفره والأبعاد الدقيقة، لتشتري هزازاً عبر الإنترنت في لبنان بثقة المتجر ومن دون الزيارة.',
      },
    ],
    sections: [
      {
        title: { en: 'Types of vibrators we stock', ar: 'أنواع الهزازات المتوفرة' },
        body: {
          en: 'Bullet vibrators for precise external stimulation, wand massagers for power, rabbit vibrators for internal and external at once, curved G-spot vibrators, wearable and app-controlled egg vibrators for couples, and air-pulse clitoral stimulators. Related dildos and kegel balls are a short step away.',
          ar: 'هزازات نحيلة للتحفيز الخارجي الدقيق، وعصي تدليك للقوة، وهزازات أرنب للداخل والخارج معاً، وهزازات منحنية لنقطة G، وهزازات بيضة قابلة للارتداء وبالتحكم عبر التطبيق للأزواج، ومحفزات بالنبض الهوائي. الديلدو وكرات كيجل على بعد خطوة.',
        },
      },
      {
        title: { en: 'How to choose', ar: 'كيف تختار' },
        body: {
          en: 'Decide between external, internal or dual stimulation first, then check the material (silicone over hard plastic), waterproofing for cleaning, and rechargeable versus battery power. Beginners usually prefer a small bullet or a slim rabbit before a large wand.',
          ar: 'حدد أولاً بين التحفيز الخارجي أو الداخلي أو المزدوج، ثم تحقق من المادة (السيليكون أفضل من البلاستيك الصلب) ومقاومة الماء للتنظيف والشحن مقابل البطارية. يفضّل المبتدئون عادةً هزازاً صغيراً أو أرنباً نحيلاً قبل العصا الكبيرة.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['dildos', 'kegel-balls', 'sex-toys', 'lubricants', 'strap-ons', 'sex-machines'],
    guides: [G.vibrators, G.battery, G.app, G.care],
    faqs: [
      {
        q: { en: 'Which vibrator is best for beginners?', ar: 'ما أفضل هزاز للمبتدئين؟' },
        a: {
          en: 'A small bullet or a slim rabbit vibrator. Both are quiet, easy to control and work with any water-based lubricant.',
          ar: 'هزاز صغير أو هزاز أرنب نحيل. كلاهما هادئ وسهل التحكم ويعمل مع أي مزلق مائي.',
        },
      },
      {
        q: { en: 'Are the vibrators waterproof and rechargeable?', ar: 'هل الهزازات مقاومة للماء وقابلة للشحن؟' },
        a: {
          en: 'Most models are USB rechargeable and splash-proof or fully waterproof. The exact rating is listed on each product page; check it before using a toy in the shower.',
          ar: 'معظم الطرازات تُشحن عبر USB ومقاومة للرذاذ أو للماء بالكامل. التصنيف الدقيق مذكور في صفحة كل منتج؛ تحقق منه قبل الاستخدام في الحمام.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  dildos: {
    heroIntro: {
      en: 'Realistic, classic, suction-cup and vibrating dildos in silicone, in every size, delivered discreetly anywhere in Lebanon.',
      ar: 'ديلدو واقعي وكلاسيكي وبقاعدة شفط ومهتز من السيليكون وبكل الأحجام، يصل بسرية إلى أي مكان في لبنان.',
    },
    intro: [
      {
        en: 'A dildo is the simplest intimate toy to understand and one of the most versatile. Vexa Toys carries dildos in Lebanon from slim beginner sizes to large realistic models, with suction-cup bases, harness-compatible flared bases and a few vibrating or thrusting versions.',
        ar: 'الديلدو هو أبسط لعبة حميمية للفهم ومن أكثرها تنوعاً. يوفر فيكسا تويز الديلدو في لبنان من الأحجام النحيلة للمبتدئين إلى الطرازات الواقعية الكبيرة، مع قواعد شفط وقواعد عريضة متوافقة مع الحزام وبعض النسخ المهتزة أو الدافعة.',
      },
      {
        en: 'Every listing shows the insertable length and diameter so you can pick a size that fits, and all dildos ship in plain packaging to Beirut the same day or across Lebanon within 72 hours.',
        ar: 'تعرض كل صفحة الطول القابل للإدخال والقطر لتختار الحجم المناسب، ويُشحن كل ديلدو بتغليف عادي إلى بيروت في نفس اليوم أو إلى كل لبنان خلال 72 ساعة.',
      },
    ],
    sections: [
      {
        title: { en: 'Which dildo to choose', ar: 'أي ديلدو تختار' },
        body: {
          en: 'Start with the diameter, not the length: 3 to 3.5 cm suits most beginners. Realistic dildos add texture and a soft dual-density feel, classic smooth shapes are easier to clean, and a suction-cup base allows hands-free use. A flared base is required if you plan to use it with a strap-on harness.',
          ar: 'ابدأ بالقطر لا الطول: 3 إلى 3.5 سم يناسب معظم المبتدئين. الديلدو الواقعي يضيف ملمساً وطبقة مزدوجة ناعمة، والأشكال الكلاسيكية الملساء أسهل في التنظيف، وقاعدة الشفط تسمح بالاستخدام دون يدين. القاعدة العريضة ضرورية إن كنت تنوي استخدامه مع حزام.',
        },
      },
      {
        title: { en: 'Materials and care', ar: 'المواد والعناية' },
        body: {
          en: 'Choose platinum silicone where possible; it is non-porous and lasts for years. Pair it with a water-based lubricant only, wash with warm water and mild soap, and store it away from other silicone toys.',
          ar: 'اختر السيليكون البلاتيني حيث أمكن؛ فهو غير مسامي ويدوم سنوات. استخدم معه مزلقاً مائياً فقط، واغسله بالماء الدافئ وصابون خفيف، واحفظه بعيداً عن ألعاب السيليكون الأخرى.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['vibrators', 'strap-ons', 'anal-toys', 'lubricants', 'sex-machines', 'sex-toys'],
    guides: [G.dildos, G.silicone, G.care, G.couples],
    faqs: [
      {
        q: { en: 'What size dildo should a beginner buy?', ar: 'ما حجم الديلدو المناسب للمبتدئ؟' },
        a: {
          en: 'Around 3 to 3.5 cm in diameter and 12 to 15 cm insertable. You can always go larger later; starting too big is the most common mistake.',
          ar: 'حوالي 3 إلى 3.5 سم قطراً و12 إلى 15 سم قابلة للإدخال. يمكنك الانتقال لحجم أكبر لاحقاً؛ البدء بحجم كبير هو الخطأ الأكثر شيوعاً.',
        },
      },
      {
        q: { en: 'Can I use a dildo with a strap-on harness?', ar: 'هل يمكن استخدام الديلدو مع حزام؟' },
        a: {
          en: 'Only models with a flared base fit a harness O-ring. The product page says whether a dildo is harness-compatible, and the strap-ons category lists complete kits.',
          ar: 'فقط الطرازات ذات القاعدة العريضة تناسب حلقة الحزام. تذكر صفحة المنتج إن كان متوافقاً مع الحزام، وفئة الأحزمة تعرض أطقماً كاملة.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'male-toys': {
    heroIntro: {
      en: 'Strokers, cock rings, penis pumps, chastity cages and delay products for men in Lebanon, shipped in plain packaging with cash on delivery.',
      ar: 'أدوات استمناء وحلقات ومضخات وأقفاص عفة ومنتجات تأخير للرجال في لبنان، تُشحن بتغليف عادي مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Male sex toys in Lebanon go far beyond the basic sleeve. This category gathers textured strokers and masturbators, vibrating and stretch cock rings, manual and electric penis pumps, chastity devices and prostate massagers, with the matching lubricants one click away.',
        ar: 'الألعاب الرجالية في لبنان تتجاوز الكم الأساسي بكثير. تجمع هذه الفئة أدوات الاستمناء المحززة، والحلقات المهتزة والمطاطية، ومضخات القضيب اليدوية والكهربائية، وأجهزة العفة، ومدلكات البروستاتا، مع المزلقات المناسبة على بعد نقرة.',
      },
      {
        en: 'Products are listed with their material, size and power source, and arrive at your door in Beirut or any Lebanese region in a sealed box that gives nothing away.',
        ar: 'تُعرض المنتجات مع المادة والحجم ومصدر الطاقة، وتصل إلى بابك في بيروت أو أي منطقة لبنانية في كرتون مغلق لا يكشف شيئاً.',
      },
    ],
    sections: [
      {
        title: { en: 'What is in this category', ar: 'ما تحتويه هذه الفئة' },
        body: {
          en: 'Masturbators and strokers for solo use, cock rings for firmer and longer erections, penis pumps for size and training, chastity cages for couples who enjoy control play, and prostate toys. Each has its own page with a buying guide.',
          ar: 'أدوات الاستمناء للاستخدام الفردي، والحلقات لانتصاب أقوى وأطول، ومضخات القضيب للحجم والتدريب، وأقفاص العفة للأزواج الذين يستمتعون بلعب التحكم، وألعاب البروستاتا. لكل منها صفحة خاصة مع دليل شراء.',
        },
      },
      {
        title: { en: 'Choosing well', ar: 'الاختيار الصحيح' },
        body: {
          en: 'For a first male toy, a soft TPE or silicone stroker with a water-based lubricant is the safest bet. Rings should stretch comfortably and never be worn for more than 20 to 30 minutes. Pumps need a slow, gradual approach; read the instructions before use.',
          ar: 'للعبة رجالية أولى، أداة ناعمة من TPE أو السيليكون مع مزلق مائي هي الخيار الأضمن. يجب أن تتمدد الحلقات براحة وألا تُلبس أكثر من 20 إلى 30 دقيقة. تحتاج المضخات إلى نهج بطيء وتدريجي؛ اقرأ التعليمات قبل الاستخدام.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['masturbators', 'cock-rings', 'penis-pumps', 'chastity', 'sexual-enhancers', 'sex-dolls'],
    guides: [G.male, G.lube, G.care, G.privacy],
    faqs: [
      {
        q: { en: 'What is the best male sex toy to start with?', ar: 'ما أفضل لعبة رجالية للبداية؟' },
        a: {
          en: 'A soft stroker or a stretchy cock ring. Both are inexpensive, simple to clean and work with any water-based lubricant.',
          ar: 'أداة استمناء ناعمة أو حلقة مطاطية. كلاهما غير مكلف وسهل التنظيف ويعمل مع أي مزلق مائي.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  lingerie: {
    heroIntro: {
      en: 'Lace, satin, bodysuits and intimate sets for women in Lebanon, delivered discreetly with cash on delivery.',
      ar: 'دانتيل وساتان وبدلات جسم وأطقم حميمية للنساء في لبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Lingerie in Lebanon is often a gift as much as a purchase for yourself. This collection focuses on pieces that photograph well and feel good on: lace bodysuits, satin sets, babydolls and role-play outfits, in sizes listed clearly on each page.',
        ar: 'اللانجري في لبنان غالباً ما يكون هدية بقدر ما هو شراء لنفسك. تركز هذه المجموعة على القطع التي تبدو جميلة وتُشعر بالراحة: بدلات جسم من الدانتيل، وأطقم ساتان، وبيبي دول، وأزياء لعب الأدوار، بمقاسات واضحة في كل صفحة.',
      },
      {
        en: 'Orders ship in the same plain packaging as every other Vexa Toys item, so a surprise stays a surprise until the box is opened.',
        ar: 'تُشحن الطلبات بنفس التغليف العادي ككل منتجات فيكسا تويز، لتبقى المفاجأة مفاجأة حتى فتح الصندوق.',
      },
    ],
    sections: [
      {
        title: { en: 'Finding the right size', ar: 'إيجاد المقاس المناسب' },
        body: {
          en: 'Lingerie sizing varies by maker, so measure bust, waist and hips and compare with the size table on the product page rather than relying on your usual dress size. Stretch lace and adjustable straps forgive more than structured satin.',
          ar: 'تختلف مقاسات اللانجري بين الشركات، لذا قِس الصدر والخصر والوركين وقارن مع جدول المقاسات في صفحة المنتج بدل الاعتماد على مقاس فستانك المعتاد. الدانتيل المطاطي والأحزمة القابلة للتعديل أكثر تسامحاً من الساتان المهيكل.',
        },
      },
      {
        title: { en: 'Pairing it with the rest of the store', ar: 'التنسيق مع باقي المتجر' },
        body: {
          en: 'Lingerie pairs naturally with the couples toys and gift sets in the holiday collection. For a first shared toy, a quiet vibrator or a couples ring completes the gift.',
          ar: 'ينسجم اللانجري طبيعياً مع ألعاب الأزواج وأطقم الهدايا في مجموعة الأعياد. للعبة مشتركة أولى، هزاز هادئ أو حلقة أزواج تكمل الهدية.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['sex-toys', 'holiday-collection', 'vibrators', 'bdsm', 'new-arrivals'],
    guides: [G.lingerie, G.gifts, G.couples, G.privacy],
    faqs: [
      {
        q: { en: 'Can lingerie be returned if the size is wrong?', ar: 'هل يمكن إرجاع اللانجري إذا كان المقاس خاطئاً؟' },
        a: {
          en: 'Unopened, unworn items with tags can be returned within 7 days under the returns policy. Check the size table before ordering to avoid the exchange.',
          ar: 'يمكن إرجاع القطع غير المفتوحة وغير الملبوسة مع البطاقات خلال 7 أيام وفق سياسة الاسترجاع. راجع جدول المقاسات قبل الطلب لتجنب الاستبدال.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  bdsm: {
    heroIntro: {
      en: 'Restraints, blindfolds, paddles, gags and beginner kits for consensual play in Lebanon, in plain packaging with cash on delivery.',
      ar: 'قيود وعصابات عين ومجاديف وكمامات وأطقم للمبتدئين للعب بالتراضي في لبنان، بتغليف عادي مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'BDSM gear in Lebanon ranges from a soft blindfold to a full bed restraint system. Vexa Toys stocks the pieces most couples actually use: wrist and ankle cuffs, under-bed straps, collars, ball gags, paddles, floggers and complete starter sets.',
        ar: 'تتراوح منتجات BDSM في لبنان من عصابة عين ناعمة إلى نظام قيود كامل للسرير. يوفر فيكسا تويز القطع التي يستخدمها معظم الأزواج فعلاً: أصفاد المعصم والكاحل، وأحزمة تحت السرير، وأطواق، وكمامات كروية، ومجاديف، وسياط، وأطقم بداية كاملة.',
      },
      {
        en: 'Everything is built around comfort and quick release, because good play depends on trust and clear limits more than on the equipment.',
        ar: 'كل شيء مبني على الراحة والتحرير السريع، لأن اللعب الجيد يعتمد على الثقة والحدود الواضحة أكثر من المعدات.',
      },
    ],
    sections: [
      {
        title: { en: 'Starting safely', ar: 'البداية بأمان' },
        body: {
          en: 'Agree on a safeword, start with soft cuffs or a blindfold, and keep scissors or quick-release buckles within reach. Never leave a restrained partner alone, and check circulation often. Our beginner guide covers the basics.',
          ar: 'اتفقا على كلمة أمان، وابدآ بأصفاد ناعمة أو عصابة عين، وأبقيا مقصاً أو أبازيم تحرير سريع في المتناول. لا تتركا الشريك المقيد وحده أبداً، وتحققا من الدورة الدموية باستمرار. دليل المبتدئين يشرح الأساسيات.',
        },
      },
      {
        title: { en: 'Materials', ar: 'المواد' },
        body: {
          en: 'Faux leather and neoprene cuffs are soft and easy to clean; metal pieces last longest. Silicone gags and plugs are body-safe. Bondage kits bundle several items at a lower price than buying separately.',
          ar: 'أصفاد الجلد الصناعي والنيوبرين ناعمة وسهلة التنظيف؛ القطع المعدنية تدوم أطول. الكمامات والسدادات السيليكونية آمنة للجسم. أطقم البوندج تجمع عدة قطع بسعر أقل من الشراء المنفصل.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['bondage', 'chastity', 'butt-plugs', 'lingerie', 'sex-toys'],
    guides: [G.bdsm, G.couples, G.privacy, G.care],
    faqs: [
      {
        q: { en: 'What should a BDSM beginner buy first?', ar: 'ماذا يشتري المبتدئ في BDSM أولاً؟' },
        a: {
          en: 'A blindfold and a pair of soft cuffs, or a small starter kit that includes both. Add a paddle or feather tickler once you know what you both enjoy.',
          ar: 'عصابة عين وزوج من الأصفاد الناعمة، أو طقم بداية صغير يشملهما. أضف مجدافاً أو ريشة دغدغة بعد أن تعرفا ما تستمتعان به.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  bondage: {
    heroIntro: {
      en: 'Cuffs, ropes, under-bed restraints and spreader bars for couples in Lebanon, delivered discreetly with cash on delivery.',
      ar: 'أصفاد وحبال وقيود تحت السرير وقضبان مباعدة للأزواج في لبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Bondage is the most approachable side of BDSM, and this category keeps it practical: adjustable cuffs, bed restraint systems that hide under the mattress, door swings, neck-to-wrist kits and spreader bars, all chosen for comfort and quick release.',
        ar: 'البوندج هو الجانب الأسهل من BDSM، وتُبقيه هذه الفئة عملياً: أصفاد قابلة للتعديل، وأنظمة قيود للسرير تختفي تحت الفراش، وأراجيح أبواب، وأطقم من الرقبة إلى المعصم، وقضبان مباعدة، كلها مختارة للراحة والتحرير السريع.',
      },
      {
        en: 'Every kit lists its parts and strap lengths so you know what fits your bed and your space before it arrives in Beirut or anywhere in Lebanon.',
        ar: 'تعرض كل مجموعة أجزاءها وأطوال الأحزمة لتعرف ما يناسب سريرك ومساحتك قبل وصولها إلى بيروت أو أي مكان في لبنان.',
      },
    ],
    sections: [
      {
        title: { en: 'Which restraint system', ar: 'أي نظام قيود' },
        body: {
          en: 'Under-bed straps are the easiest: no drilling, works with any mattress. Door swings suit small rooms. Spreader bars and neck-to-wrist kits are for couples who already enjoy cuffs and want more positions.',
          ar: 'أحزمة تحت السرير هي الأسهل: بلا حفر وتعمل مع أي فراش. أراجيح الأبواب تناسب الغرف الصغيرة. قضبان المباعدة وأطقم الرقبة إلى المعصم للأزواج الذين يستمتعون بالأصفاد أصلاً ويريدون أوضاعاً أكثر.',
        },
      },
      {
        title: { en: 'Comfort and safety', ar: 'الراحة والسلامة' },
        body: {
          en: 'Padded or faux-fur cuffs prevent marks. Keep straps snug but never tight, agree on a safeword and keep quick-release buckles or safety scissors nearby. Clean fabric straps by hand and let them dry fully.',
          ar: 'الأصفاد المبطنة أو بالفرو الصناعي تمنع العلامات. أبقِ الأحزمة محكمة لكن ليست ضيقة، واتفقا على كلمة أمان، وأبقيا أبازيم تحرير سريع أو مقص أمان قريباً. نظّف الأحزمة القماشية يدوياً واتركها تجف تماماً.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['bdsm', 'chastity', 'lingerie', 'sex-toys'],
    guides: [G.bdsm, G.couples, G.privacy],
    faqs: [
      {
        q: { en: 'Do under-bed restraints damage the bed?', ar: 'هل تتلف قيود تحت السرير السرير؟' },
        a: {
          en: 'No. The straps pass under the mattress and are held by its weight, so nothing is drilled or glued. They fit standard double and king sizes.',
          ar: 'لا. تمر الأحزمة تحت الفراش ويثبتها وزنه، فلا حفر ولا لصق. تناسب المقاسات المزدوجة والكبيرة القياسية.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'anal-toys': {
    heroIntro: {
      en: 'Beginner plugs, beads, prostate massagers, douches and training sets for Lebanon, shipped discreetly with cash on delivery.',
      ar: 'سدادات للمبتدئين وخرز ومدلكات بروستاتا ودوش وأطقم تدريب للبنان، تُشحن بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Anal toys in Lebanon cover more than butt plugs: this category also holds anal beads, prostate massagers, graduated training sets and the douches and lubricants that make the experience comfortable. Everything here has a flared base or retrieval loop for safety.',
        ar: 'الألعاب الشرجية في لبنان تتجاوز السدادات: تضم هذه الفئة أيضاً الخرز الشرجي ومدلكات البروستاتا وأطقم التدريب المتدرجة والدوش والمزلقات التي تجعل التجربة مريحة. كل منتج هنا له قاعدة عريضة أو حلقة سحب للسلامة.',
      },
      {
        en: 'Sizes are listed on every page, and the smallest items are genuinely small, which is where most people should start.',
        ar: 'الأحجام مذكورة في كل صفحة، وأصغر المنتجات صغيرة فعلاً، وهنا يجب أن يبدأ معظم الناس.',
      },
    ],
    sections: [
      {
        title: { en: 'Start small, use lubricant', ar: 'ابدأ صغيراً واستخدم المزلق' },
        body: {
          en: 'Choose a slim silicone plug or the smallest piece of a training set, use a generous amount of water-based or hybrid lubricant, and go slowly. A base wider than the toy is not optional.',
          ar: 'اختر سدادة سيليكونية نحيلة أو أصغر قطعة في طقم التدريب، واستخدم كمية سخية من المزلق المائي أو الهجين، وتقدّم ببطء. القاعدة الأعرض من اللعبة ليست خياراً.',
        },
      },
      {
        title: { en: 'Hygiene', ar: 'النظافة' },
        body: {
          en: 'Wash with warm water and mild soap before and after use, keep anal toys separate from other toys, and consider an anal douche beforehand. Non-porous silicone, glass and stainless steel are the easiest to keep clean.',
          ar: 'اغسل بالماء الدافئ وصابون خفيف قبل الاستخدام وبعده، وأبقِ الألعاب الشرجية منفصلة عن غيرها، وفكّر في استخدام دوش شرجي قبلها. السيليكون غير المسامي والزجاج والفولاذ المقاوم للصدأ هي الأسهل في التنظيف.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['butt-plugs', 'lubricants', 'dildos', 'male-toys', 'strap-ons'],
    guides: [G.lube, G.care, G.male, G.privacy],
    faqs: [
      {
        q: { en: 'What is the best anal toy for a beginner?', ar: 'ما أفضل لعبة شرجية للمبتدئ؟' },
        a: {
          en: 'A small silicone plug with a wide base, or a three-piece training set so you can progress at your own pace. Always use lubricant.',
          ar: 'سدادة سيليكونية صغيرة بقاعدة عريضة، أو طقم تدريب من ثلاث قطع لتتقدم بوتيرتك. استخدم المزلق دائماً.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'butt-plugs': {
    heroIntro: {
      en: 'Silicone, metal and jewelled butt plugs in beginner to advanced sizes for Lebanon, delivered in plain packaging.',
      ar: 'سدادات من السيليكون والمعدن والمرصعة بأحجام للمبتدئين والمتقدمين في لبنان، تصل بتغليف عادي.',
    },
    intro: [
      {
        en: 'Butt plugs are the most popular anal toy for beginners and couples because they are simple: insert, relax and enjoy the sensation of fullness. Vexa Toys offers butt plugs in Lebanon in silicone, stainless steel and jewelled designs, singly or in graduated sets.',
        ar: 'سدادات المؤخرة هي أشهر لعبة شرجية للمبتدئين والأزواج لأنها بسيطة: أدخل واسترخِ واستمتع بالإحساس بالامتلاء. يوفر فيكسا تويز السدادات في لبنان من السيليكون والفولاذ المقاوم للصدأ والتصاميم المرصعة، منفردة أو في أطقم متدرجة.',
      },
      {
        en: 'Each page lists the insertable length, the widest diameter and the base type, so you can compare before ordering to Beirut or anywhere in Lebanon.',
        ar: 'تعرض كل صفحة الطول القابل للإدخال وأعرض قطر ونوع القاعدة، لتقارن قبل الطلب إلى بيروت أو أي مكان في لبنان.',
      },
    ],
    sections: [
      {
        title: { en: 'Silicone or metal', ar: 'سيليكون أم معدن' },
        body: {
          en: 'Silicone is soft, warm and forgiving, ideal for a first plug and for longer wear. Stainless steel is heavier, holds temperature and is the easiest to sterilise. Jewelled plugs are usually metal and chosen for looks as much as feel.',
          ar: 'السيليكون ناعم ودافئ ومتسامح، مثالي للسدادة الأولى وللارتداء الأطول. الفولاذ أثقل ويحتفظ بالحرارة وهو الأسهل في التعقيم. السدادات المرصعة عادةً معدنية وتُختار للشكل بقدر الإحساس.',
        },
      },
      {
        title: { en: 'Sizing and wear time', ar: 'الحجم ومدة الارتداء' },
        body: {
          en: 'Begin with a plug under 3 cm wide. Short sessions first, building up gradually, always with water-based lubricant. Stop if anything hurts; discomfort is a signal to go smaller or slower.',
          ar: 'ابدأ بسدادة عرضها أقل من 3 سم. جلسات قصيرة أولاً مع تدرج، ودائماً مع مزلق مائي. توقف إذا شعرت بألم؛ الانزعاج إشارة للانتقال إلى حجم أصغر أو وتيرة أبطأ.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['anal-toys', 'lubricants', 'dildos', 'bdsm'],
    guides: [G.lube, G.care, G.privacy],
    faqs: [
      {
        q: { en: 'How long can a butt plug be worn?', ar: 'كم مدة ارتداء السدادة؟' },
        a: {
          en: 'Start with 10 to 20 minutes and never sleep with one in. Experienced users wear silicone plugs for an hour or two at most, reapplying lubricant as needed.',
          ar: 'ابدأ بـ10 إلى 20 دقيقة ولا تنم بها أبداً. يرتدي المستخدمون ذوو الخبرة السدادات السيليكونية لساعة أو ساعتين كحد أقصى مع إعادة وضع المزلق عند الحاجة.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'sex-dolls': {
    heroIntro: {
      en: 'Realistic torsos and full-size dolls in TPE and silicone for Lebanon, shipped discreetly with cash on delivery.',
      ar: 'تورسو واقعي ودمى بالحجم الكامل من TPE والسيليكون للبنان، تُشحن بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Sex dolls in Lebanon have moved on from inflatable novelties. The models here use TPE or silicone with a realistic skin feel, from compact torsos that store easily to full-size dolls with articulated skeletons. Dimensions and weight are listed on every page.',
        ar: 'تجاوزت الدمى في لبنان مرحلة الدمى القابلة للنفخ. تستخدم الطرازات هنا TPE أو السيليكون بملمس واقعي للبشرة، من التورسو المدمج سهل التخزين إلى الدمى بالحجم الكامل بهيكل متحرك. الأبعاد والوزن مذكورة في كل صفحة.',
      },
      {
        en: 'Larger items ship in unmarked boxes like everything else, and our team can answer sizing or delivery questions privately on WhatsApp before you order.',
        ar: 'تُشحن القطع الكبيرة في صناديق بلا علامات ككل شيء آخر، ويمكن لفريقنا الإجابة بسرية عبر واتساب عن أسئلة الحجم أو التوصيل قبل الطلب.',
      },
    ],
    sections: [
      {
        title: { en: 'Torso or full size', ar: 'تورسو أم حجم كامل' },
        body: {
          en: 'A torso or hip model costs less, weighs a few kilograms and fits in a drawer. Full-size dolls are heavier and need storage space but offer poseable limbs. Think about where it will live before choosing.',
          ar: 'التورسو أو طراز الوركين أقل تكلفة ويزن بضعة كيلوغرامات ويدخل في درج. الدمى بالحجم الكامل أثقل وتحتاج مساحة تخزين لكنها توفر أطرافاً قابلة للوضع. فكّر أين ستُحفظ قبل الاختيار.',
        },
      },
      {
        title: { en: 'TPE versus silicone, and care', ar: 'TPE مقابل السيليكون والعناية' },
        body: {
          en: 'TPE is softer and more affordable but porous, so it needs thorough cleaning and powdering. Silicone costs more, is non-porous and lasts longer. Use water-based lubricant only and dry fully after washing.',
          ar: 'TPE أنعم وأرخص لكنه مسامي، لذا يحتاج تنظيفاً دقيقاً وتبويدراً. السيليكون أغلى وغير مسامي ويدوم أطول. استخدم المزلق المائي فقط وجفف تماماً بعد الغسل.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['masturbators', 'male-toys', 'lubricants', 'sexual-enhancers'],
    guides: [G.dolls, G.male, G.care, G.delivery],
    faqs: [
      {
        q: { en: 'How is a sex doll delivered in Lebanon?', ar: 'كيف تُسلَّم الدمية في لبنان؟' },
        a: {
          en: 'In a plain, unmarked box with no description of the contents. Delivery timing depends on the item size and your area and is confirmed when you order.',
          ar: 'في صندوق عادي بلا علامات أو وصف للمحتوى. يعتمد توقيت التوصيل على حجم المنتج ومنطقتك ويُؤكد عند الطلب.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  'strap-ons': {
    heroIntro: {
      en: 'Adjustable harnesses, complete strap-on kits and harness-compatible dildos for couples in Lebanon, delivered discreetly.',
      ar: 'أحزمة قابلة للتعديل وأطقم كاملة وديلدو متوافق مع الحزام للأزواج في لبنان، تصل بسرية.',
    },
    intro: [
      {
        en: 'Strap-ons in Lebanon are used by couples of every kind. This category has complete kits with a harness and dildo, double-ended wearable models, and harnesses with interchangeable O-rings that accept any flared-base dildo from our dildos range.',
        ar: 'تُستخدم الأحزمة في لبنان من أزواج من كل الأنواع. تضم هذه الفئة أطقماً كاملة بحزام وديلدو، وطرازات مزدوجة قابلة للارتداء، وأحزمة بحلقات O قابلة للتبديل تقبل أي ديلدو بقاعدة عريضة من مجموعتنا.',
      },
      {
        en: 'Waist ranges and dildo dimensions are listed on each page so the kit fits the first time.',
        ar: 'نطاقات الخصر وأبعاد الديلدو مذكورة في كل صفحة ليناسب الطقم من المرة الأولى، ويصل الطلب إلى بيروت أو أي منطقة في لبنان بتغليف عادي لا يكشف المحتوى.',
      },
    ],
    sections: [
      {
        title: { en: 'Kit or separate pieces', ar: 'طقم أم قطع منفصلة' },
        body: {
          en: 'A kit is the simplest start. If you already own a flared-base dildo, a harness with interchangeable rings lets you reuse it. Wearable double dildos skip the harness entirely but need more practice.',
          ar: 'الطقم هو أبسط بداية. إذا كنت تملك ديلدو بقاعدة عريضة، فحزام بحلقات قابلة للتبديل يتيح إعادة استخدامه. الديلدو المزدوج القابل للارتداء يستغني عن الحزام لكنه يحتاج تدريباً أكثر.',
        },
      },
      {
        title: { en: 'Fit and comfort', ar: 'المقاس والراحة' },
        body: {
          en: 'Choose adjustable straps, check the waist range, and use plenty of water-based lubricant. Start with a slimmer dildo than you think you need.',
          ar: 'اختر أحزمة قابلة للتعديل، وتحقق من نطاق الخصر، واستخدم مزلقاً مائياً بكثرة. ابدأ بديلدو أنحف مما تظن أنك تحتاج.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['dildos', 'lubricants', 'sex-toys', 'vibrators'],
    guides: [G.dildos, G.couples, G.lube],
    faqs: [
      {
        q: { en: 'Will any dildo fit the harness?', ar: 'هل يناسب أي ديلدو الحزام؟' },
        a: {
          en: 'Only dildos with a flared base, and only if the base fits the O-ring size listed on the harness page. Kits come matched.',
          ar: 'فقط الديلدو ذو القاعدة العريضة، وفقط إذا ناسبت القاعدة حجم حلقة O المذكور في صفحة الحزام. الأطقم تأتي متطابقة.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'kegel-balls': {
    heroIntro: {
      en: 'Weighted kegel balls and pelvic floor trainers in silicone for Lebanon, shipped in plain packaging.',
      ar: 'كرات كيجل موزونة ومدربات قاع الحوض من السيليكون للبنان، تُشحن بتغليف عادي.',
    },
    intro: [
      {
        en: 'Kegel balls, also sold as Ben Wa balls, are worn internally to add resistance to pelvic floor exercises. Vexa Toys carries kegel balls in Lebanon in silicone-coated sets with progressive weights and a retrieval cord.',
        ar: 'كرات كيجل، التي تُباع أيضاً باسم كرات بن وا، تُرتدى داخلياً لإضافة مقاومة لتمارين قاع الحوض. يوفر فيكسا تويز كرات كيجل في لبنان بأطقم مغطاة بالسيليكون بأوزان متدرجة وخيط سحب.',
      },
      {
        en: 'They are not a medical device, and anyone with a pelvic health condition should ask a doctor first. For everyone else they are a simple, discreet way to train.',
        ar: 'ليست جهازاً طبياً، وعلى من لديها حالة صحية في الحوض استشارة الطبيب أولاً. لغير ذلك، هي طريقة بسيطة وسرية للتدريب.',
      },
    ],
    sections: [
      {
        title: { en: 'Choosing a weight', ar: 'اختيار الوزن' },
        body: {
          en: 'Start with the lightest ball in a set and short sessions of 10 to 15 minutes while standing or walking. Move up a weight only when the lighter one feels easy to hold.',
          ar: 'ابدأي بأخف كرة في الطقم وجلسات قصيرة من 10 إلى 15 دقيقة أثناء الوقوف أو المشي. انتقلي لوزن أثقل فقط عندما يصبح الأخف سهل الإمساك.',
        },
      },
      {
        title: { en: 'Care', ar: 'العناية' },
        body: {
          en: 'Choose silicone-coated balls with a retrieval loop, wash before and after use, and apply a little water-based lubricant for comfort.',
          ar: 'اختاري كرات مغطاة بالسيليكون مع حلقة سحب، واغسليها قبل الاستخدام وبعده، وضعي القليل من المزلق المائي للراحة.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['vibrators', 'lubricants', 'sex-toys'],
    guides: [G.vibrators, G.care, G.privacy],
    faqs: [
      {
        q: { en: 'How often should kegel balls be used?', ar: 'كم مرة تُستخدم كرات كيجل؟' },
        a: {
          en: 'A few short sessions a week is a common routine. Stop if you feel pain and consult a doctor if you have any pelvic health concerns.',
          ar: 'بضع جلسات قصيرة أسبوعياً روتين شائع. توقفي إن شعرتِ بألم واستشيري الطبيب إن كانت لديك مخاوف صحية في الحوض.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'sexual-enhancers': {
    heroIntro: {
      en: 'Delay sprays, creams and arousal gels for Lebanon, delivered discreetly with cash on delivery.',
      ar: 'بخاخات وكريمات تأخير وجل إثارة للبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Sexual enhancers in Lebanon are mostly topical: delay sprays and creams for men who want to last longer, and arousal or warming gels for both partners. This category lists the ingredients and usage directions on each product page.',
        ar: 'معززات الأداء في لبنان موضعية في معظمها: بخاخات وكريمات تأخير للرجال الذين يريدون مدة أطول، وجل إثارة أو تدفئة للشريكين. تعرض هذه الفئة المكونات وطريقة الاستخدام في صفحة كل منتج.',
      },
      {
        en: 'These are personal-care products, not medicines. Read the directions, test on a small area first, and speak to a doctor about any medical concern.',
        ar: 'هذه منتجات عناية شخصية وليست أدوية. اقرأ التعليمات، وجرّب على مساحة صغيرة أولاً، واستشر الطبيب في أي مسألة صحية.',
      },
    ],
    sections: [
      {
        title: { en: 'Delay products', ar: 'منتجات التأخير' },
        body: {
          en: 'Sprays act fast and are easy to dose; creams are gentler and longer to absorb. Apply as directed, wait the stated time, and wipe off excess so sensation is reduced for you but not your partner.',
          ar: 'البخاخات سريعة المفعول وسهلة التقدير؛ الكريمات ألطف وأبطأ امتصاصاً. ضعها حسب التعليمات، وانتظر المدة المذكورة، وامسح الزائد لتقل الحساسية لك دون شريكك.',
        },
      },
      {
        title: { en: 'Pairing with other products', ar: 'التنسيق مع منتجات أخرى' },
        body: {
          en: 'A vibrating cock ring or a penis pump addresses firmness in a different way and can be combined with a delay product. Water-based lubricant works with all of them.',
          ar: 'حلقة مهتزة أو مضخة تعالج الصلابة بطريقة مختلفة ويمكن جمعها مع منتج تأخير. المزلق المائي يعمل مع كلها.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['cock-rings', 'penis-pumps', 'lubricants', 'male-toys'],
    guides: [G.male, G.lube, G.privacy],
    faqs: [
      {
        q: { en: 'Are delay sprays safe to use with condoms?', ar: 'هل بخاخات التأخير آمنة مع الواقي؟' },
        a: {
          en: 'Most water-based delay products are condom-compatible; the product page states it. Avoid oil-based products with latex condoms.',
          ar: 'معظم منتجات التأخير المائية متوافقة مع الواقي؛ تذكر صفحة المنتج ذلك. تجنب المنتجات الزيتية مع الواقيات اللاتكسية.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'penis-pumps': {
    heroIntro: {
      en: 'Manual and electric penis pumps and sleeves for Lebanon, delivered in plain packaging with cash on delivery.',
      ar: 'مضخات يدوية وكهربائية وأكمام للقضيب للبنان، تصل بتغليف عادي مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Penis pumps use gentle vacuum to draw blood into the penis for a firmer erection and a temporary increase in size. Vexa Toys stocks penis pumps in Lebanon from simple hand-bulb models to rechargeable electric pumps with pressure control, plus sleeves and extenders.',
        ar: 'تستخدم مضخات القضيب شفطاً لطيفاً لسحب الدم إلى القضيب لانتصاب أقوى وزيادة مؤقتة في الحجم. يوفر فيكسا تويز المضخات في لبنان من الطرازات اليدوية البسيطة إلى الكهربائية القابلة للشحن مع التحكم بالضغط، إضافة إلى الأكمام والمطولات.',
      },
      {
        en: 'Results are temporary and depend on correct use. Each page explains the cylinder size and release valve so you can choose a pump that fits.',
        ar: 'النتائج مؤقتة وتعتمد على الاستخدام الصحيح. تشرح كل صفحة حجم الأسطوانة وصمام التحرير لتختار مضخة مناسبة.',
      },
    ],
    sections: [
      {
        title: { en: 'Manual or electric', ar: 'يدوية أم كهربائية' },
        body: {
          en: 'Manual pumps are cheaper and give full control of the pressure. Electric pumps are easier to use consistently and often include a gauge. Both need a snug sleeve at the base and a quick-release valve.',
          ar: 'المضخات اليدوية أرخص وتمنح تحكماً كاملاً بالضغط. الكهربائية أسهل في الاستخدام المنتظم وغالباً تشمل مقياساً. كلاهما يحتاج كماً محكماً عند القاعدة وصمام تحرير سريع.',
        },
      },
      {
        title: { en: 'Using a pump safely', ar: 'الاستخدام الآمن' },
        body: {
          en: 'Increase pressure slowly, limit sessions to the time stated in the instructions, release immediately if you feel pain, and never fall asleep with a ring or sleeve on. Men with circulation or blood conditions should ask a doctor first.',
          ar: 'ارفع الضغط ببطء، وحدد الجلسات بالمدة المذكورة في التعليمات، وحرر فوراً عند الشعور بألم، ولا تنم أبداً بحلقة أو كم. على من لديه مشاكل في الدورة الدموية أو الدم استشارة الطبيب أولاً.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['cock-rings', 'sexual-enhancers', 'male-toys', 'masturbators'],
    guides: [G.male, G.privacy, G.care],
    faqs: [
      {
        q: { en: 'Do penis pumps give permanent results?', ar: 'هل تعطي المضخات نتائج دائمة؟' },
        a: {
          en: 'No. The effect on firmness and size is temporary. Pumps are used for pleasure, confidence and as part of routines some men follow; they are not a medical treatment.',
          ar: 'لا. التأثير على الصلابة والحجم مؤقت. تُستخدم المضخات للمتعة والثقة وضمن روتين يتبعه بعض الرجال؛ وليست علاجاً طبياً.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'cock-rings': {
    heroIntro: {
      en: 'Stretch silicone, vibrating and adjustable cock rings for Lebanon, delivered discreetly with cash on delivery.',
      ar: 'حلقات سيليكون مطاطية ومهتزة وقابلة للتعديل للبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'A cock ring is the smallest, cheapest upgrade a couple can buy. Worn at the base of the penis it helps keep erections firmer for longer, and vibrating versions add stimulation for a partner. Vexa Toys sells cock rings in Lebanon in silicone multi-packs, textured sleeves and rechargeable vibrating models.',
        ar: 'حلقة القضيب هي أصغر وأرخص ترقية يمكن للزوجين شراؤها. تُلبس عند قاعدة القضيب لتساعد على انتصاب أقوى لمدة أطول، والنسخ المهتزة تضيف تحفيزاً للشريك. يبيع فيكسا تويز الحلقات في لبنان بعبوات سيليكون متعددة وأكمام محززة وطرازات مهتزة قابلة للشحن.',
      },
      {
        en: 'Sizes and stretch are listed per product, and most sets include several diameters to find the right fit.',
        ar: 'الأحجام والمرونة مذكورة لكل منتج، ومعظم الأطقم تشمل عدة أقطار لإيجاد المقاس المناسب.',
      },
    ],
    sections: [
      {
        title: { en: 'Which ring', ar: 'أي حلقة' },
        body: {
          en: 'Stretchy silicone rings are the beginner choice. Vibrating rings sit a small motor against the partner during intercourse. Adjustable or lasso rings fit any size. Metal rings are for experienced users only.',
          ar: 'حلقات السيليكون المطاطية هي خيار المبتدئ. الحلقات المهتزة تضع محركاً صغيراً ملامساً للشريك أثناء الجماع. الحلقات القابلة للتعديل تناسب أي حجم. الحلقات المعدنية لذوي الخبرة فقط.',
        },
      },
      {
        title: { en: 'Safe use', ar: 'الاستخدام الآمن' },
        body: {
          en: 'Put the ring on with a little water-based lubricant, keep sessions under 20 to 30 minutes, and remove it at once if you feel numbness or pain. Clean with warm soapy water and dry before storing.',
          ar: 'ضع الحلقة مع القليل من المزلق المائي، وأبقِ الجلسات أقل من 20 إلى 30 دقيقة، وانزعها فوراً عند الشعور بخدر أو ألم. نظفها بماء دافئ وصابون وجففها قبل الحفظ.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['penis-pumps', 'sexual-enhancers', 'vibrators', 'male-toys'],
    guides: [G.male, G.couples, G.care],
    faqs: [
      {
        q: { en: 'How tight should a cock ring be?', ar: 'كم يجب أن تكون الحلقة ضيقة؟' },
        a: {
          en: 'Snug but never painful. If it leaves marks or feels numb, size up. Multi-packs make it easy to find the right diameter.',
          ar: 'محكمة لكن ليست مؤلمة أبداً. إذا تركت علامات أو شعرت بخدر، اختر حجماً أكبر. العبوات المتعددة تسهّل إيجاد القطر المناسب.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  masturbators: {
    heroIntro: {
      en: 'Textured strokers, realistic sleeves and automatic masturbators for men in Lebanon, shipped in plain packaging.',
      ar: 'أدوات محززة وأكمام واقعية وأجهزة استمناء أوتوماتيكية للرجال في لبنان، تُشحن بتغليف عادي.',
    },
    intro: [
      {
        en: 'Male masturbators in Lebanon range from pocket-size sleeves to automatic stroking devices. This category has soft TPE and silicone strokers with internal textures, realistic sleeves, and powered models with vibration or thrusting, each listed with its material and dimensions.',
        ar: 'تتراوح أدوات الاستمناء الرجالية في لبنان من الأكمام بحجم الجيب إلى الأجهزة الأوتوماتيكية. تضم هذه الفئة أدوات ناعمة من TPE والسيليكون بتحزيز داخلي، وأكماماً واقعية، وطرازات تعمل بالطاقة مع اهتزاز أو دفع، كل منها مع المادة والأبعاد.',
      },
      {
        en: 'A good lubricant matters more here than anywhere else; the lubricants category lists water-based options that suit TPE.',
        ar: 'المزلق الجيد مهم هنا أكثر من أي مكان آخر؛ فئة المزلقات تعرض خيارات مائية تناسب TPE.',
      },
    ],
    sections: [
      {
        title: { en: 'Open or closed, manual or automatic', ar: 'مفتوح أم مغلق، يدوي أم أوتوماتيكي' },
        body: {
          en: 'Open-ended sleeves are easiest to clean and dry. Closed strokers create suction. Automatic masturbators do the work for you but cost more and need charging. Beginners do well with a simple closed stroker.',
          ar: 'الأكمام المفتوحة الطرفين أسهل في التنظيف والتجفيف. الأدوات المغلقة تخلق شفطاً. الأجهزة الأوتوماتيكية تقوم بالعمل عنك لكنها أغلى وتحتاج شحناً. المبتدئون يناسبهم كم مغلق بسيط.',
        },
      },
      {
        title: { en: 'Cleaning TPE properly', ar: 'تنظيف TPE بشكل صحيح' },
        body: {
          en: 'Rinse with warm water, use a mild toy cleaner, dry completely and dust with renewal powder to keep TPE soft. Never use silicone lubricant on TPE or silicone toys.',
          ar: 'اشطف بالماء الدافئ، واستخدم منظف ألعاب خفيفاً، وجفف تماماً، وانثر بودرة التجديد ليبقى TPE ناعماً. لا تستخدم المزلق السيليكوني أبداً على ألعاب TPE أو السيليكون.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['sex-dolls', 'male-toys', 'lubricants', 'cock-rings'],
    guides: [G.male, G.lube, G.care, G.privacy],
    faqs: [
      {
        q: { en: 'How do I keep a stroker hygienic?', ar: 'كيف أحافظ على نظافة الأداة؟' },
        a: {
          en: 'Clean after every use with warm water and mild soap or toy cleaner, dry fully, and store it in its case away from heat.',
          ar: 'نظفها بعد كل استخدام بماء دافئ وصابون خفيف أو منظف ألعاب، وجففها تماماً، واحفظها في علبتها بعيداً عن الحرارة.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  chastity: {
    heroIntro: {
      en: 'Metal, silicone and resin chastity cages with locks for couples in Lebanon, delivered discreetly with cash on delivery.',
      ar: 'أقفاص عفة من المعدن والسيليكون والراتنج مع أقفال للأزواج في لبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Chastity devices in Lebanon are bought by couples who enjoy control and anticipation as part of play. Vexa Toys lists cages in stainless steel, silicone and resin, with the ring sizes, cage length and lock type on every page so you can pick a comfortable fit.',
        ar: 'يشتري أجهزة العفة في لبنان أزواج يستمتعون بالتحكم والترقب كجزء من اللعب. يعرض فيكسا تويز الأقفاص من الفولاذ المقاوم للصدأ والسيليكون والراتنج، مع أحجام الحلقات وطول القفص ونوع القفل في كل صفحة لاختيار مقاس مريح.',
      },
      {
        en: 'Comfort and hygiene decide whether a cage gets used; measure first and start with short periods.',
        ar: 'الراحة والنظافة تحددان ما إذا كان القفص سيُستخدم فعلاً؛ قِس أولاً، وابدأ بفترات قصيرة، وتصل كل الطلبات في لبنان بتغليف عادي لا يكشف المحتوى.',
      },
    ],
    sections: [
      {
        title: { en: 'Measuring for a cage', ar: 'القياس للقفص' },
        body: {
          en: 'Measure the base ring diameter when flaccid and choose the cage length listed as slightly shorter than your flaccid length. Sets with several rings make the first fit easier.',
          ar: 'قِس قطر حلقة القاعدة في حالة الارتخاء واختر طول القفص المذكور أقصر قليلاً من طولك في الارتخاء. الأطقم بعدة حلقات تسهّل المقاس الأول.',
        },
      },
      {
        title: { en: 'Materials and hygiene', ar: 'المواد والنظافة' },
        body: {
          en: 'Silicone is light and forgiving for beginners; steel is secure and easy to sterilise; resin is light and discreet under clothes. Clean daily, dry fully and remove the device at any sign of swelling or numbness.',
          ar: 'السيليكون خفيف ومتسامح للمبتدئين؛ الفولاذ آمن وسهل التعقيم؛ الراتنج خفيف وسري تحت الملابس. نظف يومياً، وجفف تماماً، وانزع الجهاز عند أي علامة تورم أو خدر.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['bdsm', 'bondage', 'cock-rings', 'male-toys'],
    guides: [G.bdsm, G.male, G.privacy],
    faqs: [
      {
        q: { en: 'Which chastity cage material is best for a first device?', ar: 'ما أفضل مادة لقفص العفة الأول؟' },
        a: {
          en: 'Silicone or resin: both are light, comfortable and quiet. Move to steel once you know your size and how long you want to wear it.',
          ar: 'السيليكون أو الراتنج: كلاهما خفيف ومريح وهادئ. انتقل إلى الفولاذ بعد معرفة مقاسك والمدة التي تريد ارتداءه فيها.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'sex-machines': {
    heroIntro: {
      en: 'Thrusting and vibrating sex machines with attachments for Lebanon, shipped discreetly with cash on delivery.',
      ar: 'ماكينات دافعة ومهتزة مع ملحقات للبنان، تُشحن بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'Sex machines in Lebanon are for people who want hands-free, powerful and adjustable penetration. The models here are compact thrusting machines with speed control, adjustable angle and interchangeable dildo attachments, listed with stroke length, speed range and noise notes.',
        ar: 'ماكينات الجنس في لبنان لمن يريد إيلاجاً قوياً وقابلاً للتعديل دون استخدام اليدين. الطرازات هنا ماكينات دافعة مدمجة مع تحكم بالسرعة وزاوية قابلة للتعديل وملحقات ديلدو قابلة للتبديل، مع طول الدفعة ونطاق السرعة وملاحظات الصوت.',
      },
      {
        en: 'They are larger items, so check the dimensions and power requirements, and ask us on WhatsApp if you are unsure which attachment fits.',
        ar: 'هي قطع كبيرة، فتحقق من الأبعاد ومتطلبات الطاقة، واسألنا على واتساب إن لم تكن متأكداً من الملحق المناسب.',
      },
    ],
    sections: [
      {
        title: { en: 'What to check before buying', ar: 'ما تتحقق منه قبل الشراء' },
        body: {
          en: 'Stroke length and speed range decide the feel. A suction base or stable legs matter on tile floors. Most machines accept standard Vac-U-Lock or threaded attachments; the dildos category lists compatible options.',
          ar: 'طول الدفعة ونطاق السرعة يحددان الإحساس. قاعدة الشفط أو الأرجل الثابتة مهمة على أرضيات البلاط. تقبل معظم الماكينات ملحقات Vac-U-Lock أو الملولبة القياسية؛ فئة الديلدو تعرض خيارات متوافقة.',
        },
      },
      {
        title: { en: 'Using it well', ar: 'الاستخدام الجيد' },
        body: {
          en: 'Start on the lowest speed with a slimmer attachment and plenty of water-based lubricant. Keep the remote within reach and clean attachments after every session.',
          ar: 'ابدأ بأقل سرعة مع ملحق أنحف وكثير من المزلق المائي. أبقِ الريموت في المتناول ونظف الملحقات بعد كل جلسة.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['dildos', 'vibrators', 'strap-ons', 'lubricants'],
    guides: [G.dildos, G.lube, G.delivery],
    faqs: [
      {
        q: { en: 'Are sex machines loud?', ar: 'هل الماكينات صاخبة؟' },
        a: {
          en: 'They are louder than a vibrator but quieter at low speeds. Placing the machine on a rug or towel reduces noise on hard floors.',
          ar: 'أعلى صوتاً من الهزاز لكنها أهدأ على السرعات المنخفضة. وضع الماكينة على سجادة أو منشفة يقلل الضجيج على الأرضيات الصلبة.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  lubricants: {
    heroIntro: {
      en: 'Water-based, silicone and hybrid lubricants that are safe with toys and condoms, delivered across Lebanon.',
      ar: 'مزلقات مائية وسيليكونية وهجينة آمنة مع الألعاب والواقيات، تصل إلى كل لبنان.',
    },
    intro: [
      {
        en: 'Lubricant is the one product that improves every other one. Vexa Toys sells lubricants in Lebanon in water-based formulas that work with silicone toys and latex condoms, long-lasting silicone formulas for skin-to-skin use, and hybrids in between.',
        ar: 'المزلق هو المنتج الوحيد الذي يحسّن كل منتج آخر. يبيع فيكسا تويز المزلقات في لبنان بتركيبات مائية تعمل مع ألعاب السيليكون والواقيات اللاتكسية، وتركيبات سيليكونية طويلة الأمد للاستخدام بين البشرة، وهجينة بينهما.',
      },
      {
        en: 'Each page lists the base, the ingredients and whether it is condom and toy compatible, so you can match a lubricant to what you already own.',
        ar: 'تعرض كل صفحة القاعدة والمكونات وإن كان متوافقاً مع الواقي والألعاب، لتطابق المزلق مع ما تملكه.',
      },
    ],
    sections: [
      {
        title: { en: 'Water, silicone or hybrid', ar: 'مائي أم سيليكوني أم هجين' },
        body: {
          en: 'Water-based is the universal choice: safe with every toy and condom, easy to wash off, needs reapplying. Silicone-based lasts longer and is waterproof but must not touch silicone toys. Hybrids balance both.',
          ar: 'المائي هو الخيار الشامل: آمن مع كل لعبة وواقٍ، سهل الغسل، يحتاج إعادة وضع. السيليكوني يدوم أطول ومقاوم للماء لكن يجب ألا يلامس ألعاب السيليكون. الهجين يوازن بينهما.',
        },
      },
      {
        title: { en: 'For anal use and sensitive skin', ar: 'للاستخدام الشرجي والبشرة الحساسة' },
        body: {
          en: 'Thicker water-based or hybrid gels are better for anal toys. Look for glycerin- and paraben-free formulas if you are prone to irritation, and patch-test a new lubricant first.',
          ar: 'الجل المائي أو الهجين الأكثر سماكة أفضل للألعاب الشرجية. ابحث عن تركيبات خالية من الغليسيرين والبارابين إن كنت عرضة للتهيج، وجرّب المزلق الجديد على مساحة صغيرة أولاً.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['vibrators', 'dildos', 'anal-toys', 'masturbators'],
    guides: [G.lube, G.silicone, G.care],
    faqs: [
      {
        q: { en: 'Which lubricant is safe with silicone toys?', ar: 'أي مزلق آمن مع ألعاب السيليكون؟' },
        a: {
          en: 'Water-based lubricant. Silicone lubricant can degrade silicone toys over time, so keep it for skin-to-skin use only.',
          ar: 'المزلق المائي. قد يتلف المزلق السيليكوني ألعاب السيليكون مع الوقت، فاحتفظ به للاستخدام بين البشرة فقط.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  poppers: {
    heroIntro: {
      en: 'Poppers and intimate relaxation products for adults in Lebanon, delivered discreetly with cash on delivery.',
      ar: 'بوبرز ومنتجات استرخاء حميمية للبالغين في لبنان، تصل بسرية مع الدفع عند الاستلام.',
    },
    intro: [
      {
        en: 'This category lists the poppers and intimate relaxation products currently available at Vexa Toys in Lebanon. Each product page shows the brand, bottle size and usage notes from the maker.',
        ar: 'تعرض هذه الفئة البوبرز ومنتجات الاسترخاء الحميمية المتوفرة حالياً في فيكسا تويز في لبنان. تعرض كل صفحة منتج العلامة وحجم العبوة وملاحظات الاستخدام من الشركة المصنعة.',
      },
      {
        en: 'These products are for adults only, are not medicines, and should be kept away from heat, flames and children. Read the label and the maker\'s warnings before use.',
        ar: 'هذه المنتجات للبالغين فقط، وليست أدوية، ويجب إبعادها عن الحرارة واللهب والأطفال. اقرأ الملصق وتحذيرات الشركة المصنعة قبل الاستخدام.',
      },
    ],
    sections: [
      {
        title: { en: 'Storage', ar: 'التخزين' },
        body: {
          en: 'Keep bottles tightly closed, upright and cool; the contents are volatile and lose strength once opened. Never store them near an open flame or in a hot car.',
          ar: 'أبقِ العبوات مغلقة بإحكام ومنتصبة وباردة؛ المحتوى متطاير ويفقد قوته بعد الفتح. لا تحفظها أبداً قرب لهب مفتوح أو في سيارة ساخنة.',
        },
      },
      {
        title: { en: 'Related products', ar: 'منتجات ذات صلة' },
        body: {
          en: 'Many customers pair these with a thicker water-based or hybrid lubricant from the lubricants range, or browse the anal toys category for beginner-friendly options.',
          ar: 'يجمع كثير من العملاء بينها وبين مزلق مائي أو هجين أكثر سماكة من فئة المزلقات، أو يتصفحون فئة الألعاب الشرجية لخيارات مناسبة للمبتدئين.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['lubricants', 'anal-toys', 'sexual-enhancers'],
    guides: [G.lube, G.privacy, G.delivery],
    faqs: [
      PRIVACY_FAQ,
      PAYMENT_FAQ,
      RETURNS_FAQ,
    ],
  },

  'holiday-collection': {
    heroIntro: {
      en: 'Couples gift sets, lingerie and intimate bundles for the holidays in Lebanon, gift-ready and delivered discreetly.',
      ar: 'أطقم هدايا للأزواج ولانجري وباقات حميمية للأعياد في لبنان، جاهزة للإهداء وتصل بسرية.',
    },
    intro: [
      {
        en: 'The holiday collection gathers the Vexa Toys products that work best as gifts in Lebanon: lingerie, couples toys, massage and intimacy sets and seasonal bundles. Each item ships in the same plain outer box as every order, with the gift inside untouched.',
        ar: 'تجمع مجموعة الأعياد منتجات فيكسا تويز الأنسب للإهداء في لبنان: لانجري وألعاب للأزواج وأطقم تدليك وحميمية وباقات موسمية. تُشحن كل قطعة في نفس الكرتون الخارجي العادي ككل طلب، والهدية داخله سليمة.',
      },
      {
        en: 'Order early around Valentine\'s Day, Christmas and New Year, when delivery slots in Beirut fill up fastest.',
        ar: 'اطلب مبكراً حول عيد الحب والميلاد ورأس السنة، حين تمتلئ مواعيد التوصيل في بيروت بأسرع ما يمكن.',
      },
    ],
    sections: [
      {
        title: { en: 'Gift ideas by couple', ar: 'أفكار هدايا حسب الزوجين' },
        body: {
          en: 'For a first shared toy, a couples ring or small vibrator. For a partner who loves to dress up, lingerie in the right size. For adventurous couples, a soft BDSM starter kit. Our gift guide walks through more options.',
          ar: 'للعبة مشتركة أولى، حلقة أزواج أو هزاز صغير. لشريك يحب التأنق، لانجري بالمقاس المناسب. للأزواج المغامرين، طقم BDSM ناعم للمبتدئين. دليل الهدايا يستعرض خيارات أكثر.',
        },
      },
      {
        title: { en: 'Making it feel like a gift', ar: 'لتبدو كهدية' },
        body: {
          en: 'Add a lubricant or a massage candle to complete a set, and check sizes on lingerie before ordering so nothing needs exchanging. Gift-worthy items are marked on their product pages.',
          ar: 'أضف مزلقاً أو شمعة تدليك لإكمال الطقم، وتحقق من مقاسات اللانجري قبل الطلب كي لا يحتاج شيء إلى استبدال. المنتجات المناسبة للإهداء مذكورة في صفحاتها.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['lingerie', 'sex-toys', 'vibrators', 'lubricants', 'new-arrivals'],
    guides: [G.gifts, G.couples, G.lingerie],
    faqs: [
      {
        q: { en: 'Can I send a gift to someone else\'s address?', ar: 'هل يمكن إرسال هدية إلى عنوان شخص آخر؟' },
        a: {
          en: 'Yes. Enter the recipient\'s address at checkout. The box is plain and the courier only needs a name and phone number for delivery.',
          ar: 'نعم. أدخل عنوان المستلم عند الدفع. الكرتون عادي ويحتاج المندوب فقط إلى اسم ورقم هاتف للتوصيل.',
        },
      },
      PRIVACY_FAQ,
      PAYMENT_FAQ,
    ],
  },

  'new-arrivals': {
    heroIntro: {
      en: 'The latest adult toys, lingerie and accessories added to Vexa Toys Lebanon, updated as new stock lands.',
      ar: 'أحدث الألعاب واللانجري والإكسسوارات المضافة إلى فيكسا تويز لبنان، تُحدَّث مع وصول المخزون الجديد.',
    },
    intro: [
      {
        en: 'New arrivals shows what has just reached our Lebanon stock across every category, from vibrators and dildos to male toys and BDSM gear. It is the quickest way to see what is new before it appears in the main categories.',
        ar: 'تعرض الوصولات الجديدة ما وصل للتو إلى مخزوننا في لبنان عبر كل الفئات، من الهزازات والديلدو إلى الألعاب الرجالية ومنتجات BDSM. إنها أسرع طريقة لرؤية الجديد قبل ظهوره في الفئات الرئيسية.',
      },
      {
        en: 'Every new product is listed with the same material, size and care details as the rest of the store, and ships discreetly with cash on delivery.',
        ar: 'يُعرض كل منتج جديد بنفس تفاصيل المادة والحجم والعناية كبقية المتجر، ويُشحن بسرية مع الدفع عند الاستلام.',
      },
    ],
    sections: [
      {
        title: { en: 'How to use this page', ar: 'كيف تستخدم هذه الصفحة' },
        body: {
          en: 'Browse here first if you already know the store, then jump to the full category for alternatives and sizes. New items are also flagged with a "New" badge in their categories.',
          ar: 'تصفح هنا أولاً إن كنت تعرف المتجر، ثم انتقل إلى الفئة الكاملة للبدائل والمقاسات. المنتجات الجديدة تحمل أيضاً شارة "جديد" في فئاتها.',
        },
      },
      {
        title: { en: 'Not sure what to pick', ar: 'لست متأكداً مما تختار' },
        body: {
          en: 'Take the three-question quiz or message us on WhatsApp. The beginner guides on the blog explain the main categories in plain language.',
          ar: 'جرّب اختبار الأسئلة الثلاثة أو راسلنا على واتساب. أدلة المبتدئين في المدونة تشرح الفئات الرئيسية بلغة بسيطة.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['sex-toys', 'vibrators', 'male-toys', 'holiday-collection'],
    guides: [G.couples, G.faq, G.delivery],
    faqs: [PRIVACY_FAQ, PAYMENT_FAQ, RETURNS_FAQ],
  },

  'adult-toys': {
    heroIntro: {
      en: 'Every adult toy category at Vexa Toys Lebanon on one page: vibrators, dildos, male toys, lingerie, BDSM, dolls and enhancers.',
      ar: 'كل فئات منتجات الكبار في فيكسا تويز لبنان في صفحة واحدة: هزازات وديلدو وألعاب رجالية ولانجري وBDSM ودمى ومعززات.',
    },
    intro: [
      {
        en: 'Adult toys in Lebanon, all in one place. This page lists the complete Vexa Toys catalog beyond the core sex toys range, so you can filter by category, price and availability and compare across the whole store.',
        ar: 'منتجات الكبار في لبنان، كلها في مكان واحد. تعرض هذه الصفحة كامل كتالوج فيكسا تويز خارج مجموعة الألعاب الجنسية الأساسية، لتفلتر حسب الفئة والسعر والتوفر وتقارن عبر المتجر كله.',
      },
      {
        en: 'If you know what you want, the category pages go deeper on each type with buying advice written for Lebanon.',
        ar: 'إذا كنت تعرف ما تريد، فصفحات الفئات تتعمق في كل نوع بنصائح شراء مكتوبة للبنان، مع التوصيل إلى بيروت وكل المناطق والدفع عند الاستلام.',
      },
    ],
    sections: [
      {
        title: { en: 'Browse by category', ar: 'تصفح حسب الفئة' },
        body: {
          en: 'Vibrators and dildos for internal and external stimulation, male toys and masturbators, lingerie and gift sets, BDSM and bondage gear, sex dolls, and the lubricants and enhancers that go with them.',
          ar: 'هزازات وديلدو للتحفيز الداخلي والخارجي، وألعاب رجالية وأدوات استمناء، ولانجري وأطقم هدايا، ومنتجات BDSM وبوندج، ودمى، والمزلقات والمعززات المناسبة لها.',
        },
      },
      {
        title: { en: 'Shopping with confidence', ar: 'التسوق بثقة' },
        body: {
          en: 'Each product page lists materials and dimensions. Orders ship in plain boxes with cash on delivery, and unopened items can be returned within 7 days.',
          ar: 'تعرض كل صفحة منتج المواد والأبعاد. تُشحن الطلبات في كراتين عادية مع الدفع عند الاستلام، ويمكن إرجاع المنتجات غير المفتوحة خلال 7 أيام.',
        },
      },
      {
        title: { en: 'Delivery and privacy in Lebanon', ar: 'التوصيل والخصوصية في لبنان' },
        body: DELIVERY,
      },
    ],
    related: ['sex-toys', 'vibrators', 'dildos', 'male-toys', 'lingerie', 'bdsm', 'sex-dolls', 'sexual-enhancers'],
    guides: [G.couples, G.faq, G.privacy, G.delivery],
    faqs: [PRIVACY_FAQ, PAYMENT_FAQ, RETURNS_FAQ],
  },
};

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] || null;
}
