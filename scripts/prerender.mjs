import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ not found. Run vite build first.');
  process.exit(1);
}

const CATEGORIES = [
  { slug: 'sex-toys',          name: 'Sex Toys',
    title: 'ألعاب زوجية في لبنان | متجر فيكسا',
    desc:  'اشتر أفضل ألعاب زوجية في لبنان — هزازات، ديلدو، لانجري. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'vibrators',         name: 'Vibrators',
    title: 'هزازات فاخرة في لبنان | متجر فيكسا',
    desc:  'هزازات فاخرة في لبنان من أفضل الماركات. توصيل سري في نفس اليوم في بيروت، دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'lingerie',          name: 'Lingerie',
    title: 'لانجري فاخر في لبنان | متجر فيكسا',
    desc:  'أفضل لانجري فاخر في لبنان — تشكيلة واسعة بأسعار مناسبة. توصيل سري وسريع في بيروت وجميع المناطق. متجر فيكسا.' },
  { slug: 'male-toys',         name: 'Male Toys',
    title: 'ألعاب رجالية فاخرة في لبنان | متجر فيكسا',
    desc:  'أفضل ألعاب رجالية في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'dildos',            name: 'Dildos',
    title: 'ديلدو سيليكون في لبنان | متجر فيكسا',
    desc:  'ديلدو آمن مصنوع من السيليكون الطبي في لبنان. توصيل سري في نفس اليوم، دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'bdsm',              name: 'BDSM',
    title: 'منتجات BDSM في لبنان | متجر فيكسا',
    desc:  'أدوات وألعاب BDSM في لبنان — مقيدات، سياط، أقنعة. توصيل سري في بيروت. دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'holiday-collection',name: 'Holiday Collection',
    title: 'كوليكشن العطلات | متجر فيكسا لبنان',
    desc:  'تشكيلة العطلات الخاصة من متجر فيكسا — هدايا رومانسية فاخرة في لبنان. توصيل سري.' },
  { slug: 'new-arrivals',      name: 'New Arrivals',
    title: 'وصل حديثاً | متجر فيكسا لبنان',
    desc:  'آخر المنتجات الجديدة في متجر فيكسا — ألعاب زوجية، هزازات، لانجري. توصيل سري في لبنان.' },
  { slug: 'butt-plugs',        name: 'Butt Plugs',
    title: 'باط بلاغ سيليكون في لبنان | متجر فيكسا',
    desc:  'أفضل باط بلاغ سيليكون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.' },
  { slug: 'anal-toys',         name: 'Anal Toys',
    title: 'ألعاب شرجية آمنة في لبنان | متجر فيكسا',
    desc:  'أفضل ألعاب شرجية آمنة في لبنان. توصيل سري في بيروت، دفع عند الاستلام. متجر فيكسا.' },
  { slug: 'bondage',           name: 'Bondage',
    title: 'أدوات بونداج في لبنان | متجر فيكسا',
    desc:  'أدوات وألعاب بونداج في لبنان — قيود، حبال. توصيل سري في بيروت. دفع عند الاستلام.' },
  { slug: 'sex-dolls',         name: 'Sex Dolls',
    title: 'دمى حميمة في لبنان | متجر فيكسا',
    desc:  'أفضل دمى حميمة في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام.' },
  { slug: 'strap-ons',         name: 'Strap Ons',
    title: 'ستراب أون في لبنان | متجر فيكسا',
    desc:  'أفضل ستراب أون في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.' },
  { slug: 'kegel-balls',       name: 'Kegel Balls',
    title: 'كيغل بولز في لبنان | متجر فيكسا',
    desc:  'كيغل بولز لتقوية عضلات قاع الحوض في لبنان. توصيل سري في بيروت. دفع عند الاستلام.' },
  { slug: 'sexual-enhancers',  name: 'Sexual Enhancers',
    title: 'معززات جنسية في لبنان | متجر فيكسا',
    desc:  'أفضل معززات جنسية في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.' },
  { slug: 'penis-pumps',       name: 'Penis Pumps',
    title: 'مضخات تكبير في لبنان | متجر فيكسا',
    desc:  'مضخات تكبير طبية في لبنان. توصيل سري في بيروت وجميع المناطق. دفع عند الاستلام.' },
  { slug: 'cock-rings',        name: 'Cock Rings',
    title: 'حلقات قضيب سيليكون في لبنان | متجر فيكسا',
    desc:  'حلقات قضيب سيليكون طبي في لبنان. توصيل سري في بيروت وكل لبنان. دفع عند الاستلام.' },
  { slug: 'masturbators',      name: 'Masturbators',
    title: 'أدوات استمناء رجالية في لبنان | متجر فيكسا',
    desc:  'أدوات استمناء رجالية فاخرة في لبنان. توصيل سري في بيروت. متجر فيكسا.' },
  { slug: 'chastity',          name: 'Chastity',
    title: 'أقفال العفة في لبنان | متجر فيكسا',
    desc:  'أقفال العفة وإكسسوارات التحكم في لبنان. توصيل سري في بيروت. دفع عند الاستلام.' },
  { slug: 'sex-machines',      name: 'Sex Machines',
    title: 'آلات جنسية أوتوماتيكية في لبنان | متجر فيكسا',
    desc:  'أفضل آلات جنسية أوتوماتيكية في لبنان. توصيل سري في بيروت. دفع عند الاستلام.' },
  { slug: 'lubricants',        name: 'Lubricants',
    title: 'مواد تشحيم آمنة في لبنان | متجر فيكسا',
    desc:  'مواد تشحيم مائية آمنة على البشرة في لبنان. توصيل سري في بيروت. دفع عند الاستلام.' },
  { slug: 'poppers',           name: 'Poppers',
    title: 'بوبرز في لبنان | متجر فيكسا',
    desc:  'أفضل بوبرز في لبنان. توصيل سري وسريع في بيروت وجميع المناطق. دفع عند الاستلام.' },
];

