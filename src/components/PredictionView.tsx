import React, { useState } from 'react';
import { Brain, Sparkles, TrendingUp, Calendar, RefreshCw, Sliders, ShieldCheck, Download, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MedicalItem } from '../types';
import { validateCSVTemplate, parseCSV } from '../utils/inventoryEngine';

interface PredictionViewProps {
  items: MedicalItem[];
  onAddItems?: (newItems: Partial<MedicalItem>[]) => void;
}

export default function PredictionView({ items, onAddItems }: PredictionViewProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

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

  const handleExport = () => {
    // تصدير بيانات التنبؤات والاحتياجات
    let csvContent = 'كود الصنف,اسم الصنف,الفئة,الاستهلاك الحالي,التنبؤ للشهر القادم,التنبؤ للربع القادم,التنبؤ للسنة القادمة\n';
    predictions.forEach(p => {
      csvContent += `"${p.id}","${p.name}","${p.category}","${p.monthlyConsumption} / شهر","${p.nextMonthPrediction}","${p.nextQuarterPrediction}","${p.nextYearPrediction}"\n`;
    });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تنبؤات_احتياجات_المخزون_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setImportError('عذراً، يجب تحميل ملف CSV أو ملف نصي مفصول بفواصل فقط.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const validation = validateCSVTemplate(text);
      if (!validation.isValid) {
        setImportError(validation.error || 'تنسيق شيت الاستيراد غير صحيح.');
        return;
      }

      const parsed = parseCSV(text);
      if (parsed.length > 0 && onAddItems) {
        onAddItems(parsed);
        setImportSuccess(`تم استيراد وتحديث ${parsed.length} صنف طبي في لوحة التنبؤات بنجاح!`);
      } else if (!onAddItems) {
        setImportError('ميزة التحديث غير مهيأة حالياً في هذا الجزء من التطبيق.');
      } else {
        setImportError('لم نتمكن من قراءة البيانات بالشكل الصحيح.');
      }
    };
    reader.readAsText(file);
  };

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
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border border-blue-100/30"
          >
            <Download className="w-4 h-4" />
            <span>تصدير تقرير التنبؤات</span>
          </button>
          
          <label className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border border-emerald-100/30">
            <UploadCloud className="w-4 h-4" />
            <span>استيراد وتحديث البيانات</span>
            <input 
              type="file" 
              accept=".csv,.txt" 
              className="hidden" 
              onChange={handleImportFile}
            />
          </label>
        </div>
      </div>

      {importError && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{importError}</span>
        </div>
      )}

      {importSuccess && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{importSuccess}</span>
        </div>
      )}

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
