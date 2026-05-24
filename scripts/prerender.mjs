import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ not found. Run vite build first.');
  process.exit(1);
}

const TODAY = new Date().toISOString().slice(0, 10);

const CATEGORIES = [
  {
    slug: 'sex-toys', name: 'Sex Toys',
    titleAr: 'ألعاب زوجية في لبنان | متجر فيكسا',
    titleEn: 'Sex Toys in Lebanon | Vexa Store - Discreet Delivery Beirut',
    descAr: 'اشتر أفضل ألعاب زوجية في لبنان — هزازات، ديلدو، لانجري. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Buy the best sex toys in Lebanon — vibrators, dildos, lingerie. Same-day discreet delivery in Beirut, cash on delivery. Vexa Store.',
    keywords: 'sex toys Lebanon, ألعاب زوجية لبنان, adult toys Beirut, sex toys online Lebanon, متجر ألعاب جنسية بيروت, discreet delivery Lebanon',
    seoTextAr: '<h1>ألعاب زوجية في لبنان — متجر فيكسا</h1><p>متجر فيكسا هو الوجهة الأولى لشراء ألعاب زوجية فاخرة في لبنان. نوفر أكبر تشكيلة من المنتجات الحميمية في بيروت وجميع المناطق اللبنانية — هزازات، ديلدو، لانجري، أدوات BDSM، معززات جنسية.</p><ul><li>توصيل سري في نفس اليوم — بيروت</li><li>توصيل 24-72 ساعة لكل لبنان</li><li>دفع نقداً عند الاستلام</li><li>تغليف سري محكم 100%</li></ul>',
    seoTextEn: '<h2>Sex Toys in Lebanon — Vexa Store</h2><p>Vexa Store is Lebanon\'s premier destination for premium adult toys. We offer the widest selection of intimate products in Beirut and all Lebanese regions — vibrators, dildos, lingerie, BDSM gear, and sexual enhancers. All products are made from body-safe medical-grade materials.</p><ul><li>Same-day discreet delivery — Beirut</li><li>24-72 hour delivery across Lebanon</li><li>Cash on delivery (COD)</li><li>100% plain sealed packaging</li></ul>',
    related: ['vibrators','dildos','lingerie','male-toys'],
    jsonldName: 'ألعاب زوجية / Sex Toys', priority: '0.95'
  },
  {
    slug: 'vibrators', name: 'Vibrators',
    titleAr: 'هزازات فاخرة في لبنان | متجر فيكسا',
    titleEn: 'Vibrators in Lebanon | Premium Vibrators Beirut - Vexa Store',
    descAr: 'هزازات فاخرة في لبنان من أفضل الماركات. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Premium vibrators in Lebanon from top brands. Same-day discreet delivery in Beirut, cash on delivery. Vexa Store.',
    keywords: 'vibrators Lebanon, هزازات لبنان, vibrators Beirut, هزازات بيروت, clitoral vibrator, G-spot vibrator Lebanon, discreet delivery',
    seoTextAr: '<h1>هزازات في لبنان — متجر فيكسا</h1><p>اكتشف أفضل مجموعة هزازات فاخرة في لبنان من متجر فيكسا. هزازات بظرية، نقطة G، مزدوجة، وتحكم عن بعد. جميع المنتجات من السيليكون الطبي الآمن.</p><ul><li>هزازات بظرية — أقوى إحساس</li><li>هزازات نقطة G</li><li>هزازات تحكم عن بعد للأزواج</li><li>مضادة للماء وسهلة التنظيف</li></ul>',
    seoTextEn: '<h2>Vibrators in Lebanon — Vexa Store</h2><p>Discover Lebanon\'s best collection of premium vibrators at Vexa Store. We carry clitoral vibrators, G-spot vibrators, dual-stimulation and remote-controlled options. All products are made from body-safe silicone.</p><ul><li>Clitoral vibrators — intense pleasure</li><li>G-spot vibrators for deep stimulation</li><li>Remote-controlled couples vibrators</li><li>Waterproof and easy to clean</li></ul>',
    related: ['sex-toys','dildos','kegel-balls','sexual-enhancers'],
    jsonldName: 'هزازات / Vibrators', priority: '0.95'
  },
  {
    slug: 'lingerie', name: 'Lingerie',
    titleAr: 'لانجري فاخر في لبنان | متجر فيكسا',
    titleEn: 'Lingerie Lebanon | Sexy Lingerie Beirut - Vexa Store',
    descAr: 'أفضل لانجري فاخر في لبنان — تشكيلة واسعة بأسعار مناسبة. توصيل سري وسريع في بيروت وجميع المناطق. متجر فيكسا.',
    descEn: 'Premium lingerie in Lebanon — wide collection at great prices. Fast discreet delivery in Beirut and all regions. Vexa Store.',
    keywords: 'lingerie Lebanon, لانجري لبنان, sexy lingerie Beirut, لانجري بيروت, lace lingerie, lingerie shop Lebanon, discreet delivery',
    seoTextAr: '<h1>لانجري في لبنان — متجر فيكسا</h1><p>تسوقي أجمل لانجري فاخر في لبنان من متجر فيكسا. تشكيلة واسعة من اللانجري الرومانسي والمثير — دانتيل، ساتان، كورسيه، تيدي، أطقم كاملة.</p><ul><li>لانجري دانتيل رومانسي فاخر</li><li>كورسيه وبوستيه مثير</li><li>أطقم لانجري كاملة للأزواج</li><li>مقاسات متعددة — S حتى XXXL</li></ul>',
    seoTextEn: '<h2>Lingerie in Lebanon — Vexa Store</h2><p>Shop the finest lingerie in Lebanon at Vexa Store. Wide collection of romantic and sensual lingerie — lace, satin, corsets, teddies, and full sets at affordable prices.</p><ul><li>Romantic lace lingerie sets</li><li>Corsets and bustiers</li><li>Complete couples lingerie sets</li><li>Multiple sizes — S to XXXL</li></ul>',
    related: ['sex-toys','bondage','kegel-balls','new-arrivals'],
    jsonldName: 'لانجري / Lingerie', priority: '0.90'
  },
  {
    slug: 'male-toys', name: 'Male Toys',
    titleAr: 'ألعاب رجالية فاخرة في لبنان | متجر فيكسا',
    titleEn: 'Male Toys Lebanon | Men Adult Toys Beirut - Vexa Store',
    descAr: 'أفضل ألعاب رجالية في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Best male adult toys in Lebanon. Fast discreet delivery in Beirut and all regions. Cash on delivery. Vexa Store.',
    keywords: 'male toys Lebanon, ألعاب رجالية لبنان, men sex toys Beirut, masturbators Lebanon, cock rings Beirut, penis pump Lebanon',
    seoTextAr: '<h1>ألعاب رجالية في لبنان — متجر فيكسا</h1><p>تشكيلة كاملة من الألعاب الرجالية الفاخرة في لبنان — مستمني، مضخات تكبير، حلقات قضيب، وألعاب استمتاع متعددة.</p><ul><li>مستمني سيليكون واقعية</li><li>مضخات تكبير القضيب</li><li>حلقات قضيب للاستمرارية</li><li>توصيل سري في بيروت ولبنان</li></ul>',
    seoTextEn: '<h2>Male Toys in Lebanon — Vexa Store</h2><p>Complete collection of premium male adult toys in Lebanon — masturbators, penis pumps, cock rings, and more. All shipped in plain sealed packaging.</p><ul><li>Realistic silicone masturbators</li><li>Penis pumps and enlargers</li><li>Cock rings for stamina</li><li>Discreet delivery across Lebanon</li></ul>',
    related: ['cock-rings','masturbators','penis-pumps','sexual-enhancers'],
    jsonldName: 'ألعاب رجالية / Male Toys', priority: '0.85'
  },
  {
    slug: 'dildos', name: 'Dildos',
    titleAr: 'ديلدو سيليكون في لبنان | متجر فيكسا',
    titleEn: 'Dildos Lebanon | Premium Dildos Beirut - Vexa Store',
    descAr: 'ديلدو آمن مصنوع من السيليكون الطبي في لبنان. توصيل سري في نفس اليوم، دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Discover premium dildos designed for comfort and safety in Lebanon. Medical-grade silicone, BPA-free. Same-day discreet delivery Beirut.',
    keywords: 'dildos Lebanon, ديلدو لبنان, premium dildos Beirut, silicone dildo Lebanon, ديلدو سيليكون, adult toys Lebanon, discreet shipping',
    seoTextAr: '<h1>ديلدو في لبنان — متجر فيكسا</h1><p>اشترِ أفضل ديلدو سيليكون طبي في لبنان من متجر فيكسا. تشكيلة واسعة بأحجام وأشكال متعددة — واقعي، ملون، بساق شفط، مزدوج. جميعها من السيليكون الطبي الخالي من BPA.</p><ul><li>سيليكون طبي خالٍ من BPA</li><li>أحجام متعددة للجميع</li><li>بساق شفط للاستخدام بدون يدين</li><li>مضاد للماء وسهل التنظيف</li></ul>',
    seoTextEn: '<h2>Dildos in Lebanon — Vexa Store</h2><p>Buy the best silicone dildos in Lebanon at Vexa Store. Wide selection of sizes and styles — realistic, colorful, suction-cup, and double-ended. All made from body-safe, BPA-free medical silicone. Rated 4.7/5 by our customers.</p><ul><li>BPA-free medical-grade silicone</li><li>Multiple sizes for all experience levels</li><li>Suction-cup base for hands-free use</li><li>Waterproof and easy to clean</li></ul>',
    related: ['vibrators','sex-toys','butt-plugs','anal-toys'],
    jsonldName: 'ديلدو / Dildos', priority: '0.85'
  },
  {
    slug: 'bdsm', name: 'BDSM',
    titleAr: 'منتجات BDSM في لبنان | متجر فيكسا',
    titleEn: 'BDSM Toys Lebanon | Bondage Gear Beirut - Vexa Store',
    descAr: 'أدوات وألعاب BDSM في لبنان — مقيدات، سياط، أقنعة. توصيل سري في بيروت. دفع عند الاستلام. متجر فيكسا.',
    descEn: 'BDSM toys and bondage gear in Lebanon — restraints, blindfolds, paddles. Discreet delivery in Beirut. Cash on delivery. Vexa Store.',
    keywords: 'BDSM Lebanon, bondage Lebanon, BDSM Beirut, restraints Lebanon, blindfold Lebanon, ألعاب BDSM لبنان, adult BDSM shop',
    seoTextAr: '<h1>BDSM في لبنان — متجر فيكسا</h1><p>اكتشف عالم BDSM الآمن مع متجر فيكسا في لبنان. أدوات BDSM للمبتدئين والمتقدمين — قيود مخملية، عصابات عين، سياط ناعمة، مشابك.</p><ul><li>قيود مخملية ناعمة للمبتدئين</li><li>عصابات عين فاخرة</li><li>سياط وريش للعب الخفيف</li><li>مشابك وأدوات تحفيز</li></ul>',
    seoTextEn: '<h2>BDSM in Lebanon — Vexa Store</h2><p>Explore the world of BDSM safely with Vexa Store Lebanon. We carry beginner and advanced BDSM gear — velvet restraints, blindfolds, soft paddles, and nipple clamps. All products are beginner-friendly and safe.</p><ul><li>Soft velvet restraints for beginners</li><li>Premium blindfolds for sensory play</li><li>Paddles and feathers for light play</li><li>Clamps and stimulation tools</li></ul>',
    related: ['bondage','sex-toys','lingerie','strap-ons'],
    jsonldName: 'BDSM', priority: '0.80'
  },
  {
    slug: 'holiday-collection', name: 'Holiday Collection',
    titleAr: 'كوليكشن العطلات | متجر فيكسا لبنان',
    titleEn: 'Holiday Collection Lebanon | Romantic Gift Sets - Vexa Store',
    descAr: 'تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة في لبنان. توصيل سري.',
    descEn: 'Special holiday collection from Vexa Store — premium romantic gift sets in Lebanon. Discreet delivery.',
    keywords: 'holiday gift sets Lebanon, romantic gifts Beirut, adult gift sets Lebanon, هدايا رومانسية لبنان, couples gifts Beirut',
    seoTextAr: '<h1>كوليكشن العطلات — متجر فيكسا لبنان</h1><p>تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة مثالية للمناسبات والأعياد في لبنان.</p><ul><li>أطقم هدايا رومانسية فاخرة</li><li>تغليف هدية أنيق وسري</li><li>مثالية لأعياد الميلاد والذكرى السنوية</li></ul>',
    seoTextEn: '<h2>Holiday Collection Lebanon — Vexa Store</h2><p>Vexa Store\'s exclusive holiday collection features premium romantic gift sets perfect for special occasions in Lebanon. Each set is elegantly packaged with full discretion.</p><ul><li>Luxury romantic gift sets</li><li>Elegant and discreet gift packaging</li><li>Perfect for birthdays and anniversaries</li></ul>',
    related: ['lingerie','sex-toys','new-arrivals','vibrators'],
    jsonldName: 'Holiday Collection / كوليكشن العطلات', priority: '0.75'
  },
  {
    slug: 'new-arrivals', name: 'New Arrivals',
    titleAr: 'وصل حديثاً | متجر فيكسا لبنان',
    titleEn: 'New Arrivals Lebanon | Latest Adult Toys Beirut - Vexa Store',
    descAr: 'آخر المنتجات الجديدة في متجر فيكسا — ألعاب زوجية، هزازات، لانجري. توصيل سري في لبنان.',
    descEn: 'Latest new products at Vexa Store Lebanon — sex toys, vibrators, lingerie. Discreet delivery across Lebanon.',
    keywords: 'new arrivals adult toys Lebanon, latest sex toys Beirut, وصل حديثاً لبنان, new vibrators Lebanon, new lingerie Beirut',
    seoTextAr: '<h1>وصل حديثاً — متجر فيكسا لبنان</h1><p>اكتشف أحدث الوافدات إلى متجر فيكسا في لبنان. نُضيف منتجات جديدة أسبوعياً — هزازات، لانجري، ألعاب زوجية.</p><ul><li>منتجات جديدة كل أسبوع</li><li>أحدث الماركات والتصميمات</li><li>عروض خاصة على الوافدات الجديدة</li></ul>',
    seoTextEn: '<h2>New Arrivals at Vexa Store Lebanon</h2><p>Discover the latest additions to Vexa Store Lebanon. We add new products weekly — vibrators, lingerie, couples toys. Be the first to get the newest arrivals.</p><ul><li>New products every week</li><li>Latest brands and designs</li><li>Special offers on new arrivals</li></ul>',
    related: ['sex-toys','vibrators','lingerie','dildos'],
    jsonldName: 'New Arrivals / وصل حديثاً', priority: '0.90'
  },
  {
    slug: 'butt-plugs', name: 'Butt Plugs',
    titleAr: 'باط بلاغ سيليكون في لبنان | متجر فيكسا',
    titleEn: 'Butt Plugs Lebanon | Anal Plugs Beirut - Vexa Store',
    descAr: 'أفضل باط بلاغ سيليكون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Best butt plugs in Lebanon — silicone and stainless steel options. Discreet delivery in Beirut. Cash on delivery.',
    keywords: 'butt plugs Lebanon, anal plugs Beirut, سدادة شرجية لبنان, silicone butt plug Lebanon, beginner anal plug',
    seoTextAr: '<h1>باط بلاغ في لبنان — متجر فيكسا</h1><p>تشكيلة متنوعة من الباط بلاغ الآمن في لبنان. مصنوعة من السيليكون الطبي أو الستانلس ستيل — ناعمة ومريحة بأحجام وأشكال متعددة.</p><ul><li>سيليكون طبي ناعم ومرن</li><li>أحجام للمبتدئين والمتقدمين</li><li>مضادة للماء</li></ul>',
    seoTextEn: '<h2>Butt Plugs in Lebanon — Vexa Store</h2><p>Safe and comfortable butt plugs in Lebanon at Vexa Store. Made from medical silicone or stainless steel — smooth and comfortable in multiple sizes.</p><ul><li>Soft medical-grade silicone</li><li>Sizes for beginners and advanced users</li><li>Waterproof and easy to clean</li></ul>',
    related: ['anal-toys','sex-toys','bondage','dildos'],
    jsonldName: 'Butt Plugs / سدادة شرجية', priority: '0.70'
  },
  {
    slug: 'anal-toys', name: 'Anal Toys',
    titleAr: 'ألعاب شرجية آمنة في لبنان | متجر فيكسا',
    titleEn: 'Anal Toys Lebanon | Anal Beads & Prostate Massagers Beirut',
    descAr: 'أفضل ألعاب شرجية آمنة في لبنان. توصيل سري في بيروت، دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Best safe anal toys in Lebanon — anal beads, prostate massagers. Discreet delivery in Beirut. Cash on delivery.',
    keywords: 'anal toys Lebanon, ألعاب شرجية لبنان, anal beads Beirut, prostate massager Lebanon, anal sex toys Lebanon',
    seoTextAr: '<h1>ألعاب شرجية في لبنان — متجر فيكسا</h1><p>تشكيلة آمنة ومتنوعة من الألعاب الشرجية في لبنان — باط بلاغ، مدلكات بروستات، خرزات شرجية. جميعها من مواد طبية آمنة 100%.</p><ul><li>مواد طبية آمنة خالية من BPA</li><li>مدلكات بروستات للرجال</li><li>خرزات شرجية بأحجام متدرجة</li></ul>',
    seoTextEn: '<h2>Anal Toys in Lebanon — Vexa Store</h2><p>Safe and varied anal toy collection in Lebanon — butt plugs, prostate massagers, anal beads. All made from 100% body-safe medical materials.</p><ul><li>BPA-free body-safe materials</li><li>Prostate massagers for men</li><li>Graduated anal beads</li></ul>',
    related: ['butt-plugs','male-toys','sex-toys','bondage'],
    jsonldName: 'Anal Toys / ألعاب شرجية', priority: '0.70'
  },
  {
    slug: 'bondage', name: 'Bondage',
    titleAr: 'أدوات بونداج في لبنان | متجر فيكسا',
    titleEn: 'Bondage Gear Lebanon | Restraints & Rope Beirut - Vexa Store',
    descAr: 'أدوات وألعاب بونداج في لبنان — قيود، حبال. توصيل سري في بيروت. دفع عند الاستلام.',
    descEn: 'Bondage gear in Lebanon — restraints, rope, handcuffs. Discreet delivery in Beirut. Cash on delivery.',
    keywords: 'bondage Lebanon, restraints Lebanon, bondage gear Beirut, قيود لبنان, BDSM bondage Lebanon, handcuffs Lebanon',
    seoTextAr: '<h1>بونداج في لبنان — متجر فيكسا</h1><p>أدوات البونداج الآمنة والفاخرة في لبنان — قيود مخملية، حبال ناعمة، أصفاد جلدية. مناسبة للمبتدئين الراغبين في استكشاف عالم القيود بأمان.</p>',
    seoTextEn: '<h2>Bondage in Lebanon — Vexa Store</h2><p>Safe and luxurious bondage gear in Lebanon — velvet restraints, soft rope, leather cuffs. Perfect for beginners looking to safely explore restraint play.</p>',
    related: ['bdsm','sex-toys','lingerie','strap-ons'],
    jsonldName: 'Bondage / عبودية', priority: '0.70'
  },
  {
    slug: 'sex-dolls', name: 'Sex Dolls',
    titleAr: 'دمى حميمة في لبنان | متجر فيكسا',
    titleEn: 'Sex Dolls Lebanon | Realistic Love Dolls Beirut - Vexa Store',
    descAr: 'أفضل دمى حميمة في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Best sex dolls in Lebanon — realistic design, premium materials. Fast discreet delivery in Beirut. Cash on delivery.',
    keywords: 'sex dolls Lebanon, love dolls Beirut, دمى جنسية لبنان, realistic sex doll Lebanon, adult dolls Beirut',
    seoTextAr: '<h1>دمى حميمة في لبنان — متجر فيكسا</h1><p>دمى حميمة واقعية بأجسام مصنوعة من مواد عالية الجودة في لبنان. تشكيلة متنوعة من الدمى الجزئية والكاملة.</p>',
    seoTextEn: '<h2>Sex Dolls in Lebanon — Vexa Store</h2><p>Realistic intimate dolls made from high-quality materials in Lebanon. Wide variety of partial and full-body options with realistic designs.</p>',
    related: ['male-toys','masturbators','sex-toys','anal-toys'],
    jsonldName: 'Sex Dolls / دمى حميمة', priority: '0.70'
  },
  {
    slug: 'strap-ons', name: 'Strap Ons',
    titleAr: 'ستراب أون في لبنان | متجر فيكسا',
    titleEn: 'Strap-ons Lebanon | Harness & Dildo Sets Beirut - Vexa Store',
    descAr: 'أفضل ستراب أون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Best strap-ons in Lebanon — adjustable harnesses and silicone dildos. Discreet delivery in Beirut. Cash on delivery.',
    keywords: 'strap-ons Lebanon, strap-on harness Beirut, أحزمة لبنان, strap on dildo Lebanon, pegging Lebanon',
    seoTextAr: '<h1>ستراب أون في لبنان — متجر فيكسا</h1><p>ستراب أون فاخر ومريح للأزواج في لبنان. أحزمة قابلة للتعديل وديلدو سيليكون آمن لتجارب متنوعة.</p>',
    seoTextEn: '<h2>Strap-ons in Lebanon — Vexa Store</h2><p>Premium and comfortable strap-ons for couples in Lebanon. Adjustable harnesses with safe silicone dildos for versatile experiences.</p>',
    related: ['bdsm','dildos','bondage','sex-toys'],
    jsonldName: 'Strap-ons / أحزمة', priority: '0.70'
  },
  {
    slug: 'kegel-balls', name: 'Kegel Balls',
    titleAr: 'كيغل بولز في لبنان | متجر فيكسا',
    titleEn: 'Kegel Balls Lebanon | Pelvic Floor Exercises Beirut - Vexa Store',
    descAr: 'كيغل بولز لتقوية عضلات قاع الحوض في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
    descEn: 'Kegel balls for pelvic floor strengthening in Lebanon — medical silicone, beginner-friendly. Discreet delivery Beirut.',
    keywords: 'kegel balls Lebanon, كيغل لبنان, pelvic floor Lebanon, kegel exercises Beirut, Ben Wa balls Lebanon',
    seoTextAr: '<h1>كيغل بولز في لبنان — متجر فيكسا</h1><p>كيغل بولز لتقوية عضلات قاع الحوض وتحسين الحياة الجنسية في لبنان. مصنوعة من السيليكون الطبي الآمن.</p>',
    seoTextEn: '<h2>Kegel Balls in Lebanon — Vexa Store</h2><p>Kegel balls for pelvic floor strengthening and improved intimate wellness in Lebanon. Made from safe medical silicone, beginner-friendly designs.</p>',
    related: ['vibrators','sex-toys','lingerie','sexual-enhancers'],
    jsonldName: 'Kegel Balls / كيغل بولز', priority: '0.65'
  },
  {
    slug: 'sexual-enhancers', name: 'Sexual Enhancers',
    titleAr: 'معززات جنسية في لبنان | متجر فيكسا',
    titleEn: 'Sexual Enhancers Lebanon | Delay & Performance Beirut - Vexa Store',
    descAr: 'أفضل معززات جنسية في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Best sexual enhancers and delay products in Lebanon. Discreet delivery Beirut. Cash on delivery.',
    keywords: 'sexual enhancers Lebanon, delay spray Lebanon, معززات جنسية لبنان, performance enhancers Beirut, delay products Lebanon',
    seoTextAr: '<h1>معززات جنسية في لبنان — متجر فيكسا</h1><p>معززات ومؤخرات جنسية فاخرة في لبنان — كريمات تقوية، أدوية تأخير، مكملات تحسين الأداء لتجربة أطول وأكثر متعة.</p>',
    seoTextEn: '<h2>Sexual Enhancers in Lebanon — Vexa Store</h2><p>Premium sexual enhancers and delay products in Lebanon — strengthening creams, delay sprays, performance supplements for longer, more pleasurable experiences.</p>',
    related: ['male-toys','vibrators','cock-rings','lubricants'],
    jsonldName: 'Sexual Enhancers / معززات جنسية', priority: '0.65'
  },
  {
    slug: 'penis-pumps', name: 'Penis Pumps',
    titleAr: 'مضخات القضيب في لبنان | متجر فيكسا',
    titleEn: 'Penis Pumps Lebanon | Male Enhancement Beirut - Vexa Store',
    descAr: 'أفضل مضخات القضيب في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Best penis pumps and sleeves in Lebanon. Discreet delivery Beirut. Cash on delivery. Vexa Store.',
    keywords: 'penis pump Lebanon, مضخة قضيب لبنان, male enhancement Lebanon, penis sleeve Beirut, cock pump Lebanon',
    seoTextAr: '<h1>مضخات القضيب في لبنان — متجر فيكسا</h1><p>مضخات وأكمام القضيب الفاخرة في لبنان. تشكيلة متنوعة لتحسين الأداء والثقة الذاتية.</p>',
    seoTextEn: '<h2>Penis Pumps in Lebanon — Vexa Store</h2><p>Premium penis pumps and sleeves in Lebanon. Diverse selection for improved performance and confidence.</p>',
    related: ['male-toys','cock-rings','sexual-enhancers','masturbators'],
    jsonldName: 'Penis Pumps / مضخات القضيب', priority: '0.65'
  },
  {
    slug: 'cock-rings', name: 'Cock Rings',
    titleAr: 'حلقات القضيب في لبنان | متجر فيكسا',
    titleEn: 'Cock Rings Lebanon | Vibrating Cock Rings Beirut - Vexa Store',
    descAr: 'حلقات قضيب سيليكون طبي في لبنان — توصيل سري في بيروت وكل لبنان. متجر فيكسا.',
    descEn: 'Medical silicone cock rings in Lebanon — vibrating and non-vibrating options. Discreet delivery Beirut.',
    keywords: 'cock rings Lebanon, حلقات قضيب لبنان, vibrating cock ring Beirut, cock ring silicone Lebanon, penis ring Lebanon',
    seoTextAr: '<h1>حلقات القضيب في لبنان — متجر فيكسا</h1><p>حلقات قضيب سيليكون طبي متنوعة في لبنان — هزازة وغير هزازة لتجربة أطول وأكثر كثافة.</p>',
    seoTextEn: '<h2>Cock Rings in Lebanon — Vexa Store</h2><p>Medical silicone cock rings in Lebanon — vibrating and non-vibrating options for longer, more intense experiences.</p>',
    related: ['male-toys','penis-pumps','sexual-enhancers','masturbators'],
    jsonldName: 'Cock Rings / حلقات القضيب', priority: '0.65'
  },
  {
    slug: 'masturbators', name: 'Masturbators',
    titleAr: 'أدوات الاستمناء في لبنان | متجر فيكسا',
    titleEn: 'Masturbators Lebanon | Male Masturbators Beirut - Vexa Store',
    descAr: 'أدوات استمناء رجالية فاخرة في لبنان — توصيل سري في بيروت. متجر فيكسا.',
    descEn: 'Premium male masturbators in Lebanon — realistic textures, discreet delivery Beirut. Vexa Store.',
    keywords: 'masturbators Lebanon, أدوات استمناء لبنان, male masturbator Beirut, pocket pussy Lebanon, fleshlight Lebanon',
    seoTextAr: '<h1>أدوات الاستمناء في لبنان — متجر فيكسا</h1><p>أدوات استمناء رجالية فاخرة في لبنان بملمس واقعي وأشكال متعددة للمتعة القصوى.</p>',
    seoTextEn: '<h2>Masturbators in Lebanon — Vexa Store</h2><p>Premium male masturbators in Lebanon with realistic textures and multiple designs for maximum pleasure.</p>',
    related: ['male-toys','sex-dolls','cock-rings','sexual-enhancers'],
    jsonldName: 'Masturbators / أدوات الاستمناء', priority: '0.65'
  },
  {
    slug: 'chastity', name: 'Chastity',
    titleAr: 'أدوات العفة في لبنان | متجر فيكسا',
    titleEn: 'Chastity Devices Lebanon | Chastity Cages Beirut - Vexa Store',
    descAr: 'أدوات العفة في لبنان — توصيل سري في بيروت وكل لبنان. متجر فيكسا.',
    descEn: 'Chastity devices and cages in Lebanon — discreet delivery Beirut. Cash on delivery. Vexa Store.',
    keywords: 'chastity Lebanon, chastity cage Beirut, أدوات العفة لبنان, chastity device Lebanon, male chastity Lebanon',
    seoTextAr: '<h1>أدوات العفة في لبنان — متجر فيكسا</h1><p>أدوات العفة وأقفاص العفة في لبنان للتحكم والمتعة. تشكيلة متنوعة من الأحجام والمواد.</p>',
    seoTextEn: '<h2>Chastity Devices in Lebanon — Vexa Store</h2><p>Chastity devices and cages in Lebanon for control and pleasure play. Various sizes and materials available.</p>',
    related: ['bdsm','bondage','male-toys','cock-rings'],
    jsonldName: 'Chastity / العفة', priority: '0.60'
  },
  {
    slug: 'sex-machines', name: 'Sex Machines',
    titleAr: 'ماكينات الجنس في لبنان | متجر فيكسا',
    titleEn: 'Sex Machines Lebanon | Fucking Machines Beirut - Vexa Store',
    descAr: 'ماكينات الجنس الفاخرة في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    descEn: 'Premium sex machines in Lebanon — powerful and versatile. Discreet delivery Beirut. Cash on delivery.',
    keywords: 'sex machines Lebanon, ماكينات جنس لبنان, fucking machine Beirut, sex machine Lebanon, automatic sex toy Lebanon',
    seoTextAr: '<h1>ماكينات الجنس في لبنان — متجر فيكسا</h1><p>ماكينات جنس فاخرة وقوية في لبنان لتجربة فريدة. توصيل سري في بيروت وجميع مناطق لبنان.</p>',
    seoTextEn: '<h2>Sex Machines in Lebanon — Vexa Store</h2><p>Premium and powerful sex machines in Lebanon for a unique experience. Discreet delivery in Beirut and all Lebanese regions.</p>',
    related: ['sex-toys','vibrators','dildos','strap-ons'],
    jsonldName: 'Sex Machines / ماكينات الجنس', priority: '0.65'
  },
  {
    slug: 'lubricants', name: 'Lubricants',
    titleAr: 'مواد التشحيم في لبنان | متجر فيكسا',
    titleEn: 'Lubricants Lebanon | Personal Lube Beirut - Vexa Store',
    descAr: 'مواد تشحيم مائية آمنة على البشرة في لبنان — توصيل سري في بيروت، دفع عند الاستلام. متجر فيكسا.',
    descEn: 'Body-safe water-based lubricants in Lebanon. Discreet delivery Beirut. Cash on delivery.',
    keywords: 'lubricants Lebanon, personal lube Beirut, مواد تشحيم لبنان, water-based lube Lebanon, lubricant gel Lebanon',
    seoTextAr: '<h1>مواد التشحيم في لبنان — متجر فيكسا</h1><p>مواد تشحيم مائية آمنة على البشرة في لبنان. مناسبة لجميع أنواع الألعاب الجنسية، بدون عطر، آمنة طبياً 100%.</p>',
    seoTextEn: '<h2>Lubricants in Lebanon — Vexa Store</h2><p>Body-safe water-based lubricants in Lebanon. Compatible with all toy types, fragrance-free, 100% medically safe.</p>',
    related: ['sex-toys','anal-toys','dildos','sexual-enhancers'],
    jsonldName: 'Lubricants / مواد التشحيم', priority: '0.65'
  },
  {
    slug: 'poppers', name: 'Poppers',
    titleAr: 'بوبرز في لبنان | متجر فيكسا',
    titleEn: 'Poppers Lebanon | Buy Poppers Beirut - Vexa Store',
    descAr: 'بوبرز في لبنان من أفضل الماركات. توصيل سري في بيروت وكل لبنان. دفع عند الاستلام.',
    descEn: 'Poppers in Lebanon from top brands. Discreet delivery Beirut. Cash on delivery. Vexa Store.',
    keywords: 'poppers Lebanon, بوبرز لبنان, poppers Beirut, amyl nitrite Lebanon, buy poppers Lebanon',
    seoTextAr: '<h1>بوبرز في لبنان — متجر فيكسا</h1><p>بوبرز من أفضل الماركات العالمية متوفر الآن في لبنان عبر متجر فيكسا. توصيل سري وسريع في بيروت وجميع مناطق لبنان.</p>',
    seoTextEn: '<h2>Poppers in Lebanon — Vexa Store</h2><p>Top-brand poppers now available in Lebanon through Vexa Store. Fast discreet delivery in Beirut and all Lebanese regions.</p>',
    related: ['sexual-enhancers','bdsm','sex-toys','male-toys'],
    jsonldName: 'Poppers / بوبرز', priority: '0.60'
  },
];

