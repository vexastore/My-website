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
    title: 'ألعاب زوجية في لبنان | متجر فيكسا',
    desc: 'اشتر أفضل ألعاب زوجية في لبنان — هزازات، ديلدو، لانجري. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>ألعاب زوجية في لبنان — متجر فيكسا</h1><p>متجر فيكسا هو الوجهة الأولى لشراء ألعاب زوجية فاخرة في لبنان. نوفر أكبر تشكيلة من المنتجات الحميمية في بيروت وجميع المناطق اللبنانية — هزازات، ديلدو، لانجري، أدوات BDSM، معززات جنسية، ومزيداً من المنتجات المصنوعة من مواد طبية آمنة.</p><p>التوصيل سري 100%: كل طلب يُشحن في كرتون مغلق بدون أي إشارة إلى المحتوى. الدفع عند الاستلام متاح في بيروت وكل لبنان.</p><ul><li>ألعاب زوجية أصلية وآمنة طبياً</li><li>توصيل سري في نفس اليوم — بيروت</li><li>توصيل 24-72 ساعة لكل لبنان</li><li>دفع نقداً عند الاستلام</li><li>تغليف سري محكم 100%</li></ul>',
    jsonldName: 'ألعاب زوجية', priority: '0.95'
  },
  {
    slug: 'vibrators', name: 'Vibrators',
    title: 'هزازات فاخرة في لبنان | متجر فيكسا',
    desc: 'هزازات فاخرة في لبنان من أفضل الماركات. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>هزازات في لبنان — متجر فيكسا</h1><p>اكتشف أفضل مجموعة هزازات فاخرة في لبنان من متجر فيكسا. نوفر هزازات من أفضل الماركات العالمية — هزازات بظرية، هزازات نقطة G، هزازات مزدوجة، وهزازات تحكم عن بعد. جميع المنتجات مصنوعة من السيليكون الطبي الآمن على البشرة.</p><ul><li>هزازات بظرية — أقوى إحساس</li><li>هزازات نقطة G للمتعة العميقة</li><li>هزازات تحكم عن بعد للأزواج</li><li>سيليكون طبي آمن 100%</li><li>مضادة للماء وسهلة التنظيف</li></ul>',
    jsonldName: 'هزازات', priority: '0.95'
  },
  {
    slug: 'lingerie', name: 'Lingerie',
    title: 'لانجري فاخر في لبنان | متجر فيكسا',
    desc: 'أفضل لانجري فاخر في لبنان — تشكيلة واسعة بأسعار مناسبة. توصيل سري وسريع في بيروت وجميع المناطق. متجر فيكسا.',
    seoText: '<h1>لانجري في لبنان — متجر فيكسا</h1><p>تسوقي أجمل لانجري فاخر في لبنان من متجر فيكسا. تشكيلة واسعة من اللانجري الرومانسي والمثير — دانتيل، ساتان، كورسيه، تيدي، أطقم كاملة، وملابس نوم مثيرة بأسعار مناسبة.</p><ul><li>لانجري دانتيل رومانسي فاخر</li><li>كورسيه وبوستيه مثير</li><li>أطقم لانجري كاملة للأزواج</li><li>ملابس نوم شفافة ومثيرة</li><li>مقاسات متعددة — S حتى XXXL</li></ul>',
    jsonldName: 'لانجري فاخر', priority: '0.90'
  },
  {
    slug: 'male-toys', name: 'Male Toys',
    title: 'ألعاب رجالية فاخرة في لبنان | متجر فيكسا',
    desc: 'أفضل ألعاب رجالية في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>ألعاب رجالية في لبنان — متجر فيكسا</h1><p>تشكيلة كاملة من الألعاب الرجالية الفاخرة في لبنان من متجر فيكسا. نوفر مجموعة متنوعة من المنتجات المصممة خصيصاً للرجال — مستمني، مضخات تكبير، حلقات قضيب، وألعاب استمتاع متعددة.</p><ul><li>مستمني سيليكون واقعية</li><li>مضخات تكبير القضيب</li><li>حلقات قضيب للاستمرارية</li><li>توصيل سري في بيروت ولبنان</li></ul>',
    jsonldName: 'ألعاب رجالية', priority: '0.85'
  },
  {
    slug: 'dildos', name: 'Dildos',
    title: 'ديلدو سيليكون في لبنان | متجر فيكسا',
    desc: 'ديلدو آمن مصنوع من السيليكون الطبي في لبنان. توصيل سري في نفس اليوم، دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>ديلدو في لبنان — متجر فيكسا</h1><p>اشترِ أفضل ديلدو سيليكون طبي في لبنان من متجر فيكسا. تشكيلة واسعة بأحجام وأشكال متعددة — واقعي، ملون، بساق شفط، مزدوج. جميعها مصنوعة من السيليكون الطبي الخالي من BPA.</p><ul><li>سيليكون طبي خالٍ من BPA</li><li>أحجام متعددة — صغير وكبير</li><li>بساق شفط للاستخدام بدون يدين</li><li>مضاد للماء وسهل التنظيف</li></ul>',
    jsonldName: 'ديلدو سيليكون', priority: '0.85'
  },
  {
    slug: 'bdsm', name: 'BDSM',
    title: 'منتجات BDSM في لبنان | متجر فيكسا',
    desc: 'أدوات وألعاب BDSM في لبنان — مقيدات، سياط، أقنعة. توصيل سري في بيروت. دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>BDSM في لبنان — متجر فيكسا</h1><p>اكتشف عالم BDSM الآمن مع متجر فيكسا في لبنان. نوفر أدوات BDSM للمبتدئين والمتقدمين — قيود مخملية، عصابات عين، سياط ناعمة، مشابك.</p><ul><li>قيود مخملية ناعمة للمبتدئين</li><li>عصابات عين فاخرة</li><li>سياط وريش للعب الخفيف</li><li>مشابك وأدوات تحفيز</li></ul>',
    jsonldName: 'أدوات BDSM', priority: '0.80'
  },
  {
    slug: 'holiday-collection', name: 'Holiday Collection',
    title: 'كوليكشن العطلات | متجر فيكسا لبنان',
    desc: 'تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة في لبنان. توصيل سري.',
    seoText: '<h1>كوليكشن العطلات — متجر فيكسا لبنان</h1><p>تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة مثالية للمناسبات والأعياد في لبنان.</p><ul><li>أطقم هدايا رومانسية فاخرة</li><li>تغليف هدية أنيق وسري</li><li>مثالية لأعياد الميلاد والذكرى السنوية</li></ul>',
    jsonldName: 'كوليكشن العطلات', priority: '0.75'
  },
  {
    slug: 'new-arrivals', name: 'New Arrivals',
    title: 'وصل حديثاً | متجر فيكسا لبنان',
    desc: 'آخر المنتجات الجديدة في متجر فيكسا — ألعاب زوجية، هزازات، لانجري. توصيل سري في لبنان.',
    seoText: '<h1>وصل حديثاً — متجر فيكسا لبنان</h1><p>اكتشف أحدث الوافدات إلى متجر فيكسا في لبنان. نُضيف منتجات جديدة أسبوعياً — هزازات، لانجري، ألعاب زوجية. كن أول من يحصل على آخر الإضافات.</p><ul><li>منتجات جديدة كل أسبوع</li><li>أحدث الماركات والتصميمات</li><li>عروض خاصة على الوافدات الجديدة</li></ul>',
    jsonldName: 'منتجات جديدة', priority: '0.90'
  },
  {
    slug: 'butt-plugs', name: 'Butt Plugs',
    title: 'باط بلاغ سيليكون في لبنان | متجر فيكسا',
    desc: 'أفضل باط بلاغ سيليكون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>باط بلاغ في لبنان — متجر فيكسا</h1><p>تشكيلة متنوعة من الباط بلاغ الآمن في لبنان. مصنوعة من السيليكون الطبي أو الستانلس ستيل — ناعمة ومريحة بأحجام وأشكال متعددة.</p><ul><li>سيليكون طبي ناعم ومرن</li><li>أحجام للمبتدئين والمتقدمين</li><li>مضادة للماء</li></ul>',
    jsonldName: 'باط بلاغ', priority: '0.70'
  },
  {
    slug: 'anal-toys', name: 'Anal Toys',
    title: 'ألعاب شرجية آمنة في لبنان | متجر فيكسا',
    desc: 'أفضل ألعاب شرجية آمنة في لبنان. توصيل سري في بيروت، دفع عند الاستلام. متجر فيكسا.',
    seoText: '<h1>ألعاب شرجية في لبنان — متجر فيكسا</h1><p>تشكيلة آمنة ومتنوعة من الألعاب الشرجية في لبنان — باط بلاغ، مدلكات بروستات، خرزات شرجية. جميعها مصنوعة من مواد طبية آمنة 100%.</p><ul><li>مواد طبية آمنة خالية من BPA</li><li>مدلكات بروستات للرجال</li><li>خرزات شرجية بأحجام متدرجة</li></ul>',
    jsonldName: 'ألعاب شرجية', priority: '0.70'
  },
  {
    slug: 'bondage', name: 'Bondage',
    title: 'أدوات بونداج في لبنان | متجر فيكسا',
    desc: 'أدوات وألعاب بونداج في لبنان — قيود، حبال. توصيل سري في بيروت. دفع عند الاستلام.',
    seoText: '<h1>بونداج في لبنان — متجر فيكسا</h1><p>أدوات البونداج الآمنة والفاخرة في لبنان — قيود مخملية، حبال ناعمة، أصفاد جلدية. مناسبة للمبتدئين الراغبين في استكشاف عالم القيود بأمان.</p>',
    jsonldName: 'أدوات بونداج', priority: '0.70'
  },
  {
    slug: 'sex-dolls', name: 'Sex Dolls',
    title: 'دمى حميمة في لبنان | متجر فيكسا',
    desc: 'أفضل دمى حميمة في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>دمى حميمة في لبنان — متجر فيكسا</h1><p>دمى حميمة واقعية بأجسام مصنوعة من مواد عالية الجودة في لبنان. تشكيلة متنوعة من الدمى الجزئية والكاملة بتصاميم واقعية ومريحة.</p>',
    jsonldName: 'دمى حميمة', priority: '0.70'
  },
  {
    slug: 'strap-ons', name: 'Strap Ons',
    title: 'ستراب أون في لبنان | متجر فيكسا',
    desc: 'أفضل ستراب أون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>ستراب أون في لبنان — متجر فيكسا</h1><p>ستراب أون فاخر ومريح للأزواج في لبنان. أحزمة قابلة للتعديل وديلدو سيليكون آمن — لتجارب متنوعة ومريحة.</p>',
    jsonldName: 'ستراب أون', priority: '0.70'
  },
  {
    slug: 'kegel-balls', name: 'Kegel Balls',
    title: 'كيغل بولز في لبنان | متجر فيكسا',
    desc: 'كيغل بولز لتقوية عضلات قاع الحوض في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
    seoText: '<h1>كيغل بولز في لبنان — متجر فيكسا</h1><p>كيغل بولز لتقوية عضلات قاع الحوض وتحسين الحياة الجنسية في لبنان. مصنوعة من السيليكون الطبي الآمن.</p>',
    jsonldName: 'كيغل بولز', priority: '0.65'
  },
  {
    slug: 'sexual-enhancers', name: 'Sexual Enhancers',
    title: 'معززات جنسية في لبنان | متجر فيكسا',
    desc: 'أفضل معززات جنسية في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>معززات جنسية في لبنان — متجر فيكسا</h1><p>معززات ومؤخرات جنسية فاخرة في لبنان — كريمات تقوية، أدوية تأخير، مكملات تحسين الأداء لتجربة أطول وأكثر متعة.</p>',
    jsonldName: 'معززات جنسية', priority: '0.65'
  },
  {
    slug: 'penis-pumps', name: 'Penis Pumps',
    title: 'مضخات تكبير في لبنان | متجر فيكسا',
    desc: 'مضخات تكبير طبية في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>مضخات القضيب في لبنان — متجر فيكسا</h1><p>مضخات تكبير القضيب الطبية في لبنان — يدوية وكهربائية. تعمل على تحسين الانتصاب وزيادة الحجم المؤقت بشكل آمن وفعّال.</p>',
    jsonldName: 'مضخات تكبير', priority: '0.65'
  },
  {
    slug: 'cock-rings', name: 'Cock Rings',
    title: 'حلقات قضيب سيليكون في لبنان | متجر فيكسا',
    desc: 'حلقات قضيب سيليكون طبي في لبنان. توصيل سري في بيروت وكل لبنان. دفع عند الاستلام.',
    seoText: '<h1>حلقات قضيب في لبنان — متجر فيكسا</h1><p>حلقات قضيب سيليكون طبي في لبنان — تمد فترة الانتصاب وتزيد الاستمتاع للشريكين. مرنة ومريحة بأحجام متعددة.</p>',
    jsonldName: 'حلقات قضيب', priority: '0.70'
  },
  {
    slug: 'masturbators', name: 'Masturbators',
    title: 'أدوات استمناء رجالية في لبنان | متجر فيكسا',
    desc: 'أدوات استمناء رجالية فاخرة في لبنان. توصيل سري في بيروت. متجر فيكسا.',
    seoText: '<h1>مستمني في لبنان — متجر فيكسا</h1><p>أدوات الاستمناء الرجالية الفاخرة في لبنان — Pocket Pussy، كيس سيليكون واقعي. متعة واقعية ومكثفة بمواد طبية آمنة.</p>',
    jsonldName: 'أدوات استمناء', priority: '0.75'
  },
  {
    slug: 'chastity', name: 'Chastity',
    title: 'أقفال العفة في لبنان | متجر فيكسا',
    desc: 'أقفال العفة وإكسسوارات التحكم في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
    seoText: '<h1>أقفال العفة في لبنان — متجر فيكسا</h1><p>أقفال العفة ومنتجات التحكم الجنسي في لبنان — بلاستيك طبي وستانلس ستيل. للأزواج الراغبين في تجربة التحكم بشكل آمن.</p>',
    jsonldName: 'أقفال العفة', priority: '0.60'
  },
  {
    slug: 'sex-machines', name: 'Sex Machines',
    title: 'آلات جنسية أوتوماتيكية في لبنان | متجر فيكسا',
    desc: 'أفضل آلات جنسية أوتوماتيكية في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
    seoText: '<h1>آلات جنسية في لبنان — متجر فيكسا</h1><p>آلات جنسية أوتوماتيكية فاخرة في لبنان — حركة إيقاعية قوية بسرعات متعددة. تجربة فريدة ومكثفة.</p>',
    jsonldName: 'آلات جنسية', priority: '0.60'
  },
  {
    slug: 'lubricants', name: 'Lubricants',
    title: 'مواد تشحيم آمنة في لبنان | متجر فيكسا',
    desc: 'مواد تشحيم مائية آمنة على البشرة في لبنان. توصيل سري في بيروت. دفع عند الاستلام.',
    seoText: '<h1>مواد التشحيم في لبنان — متجر فيكسا</h1><p>مواد تشحيم آمنة على البشرة في لبنان — مائية وسيليكونية وهجينة. تعزز المتعة وتمنع الجفاف — متوافقة مع الواقي الذكري.</p><ul><li>تشحيم مائي — آمن مع الواقي</li><li>تشحيم سيليكوني — أطول مدة</li><li>مرطبات ومهيجات لزيادة المتعة</li></ul>',
    jsonldName: 'مواد تشحيم', priority: '0.75'
  },
  {
    slug: 'poppers', name: 'Poppers',
    title: 'بوبرز في لبنان | متجر فيكسا',
    desc: 'أفضل بوبرز في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام.',
    seoText: '<h1>بوبرز في لبنان — متجر فيكسا</h1><p>بوبرز فاخرة في لبنان من أفضل الماركات العالمية. توصيل سري وسريع في بيروت وكل لبنان مع ضمان الجودة والأصالة.</p>',
    jsonldName: 'بوبرز', priority: '0.60'
  },
];

