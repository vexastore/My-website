import { Product, AdviceArticle } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // --- Sex Toys ---
  {
    id: 'st-1',
    name: 'مجموعة التدليك الزوجية الفاخرة',
    nameEn: 'Luxury Couple Massage Set',
    description: 'مجموعة فاخرة تحتوي على زيوت طبيعية وأدوات تدليك مصممة لزيادة القرب وتحسين تجربة الاسترخاء بين الزوجين. آمنة تماماً على البشرة وتدوم طويلاً.',
    descriptionEn: 'A luxury set containing natural oils and massage tools designed to enhance intimacy and relaxation. 100% body-safe and long-lasting.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1601924991987-3976334a1d5d?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    isNew: true
  },
  {
    id: 'st-2',
    name: 'جهاز التحفيز النبضي المزدوج',
    nameEn: 'Dual Pulse Stimulation Device',
    description: 'جهاز تحفيز ثنائي المفعول بتقنية النبضات اللطيفة، مريح ومصنوع من السيليكون الطبي عالي الجودة. مقاوم للماء وقابل لإعادة الشحن عبر USB.',
    descriptionEn: 'Dual-action stimulation device with gentle pulse technology, made of high-quality medical silicone. Waterproof and USB rechargeable.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.5,
    reviewsCount: 89,
    stock: 8
  },
  {
    id: 'st-3',
    name: 'جل مائي مرطب فائق النعومة 200 مل',
    nameEn: 'Ultra-Smooth Water-Based Lubricant 200ml',
    description: 'مزلق طبيعي ذو أساس مائي، لا يسبب الحساسية، سهل التنظيف ويوفر نعومة فائقة تدوم طويلاً بدون أي لزوجة. متوافق مع جميع الألعاب والواقيات.',
    descriptionEn: 'Natural water-based lubricant, hypoallergenic, easy to clean, and provides long-lasting smoothness. Compatible with all toys and condoms.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.9,
    reviewsCount: 312,
    stock: 45
  },

  // --- Vibrators ---
  {
    id: 'vib-1',
    name: 'هزاز الوردة الذكي المطور',
    nameEn: 'Upgraded Smart Rose Vibrator',
    description: 'الهزاز الأكثر شهرة بتصميم الوردة الأنيق، يعمل بتقنية شفط الهواء اللطيفة ونبضات متعددة السرعات لتجربة فريدة وممتعة للغاية. هادئ تماماً.',
    descriptionEn: 'The famous rose vibrator, using gentle air suction technology and multi-speed pulses for a unique and enjoyable experience. Ultra-quiet.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.7,
    reviewsCount: 215,
    stock: 22,
    isNew: true
  },
  {
    id: 'vib-2',
    name: 'جهاز المساج الاهتزازي للعضلات والمناطق الحساسة',
    nameEn: 'Wand Massager for Muscle and Intimate Use',
    description: 'جهاز تدليك لاسلكي قوي برأس مرن مصنوع من السيليكون الناعم، يوفر 10 مستويات من الاهتزاز العميق للتخفيف من التوتر وتحفيز الاسترخاء التام.',
    descriptionEn: 'Powerful wireless wand massager with a flexible medical silicone head, offering 10 deep vibration levels for stress relief and relaxation.',
    price: 410,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.6,
    reviewsCount: 142,
    stock: 10
  },
  {
    id: 'vib-3',
    name: 'هزاز الرصاصة اللاسلكي الصغير',
    nameEn: 'Mini Wireless Bullet Vibrator',
    description: 'هزاز صغير الحجم وسري للغاية ولكنه قوي، يمكن التحكم به عن بعد وهو مثالي للاستخدام الفردي أو مع الشريك. مغطى بسيليكون ناعم كالحرير.',
    descriptionEn: 'Compact and discreet yet powerful bullet vibrator, remote controllable, ideal for solo or couples play. Covered in silky-smooth silicone.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.3,
    reviewsCount: 76,
    stock: 30
  },

  // --- Male Toys ---
  {
    id: 'male-1',
    name: 'جهاز الاندماج والتحفيز الذكي للرجال',
    nameEn: 'Smart Male Masturbator & Stimulator',
    description: 'جهاز آلي متطور للرجال بتصميم هندسي داخلي مبتكر يمنح شعوراً طبيعياً بالكامل. يتميز بخاصية التسخين التلقائي والاهتزاز متعدد السرعات.',
    descriptionEn: 'Advanced automatic male device with innovative internal textures. Features automatic warming and multi-speed vibration.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.4,
    reviewsCount: 94,
    stock: 6,
    isNew: true
  },
  {
    id: 'male-2',
    name: 'حلقات السيليكون المرنة للرجال (طقم 3 قطع)',
    nameEn: 'Flexible Silicone Men Rings (Set of 3)',
    description: 'مجموعة من 3 حلقات بأحجام مختلفة مصنوعة من السيليكون الطبي عالي المرونة. مصممة لزيادة القدرة والتحمل وتحسين الأداء لفترات أطول بأمان.',
    descriptionEn: 'Set of 3 different sized rings made of high-stretch medical silicone. Designed to increase stamina and enhance performance safely.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.2,
    reviewsCount: 118,
    stock: 25
  },
  {
    id: 'male-3',
    name: 'كم التحفيز التلقائي المضلع',
    nameEn: 'Ribbed Automatic Stimulation Sleeve',
    description: 'كم مصنوع من مادة TPE فائقة النعومة والمرونة، يتميز بتصميم مضلع داخلي لزيادة التحفيز. سهل التنظيف وإعادة الاستخدام ومريح للغاية.',
    descriptionEn: 'Sleeve made of ultra-soft and stretchy TPE, featuring ribbed internal textures for stimulation. Easy to clean, reusable, and comfortable.',
    price: 195,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.5,
    reviewsCount: 63,
    stock: 14
  },

  // --- Dildos ---
  {
    id: 'dil-1',
    name: 'ديلدو السيليكون الواقعي مع قاعدة تثبيت',
    nameEn: 'Realistic Silicone Dildo with Suction Cup',
    description: 'ديلدو واقعي للغاية مصنوع من سيليكون مزدوج الكثافة (قلب صلب وطبقة خارجية ناعمة كالبشرة). مزود بقاعدة شفط قوية للتثبيت على أي سطح ناعم.',
    descriptionEn: 'Highly realistic dildo made of dual-density silicone (firm core, soft skin-like outer layer). Equipped with a strong suction cup base.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.6,
    reviewsCount: 52,
    stock: 5
  },
  {
    id: 'dil-2',
    name: 'ديلدو زجاجي فاخر للعلاج بالحرارة والبرودة',
    nameEn: 'Luxury Glass Dildo for Temperature Play',
    description: 'مصنوع يدوياً من زجاج البورسليكات المقاوم للصدمات والآمن تماماً. يمكن وضعه في ماء دافئ أو بارد لتجربة أحاسيس حرارية مثيرة ومميزة.',
    descriptionEn: 'Handmade from shatterproof and body-safe borosilicate glass. Can be placed in warm or cold water for exciting temperature play.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.8,
    reviewsCount: 41,
    stock: 7
  },
  {
    id: 'dil-3',
    name: 'ديلدو جي-سبوت المرن المنحني',
    nameEn: 'Flexible Curved G-Spot Dildo',
    description: 'تصميم مريح بانحناءة مدروسة بدقة للوصول المباشر وملمس حريري ناعم من السيليكون. مرن بما يكفي ليتكيف مع شكل الجسم ويوفر راحة تامة.',
    descriptionEn: 'Ergonomic design with a precisely engineered curve for direct reach and silky-smooth silicone. Flexible enough to adapt to the body.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.5,
    reviewsCount: 88,
    stock: 18
  },

  // --- Lingerie ---
  {
    id: 'ling-1',
    name: 'بيبي دول الدانتيل الأسود الفاخر',
    nameEn: 'Luxury Black Lace Babydoll',
    description: 'قطعة لانجري كلاسيكية فاخرة من الدانتيل الناعم والشيفون الشفاف، تأتي مع سروال داخلي مطابق. تبرز جمال الجسم وتمنح شعوراً بالثقة والأنوثة.',
    descriptionEn: 'Classic luxury babydoll in soft lace and sheer chiffon, comes with a matching thong. Accents body beauty and gives a feeling of confidence.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1618333244973-f8e43420a16e?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.8,
    reviewsCount: 167,
    stock: 20,
    isNew: true
  },
  {
    id: 'ling-2',
    name: 'طقم بودي سوت ساتان أحمر قرمزي',
    nameEn: 'Crimson Red Satin Bodysuit',
    description: 'بودي سوت جذاب مصنوع من الساتان الفاخر اللامع والدانتيل المزخرف. أحزمة قابلة للتعديل لمقاس مثالي، وتصميم مفتوح من الظهر لإطلالة ساحرة.',
    descriptionEn: 'Attractive bodysuit made of premium glossy satin and ornate lace. Adjustable straps for a perfect fit, and open back design.',
    price: 185,
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.6,
    reviewsCount: 95,
    stock: 12
  },
  {
    id: 'ling-3',
    name: 'رداء كيمونو من الحرير الناعم',
    nameEn: 'Soft Silk Kimono Robe',
    description: 'رداء طويل وفضفاض من الحرير الصناعي فائق النعومة، مزين بأطراف من الدانتيل على الأكمام وحزام خصر عريض. أنيق ومريح للغاية للأمسيات الخاصة.',
    descriptionEn: 'Long, loose robe in ultra-soft faux silk, adorned with lace trim on sleeves and a wide waist belt. Elegant and comfortable.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.7,
    reviewsCount: 134,
    stock: 16
  },

  // --- BDSM ---
  {
    id: 'bdsm-1',
    name: 'طقم القيود الجلدية الناعمة للمبتدئين',
    nameEn: 'Soft Leather Restraints Starter Kit',
    description: 'مجموعة قيود للمعصم والكاحل مصنوعة من الجلد الصناعي المبطن بالنيوبرين الناعم لحماية البشرة. سهلة التعديل والتركيب وآمنة تماماً.',
    descriptionEn: 'Wrist and ankle restraints set made of faux leather lined with soft neoprene to protect the skin. Easy to adjust and completely safe.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.4,
    reviewsCount: 58,
    stock: 9
  },
  {
    id: 'bdsm-2',
    name: 'عصابة العينين الحريرية الفاخرة مع ريشة مداعبة',
    nameEn: 'Luxury Silk Blindfold with Tickler Feather',
    description: 'عصابة عين من الحرير الطبيعي لحجب الضوء تماماً وزيادة الحساسية للمس، تأتي مع ريشة مداعبة ناعمة لتجربة حسية مشوقة ومثيرة.',
    descriptionEn: 'Natural silk blindfold to completely block light and heighten touch sensitivity, comes with a soft tickler feather for sensory play.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1520006403993-47400cad67c5?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.7,
    reviewsCount: 112,
    stock: 35
  },
  {
    id: 'bdsm-3',
    name: 'سوط المداعبة الجلدي القصير',
    nameEn: 'Short Leather Flogger / Crop',
    description: 'سوط كلاسيكي مصنوع من شرائح الجلد الناعم بمقبض مريح ومضفر. مصمم لتقديم ضربات خفيفة ومثيرة تزيد من الأدرينالين والإثارة.',
    descriptionEn: 'Classic flogger made of soft leather falls with a comfortable braided handle. Designed to deliver light, thrilling sensations.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.5,
    reviewsCount: 47,
    stock: 11
  },

  // --- Holiday Collection ---
  {
    id: 'hol-1',
    name: 'تقويم المفاجآت الرومانسية (24 يوماً)',
    nameEn: '24 Days of Romance Advent Calendar',
    description: 'صندوق هدايا فاخر يحتوي على 24 مفاجأة مميزة للأزواج، تتنوع بين ألعاب صغيرة، زيوت عطرية، أربطة، وإكسسوارات رومانسية تجعل كل يوم احتفالاً.',
    descriptionEn: 'Luxury gift box containing 24 special surprises for couples, ranging from mini toys, aromatic oils, ties, and romantic accessories.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.9,
    reviewsCount: 34,
    stock: 4,
    isNew: true
  },
  {
    id: 'hol-2',
    name: 'طقم لانجري بابا نويل التنكري المثير',
    nameEn: 'Sexy Santa Cosplay Lingerie Set',
    description: 'طقم تنكري مخملي أحمر بأطراف فرو بيضاء ناعمة وتفاصيل جذابة. يتضمن الفستان الصغير، قبعة العيد، وحزام الخصر الأسود العريض لإطلالة احتفالية بامتياز.',
    descriptionEn: 'Red velvet cosplay set with soft white faux fur trim. Includes mini dress, holiday hat, and wide black waist belt for a festive look.',
    price: 225,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.5,
    reviewsCount: 78,
    stock: 14
  },
  {
    id: 'hol-3',
    name: 'شمعة المساج العطرية الفاخرة - برائحة الفانيليا والعود',
    nameEn: 'Luxury Massage Candle - Vanilla & Oud',
    description: 'شمعة مصنوعة من زبدة الشيا وزيت جوز الهند الطبيعي. عند ذوبانها تتحول إلى زيت دافئ ومغذي للبشرة، مثالي لعمل مساج رومانسي دافئ برائحة ساحرة.',
    descriptionEn: 'Candle made from shea butter and natural coconut oil. Melts into a warm, nourishing massage oil with an enchanting vanilla and oud scent.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.8,
    reviewsCount: 143,
    stock: 28
  },

  // --- New Arrivals ---
  {
    id: 'new-1',
    name: 'جهاز المساج الصوتي التفاعلي الذكي',
    nameEn: 'Smart Interactive Audio Massager',
    description: 'أحدث صيحة في عالم الألعاب الزوجية! جهاز اهتزازي ذكي يتفاعل مع الموسيقى أو صوت الشريك عبر البلوتوث وتطبيق الهاتف لتجربة لا مثيل لها.',
    descriptionEn: 'The latest trend! Smart vibrator that interacts with music or your partner\'s voice via Bluetooth and mobile app for an unmatched experience.',
    price: 620,
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 5.0,
    reviewsCount: 12,
    stock: 6,
    isNew: true
  },
  {
    id: 'new-2',
    name: 'لانجري الدانتيل الذهبي الفاخر قطعتين',
    nameEn: 'Luxury Gold Lace Lingerie 2-Piece Set',
    description: 'طقم لانجري مذهل يدمج بين الشيفون الأسود الناعم وخيوط الدانتيل الذهبية اللامعة. تصميم عصري وجريء يعطي رونقاً ملكياً جذاباً واستثنائياً.',
    descriptionEn: 'Stunning lingerie set merging soft black chiffon with shiny golden lace threads. Modern and bold design giving a royal, attractive look.',
    price: 270,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 4.9,
    reviewsCount: 18,
    stock: 8,
    isNew: true
  },
  {
    id: 'new-3',
    name: 'طقم الزيوت العطرية العضوية (إثارة ونوم عميق)',
    nameEn: 'Organic Essential Oils Set (Arousal & Deep Sleep)',
    description: 'مجموعة مركزة من الزيوت العطرية العضوية الطبيعية 100%. تشمل زيت اللافندر للاسترخاء وزيت اليلانغ يلانغ والياسمين لزيادة الرغبة وتحسين المزاج.',
    descriptionEn: 'Concentrated set of 100% natural organic essential oils. Includes lavender for relaxation, and ylang-ylang and jasmine to enhance mood.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 4.7,
    reviewsCount: 22,
    stock: 20,
    isNew: true
  }
];