const SLUG_TO_NAME_AR = {
  'sex-toys':'ألعاب زوجية','vibrators':'هزازات','dildos':'ديلدو','lingerie':'لانجري',
  'male-toys':'ألعاب رجالية','bdsm':'BDSM','butt-plugs':'سدادة شرجية','anal-toys':'ألعاب الشرج',
  'bondage':'عبودية','sex-dolls':'دمى جنسية','strap-ons':'ستراب أون','kegel-balls':'كيغل بولز',
  'sexual-enhancers':'معززات جنسية','penis-pumps':'مضخات القضيب','cock-rings':'حلقات القضيب',
  'masturbators':'مستمني','chastity':'العفة','sex-machines':'ماكينات الجنس',
  'lubricants':'مواد التشحيم','poppers':'بوبرز','new-arrivals':'وصل حديثاً',
  'holiday-collection':'مجموعة الأعياد',
};
const SLUG_TO_NAME_EN = {
  'sex-toys':'Sex Toys','vibrators':'Vibrators','dildos':'Dildos','lingerie':'Lingerie',
  'male-toys':'Male Toys','bdsm':'BDSM','butt-plugs':'Butt Plugs','anal-toys':'Anal Toys',
  'bondage':'Bondage','sex-dolls':'Sex Dolls','strap-ons':'Strap-ons','kegel-balls':'Kegel Balls',
  'sexual-enhancers':'Sexual Enhancers','penis-pumps':'Penis Pumps','cock-rings':'Cock Rings',
  'masturbators':'Masturbators','chastity':'Chastity','sex-machines':'Sex Machines',
  'lubricants':'Lubricants','poppers':'Poppers','new-arrivals':'New Arrivals',
  'holiday-collection':'Holiday Collection',
};