const base = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const SEO_STYLE = `<style id="seo-style">
#seo-preamble{font-family:Arial,sans-serif;direction:rtl;padding:14px 18px;background:#060606;color:#bbb;border-bottom:1px solid #1a1a1a;font-size:14px;line-height:1.65}
#seo-preamble h1{font-size:18px;font-weight:700;color:#ddd;margin:0 0 8px}
#seo-preamble p{margin:0 0 8px;color:#999}
#seo-preamble ul{margin:0;padding-right:18px;color:#888}
#seo-preamble li{margin-bottom:3px}
</style>`;

function buildJsonLd(cat) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": cat.title,
    "description": cat.desc,
    "url": `https://vexatoys.com/${cat.slug}`,
    "isPartOf": { "@type": "WebSite", "name": "Vexa Store Lebanon", "url": "https://vexatoys.com" },
    "about": { "@type": "Thing", "name": cat.jsonldName },
    "publisher": {
      "@type": "Organization",
      "name": "Vexa Store Lebanon",
      "url": "https://vexatoys.com",
      "contactPoint": { "@type": "ContactPoint", "telephone": "+96176730767", "contactType": "customer service", "areaServed": "LB" }
    }
  });
}

function generatePage({ slug, name, title, desc, seoText, jsonldName, priority, initScript }) {
  let html = base;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  const canonicalUrl = `https://vexatoys.com/${slug}`;
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,       `$1${desc}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,        `$1${canonicalUrl}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,       `$1${title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${desc}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,       `$1${title}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${desc}$2`);

  const jsonLdTag = `<script type="application/ld+json">${buildJsonLd({ slug, title, desc, jsonldName, priority })}</script>`;
  const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${title}</h1><p>${desc}</p><p>متجر فيكسا — توصيل سري في لبنان — دفع عند الاستلام</p><a href="https://vexatoys.com">vexatoys.com</a></div></noscript>`;

  html = html.replace('</head>', `${jsonLdTag}\n${SEO_STYLE}\n${initScript}\n${noscript}\n</head>`);

  const seoPreamble = `<div id="seo-preamble">${seoText}</div>`;
  html = html.replace('<div id="root">', `${seoPreamble}\n<div id="root">`);

  return html;
}