const base = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

function generatePage({ slug, name, title, desc, initScript }) {
  let html = base;
  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  // Canonical
  const canonicalUrl = `https://vexatoys.com/${slug}`;
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  // Meta description
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,  `$1${desc}$2`);
  // og:url
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,   `$1${canonicalUrl}$2`);
  // og:title
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${title}$2`);
  // og:description
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${desc}$2`);
  // twitter:title
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,     `$1${title}$2`);
  // twitter:description
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${desc}$2`);
  // Inject init script + noscript before </head>
  const noscript = `<noscript><div style="font-family:sans-serif;padding:20px;direction:rtl"><h1>${title}</h1><p>${desc}</p><p>متجر فيكسا — توصيل سري في لبنان — دفع عند الاستلام</p><a href="https://vexatoys.com">العودة للمتجر</a></div></noscript>`;
  html = html.replace('</head>', `${initScript}\n${noscript}\n</head>`);
  return html;
}

// Generate category pages
for (const cat of CATEGORIES) {
  const initScript = `<script>window.__INITIAL_CATEGORY__="${cat.name}";</script>`;
  const html = generatePage({ ...cat, initScript });
  fs.writeFileSync(path.join(distDir, `${cat.slug}.html`), html);
  console.log(`✓ ${cat.slug}.html`);
}

// Generate about page
const aboutHtml = generatePage({
  slug: 'about',
  name: 'about',
  title: 'عن متجر فيكسا | ألعاب زوجية ولانجري في لبنان - توصيل سري',
  desc:  'تعرف على متجر فيكسا — المتجر الأكثر أماناً وخصوصية للمنتجات الزوجية واللانجري في لبنان. توصيل سري في بيروت.',
  initScript: '<script>window.__INITIAL_VIEW__="about";</script>',
});
fs.writeFileSync(path.join(distDir, 'about.html'), aboutHtml);
console.log('✓ about.html');

console.log(`\n✅ Pre-rendering complete: ${CATEGORIES.length + 1} pages generated.`);