const base = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const SEO_STYLE = `<style id="seo-style">
#seo-preamble{font-family:Arial,sans-serif;padding:14px 18px;background:#060606;color:#bbb;border-bottom:1px solid #1a1a1a;font-size:14px;line-height:1.65}
#seo-preamble .seo-ar{direction:rtl;text-align:right}
#seo-preamble .seo-en{direction:ltr;text-align:left;margin-top:12px;border-top:1px solid #1a1a1a;padding-top:12px}
#seo-preamble h1,#seo-preamble h2{font-size:18px;font-weight:700;color:#ddd;margin:0 0 8px}
#seo-preamble p{margin:0 0 8px;color:#999}
#seo-preamble ul{margin:0;padding-inline-start:18px;color:#888}
#seo-preamble li{margin-bottom:3px}
#seo-related{font-family:Arial,sans-serif;padding:10px 18px 12px;background:#060606;border-bottom:1px solid #1a1a1a;font-size:12px;direction:rtl}
#seo-related a{color:#666;text-decoration:none;margin-left:12px;margin-right:4px}
#seo-related a:hover{color:#999}
#seo-related span{color:#444}
</style>`;

function buildJsonLd(cat) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": cat.titleEn,
    "alternateName": cat.titleAr,
    "description": cat.descEn,
    "url": `https://vexatoys.com/${cat.slug}`,
    "inLanguage": ["ar","en"],
    "isPartOf": {
      "@type": "WebSite",
      "name": "Vexa Store Lebanon",
      "url": "https://vexatoys.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://vexatoys.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    "about": {
      "@type": "Thing",
      "name": cat.jsonldName,
      "description": cat.descEn
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vexa Store Lebanon",
      "url": "https://vexatoys.com",
      "logo": { "@type": "ImageObject", "url": "https://vexatoys.com/vexa-logo.jpg" },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+96176730767",
        "contactType": "customer service",
        "areaServed": "LB",
        "availableLanguage": ["Arabic","English"]
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Vexa Store Lebanon", "item": "https://vexatoys.com/" },
        { "@type": "ListItem", "position": 2, "name": cat.jsonldName, "item": `https://vexatoys.com/${cat.slug}` }
      ]
    }
  });
}

