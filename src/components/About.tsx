import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Lock, Star, Heart, Package, Zap, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { language, setView } = useShop();
  const isArabic = language === 'ar';

  const features = [
    {
      icon: <Lock size={24} className="text-indigo-400" />,
      ar: { title: 'خصوصية مطلقة 100%', body: 'كل طلب يُشحن في كرتون عادي مغلق بالكامل بدون أي إشارة إلى محتواه أو اسم المتجر. خصوصيتك هي أولويتنا الأولى في متجر فيكسا.' },
      en: { title: '100% Discreet Packaging', body: 'Every order ships in a plain sealed box with zero indication of its contents or our store name. Your privacy is our top priority at Vexa Store Lebanon.' }
    },
    {
      icon: <Truck size={24} className="text-emerald-400" />,
      ar: { title: 'توصيل سري في نفس اليوم — بيروت', body: 'نوصل طلبك في نفس اليوم داخل بيروت وضواحيها. خارج بيروت؟ نوصل لكل لبنان خلال 24 إلى 72 ساعة بسرية تامة.' },
      en: { title: 'Same-Day Discreet Delivery — Beirut', body: 'We deliver your order the same day within Beirut and its suburbs. Outside Beirut? We ship all across Lebanon within 24 to 72 hours, fully discreet.' }
    },
    {
      icon: <Package size={24} className="text-amber-400" />,
      ar: { title: 'دفع عند الاستلام (COD)', body: 'لا تحتاج للدفع أونلاين. ادفع نقداً عند استلام طلبك. نضمن لك أمان تام في كل خطوة من خطوات التسوق.' },
      en: { title: 'Cash on Delivery (COD)', body: 'No online payment required. Pay in cash when your order arrives. We guarantee complete safety at every step of your shopping experience.' }
    },
    {
      icon: <CheckCircle2 size={24} className="text-rose-400" />,
      ar: { title: 'منتجات أصلية 100% آمنة طبياً', body: 'جميع منتجاتنا مصنوعة من مواد طبية معتمدة وآمنة على البشرة. نضمن الجودة والأصالة لكل منتج في متجرنا.' },
      en: { title: '100% Original Body-Safe Products', body: 'All our products are made from certified medical-grade, body-safe materials. We guarantee quality and authenticity for every product in our store.' }
    },
    {
      icon: <Star size={24} className="text-yellow-400" />,
      ar: { title: 'تشكيلة واسعة من المنتجات الفاخرة', body: 'أكبر تشكيلة من الألعاب الزوجية، الهزازات، اللانجري، منتجات BDSM، وأكثر في لبنان. شيء لكل الأذواق.' },
      en: { title: 'Widest Selection of Premium Products', body: 'Lebanon\'s largest selection of sex toys, vibrators, lingerie, BDSM, and more. Something for every taste and preference.' }
    },
    {
      icon: <Heart size={24} className="text-pink-400" />,
      ar: { title: 'دعم فني متخصص وبخصوصية تامة', body: 'فريق دعمنا متواجد على واتساب للإجابة على أي استفسار بكل سرية. نحن نفهم احتياجاتك ونوفر لك المساعدة الصحيحة.' },
      en: { title: 'Expert Support with Full Privacy', body: 'Our support team is on WhatsApp to answer any question with complete confidentiality. We understand your needs and provide the right assistance.' }
    },
  ];

  const categories = [
    { ar: 'ألعاب زوجية', en: 'Sex Toys in Lebanon', id: 'Sex Toys' },
    { ar: 'هزازات', en: 'Vibrators in Beirut', id: 'Vibrators' },
    { ar: 'لانجري', en: 'Lingerie Lebanon', id: 'Lingerie' },
    { ar: 'ديلدو', en: 'Dildos in Lebanon', id: 'Dildos' },
    { ar: 'ألعاب القوة BDSM', en: 'BDSM Lebanon', id: 'BDSM' },
    { ar: 'ألعاب رجالية', en: 'Male Toys Lebanon', id: 'Male Toys' },
    { ar: 'مضخات القضيب', en: 'Penis Pumps Lebanon', id: 'Penis Pumps' },
    { ar: 'مواد التشحيم', en: 'Lubricants Lebanon', id: 'Lubricants' },
  ];

  return (
    <article className="min-h-screen bg-[#070707] text-white" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#070707] px-5 py-20 text-center sm:py-28">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            {isArabic ? 'عن متجر فيكسا' : 'About Vexa Store Lebanon'}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
            {isArabic
              ? 'متجر فيكسا — الوجهة الأولى للمنتجات الزوجية الفاخرة في لبنان'
              : 'Vexa Store — Lebanon\'s #1 Destination for Discreet Adult Products'}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/55 sm:text-base">
            {isArabic
              ? 'متجر فيكسا هو المتجر الرائد والأكثر أماناً لشراء الألعاب الزوجية، الهزازات، اللانجري الفاخر، ومنتجات BDSM في لبنان. نوفر تجربة تسوق سرية 100% مع توصيل في نفس اليوم في بيروت وخلال 72 ساعة لكل المناطق اللبنانية.'
              : 'Vexa Store is Lebanon\'s leading and most trusted destination for buying sex toys, vibrators, premium lingerie, and BDSM products. As a fully online sex shop in Lebanon and a discreet online adult store, we serve customers in Beirut and every Lebanese region — a 100% private shopping experience with same-day delivery in Beirut and within 72 hours nationwide, so you never need to visit a physical sex shop in Beirut to get what you want.'}
          </p>
          <button
            onClick={() => setView('shop')}
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-white/90 active:scale-[0.98]"
          >
            <Zap size={14} />
            {isArabic ? 'تسوق الآن' : 'Shop Now'}
          </button>
        </div>
      </header>

      {/* ── Why Vexa ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-white/35">
            {isArabic ? 'لماذا تختار متجر فيكسا؟' : 'Why Choose Vexa Store Lebanon?'}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? '٦ أسباب تجعلنا الخيار الأول للتسوق السري في لبنان'
              : '6 Reasons We\'re Lebanon\'s #1 Choice for Discreet Shopping'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-3 hover:border-white/15 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                {isArabic ? f.ar.title : f.en.title}
              </h3>
              <p className="text-xs leading-6 text-white/50">
                {isArabic ? f.ar.body : f.en.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="border-y border-white/8 bg-[#0d0d0d] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-white/35">
            {isArabic ? 'قصتنا' : 'Our Story'}
          </p>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? 'كيف بدأ متجر فيكسا في لبنان؟'
              : 'How Vexa Store Started in Lebanon'}
          </h2>
          <div className="space-y-4 text-sm leading-8 text-white/55">
            {isArabic ? (
              <>
                <p>
                  أُسِّس متجر فيكسا بهدف واحد واضح: توفير تجربة تسوق آمنة وسرية تماماً للأزواج والبالغين في لبنان. في سوق كان يفتقر إلى الخصوصية والجودة، جئنا لنملأ هذه الفجوة.
                </p>
                <p>
                  نحن نؤمن أن كل شخص يستحق الوصول إلى منتجات زوجية فاخرة وآمنة طبياً دون الخوف من الحكم أو الإحراج. لذلك نضمن أن كل طلب يصل في كرتون مغلق عادي، ودفع عند الاستلام، وخدمة دعم سرية.
                </p>
                <p>
                  من بيروت إلى طرابلس، من صيدا إلى زحلة — نوصل لكل لبنان. مجموعتنا تشمل أكثر من 200 منتج من أفضل الماركات العالمية، بما في ذلك الهزازات، الديلدو، اللانجري، منتجات BDSM، الألعاب الرجالية، وأكثر.
                </p>
              </>
            ) : (
              <>
                <p>
                  Vexa Store was founded with one clear mission: to provide a completely safe and discreet shopping experience for couples and adults in Lebanon. In a market that lacked privacy and quality, we came to fill that gap.
                </p>
                <p>
                  We believe everyone deserves access to premium, body-safe adult products without fear of judgment or embarrassment. That's why we guarantee every order arrives in a plain sealed box, with cash on delivery, and a confidential support service.
                </p>
                <p>
                  From Beirut to Tripoli, from Sidon to Zahle — we deliver across all of Lebanon. Our collection includes 200+ products from top international brands: vibrators, dildos, lingerie, BDSM gear, male toys, and much more.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Browse Categories ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-white/35">
            {isArabic ? 'تصفح المنتجات' : 'Browse Our Categories'}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? 'أكبر تشكيلة من منتجات البالغين في لبنان'
              : 'Lebanon\'s Largest Adult Products Collection'}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setView('shop'); }}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-5 text-center transition hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.97]"
            >
              <span className="text-xs font-black uppercase tracking-[0.15em] text-white">
                {isArabic ? cat.ar : cat.en}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => setView('shop')}
            className="border border-white/20 px-10 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/80 transition hover:bg-white hover:text-black active:scale-[0.98]"
          >
            {isArabic ? 'عرض جميع المنتجات' : 'View All Products'}
          </button>
        </div>
      </section>

      {/* ── Delivery Info ── */}
      <section className="bg-[#ff8f96] px-5 py-12 text-center text-black sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black tracking-wide sm:text-3xl">
            {isArabic
              ? 'توصيل سري لكل لبنان — ادفع عند الاستلام'
              : 'Discreet Delivery Across Lebanon — Pay on Delivery'}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7">
            {isArabic
              ? 'بيروت: توصيل في نفس اليوم. كل لبنان: خلال 24 إلى 72 ساعة. كل الطلبات تصل بتغليف سري محكم.'
              : 'Beirut: Same-day delivery. All Lebanon: within 24 to 72 hours. Every order arrives in fully discreet packaging.'}
          </p>
          <button
            onClick={() => setView('shop')}
            className="mt-7 inline-flex items-center gap-2 bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
          >
            <ShieldCheck size={14} />
            {isArabic ? 'اطلب الآن بأمان' : 'Shop Now Safely'}
          </button>
        </div>
      </section>

    </article>
  );
};