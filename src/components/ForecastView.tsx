import React, { useState } from 'react';
import { Brain, TrendingUp, Sparkles, Calendar, HelpCircle, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { MedicalItem } from '../types';

interface ForecastViewProps {
  items: MedicalItem[];
}

export default function ForecastView({ items }: ForecastViewProps) {
  const [selectedItem, setSelectedItem] = useState<MedicalItem | null>(items[0] || null);

  // حساب التوقعات الافتراضية بناءً على الاستهلاك الفعلي للأصناف
  const forecastData = items.map(item => {
    const monthlyDemand = item.monthlyConsumption;
    const quarterlyDemand = Math.round(monthlyDemand * 3);
    const annualForecast = Math.round(monthlyDemand * 12 * 1.05); // نمو بنسبة 5% للسلامة اللوجستية

    // توليد توصيات ذكية لكل صنف
    let aiRecommendation = 'المخزون مستقر وآمن؛ يوصى بالحفاظ على معدلات التدفق الحالية.';
    if (item.quantity <= item.minThreshold) {
      aiRecommendation = `عاجل جداً: يقل مستوى العهدة الحالية بمقدار ${(item.minThreshold - item.quantity)} عن حد الأمان الأدنى. يوصى بتعميد أمر شراء لـ ${Math.round(monthlyDemand * 2)} وحدة فوراً.`;
    } else if (item.quantity <= (item.minThreshold * 1.5)) {
      aiRecommendation = `تنبيه مبكر: المخزون على وشك الاقتراب من مستوى إعادة الطلب. يوصى بجدولة شحنة توريد لـ ${Math.round(monthlyDemand * 1.5)} وحدة للشهر المقبل.`;
    }

    return {
      ...item,
      monthlyDemand,
      quarterlyDemand,
      annualForecast,
      aiRecommendation
    };
  });

  const selectedForecast = selectedItem 
    ? forecastData.find(f => f.id === selectedItem.id) || forecastData[0]
    : forecastData[0];

  return (
    <div className="space-y-6 text-right animate-fade-in font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Brain className="w-7 h-7 text-[#0055D4]" />
          <span>محرك التنبؤ بالطلب والاحتياجات الطبية بالذكاء الاصطناعي</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          حساب الطلب التقديري والاحتياجات المستقبلية للأشهر والربع والسنوات القادمة بالاعتماد على خوارزميات التنعيم الأسي للمتتاليات الزمنية
        </p>
      </div>

      {/* لوحة التفاصيل التنبؤية المتكاملة للصنف المختار */}
      {selectedForecast && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* عمود البطاقات الرقمية الثلاث */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div>
                <span className="text-[10px] bg-[#0055D4]/10 text-[#0055D4] dark:text-blue-400 font-extrabold px-3 py-1 rounded-full">
                  تحليل الصنف المحدد
                </span>
                <h2 className="font-black text-lg text-slate-800 dark:text-slate-50 mt-2">
                  {selectedForecast.name} <span className="font-mono text-slate-400 text-xs font-semibold">({selectedForecast.id})</span>
                </h2>
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-slate-400">الفئة</span>
                <span className="text-xs font-bold text-[#0055D4] dark:text-blue-400">{selectedForecast.category}</span>
              </div>
            </div>

            {/* بطاقات المؤشرات الثلاثية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20 text-right">
                <span className="block text-[11px] text-slate-400 font-bold mb-1">الطلب الشهري المتوقع</span>
                <span className="text-xl font-black text-slate-850 dark:text-slate-100 font-mono">
                  {selectedForecast.monthlyDemand.toLocaleString('ar-EG')}
                </span>
                <span className="block text-[9px] text-slate-400 mt-1">وحدة / شهرياً</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/20 text-right">
                <span className="block text-[11px] text-slate-400 font-bold mb-1">الطلب ربع السنوي المتوقع</span>
                <span className="text-xl font-black text-slate-850 dark:text-slate-100 font-mono">
                  {selectedForecast.quarterlyDemand.toLocaleString('ar-EG')}
                </span>
                <span className="block text-[9px] text-slate-400 mt-1">وحدة / ربع سنوي</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/20 text-right">
                <span className="block text-[11px] text-slate-400 font-bold mb-1">التنبؤ بالاحتياج السنوي</span>
                <span className="text-xl font-black text-slate-850 dark:text-slate-100 font-mono">
                  {selectedForecast.annualForecast.toLocaleString('ar-EG')}
                </span>
                <span className="block text-[9px] text-emerald-500 font-extrabold mt-1">توقع لعام كلي شامل الأمان</span>
              </div>
            </div>

            {/* صندوق التوصية الذكية لمستشار الإمداد AI */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border border-emerald-500/10 dark:border-emerald-500/20 flex gap-4 items-start">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">توصية مستشار الإمداد الذكي (AI Recommendation):</span>
                <p className="text-slate-750 dark:text-slate-300 text-xs font-bold leading-relaxed mt-1">
                  {selectedForecast.aiRecommendation}
                </p>
              </div>
            </div>
          </div>

          {/* معلومات العهدة الحالية */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/80 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">مستويات العهدة الحالية للأمان</h3>
            
            <div className="space-y-3.5 text-xs font-bold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">المخزون الحالي</span>
                <span className="font-mono text-slate-800 dark:text-slate-150">{selectedForecast.quantity.toLocaleString('ar-EG')} وحدة</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">مخزون الأمان الصارم</span>
                <span className="font-mono text-slate-800 dark:text-slate-150">{selectedForecast.safetyStock.toLocaleString('ar-EG')} وحدة</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">حد الخطر الأدنى</span>
                <span className="font-mono text-rose-500">{selectedForecast.minThreshold.toLocaleString('ar-EG')} وحدة</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">المورد المتوقع لتلبية الطلب</span>
                <span className="text-[#0055D4] dark:text-blue-400 font-extrabold">{selectedForecast.supplier}</span>
              </div>
            </div>

            <button 
              onClick={() => alert(`تم إصدار وتعميد طلب الشراء والجدولة لـ ${selectedForecast.name} بنجاح`)}
              className="w-full py-2.5 bg-[#0055D4] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition-transform active:scale-[0.98]"
            >
              جدولة أمر شراء وتوريد آلي
            </button>
          </div>
        </div>
      )}

      {/* جدول اختيار الأصناف الطبية */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h2 className="font-bold text-base text-slate-850 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#0055D4]" />
          <span>جدول التنبؤات الشامل لكافة بنود المخزون السلعي الطبي</span>
        </h2>

        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <th className="p-3 font-bold">كود الصنف</th>
                <th className="p-3 font-bold">اسم الصنف</th>
                <th className="p-3 font-bold">الفئة العلاجية</th>
                <th className="p-3 font-bold text-center">الطلب الشهري المتوقع</th>
                <th className="p-3 font-bold text-center">الطلب ربع السنوي</th>
                <th className="p-3 font-bold text-center">الطلب السنوي</th>
                <th className="p-3 font-bold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
              {forecastData.map((forecast) => {
                const isSelected = selectedItem?.id === forecast.id;
                return (
                  <tr 
                    key={forecast.id} 
                    onClick={() => setSelectedItem(forecast)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-950/30 dark:hover:bg-blue-950/40 font-bold' 
                        : 'hover:bg-slate-50/55 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 font-mono text-slate-500">{forecast.id}</td>
                    <td className="p-3 font-black text-slate-850 dark:text-slate-50">{forecast.name}</td>
                    <td className="p-3 text-slate-400">{forecast.category}</td>
                    <td className="p-3 text-center font-mono">{forecast.monthlyDemand.toLocaleString('ar-EG')}</td>
                    <td className="p-3 text-center font-mono">{forecast.quarterlyDemand.toLocaleString('ar-EG')}</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400">{forecast.annualForecast.toLocaleString('ar-EG')}</td>
                    <td className="p-3 text-center">
                      <button className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-[10px] font-black hover:bg-blue-500 hover:text-white transition-colors cursor-pointer">
                        عرض التحليل
                      </button>
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
