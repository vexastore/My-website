import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_ARTICLES } from '../data/mockData';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { AdviceArticle } from '../types';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const AdviceHub: React.FC = () => {
  const { selectedArticle, setSelectedArticle } = useShop();
  const [articles, setArticles] = useState<AdviceArticle[]>(MOCK_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const snap = await getDocs(collection(db, 'blogPosts'));
        if (!snap.empty) {
          const fetched: AdviceArticle[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdviceArticle));
          fetched.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setArticles(fetched);
        }
        // If empty, keep MOCK_ARTICLES as fallback
      } catch {
        // On error, keep MOCK_ARTICLES
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // If an article is selected, show its full content
  if (selectedArticle) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 mb-6 transition"
        >
          <ArrowRight size={16} className="rotate-180" /> العودة للمقالات
        </button>

        {selectedArticle.image && (
          <div className="aspect-video overflow-hidden rounded-2xl mb-6">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 text-xs font-bold text-stone-400 mb-3">
          <span className="flex items-center gap-1"><Calendar size={12} /> {selectedArticle.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {selectedArticle.readTime}</span>
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{selectedArticle.category}</span>
        </div>

        <h1 className="text-2xl font-black text-stone-900 mb-6 leading-snug">
          {selectedArticle.title}
        </h1>

        <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap text-sm">
          {selectedArticle.content}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-purple-500" />
          <h2 className="text-lg font-black text-stone-900">مركز النصائح والإرشادات</h2>
        </div>
        <p className="text-xs text-stone-400 font-medium">
          مقالات متخصصة لتعزيز العلاقة الزوجية بشكل صحي وآمن
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          المحتوى هنا موجه للبالغين المتزوجين فقط وبهدف تثقيفي صحي. جميع النصائح لأغراض تعليمية.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-stone-400">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm font-medium">جاري تحميل المقالات...</span>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white border border-stone-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col"
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
      )}
    </div>
  );
};
