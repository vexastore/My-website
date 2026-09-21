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
      en: { title: '100% Discreet Packaging', body: 'Every order ships in a plain sealed box with zero indication of its contents or our store name. Your privacy is our top priority at Vexa Toys Lebanon.' }
    },
    {
      icon: <Truck size={24} className="text-emerald-400" />,
      ar: { title: 'توصيل سري في نفس اليوم, بيروت', body: 'نوصل طلبك في نفس اليوم داخل بيروت وضواحيها. خارج بيروت؟ نوصل لكل لبنان خلال 24 إلى 72 ساعة بسرية تامة.' },
      en: { title: 'Same-Day Discreet Delivery, Beirut', body: 'We deliver your order the same day within Beirut and its suburbs. Outside Beirut? We ship all across Lebanon within 24 to 72 hours, fully discreet.' }
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

  return (
    <article className="min-h-screen bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-black border-b border-white/10 px-5 py-24 text-center sm:py-36">
        {/* Full-bleed Beirut city-lights background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <img
            src="/images/mockup/about-hero-bg.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Dark overlay so text stays fully legible */}
          <div className="absolute inset-0 bg-black/65" />
          {/* Pink glow from top */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, #ff2d78 0%, transparent 55%)' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#ff2d78]">
            {isArabic ? 'عن متجر فيكسا' : 'About Vexa Toys Lebanon'}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
            {isArabic
              ? 'متجر فيكسا, الوجهة الأولى للمنتجات الزوجية الفاخرة في لبنان'
              : 'Vexa Toys, Lebanon\'s #1 Destination for Discreet Adult Products'}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
            {isArabic
              ? 'متجر فيكسا هو المتجر الرائد والأكثر أماناً لشراء الألعاب الزوجية، الهزازات، اللانجري الفاخر، ومنتجات BDSM في لبنان. نوفر تجربة تسوق سرية 100% مع توصيل في نفس اليوم في بيروت وخلال 72 ساعة لكل المناطق اللبنانية.'
              : 'Vexa Toys is Lebanon\'s leading and most trusted destination for buying sex toys, vibrators, premium lingerie, and BDSM products. As a fully online sex shop in Lebanon and a discreet online adult store, we serve customers in Beirut and every Lebanese region, a 100% private shopping experience with same-day delivery in Beirut and within 72 hours nationwide, so you never need to visit a physical sex shop in Beirut to get what you want.'}
          </p>
          <button
            onClick={() => setView('shop')}
            className="mt-8 inline-flex items-center gap-2 bg-[#ff2d78] hover:bg-white text-black font-black rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.2em] transition active:scale-[0.98] shadow-lg shadow-[#ff2d78]/25"
          >
            <Zap size={14} />
            {isArabic ? 'تسوق الآن' : 'Shop Now'}
          </button>
        </div>
      </header>


      {/* ── Why Vexa ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-[#ff2d78]">
            {isArabic ? 'لماذا تختار متجر فيكسا؟' : 'Why Choose Vexa Toys Lebanon?'}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? '٦ أسباب تجعلنا الخيار الأول للتسوق السري في لبنان'
              : '6 Reasons We\'re Lebanon\'s #1 Choice for Discreet Shopping'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3 hover:border-[#ff2d78]/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                {isArabic ? f.ar.title : f.en.title}
              </h3>
              <p className="text-xs leading-6 text-stone-400">
                {isArabic ? f.ar.body : f.en.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-[#0a0a0a] border-y border-white/10 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-[#ff2d78]">
            {isArabic ? 'قصتنا' : 'Our Story'}
          </p>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? 'كيف بدأ متجر فيكسا في لبنان؟'
              : 'How Vexa Toys Started in Lebanon'}
          </h2>
          <div className="space-y-4 text-sm leading-8 text-stone-400">
            {isArabic ? (
              <>
                <p>
                  أُسِّس متجر فيكسا بهدف واحد واضح: توفير تجربة تسوق آمنة وسرية تماماً للأزواج والبالغين في لبنان. في سوق كان يفتقر إلى الخصوصية والجودة، جئنا لنملأ هذه الفجوة.
                </p>
                <p>
                  نحن نؤمن أن كل شخص يستحق الوصول إلى منتجات زوجية فاخرة وآمنة طبياً دون الخوف من الحكم أو الإحراج. لذلك نضمن أن كل طلب يصل في كرتون مغلق عادي، ودفع عند الاستلام، وخدمة دعم سرية.
                </p>
                <p>
                  من بيروت إلى طرابلس، من صيدا إلى زحلة, نوصل لكل لبنان. مجموعتنا تشمل أكثر من 200 منتج من أفضل الماركات العالمية، بما في ذلك الهزازات، الديلدو، اللانجري، منتجات BDSM، الألعاب الرجالية، وأكثر.
                </p>
              </>
            ) : (
              <>
                <p>
                  Vexa Toys was founded with one clear mission: to provide a completely safe and discreet shopping experience for couples and adults in Lebanon. In a market that lacked privacy and quality, we came to fill that gap.
                </p>
                <p>
                  We believe everyone deserves access to premium, body-safe adult products without fear of judgment or embarrassment. That's why we guarantee every order arrives in a plain sealed box, with cash on delivery, and a confidential support service.
                </p>
                <p>
                  From Beirut to Tripoli, from Sidon to Zahle, we deliver across all of Lebanon. Our collection includes 200+ products from top international brands: vibrators, dildos, lingerie, BDSM gear, male toys, and much more.
                </p>
              </>
            )}
          </div>
        </div>
      </section>



      {/* ── Delivery Info ── */}
      <section className="bg-[#ff2d78]/10 border-y border-[#ff2d78]/30 px-5 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black tracking-wide text-white sm:text-3xl">
            {isArabic
              ? 'توصيل سري لكل لبنان, ادفع عند الاستلام'
              : 'Discreet Delivery Across Lebanon, Pay on Delivery'}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-300">
            {isArabic
              ? 'بيروت: توصيل في نفس اليوم. كل لبنان: خلال 24 إلى 72 ساعة. كل الطلبات تصل بتغليف سري محكم.'
              : 'Beirut: Same-day delivery. All Lebanon: within 24 to 72 hours. Every order arrives in fully discreet packaging.'}
          </p>
          <button
            onClick={() => setView('shop')}
            className="mt-7 inline-flex items-center gap-2 bg-[#ff2d78] hover:bg-white text-black rounded-full font-black px-8 py-3.5 text-xs uppercase tracking-[0.2em] transition active:scale-[0.98] shadow-lg shadow-[#ff2d78]/25"
          >
            <ShieldCheck size={14} />
            {isArabic ? 'اطلب الآن بأمان' : 'Shop Now Safely'}
          </button>
        </div>
      </section>

    </article>
  );
};