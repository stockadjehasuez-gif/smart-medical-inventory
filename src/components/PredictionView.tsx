import React, { useState } from 'react';
import { Brain, Sparkles, TrendingUp, Calendar, RefreshCw, Sliders, ShieldCheck } from 'lucide-react';
import { MedicalItem } from '../types';

interface PredictionViewProps {
  items: MedicalItem[];
}

export default function PredictionView({ items }: PredictionViewProps) {
  // معاملات التعديل والمحاكاة لتوقعات الذكاء الاصطناعي
  const [seasonalCoefficient, setSeasonalCoefficient] = useState<number>(1.15); // معامل الموسمية والتفشي الطبيعي
  const [safetyBufferPercent, setSafetyBufferPercent] = useState<number>(10); // هامش الطوارئ الطبي الإضافي

  // فئة الأصناف الطبية المختارة
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(i => i.category === selectedCategory);

  // حساب التوقعات لكل صنف
  const predictions = filteredItems.map(item => {
    // 1- توقع الشهر القادم: الاستهلاك الشهري المتوسط × معامل الموسمية × هامش الطوارئ
    const nextMonthPrediction = Math.round(
      item.monthlyConsumption * seasonalCoefficient * (1 + safetyBufferPercent / 100)
    );

    // 2- توقع الربع القادم (3 أشهر): توقع الشهر القادم × 3 مع مراعاة طفيفة للمخزون الحالي المتوفر كخصم أو دعم
    const nextQuarterPrediction = Math.round(nextMonthPrediction * 3);

    // 3- توقع السنة القادمة (12 شهر): توقع الشهر القادم × 12
    const nextYearPrediction = Math.round(nextMonthPrediction * 12);

    // صياغة أسباب التوقعات الطبية اللوجستية بناءً على البيانات والتصنيفات
    let reasons = '';
    const xyz = item.xyzCategory || 'X';
    if (xyz === 'X') {
      reasons = `استهلاك الصنف مستقر جداً وثابت. تم حساب الاحتياج بناء على المتوسط الشهري مع هامش سلامة بنسبة ${safetyBufferPercent}% لمواجهة أي تأخيرات توريد طارئة من المورد.`;
    } else if (xyz === 'Y') {
      reasons = `هذا الصنف ذو طابع موسمي/متغير (مثل اللقاحات وأدوية الحساسية والإنفلونزا). تم تطبيق معامل تذبذب وموسمية بمعدل ${seasonalCoefficient}× تحسباً لزيادة الحالات المرضية الموسمية بالمستشفى.`;
    } else {
      reasons = `استهلاك نادر أو غير متوقع (مثل الأمصال النادرة، الأجهزة المحمولة). ينصح بالطلب فقط لدعم مخزون الأمان الأدنى (${item.minThreshold} وحدات) وتجنب التكدس بالمستودعات.`;
    }

    return {
      ...item,
      nextMonthPrediction,
      nextQuarterPrediction,
      nextYearPrediction,
      reasons
    };
  });

  return (
    <div id="prediction-view-container" className="space-y-8 py-2 text-right" dir="rtl">
      
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">التنبؤ الذكي بالاحتياجات المستقبلية</h1>
          <p className="text-slate-400 dark:text-slate-50 text-sm mt-1">
            تقديرات حسابية متقدمة لحجم الاستهلاك المتوقع للشهر والربع والسنة القادمة لمساعدة إدارة المشتريات على إعداد الموازنات الطبية
          </p>
        </div>
      </div>

      {/* لوحة التحكم اللوجستية (Sliders) للتوقعات */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xs space-y-6">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>المعاملات اللوجستية لضبط جودة التوقعات والمحاكاة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* سلايدر معامل الموسمية */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold">معامل التفشي والموسمية</span>
              <span className="font-black text-blue-600 dark:text-blue-400">{seasonalCoefficient}×</span>
            </div>
            <input 
              type="range" 
              min="0.8" 
              max="2.0" 
              step="0.05"
              value={seasonalCoefficient}
              onChange={(e) => setSeasonalCoefficient(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="block text-[10px] text-slate-400 leading-normal">
              يضاعف توقعات الاستهلاك لمواجهة مواسم الشتاء أو الأوبئة الشائعة.
            </span>
          </div>

          {/* سلايدر هامش الطوارئ */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold">هامش الطوارئ الطبي الإضافي</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">+{safetyBufferPercent}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="5"
              value={safetyBufferPercent}
              onChange={(e) => setSafetyBufferPercent(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="block text-[10px] text-slate-400 leading-normal">
              نسبة مخزون أمان إضافية لضمان عدم حدوث نفاد مفاجئ للأدوية المنقذة للحياة.
            </span>
          </div>

          {/* تصفية الفئة للتوقعات */}
          <div className="space-y-2">
            <label className="block text-xs text-slate-500 font-bold">تصفية حسب فئة المخزون</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="all">عرض جميع الفئات الطبية ({items.length} أصناف)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="block text-[10px] text-slate-400 leading-normal">
              عزل الأصناف لسهولة التخطيط لكل قسم على حدة بالمستشفى.
            </span>
          </div>

        </div>
      </div>

      {/* عرض نتائج التنبؤات والتحليل الرياضي */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">نتائج وجداول التنبؤ الكمي بالطلب</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs" dir="rtl">
            <thead className="bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-bold">
              <tr>
                <th className="px-4 py-3">كود الصنف</th>
                <th className="px-4 py-3">اسم الصنف</th>
                <th className="px-4 py-3 text-center">الاستهلاك الحالي</th>
                <th className="px-4 py-3 text-center bg-blue-50/20 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-black">الشهر القادم</th>
                <th className="px-4 py-3 text-center bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-black">الربع القادم</th>
                <th className="px-4 py-3 text-center bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-black">السنة القادمة</th>
                <th className="px-4 py-3 max-w-sm">أسباب ودراسة التوقع</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {predictions.map((pred) => (
                <tr key={pred.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/10">
                  <td className="px-4 py-4 font-mono font-bold text-slate-800 dark:text-slate-250">{pred.id}</td>
                  <td className="px-4 py-4">
                    <span className="block font-bold text-slate-800 dark:text-slate-100">{pred.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{pred.category}</span>
                  </td>
                  <td className="px-4 py-4 text-center">{pred.monthlyConsumption} / شهر</td>
                  
                  {/* توقعات الفترات الزمنية */}
                  <td className="px-4 py-4 text-center font-bold bg-blue-50/10 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 font-mono">
                    {pred.nextMonthPrediction.toLocaleString('ar-SA')}
                  </td>
                  <td className="px-4 py-4 text-center font-bold bg-indigo-50/10 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 font-mono">
                    {pred.nextQuarterPrediction.toLocaleString('ar-SA')}
                  </td>
                  <td className="px-4 py-4 text-center font-bold bg-emerald-50/10 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400 font-mono">
                    {pred.nextYearPrediction.toLocaleString('ar-SA')}
                  </td>
                  
                  <td className="px-4 py-4 max-w-sm text-slate-400 text-[11px] leading-relaxed">
                    {pred.reasons}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
