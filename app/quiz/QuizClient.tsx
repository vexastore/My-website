'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { StoreLocale } from '@/lib/storeLocaleShared';
import { CATEGORY_META as CATEGORIES } from '@/lib/categoryMeta';

const STEPS = [
  {
    id: 'for',
    question: 'Who is this for?',
    options: [
      { emoji: '👩', label: 'For me (female)', value: 'female' },
      { emoji: '👨', label: 'For me (male)', value: 'male' },
      { emoji: '💑', label: 'For us as a couple', value: 'couple' },
      { emoji: '🎁', label: 'As a gift', value: 'gift' },
    ],
  },
  {
    id: 'level',
    question: 'What is your experience level?',
    options: [
      { emoji: '🌱', label: 'First time, never tried', value: 'beginner' },
      { emoji: '⚡', label: 'Some experience', value: 'intermediate' },
      { emoji: '🔥', label: 'Very experienced', value: 'advanced' },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    options: [
      { emoji: '💥', label: 'Maximum pleasure & intensity', value: 'pleasure' },
      { emoji: '🎯', label: 'Easy to use, nothing complicated', value: 'simple' },
      { emoji: '🌶️', label: 'Something kinky and new', value: 'kinky' },
      { emoji: '📦', label: 'Ultra discreet, nothing obvious', value: 'discreet' },
    ],
  },
];

type Answers = Record<string, string>;

const CATEGORY_META: Record<string, { label: string; emoji: string; desc: string }> = {
  vibrators: { label: 'Vibrators', emoji: '💜', desc: 'Bullet, wand, rabbit & G-spot styles, the most popular first choice' },
  dildos: { label: 'Dildos', emoji: '💎', desc: 'Body-safe silicone & realistic options in every size' },
  'male-toys': { label: 'Male Toys', emoji: '⚡', desc: 'Masturbators, cock rings, pumps, the full male pleasure range' },
  masturbators: { label: 'Masturbators', emoji: '🎯', desc: 'Realistic texture, hands-free options, automatic models' },
  'cock-rings': { label: 'Cock Rings', emoji: '💍', desc: 'Silicone, metal & vibrating, stronger erections, more pleasure for both' },
  lubricants: { label: 'Lubricants', emoji: '💧', desc: 'Water-based & silicone, essential for comfort and sensation' },
  'sex-toys': { label: 'Sex Toys', emoji: '🛍️', desc: '500+ products, browse everything in one place' },
  lingerie: { label: 'Lingerie', emoji: '👙', desc: 'Lace, satin & mesh, beautiful intimate sets for all sizes' },
  bdsm: { label: 'BDSM', emoji: '🔒', desc: 'Restraints, blindfolds, paddles, beginner kits included' },
  bondage: { label: 'Bondage', emoji: '🪢', desc: 'Cuffs, rope, under-bed systems, for couples who love control' },
  'sex-machines': { label: 'Sex Machines', emoji: '🤖', desc: 'Powerful thrusting & riding machines, hands-free, tireless' },
  'strap-ons': { label: 'Strap-ons', emoji: '🔗', desc: 'Harnesses & dildos, popular for all genders and orientations' },
  'kegel-balls': { label: 'Kegel Balls', emoji: '🔮', desc: 'Strengthen pelvic muscles and intensify orgasms over time' },
  'butt-plugs': { label: 'Butt Plugs', emoji: '✨', desc: 'Silicone, metal & vibrating, beginner to advanced sizes' },
  'holiday-collection': { label: 'Gift Sets', emoji: '🎁', desc: 'Curated couples & romantic gift sets for any occasion' },
  'anal-toys': { label: 'Anal Toys', emoji: '🌟', desc: 'Beads, prostate massagers & anal vibrators for all levels' },
  chastity: { label: 'Chastity', emoji: '🗝️', desc: 'Plastic, silicone & metal cages for couples D/s dynamics' },
  'penis-pumps': { label: 'Penis Pumps', emoji: '💪', desc: 'Manual & electric vacuum devices for enhanced performance' },
  'sexual-enhancers': { label: 'Sexual Enhancers', emoji: '🔥', desc: 'Delay sprays, arousal gels & libido boosters' },
};

const SCORE_MAP: Record<string, Record<string, number>> = {
  female:       { vibrators: 5, dildos: 4, 'kegel-balls': 3, lingerie: 3, 'sex-toys': 2, lubricants: 2 },
  male:         { masturbators: 5, 'male-toys': 4, 'cock-rings': 3, 'penis-pumps': 3, lubricants: 2 },
  couple:       { 'sex-toys': 4, lingerie: 3, 'strap-ons': 3, bdsm: 2, lubricants: 2 },
  gift:         { 'holiday-collection': 5, lingerie: 3, 'sex-toys': 3 },
  beginner:     { lubricants: 3, 'sex-toys': 2, vibrators: 2 },
  intermediate: { 'sex-toys': 1, bdsm: 1, dildos: 1 },
  advanced:     { 'sex-machines': 4, bdsm: 3, bondage: 3, chastity: 2 },
  pleasure:     { vibrators: 3, 'sex-machines': 2, masturbators: 2, 'sexual-enhancers': 2 },
  simple:       { vibrators: 2, lubricants: 2, 'sex-toys': 2, 'cock-rings': 1 },
  kinky:        { bdsm: 4, bondage: 4, chastity: 2, 'strap-ons': 2, 'anal-toys': 2 },
  discreet:     { 'sex-toys': 2, lubricants: 2, 'kegel-balls': 2, 'cock-rings': 1 },
};

function getResults(answers: Answers): string[] {
  const scores: Record<string, number> = {};
  for (const val of Object.values(answers)) {
    const map = SCORE_MAP[val] || {};
    for (const [cat, pts] of Object.entries(map)) {
      scores[cat] = (scores[cat] || 0) + pts;
    }
  }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}

const AR_QUESTIONS = ['لمن تبحث عن المنتج؟', 'ما مستوى خبرتك؟', 'ما الأهم بالنسبة لك؟'];
const AR_OPTIONS: Record<string, string> = {
  female: 'لي (امرأة)', male: 'لي (رجل)', couple: 'لنا كزوجين', gift: 'هدية',
  beginner: 'هذه أول تجربة', intermediate: 'لدي بعض الخبرة', advanced: 'لدي خبرة كبيرة',
  pleasure: 'متعة وإحساس أقوى', simple: 'سهل الاستخدام', kinky: 'شيء جديد ومختلف', discreet: 'خصوصية تامة',
};

export function QuizClient({ locale = 'en' }: { locale?: StoreLocale }) {
  const ar = locale === 'ar';
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;
  const results = done ? getResults(answers) : [];

  function choose(value: string) {
    setSelected(value);
    setTimeout(() => {
      const next = { ...answers, [current.id]: value };
      setAnswers(next);
      setSelected(null);
      if (step + 1 < STEPS.length) {
        setStep(step + 1);
      } else {
        setDone(true);
      }
    }, 280);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setDone(false);
    setSelected(null);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16" dir={ar ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff2d78] mb-3 text-center">{ar ? 'نتيجتك' : 'Your Results'}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">{ar ? 'خيارات تناسبك' : 'Perfect picks for you'}</h2>
          <p className="text-stone-400 text-sm text-center mb-10">{ar ? 'بناءً على إجاباتك، ننصحك بالبدء هنا:' : 'Based on your answers, we recommend starting here:'}</p>

          <div className="space-y-4 mb-10">
            {results.map((slug, i) => {
              const meta = CATEGORY_META[slug];
              if (!meta) return null;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-[#ff2d78]/50 hover:bg-white/10 transition"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#ff2d78]/10 border border-[#ff2d78]/20 flex items-center justify-center text-2xl">
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {i === 0 && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff2d78] bg-[#ff2d78]/10 px-2 py-0.5 rounded-full">{ar ? 'الخيار الأفضل' : 'Top Pick'}</span>
                      )}
                      <p className="font-black text-white group-hover:text-[#ff2d78] transition">{ar ? CATEGORIES.find(c => c.slug === slug)?.titleAr.split('|')[0].trim() || meta.label : meta.label}</p>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">{ar ? 'تصفح هذه الفئة واختر المنتج المناسب لك بخصوصية تامة.' : meta.desc}</p>
                  </div>
                  <span className="text-stone-600 group-hover:text-[#ff2d78] transition font-bold shrink-0">→</span>
                </Link>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
            <p className="text-xs text-stone-400 text-center mb-1">{ar ? 'تحتاج إلى مساعدة في الاختيار؟' : 'Need help deciding?'}</p>
            <p className="text-sm font-bold text-white text-center">{ar ? 'تواصل معنا عبر واتساب للمساعدة.' : 'Chat with us on WhatsApp, we reply instantly'}</p>
            <a
              href="https://wa.me/96176730767"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] py-3 text-sm font-black text-white transition active:scale-95"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993z"/></svg>
              {ar ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            </a>
          </div>

          <button
            onClick={restart}
            className="w-full text-center text-xs text-stone-500 hover:text-white transition font-bold py-2"
          >
            {ar ? '↺ ابدأ من جديد' : '↺ Start over'}
          </button>

          <Link href="/" className="mt-4 block text-center text-xs text-stone-600 hover:text-white transition font-bold">
            {ar ? 'العودة للمتجر' : '← Back to store'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16" dir={ar ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff2d78] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-stone-500 shrink-0">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Question */}
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff2d78] mb-3">
          {ar ? 'السؤال' : 'Question'} {step + 1}
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 leading-tight">
          {ar ? AR_QUESTIONS[step] : current.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => choose(opt.value)}
              className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-start transition
                ${selected === opt.value
                  ? 'border-[#ff2d78] bg-[#ff2d78]/15 scale-[0.98]'
                  : 'border-white/10 bg-white/5 hover:border-[#ff2d78]/40 hover:bg-white/10'
                }`}
            >
              <span className="text-2xl shrink-0">{opt.emoji}</span>
              <span className="font-bold text-white text-sm sm:text-base">{ar ? AR_OPTIONS[opt.value] : opt.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-xs text-stone-600 hover:text-stone-400 transition font-bold"
          >
            {ar ? 'عودة →' : '← Back'}
          </button>
        )}

        <Link href="/" className="mt-4 block text-center text-xs text-stone-600 hover:text-white transition font-bold">
          {ar ? 'العودة للمتجر' : '← Back to store'}
        </Link>
      </div>
    </div>
  );
}
