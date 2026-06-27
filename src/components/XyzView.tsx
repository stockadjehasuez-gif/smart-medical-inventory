import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, HelpCircle, Activity, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { MedicalItem } from '../types';

interface XyzViewProps {
  items: MedicalItem[];
}

export default function XyzView({ items }: XyzViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'X' | 'Y' | 'Z' | null>(null);

  // حساب توزيع فئات XYZ
  const xyzCounts = { X: 0, Y: 0, Z: 0 };
  items.forEach(item => {
    const cat = item.xyzCategory || 'X';
    if (cat in xyzCounts) {
      xyzCounts[cat]++;
    }
  });

  const xyzData = [
    { 
      name: 'فئة X', 
      label: 'مستقرة الاستهلاك (Stable)', 
      count: xyzCounts.X, 
      desc: 'أصناف ذات معدلات طلب منتظمة جداً وتغيرات موسمية طفيفة (أقل من 10%). التنبؤ بالطلب عليها سهل ودقيق للغاية، ومستوى الأمان المطلوبة منخفض نسبياً.',
      color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
    },
    { 
      name: 'فئة Y', 
      label: 'متغيرة وموسمية (Seasonal/Variable)', 
      count: xyzCounts.Y, 
      desc: 'أصناف ذات تقلبات طلب معتدلة أو موسمية محددة (مثل محاليل معالجة الجفاف أو أدوية الإنفلونزا فصول الشتاء). دقة التنبؤ متوسطة وتحتاج إلى مراقبة دورية للتعديل.',
      color: 'border-blue-500 text-blue-500 bg-blue-500/5'
    },
    { 
      name: 'فئة Z', 
      label: 'غير مستقرة ونادرة (Irregular/Rare)', 
      count: xyzCounts.Z, 
      desc: 'أصناف ذات استهلاك عشوائي أو نادر جداً (مثل الترياقات النادرة، أو الأمصال الجراحية الحرجة). التنبؤ بها يكاد يكون مستحيلاً ويحتاج لتخصيص مخزون أمان كبير للسلامة الطبية.',
      color: 'border-amber-500 text-amber-500 bg-amber-500/5'
    }
  ];

  const selectedCategoryItems = selectedCategory
    ? items.filter(i => i.xyzCategory === selectedCategory)
    : items;

  return (
    <div className="space-y-6 text-right animate-fade-in font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-[#0055D4]" />
          <span>تحليل وتوزيع استقرار المخزون الطبي (XYZ Analysis)</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          تصنيف البنود الطبية حسب درجة استقرار معدلات الاستهلاك والتقلبات الزمنية لمستويات الطلب لتقدير الحجم الآمن لـ مخزون الأمان
        </p>
      </div>

      {/* بطاقات التعريف بفئات XYZ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {xyzData.map((data) => (
          <div 
            key={data.name}
            onClick={() => setSelectedCategory(data.name as 'X' | 'Y' | 'Z')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              selectedCategory === data.name
                ? 'border-[#0055D4] bg-blue-500/5 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${data.color}`}>
                {data.name}
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-slate-100 font-mono">
                {data.count} <span className="text-xs text-slate-400 font-normal">بنود</span>
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-800 dark:text-slate-50 mb-1">{data.label}</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">{data.desc}</p>
          </div>
        ))}
      </div>

      {/* جدول الأصناف التابعة للتصنيف المختار */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
          <h2 className="font-bold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0055D4]" />
            <span>
              {selectedCategory 
                ? `الأصناف المدرجة تحت تصنيف الاستقرار: فئة ${selectedCategory}` 
                : 'كل الأصناف مع تصنيف استقرار الاستهلاك (XYZ)'}
            </span>
          </h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-[#0055D4] hover:underline font-bold"
            >
              عرض كافة الأصناف
            </button>
          )}
        </div>

        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <th className="p-3 font-bold">كود الصنف</th>
                <th className="p-3 font-bold">اسم الصنف</th>
                <th className="p-3 font-bold">الفئة العلاجية</th>
                <th className="p-3 font-bold text-center">الكمية الحالية</th>
                <th className="p-3 font-bold text-center">الاستهلاك الشهري</th>
                <th className="p-3 font-bold text-center">حد الأمان ROP</th>
                <th className="p-3 font-bold text-center">تصنيف الاستقرار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
              {selectedCategoryItems.map((item) => {
                const cat = item.xyzCategory || 'X';
                let tagClass = 'bg-emerald-500/10 text-emerald-500';
                if (cat === 'Y') tagClass = 'bg-blue-500/10 text-blue-500';
                if (cat === 'Z') tagClass = 'bg-amber-500/10 text-amber-500';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-500">{item.id}</td>
                    <td className="p-3 font-black text-slate-850 dark:text-slate-50">{item.name}</td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3 text-center font-mono">{item.quantity.toLocaleString('ar-EG')}</td>
                    <td className="p-3 text-center font-mono">{item.monthlyConsumption.toLocaleString('ar-EG')} / شهر</td>
                    <td className="p-3 text-center font-mono text-slate-500">{(item.monthlyConsumption * 1.5).toFixed(0)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${tagClass}`}>
                        فئة {cat}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
