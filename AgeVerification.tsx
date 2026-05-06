import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldAlert } from 'lucide-react';

export const AgeVerification: React.FC = () => {
  const { is18PlusVerified, verifyAge, language, toggleLanguage } = useShop();
  const isArabic = language === 'ar';

  if (is18PlusVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 px-4 text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full border border-stone-800 bg-stone-900/90 backdrop-blur-md p-8 rounded-2xl text-center shadow-2xl">
        <button
          onClick={toggleLanguage}
          className="mb-4 rounded-full border border-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white/70 hover:bg-white hover:text-black"
        >
          {isArabic ? 'EN' : 'AR'}
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-950 text-rose-500 border border-rose-800">
          <ShieldAlert size={36} />
        </div>
        
        <h1 className="text-2xl font-bold mb-3 tracking-wide">{isArabic ? 'محتوى مخصص للبالغين فقط' : 'Adults Only Content'}</h1>
        <p className="text-stone-400 text-sm mb-6 leading-relaxed">
          {isArabic
            ? 'هذا الموقع يحتوي على منتجات ومعلومات مخصصة للبالغين (+18) فقط. يرجى تأكيد عمرك للمتابعة. يضمن متجرنا سرية تامة وتغليفاً سرياً لجميع الشحنات.'
            : 'This website contains products and information intended for adults (+18) only. Please confirm your age to continue. We guarantee full privacy and discreet packaging for all orders.'}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={verifyAge}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-plum-700 hover:from-rose-500 hover:to-plum-600 text-white font-bold rounded-lg transition shadow-lg hover:shadow-rose-500/20 active:scale-[0.98]"
          >
            {isArabic ? 'نعم، أنا فوق 18 عاماً - دخول' : 'Yes, I am 18+ - Enter'}
          </button>
          
          <a
            href="https://www.google.com"
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-lg transition border border-stone-700"
          >
            {isArabic ? 'خروج (أقل من 18 عاماً)' : 'Exit (Under 18)'}
          </a>
        </div>
        
        <p className="text-[10px] text-stone-600 mt-6 leading-none">
          {isArabic ? 'بدخولك للموقع أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بالمتجر.' : 'By entering this website, you agree to our terms of use and privacy policy.'}
        </p>
      </div>
    </div>
  );
};
