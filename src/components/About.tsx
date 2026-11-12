import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Lock, Star, Heart, Package, Zap, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { language, localizeHref } = useShop();
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
      ar: { title: 'تشكيلة واسعة من المنتجات الفاخرة', body: 'تشكيلة واسعة من الهزازات، الديلدو، اللانجري، منتجات BDSM وأكثر. شيء لكل الأذواق.' },
      en: { title: 'Wide Selection of Premium Products', body: 'A wide selection of vibrators, dildos, lingerie, BDSM gear and more. Something for every taste and preference.' }
    },
    {
      icon: <Heart size={24} className="text-pink-400" />,
      ar: { title: 'دعم فني متخصص وبخصوصية تامة', body: 'فريق دعمنا متواجد على واتساب للإجابة على أي استفسار بكل سرية. نحن نفهم احتياجاتك ونوفر لك المساعدة الصحيحة.' },
      en: { title: 'Expert Support with Full Privacy', body: 'Our support team is on WhatsApp to answer any question with complete confidentiality. We understand your needs and provide the right assistance.' }
    },
  ];

  return (
    <article className="min-h-screen bg-vexa-ink text-white" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-vexa-ink border-b border-white/10 px-5 py-24 text-center sm:py-36">
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
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-vexa-pink">
            {isArabic ? 'عن متجر فيكسا' : 'About Vexa Toys'}
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
            {isArabic
              ? 'قصة متجر فيكسا'
              : 'The Story Behind Vexa Toys'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
            {isArabic
              ? 'متجر فيكسا هو متجر لبناني إلكتروني للمنتجات الزوجية، قائم على وعد واحد: تجربة تسوق خاصة وبدون أحكام. تصل الطلبات في كرتون عادي مغلق، في نفس اليوم داخل بيروت وخلال 72 ساعة في كل لبنان، مع الدفع عند الاستلام.'
              : 'Vexa Toys is a Lebanese online store for adult products, built around one promise: a private, judgment-free shopping experience. Orders ship in plain sealed boxes, arrive the same day in Beirut and within 72 hours across Lebanon, and are paid for in cash on delivery.'}
          </p>
          <a
            href={localizeHref('/sex-toys')}
            className="mt-8 inline-flex items-center gap-2 bg-vexa-pink hover:bg-white text-black font-black rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.2em] transition active:scale-[0.98] shadow-lg shadow-vexa-pink/25"
          >
            <Zap size={14} />
            {isArabic ? 'تصفح الألعاب الزوجية' : 'Browse sex toys in Lebanon'}
          </a>
        </div>
      </header>


      {/* ── Why Vexa ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-vexa-pink">
            {isArabic ? 'لماذا متجر فيكسا؟' : 'Why Vexa Toys?'}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-3xl">
            {isArabic
              ? 'لماذا يختار العملاء متجر فيكسا'
              : 'Why Customers Choose Vexa Toys'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3 hover:border-vexa-pink/40 transition">
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
      <section className="bg-vexa-surface border-y border-white/10 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-vexa-pink">
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
      <section className="bg-vexa-pink/10 border-y border-vexa-pink/30 px-5 py-12 text-center sm:py-16">
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
          <a
            href={localizeHref('/adult-toys')}
            className="mt-7 inline-flex items-center gap-2 bg-vexa-pink hover:bg-white text-black rounded-full font-black px-8 py-3.5 text-xs uppercase tracking-[0.2em] transition active:scale-[0.98] shadow-lg shadow-vexa-pink/25"
          >
            <ShieldCheck size={14} />
            {isArabic ? 'تصفح كل المنتجات' : 'Browse all adult toys'}
          </a>
        </div>
      </section>

    </article>
  );
};