for (const cat of CATEGORIES) {
  const initScript = `<script>window.__INITIAL_CATEGORY__="${cat.name}";</script>`;
  const html = generatePage({ ...cat, initScript });
  fs.writeFileSync(path.join(distDir, `${cat.slug}.html`), html);
  console.log(`✓ ${cat.slug}.html`);
}

// ── About page ──────────────────────────────────────────────────────────────
const aboutJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "عن متجر فيكسا",
  "description": "تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية في لبنان.",
  "url": "https://vexatoys.com/about",
  "publisher": { "@type": "Organization", "name": "Vexa Store Lebanon", "url": "https://vexatoys.com" }
});
const aboutSeoText = '<h1>عن متجر فيكسا — ألعاب زوجية ولانجري في لبنان</h1><p>متجر فيكسا هو المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية، اللانجري، ومستلزمات السعادة الرومانسية الفاخرة في لبنان.</p><ul><li>توصيل سري 100% في بيروت ولبنان</li><li>دفع عند الاستلام (COD)</li><li>منتجات أصلية وآمنة طبياً</li><li>خدمة عملاء سرية عبر واتساب</li></ul>';

let aboutHtml = base;
aboutHtml = aboutHtml.replace(/<title>[^<]*<\/title>/, `<title>عن متجر فيكسا | ألعاب زوجية ولانجري في لبنان - توصيل سري</title>`);
aboutHtml = aboutHtml.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="https://vexatoys.com/about" />`);
aboutHtml = aboutHtml.replace(/(<meta name="description" content=")[^"]*(")/,   `$1تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية واللانجري في لبنان.$2`);
aboutHtml = aboutHtml.replace(/(<meta property="og:url" content=")[^"]*(")/,    `$1https://vexatoys.com/about$2`);
aboutHtml = aboutHtml.replace(/(<meta property="og:title" content=")[^"]*(")/,   `$1عن متجر فيكسا | لبنان$2`);
aboutHtml = aboutHtml.replace('</head>',
  `<script type="application/ld+json">${aboutJsonLd}</script>\n${SEO_STYLE}\n<script>window.__INITIAL_VIEW__="about";</script>\n</head>`);
aboutHtml = aboutHtml.replace('<div id="root">', `<div id="seo-preamble">${aboutSeoText}</div>\n<div id="root">`);
fs.writeFileSync(path.join(distDir, 'about.html'), aboutHtml);
console.log('✓ about.html');

// ── Auto-generate sitemap.xml in dist/ ──────────────────────────────────────
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
console.log('✓ sitemap.xml (auto-generated)');

console.log(`\n✅ Pre-rendering complete: ${CATEGORIES.length + 1} pages + sitemap.xml`);
