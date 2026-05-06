import React from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_ARTICLES } from '../data/mockData';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const AdviceHub: React.FC = () => {
  const { selectedArticle, setSelectedArticle } = useShop();

  // If an article is selected, show its full content
  if (selectedArticle) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-white border border-stone-150 shadow-sm" dir="rtl">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition mb-4"
        >
          <ArrowRight size={14} className="ml-1" /> العودة لقائمة المقالات النصائح
        </button>

        {/* Article Image */}
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-stone-100 border border-stone-200 mb-6 shadow-sm">
          <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-stone-400 mb-4 border-b border-stone-100 pb-3">
          <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles size={12} /> {selectedArticle.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {selectedArticle.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> وقت القراءة: {selectedArticle.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-6 leading-tight">
          {selectedArticle.title}
        </h1>

        {/* Content */}
        <div className="text-stone-700 text-sm sm:text-base leading-8 whitespace-pre-wrap font-medium space-y-4">
          {selectedArticle.content.split('\n\n').map((paragraph, index) => {
            // Highlight list items or bold text if they start with bullet numbers
            if (paragraph.match(/^\d+\./) || paragraph.startsWith('**')) {
              return (
                <div key={index} className="bg-purple-50/40 p-4 border-r-4 border-purple-600 rounded-lg text-purple-950 font-bold my-4">
                  {paragraph}
                </div>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Advisory Footer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 h-6 w-6 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-800">ملاحظة طبية وتثقيفية</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed font-medium">
              جميع النصائح الواردة في هذا القسم مخصصة لأغراض تثقيفية وعامة فقط، وهي تهدف لتحسين التواصل وبناء علاقة زوجية صحية. لا تغني هذه المعلومات عن استشارة طبيب العائلة أو اختصاصي الصحة الجنسية والزوجية عند مواجهة أي مشاكل صحية.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the list of all articles
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir="rtl">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200 pb-4 flex items-center gap-2">
        <BookOpen className="text-purple-600 h-6 w-6 sm:h-7 sm:w-7" />
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-800">
            مركز النصائح والإرشادات الزوجية
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            دليلك الشامل والآمن لاستخدام المنتجات، المحافظة عليها، وكيفية تجديد الشغف وتطوير العلاقة الحميمة بوعي وخصوصية.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ARTICLES.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
          >
            {/* Image */}
            <div className="aspect-video overflow-hidden bg-stone-100 relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-2 right-2 px-2.5 py-1 text-[10px] font-bold bg-purple-700 text-white rounded-md">
                {article.category}
              </span>
            </div>

            {/* Content Preview */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-800 text-sm sm:text-base line-clamp-2 group-hover:text-purple-700 transition leading-snug mb-2">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed mb-4 font-medium">
                  {article.content.substring(0, 160)}...
                </p>
              </div>

              {/* Action Link */}
              <div className="border-t border-stone-100 pt-3 mt-auto flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-800 transition">
                <span>اقرأ المقال بالكامل</span>
                <ArrowRight size={14} className="group-hover:translate-x-[-4px] transition-transform duration-200" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
