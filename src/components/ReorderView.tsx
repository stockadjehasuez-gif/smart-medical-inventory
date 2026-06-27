import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, AlertTriangle, Play, HelpCircle, Check, Loader2 } from 'lucide-react';
import { MedicalItem } from '../types';
import { getReorderPoint, getDaysOfSupply } from '../utils/inventoryEngine';

interface ReorderViewProps {
  items: MedicalItem[];
  onOrderCompleted: (itemId: string, orderQuantity: number) => void;
}

export default function ReorderView({ items, onOrderCompleted }: ReorderViewProps) {
  // حالة محاكاة عمليات الشراء
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  // حساب الأصناف التي وصلت أو هبطت تحت نقطة إعادة الطلب الذكية ROP
  const reorderList = items.map(item => {
    const rop = getReorderPoint(item);
    const isBelowROP = item.quantity <= rop;
    
    // الكمية المقترحة للشراء = (معدل الاستهلاك الشهري * 2) - الكمية الحالية
    const suggestedQuantity = Math.max(0, (item.monthlyConsumption * 2) - item.quantity);
    
    // مستوى الأولوية
    let priority: 'high' | 'medium' | 'low' = 'low';
    const coverageDays = getDaysOfSupply(item);
    if (item.quantity <= item.minThreshold || coverageDays < 10) {
      priority = 'high';
    } else if (item.quantity <= rop * 0.7) {
      priority = 'medium';
    }

    return {
      ...item,
      rop,
      isBelowROP,
      suggestedQuantity,
      priority,
      coverageDays
    };
  }).filter(i => i.isBelowROP && i.suggestedQuantity > 0);

  // محاكاة إتمام أمر الشراء الفوري
  const handleOrderSubmit = (itemId: string, quantity: number) => {
    setLoadingOrderId(itemId);
    
    // محاكاة الاتصال بنظام الشراء بالمستشفى لـ 1.2 ثانية
    setTimeout(() => {
      onOrderCompleted(itemId, quantity);
      setLoadingOrderId(null);
      setSuccessOrderId(itemId);
      
      // إخفاء إشارة النجاح بعد 3 ثوانٍ
      setTimeout(() => {
        setSuccessOrderId(null);
      }, 3000);
    }, 1200);
  };

  return (
    <div id="reorder-view-container" className="space-y-8 py-2 text-right animate-fade-in" dir="rtl">
      
      {/* عنوان الصفحة الرئيسي */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">مراقبة مستويات إعادة الطلب الذكي (ROP)</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            الأصناف المطلوب طلبها فوراً، والكمية المقترحة للشراء، وفترة التوريد المتوقعة مع محاكاة إتمام أوامر التوريد الطبية
          </p>
        </div>
      </div>

      {/* معادلة الحساب اللوجستية */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/50 dark:border-blue-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="block font-black text-sm text-blue-800 dark:text-blue-400">كيف يتم حساب نقطة إعادة الطلب ROP؟</span>
          <span className="block text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            المعادلة اللوجستية المعتمدة: <strong className="text-blue-700 dark:text-blue-300">ROP = (الاستهلاك اليومي × فترة التوريد باليوم) + مخزون الأمان</strong>.
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 shadow-2xs shrink-0 self-start md:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          معتمدة طبقاً لمعايير الهيئة اللوجستية الطبية
        </div>
      </div>

      {/* قائمة الأصناف المطلوب توريدها فوراً */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>قائمة الشراء والطلب العاجل ({reorderList.length} أصناف مهددة بالنفاد)</span>
          </h2>
        </div>

        {reorderList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reorderList.map((item) => (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 space-y-4 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                {/* الجزء العلوي */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold font-mono uppercase">{item.id} | {item.category}</span>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight mt-0.5">{item.name}</h3>
                    </div>
                    
                    {/* وسم الأولوية */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      item.priority === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                        : item.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    }`}>
                      {item.priority === 'high' ? 'أولوية قصوى' : item.priority === 'medium' ? 'أولوية متوسطة' : 'عادي'}
                    </span>
                  </div>

                  {/* إحصائيات مخزون الصنف */}
                  <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                    <div>
                      <span className="block text-[10px] text-slate-400">الكمية الحالية</span>
                      <span className="block text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">نقطة ROP</span>
                      <span className="block text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{item.rop}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">أيام التغطية</span>
                      <span className="block text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">{item.coverageDays} يوم</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    المورد المقترح: <strong className="text-slate-600 dark:text-slate-300">{item.supplier}</strong> (يستغرق التوريد {item.leadTimeDays} أيام عمل).
                  </p>
                </div>

                {/* الجزء السفلي للشراء والمحاكاة */}
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium">الكمية المقترحة للشراء</span>
                    <span className="block text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {item.suggestedQuantity.toLocaleString('ar-SA')} <span className="text-[10px] font-normal text-slate-500">وحدة</span>
                    </span>
                  </div>

                  <button
                    id={`btn-order-${item.id}`}
                    disabled={loadingOrderId === item.id}
                    onClick={() => handleOrderSubmit(item.id, item.suggestedQuantity)}
                    className={`
                      px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm
                      ${successOrderId === item.id
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'}
                      disabled:opacity-60
                    `}
                  >
                    {loadingOrderId === item.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري إرسال الأمر...</span>
                      </>
                    ) : successOrderId === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم إرسال الطلب!</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>إطلاق أمر توريد</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
            <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-full" />
            <span className="block font-bold text-slate-700 dark:text-slate-300">مستويات المخزون آمنة بالكامل!</span>
            <span className="block mt-1">لا توجد أدوية أو مستلزمات طبية وصلت أو هبطت تحت نقطة إعادة الطلب حالياً.</span>
          </div>
        )}
      </div>

    </div>
  );
}
