import React, { useState } from 'react';
import { Layers, Folder, Database, Activity, DollarSign, ArrowRight } from 'lucide-react';
import { MedicalItem } from '../types';

interface CategoriesViewProps {
  items: MedicalItem[];
  onNavigate?: (tab: any) => void;
}

export default function CategoriesView({ items, onNavigate }: CategoriesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // استخراج الفئات الفريدة
  const categories = Array.from(new Set(items.map(i => i.category)));

  // حساب إحصائيات كل فئة
  const categoryStats = categories.map(category => {
    const categoryItems = items.filter(i => i.category === category);
    const totalQty = categoryItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalVal = categoryItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
    const criticalCount = categoryItems.filter(i => i.quantity <= i.minThreshold).length;

    return {
      name: category,
      itemsCount: categoryItems.length,
      totalQuantity: totalQty,
      totalValue: totalVal,
      criticalCount
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  const selectedCategoryItems = selectedCategory 
    ? items.filter(i => i.category === selectedCategory)
    : [];

  return (
    <div className="space-y-6 text-right animate-fade-in font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">بوابة تصنيفات وفئات المواد الطبية</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          مراقبة توزيع القيمة الاستثمارية والكميات وعوامل الخطر للأصناف موزعة حسب الأقسام العلاجية والمجموعات الدوائية
        </p>
      </div>

      {/* مصفوفة كروت الفئات (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((stat) => (
          <div 
            key={stat.name}
            onClick={() => setSelectedCategory(stat.name)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              selectedCategory === stat.name
                ? 'bg-blue-600/5 border-[#0055D4] dark:border-blue-500 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-[#0055D4]/40 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0055D4] dark:text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              {stat.criticalCount > 0 && (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {stat.criticalCount} حرجة
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 mb-2">{stat.name}</h3>
            
            <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold mb-0.5">عدد الأصناف</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stat.itemsCount}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold mb-0.5">إجمالي العهدة</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stat.totalQuantity.toLocaleString('ar-EG')}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold mb-0.5">القيمة الإجمالية</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {(stat.totalValue).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* تفاصيل الفئة المحددة */}
      {selectedCategory ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
            <div>
              <h2 className="font-bold text-lg text-slate-850 dark:text-slate-50 flex items-center gap-2">
                <Folder className="w-5 h-5 text-[#0055D4]" />
                <span>أصناف فئة: {selectedCategory} ({selectedCategoryItems.length} صنف)</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">جميع الأصناف الطبية المقيدة بعهد المستشفى تحت هذا التصنيف</p>
            </div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-[#0055D4] hover:underline font-bold"
            >
              عرض الفئات الكلية
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-150 dark:border-slate-800">
                  <th className="p-3 font-bold">كود الصنف</th>
                  <th className="p-3 font-bold">اسم الصنف</th>
                  <th className="p-3 font-bold">الكمية الحالية</th>
                  <th className="p-3 font-bold">معدل الاستهلاك الشهري</th>
                  <th className="p-3 font-bold">سعر الوحدة</th>
                  <th className="p-3 font-bold">قيمة المخزون</th>
                  <th className="p-3 font-bold">المورد المعتمد</th>
                  <th className="p-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedCategoryItems.map((item) => {
                  const isCritical = item.quantity <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-500">{item.id}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                      <td className="p-3 font-black">{item.quantity.toLocaleString('ar-EG')}</td>
                      <td className="p-3 font-mono">{item.monthlyConsumption} / شهر</td>
                      <td className="p-3 font-mono">{(item.unitPrice).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                      <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {(item.quantity * item.unitPrice).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">{item.supplier}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isCritical 
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' 
                            : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'
                        }`}>
                          {isCritical ? 'حرج - بحاجة لتوريد' : 'مستقر وآمن'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-bold">انقر على أي فئة طبية في الأعلى لعرض تفاصيلها وجدول جرد الأصناف التابعة لها بالتفصيل.</p>
        </div>
      )}
    </div>
  );
}