export const MOCK_ARTICLES: AdviceArticle[] = [
  {
    id: 'art-1',
    title: 'كيفية اختيار الألعاب الزوجية المناسبة لأول مرة',
    titleEn: 'How to Choose the Right Couples Toys for the First Time',
    content: 'البدء في استخدام الألعاب الزوجية قد يكون تجربة مشوقة للغاية وتفتح آفاقاً جديدة من المتعة والتواصل بين الزوجين. الخطوة الأولى والأهم هي الحوار الصريح والمفتوح. يجب أن يتفق الطرفان على تجربة شيء جديد بروح من المرح والفضول بدون أي ضغوط.\n\nعند الاختيار لأول مرة، يفضل البدء بأشياء بسيطة وغير مخيفة. مثلاً، تعتبر زيوت المساج العطرية الفاخرة أو شموع المساج مدخلاً ممتازاً لأنها تركز على الاسترخاء واللمس اللطيف. تليها عصابات العين الحريرية أو الريش الناعم التي تعزز الحواس الأخرى بشكل مذهل.\n\nإذا رغبتم في تجربة أجهزة اهتزازية، فإن هزاز الرصاصة الصغير أو حلقات السيليكون المرنة للرجال تعد خيارات مثالية لأنها صغيرة الحجم، سهلة الاستخدام، وتخدم كلا الطرفين. تذكروا دائماً استخدام مزلقات مائية عالية الجودة لتوفير أقصى درجات الراحة والنعومة، واحرصوا على تنظيف الأدوات جيداً بالماء الدافئ والصابون الطبي المخصص بعد كل استخدام لضمان السلامة التامة.',
    contentEn: 'Starting to use couples toys can be an exciting experience. The first step is open dialogue. Start with simple items like massage oils or silk blindfolds. For devices, small bullets or rings are ideal. Always use high-quality water-based lubricants and clean tools after use.',
    readTime: '5 دقائق',
    category: 'نصائح للمبتدئين',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-15'
  },
  {
    id: 'art-2',
    title: 'أهمية المزلقات المائية وكيفية العناية بمنتجات السيليكون',
    titleEn: 'The Importance of Water-Based Lubes and Silicone Care',
    content: 'تعتبر المزلقات ذات الأساس المائي حجر الأساس في أي علاقة حميمة صحية وممتعة. فهي لا تقتصر فقط على حل مشكلة الجفاف، بل تضيف نعومة فائقة تقلل من الاحتكاك المزعج وتزيد من الإحساس بالمتعة لكلا الطرفين.\n\nلماذا نؤكد دائماً على المزلقات المائية؟ لأنها ببساطة الأكثر أماناً على الإطلاق. المزلقات المائية متوافقة تماماً مع الواقيات الذكرية بجميع أنواعها، والأهم من ذلك أنها الوحيدة الآمنة للاستخدام مع الألعاب المصنوعة من السيليكون. المزلقات الزيتية أو التي تحتوي على سيليكون تؤدي إلى تآكل وتلف الألعاب السيليكونية بسرعة، مما يجعلها بيئة لتراكم البكتيريا.\n\nأما بالنسبة للعناية بالمنتجات، فالأمر غاية في البساطة ولكنه يتطلب استمرارية: \n1. اغسل المنتج مباشرة بعد الاستخدام بالماء الدافئ وصابون مضاد للبكتيريا غير معطر، أو استخدم بخاخ تنظيف الألعاب المخصص.\n2. تجنب غمر الأجزاء الكهربائية في الماء ما لم يكن المنتج مصنفاً كمقاوم للماء بالكامل (Waterproof).\n3. جفف المنتج بقطعة قماش نظيفة لا تترك وبرأ، ودعه يجف تماماً في الهواء.\n4. احفظ كل منتج في حقيبته الخاصة المصنوعة من القماش (المخمل أو الساتان) بعيداً عن أشعة الشمس المباشرة والحرارة، ولا تخزن المنتجات السيليكونية ملامسة لبعضها البعض لأنها قد تتفاعل وتلتصق.',
    contentEn: 'Water-based lubes are essential for comfort and safety. They are compatible with condoms and silicone toys. Oil-based lubes destroy silicone. Clean toys immediately with warm water and antibacterial soap, dry with a lint-free cloth, and store in a cool, dry cloth bag.',
    readTime: '4 دقائق',
    category: 'صحة وعناية',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-10'
  },
  {
    id: 'art-3',
    title: 'كسر الروتين الزوجي: أفكار لإعادة الحيوية للعلاقة الحميمة',
    titleEn: 'Breaking the Routine: Ideas to Revitalize Intimacy',
    content: 'الروتين هو العدو الأول للعلاقات الزوجية طويلة الأمد، ومن الطبيعي جداً أن تمر العلاقة الحميمة بفترات من الركود بسبب ضغوط الحياة، العمل، والأبناء. لكن الخبر السار هو أن إعادة الشغف والحيوية أمر ممكن تماماً ويحتاج فقط إلى القليل من التخطيط والمبادرة.\n\nإليكم بعض الأفكار المجربة والمبتكرة:\n1. **تغيير البيئة والتوقيت:** ليس من الضروري أن تكون العلاقة دائماً في غرفة النوم وفي نهاية اليوم عندما يكون الإرهاق في أوجه. جربوا أوقاتاً مختلفة كعطلة نهاية الأسبوع صباحاً، أو يمكنكم الحجز في فندق ليوم واحد لتغيير الأجواء تماماً.\n2. **التدليك الرومانسي المتبادل:** خصصوا ليلة كاملة للتدليك فقط بدون أي توقعات أخرى. استخدام شموع المساج العطرية الدافئة والموسيقى الهادئة يخلق جواً من الاسترخاء العميق ويقرب المسافات الجسدية والعاطفية.\n3. **الألعاب التنكرية واللانجري:** تجربة أزياء تنكرية أو أطقم لانجري جريئة وجديدة كلياً تكسر الصورة النمطية المعتادة وتثير الفضول والإعجاب مجدداً.\n4. **إدخال مفاجآت جديدة:** مثل استخدام عصابة العينين (حجب حاسة البصر يضاعف الشعور بلمسات الشريك ويثير الحماس) أو تجربة جهاز اهتزازي جديد يتم التحكم فيه عن بعد.\n\nتذكروا دوماً أن التواصل والتعبير عن المشاعر والتقدير المتبادل هو الوقود الحقيقي لأي علاقة حميمة ناجحة.',
    contentEn: 'Routine can dampen long-term intimacy. Revitalize it by changing environments, booking a hotel, dedicating a night to mutual massage with warm candles, using blindfolds, or trying new lingerie/toys. Open communication is the fuel of intimacy.',
    readTime: '6 دقائق',
    category: 'علاقات زوجية',
    image: 'https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-05'
  }
];