function buildRelatedLinks(slugs) {
  const arLinks = slugs.map(s =>
    `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_AR[s] || s}</a>`
  ).join('<span>|</span>');
  const enLinks = slugs.map(s =>
    `<a href="https://vexatoys.com/${s}">${SLUG_TO_NAME_EN[s] || s}</a>`
  ).join('<span>|</span>');
  return `<div id="seo-related">
    <span style="color:#555;margin-left:8px">ذات صلة:</span>${arLinks}
    &nbsp;&nbsp;<span style="direction:ltr;display:inline">Related: ${enLinks}</span>
  </div>`;
}

function generatePage(cat) {
  let html = base;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${cat.titleAr} | ${cat.titleEn}</title>`);

  const canonicalUrl = `https://vexatoys.com/${cat.slug}`;
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,      `$1${cat.descAr} ${cat.descEn}$2`);
  html = html.replace(/(<meta name="keywords" content=")[^"]*(")/,          `$1${cat.keywords}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,        `$1${canonicalUrl}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,      `$1${cat.titleAr}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${cat.descAr}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,     `$1${cat.titleAr}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${cat.descAr}$2`);

  const jsonLdTag = `<script type="application/ld+json">${buildJsonLd(cat)}</script>`;
  const noscript  = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${cat.titleAr}</h1><p>${cat.descAr}</p><p>متجر فيكسا — توصيل سري في لبنان — دفع عند الاستلام</p><a href="https://vexatoys.com">vexatoys.com</a></div></noscript>`;
  const initScript = `<script>window.__INITIAL_CATEGORY__="${cat.name}";</script>`;

  html = html.replace('</head>', `${jsonLdTag}\n${SEO_STYLE}\n${initScript}\n${noscript}\n</head>`);

  const seoPreamble = `<div id="seo-preamble"><div class="seo-ar">${cat.seoTextAr}</div><div class="seo-en">${cat.seoTextEn}</div></div>`;
  const relatedLinks = buildRelatedLinks(cat.related);

  html = html.replace('<div id="root">', `${seoPreamble}\n${relatedLinks}\n<div id="root">`);

  return html;
}

for (const cat of CATEGORIES) {
  const html = generatePage(cat);
  fs.writeFileSync(path.join(distDir, `${cat.slug}.html`), html);
  console.log(`✓ ${cat.slug}.html`);
}

// ── About page ───────────────────────────────────────────────────────────────
const aboutJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Vexa Store Lebanon / عن متجر فيكسا",
  "description": "Vexa Store is Lebanon's most discreet and trusted adult products store — تعرف على متجر فيكسا، المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية في لبنان.",
  "url": "https://vexatoys.com/about",
  "publisher": { "@type": "Organization", "name": "Vexa Store Lebanon", "url": "https://vexatoys.com" }
});
const aboutSeoText = `
  <div style="font-family:Arial,sans-serif;padding:14px 18px;background:#060606;color:#bbb;border-bottom:1px solid #1a1a1a;font-size:14px;line-height:1.65">
    <div dir="rtl"><h1>عن متجر فيكسا — ألعاب زوجية ولانجري في لبنان</h1>
    <p>متجر فيكسا هو المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية، اللانجري، ومستلزمات السعادة الرومانسية الفاخرة في لبنان.</p>
    <ul><li>توصيل سري 100% في بيروت ولبنان</li><li>دفع عند الاستلام (COD)</li><li>منتجات أصلية وآمنة طبياً</li><li>خدمة عملاء سرية عبر واتساب</li></ul></div>
    <div dir="ltr" style="margin-top:12px;border-top:1px solid #1a1a1a;padding-top:12px"><h2>About Vexa Store Lebanon</h2>
    <p>Vexa Store is Lebanon's most discreet and trusted adult products store. We deliver premium sex toys, lingerie, and intimate accessories across Lebanon with 100% plain sealed packaging.</p>
    <ul><li>100% discreet delivery in Beirut and Lebanon</li><li>Cash on delivery (COD)</li><li>Original, body-safe medical-grade products</li><li>Private WhatsApp customer support</li></ul></div>
  </div>`;

let aboutHtml = base;
aboutHtml = aboutHtml.replace(/<title>[^<]*<\/title>/, `<title>عن متجر فيكسا | About Vexa Store Lebanon - Adult Toys & Lingerie</title>`);
aboutHtml = aboutHtml.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://vexatoys.com/about" />`);
aboutHtml = aboutHtml.replace(/(<meta name="description" content=")[^"]*(")/,    `$1تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية واللانجري في لبنان. About Vexa Store — Lebanon's most discreet adult products store.$2`);
aboutHtml = aboutHtml.replace(/(<meta name="keywords" content=")[^"]*(")/,        `$1Vexa Store Lebanon, متجر فيكسا, adult toys store Lebanon, sex toys shop Beirut, متجر ألعاب جنسية لبنان$2`);
aboutHtml = aboutHtml.replace(/(<meta property="og:url" content=")[^"]*(")/,      `$1https://vexatoys.com/about$2`);
aboutHtml = aboutHtml.replace(/(<meta property="og:title" content=")[^"]*(")/,    `$1عن متجر فيكسا | Vexa Store Lebanon$2`);
aboutHtml = aboutHtml.replace('</head>', `<script type="application/ld+json">${aboutJsonLd}</script>\n${SEO_STYLE}\n<script>window.__INITIAL_VIEW__="about";</script>\n</head>`);
aboutHtml = aboutHtml.replace('<div id="root">', `${aboutSeoText}\n<div id="root">`);
fs.writeFileSync(path.join(distDir, 'about.html'), aboutHtml);
console.log('✓ about.html');

// ── Auto-generate sitemap.xml (clean URLs ONLY — no ?category=) ─────────────
const urlEntries = [
  `  <url>\n    <loc>https://vexatoys.com/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>https://vexatoys.com/about</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
  ...CATEGORIES.map(c =>
    `  <url>\n    <loc>https://vexatoys.com/${c.slug}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${c.priority}</priority>\n  </url>`
  )
].join('\n');

fs.writeFileSync(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
);
console.log('✓ sitemap.xml (clean URLs only, no ?category=)');
console.log(`\n✅ Pre-rendering complete: ${CATEGORIES.length + 1} pages + sitemap.xml`);
