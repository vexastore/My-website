import React, { lazy, Suspense } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { ShieldCheck, Lock, Heart, Mail } from 'lucide-react';

const Checkout = lazy(() => import('./components/Checkout').then(m => ({ default: m.Checkout })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const MyOrders = lazy(() => import('./components/MyOrders').then(m => ({ default: m.MyOrders })));
const FloatingWhatsApp = lazy(() => import('./components/FloatingWhatsApp').then(m => ({ default: m.FloatingWhatsApp })));

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
  </div>
);

const AppContent: React.FC = () => {
  const { currentView, language } = useShop();
  const isArabic = language === 'ar';

  const renderView = () => {
    switch (currentView) {
      case 'shop':     return <ProductList />;
      case 'checkout': return <Suspense fallback={<PageLoader />}><Checkout /></Suspense>;
      case 'admin':    return <Suspense fallback={<PageLoader />}><AdminPanel /></Suspense>;
      case 'orders':   return <Suspense fallback={<PageLoader />}><MyOrders /></Suspense>;
      default:         return <ProductList />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050101] text-stone-900 flex flex-col font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      <Navbar />
      <Suspense fallback={null}><FloatingWhatsApp /></Suspense>
      <main className="vexa-page-shell flex-grow">{renderView()}</main>

      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-300 bg-clip-text text-transparent">
              VEXA STORE
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-medium">
              {isArabic
                ? 'متجر فيكسا (Vexa Store) هو المتجر الرائد والأكثر أماناً للمنتجات الزوجية، اللانجري، ومستلزمات السعادة الرومانسية الفاخرة. نحن نصنع تجربة تسوق فريدة ومثيرة في بيئة آمنة تضمن الخصوصية المطلقة.'
                : 'Vexa Store is a discreet premium destination for couples products, lingerie, and romantic essentials. We create a private, secure, and elevated shopping experience with absolute confidentiality.'}
            </p>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs bg-stone-800/50 p-2.5 rounded-lg border border-stone-800 shadow-inner text-glow">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span>{isArabic ? 'خصوصية كاملة وتغليف سري محكم 100%' : 'Full privacy and 100% discreet packaging'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Heart size={14} className="text-rose-500" /> {isArabic ? 'معلومات تهمك' : 'Important Info'}
            </h4>
            <ul className="text-xs text-stone-400 space-y-2 font-medium">
              <li className="flex items-center gap-1 hover:text-stone-200 cursor-pointer">
                {isArabic ? '• التوصيل للمنزل خلال 24 - 48 ساعة كحد أقصى.' : '• Home delivery within 24 - 48 hours maximum.'}
              </li>
              <li className="flex items-center gap-1 hover:text-stone-200 cursor-pointer">
                {isArabic ? '• الدفع نقداً أو بالشبكة عند استلام طلبك (COD).' : '• Cash or card payment on delivery (COD).'}
              </li>
              <li className="flex items-center gap-1 hover:text-stone-200 cursor-pointer">
                {isArabic ? '• كرتون سري مغلق بالكامل لا يحتوي على اسم المحتوى أو المتجر.' : '• Plain sealed box with no product or store name.'}
              </li>
              <li className="flex items-center gap-1 hover:text-stone-200 cursor-pointer">
                {isArabic ? '• منتجات أصلية 100% ومصنوعة من مواد طبية آمنة على البشرة.' : '• Original products made from body-safe materials.'}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {(() => {
              const title = isArabic ? 'خدمة الدعم الفني 📞' : 'Customer Support 📞';
              const workingHoursTitle = isArabic ? 'ساعات العمل:' : 'Working Hours:';
              const workingHoursText = isArabic ? 'الإثنين إلى السبت، ٨:٠٠ صباحاً - ٦:٠٠ مساءً' : 'Monday - Saturday, 8:00 AM - 6:00 PM';
              const whatsappBtnText = isArabic ? 'الدعم الفني عبر واتساب' : 'WhatsApp Live Chat';
              const description = isArabic
                ? 'فريق الدعم الفني في متجر فيكسا متواجد لمساعدتكم والإجابة على أي استفسارات تتعلق بالمنتجات، الطلبات، أو الشحن بسرية تامة.'
                : 'Vexa Store support team is available to assist you and answer any inquiries regarding products, orders, or shipping with absolute privacy.';
              const waText = isArabic
                ? encodeURIComponent('مرحباً متجر فيكسا، أرغب في الاستفسار عن المنتجات أو المساعدة في طلبي بكل خصوصية.')
                : encodeURIComponent('Hello Vexa Store, I would like to inquire about products or need assistance with an order with full privacy.');

              return (
                <>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-stone-800 pb-2">
                    <Mail size={14} className="text-purple-400" /> {title}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-medium">{description}</p>
                  <div className="bg-stone-800/40 border border-stone-800 p-3 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 block">{workingHoursTitle}</span>
                    <span className="text-xs font-bold text-stone-200 block" dir={isArabic ? 'rtl' : 'ltr'}>{workingHoursText}</span>
                  </div>
                  <a
                    href={`https://wa.me/96176730767?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-md hover:shadow-emerald-500/10 border border-emerald-500/20"
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.845-1.587-5.921.003-6.556 5.338-11.891 11.893-11.891 3.176.001 6.165 1.236 8.413 3.484 2.248 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.916 3.21 1.399 4.909 1.4 5.424 0 9.835-4.411 9.838-9.835.002-2.628-1.021-5.1-2.88-6.958-1.859-1.859-4.331-2.88-6.955-2.881-5.423 0-9.835 4.412-9.838 9.836-.001 1.79.491 3.535 1.425 5.047l-1.012 3.7 3.784-.993zm11.458-7.228c-.312-.156-1.847-.91-2.132-1.014-.285-.104-.492-.156-.7.156-.207.312-.802 1.014-.983 1.221-.181.208-.363.234-.675.078-.312-.156-1.317-.485-2.51-1.549-.928-.827-1.554-1.849-1.736-2.161-.182-.312-.02-.481.136-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.207.052-.39-.026-.546-.078-.156-.7-1.688-.959-2.311-.253-.61-.51-.527-.7-.537-.182-.01-.39-.01-.597-.01-.208 0-.545.078-.83.39-.285.312-1.089 1.065-1.089 2.597 0 1.533 1.115 3.013 1.271 3.221.156.208 2.193 3.349 5.313 4.699.742.32 1.32.512 1.77.654.745.237 1.423.204 1.959.124.597-.089 1.847-.754 2.108-1.442.261-.689.261-1.274.182-1.39-.078-.118-.285-.182-.597-.338z" />
                    </svg>
                    {whatsappBtnText}
                  </a>
                  <div className="flex flex-col gap-1 pt-1 text-xs">
                    <a href="mailto:Vexastore72@gmail.com" className="hover:text-indigo-400 font-bold flex items-center gap-1 underline" dir="ltr">
                      Vexastore72@gmail.com
                    </a>
                    <span className="text-[10px] text-stone-500 block">
                      {isArabic
                        ? 'تنبيه: هذا الموقع للأزواج والبالغين فقط. استخدامك للموقع يمثل موافقتك على شروط الخصوصية التامة.'
                        : 'Notice: This website is strictly for couples and adults (+18) only. Your use implies full agreement to our privacy terms.'}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-stone-800 mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-medium">
          <p>© {new Date().getFullYear()} Vexa Store. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-stone-400 cursor-pointer">
              <Lock size={12} /> {isArabic ? 'سياسة الخصوصية السرية' : 'Privacy Policy'}
            </span>
            <span>{isArabic ? 'شروط الاستخدام' : 'Terms'}</span>
            <span>{isArabic ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
