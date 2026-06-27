import React, { useRef } from 'react';
import { FileText, Printer, FileSpreadsheet, Download, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react';
import { MedicalItem } from '../types';
import { getDaysOfSupply, getReorderPoint } from '../utils/inventoryEngine';

interface ReportsViewProps {
  items: MedicalItem[];
  availabilityRate: number;
  totalValue: number;
}

export default function ReportsView({ items, availabilityRate, totalValue }: ReportsViewProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // تصفيات التقارير
  const criticalItems = items.filter(item => {
    const days = getDaysOfSupply(item);
    return item.quantity <= item.minThreshold || days < 15;
  });

  const reorderItems = items.filter(item => item.quantity <= getReorderPoint(item));

  // تصنيفات ABC
  const aClassCount = items.filter(i => i.abcCategory === 'A').length;
  const bClassCount = items.filter(i => i.abcCategory === 'B').length;
  const cClassCount = items.filter(i => i.abcCategory === 'C').length;

  // إطلاق الطباعة الرسمية
  const handlePrint = () => {
    window.print();
  };

  // توليد محاكي تصدير لملف Word كملف نصي منسق
  const handleExportWord = () => {
    const reportTitle = "تقرير الحالة التنفيذي لمخزون المستشفى الطبي\n";
    const reportMetadata = `تاريخ التقرير: ${new Date().toISOString().split('T')[0]}\nالجهة: إدارة سلاسل الإمداد والخدمات اللوجستية الطبية المشتركة\n\n`;
    
    const section1 = `1. ملخص مؤشرات الأداء:\n`;
    const kpis = `- إجمالي قيمة المخزون الحالي: ${totalValue.toLocaleString('ar-SA')} ر.س\n- نسبة توافر المستلزمات واللقاحات: ${availabilityRate}%\n- الأصناف الطبية الكلية: ${items.length} صنف\n- أصناف حرجة تتطلب تدخلاً سريعاً: ${criticalItems.length} صنف\n- أصناف تتطلب إعادة توريد فوري: ${reorderItems.length} صنف\n\n`;

    const section2 = `2. التوصيات الاستراتيجية المعتمدة:\n`;
    const recs = `- تسريع دورة توريد الأصناف الحرجة الموضحة بالتقرير لضمان استمرارية العمل الطبي.\n- إعادة هيكلة كميات الأمان وصيغ ROP للمستلزمات ذات الاستقرار المنخفض فئة Z.\n- تصفية الأصناف الراكدة لتوفير مساحات المستودعات الطبية وتقليل الهدر المالي.\n`;

    const blob = new Blob([reportTitle + reportMetadata + section1 + kpis + section2 + recs], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hospital_executive_report_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="reports-view-container" className="space-y-8 py-2 text-right animate-fade-in" dir="rtl">
      
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">قسم التقارير التنفيذية الذكية</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">توليد وطباعة تقارير المخزون المعتمدة للجان الطبية والمجالس الإدارية</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/10"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير / حفظ PDF</span>
          </button>

          <button
            id="btn-export-word"
            onClick={handleExportWord}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل نسخة Word (نصية)</span>
          </button>
        </div>
      </div>

      {/* منطقة التقرير القابل للطباعة */}
      <div 
        ref={printAreaRef}
        id="printable-report-area" 
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xs space-y-8 print:border-none print:shadow-none print:p-0"
      >
        
        {/* هيدر التقرير الرسمي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="space-y-2 text-right">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">المستند الرسمي للمخازن الطبية</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50">تقرير ملخص المخزون الطبي التنفيذي</h2>
            <p className="text-slate-400 text-xs">تاريخ استخراج البيانات: {new Date().toLocaleDateString('ar-SA')} م</p>
          </div>
          
          <div className="text-right space-y-1 md:text-left">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">إدارة التوريد والخدمات الطبية اللوجستية</span>
            <span className="block text-slate-400 text-[10px]">قسم سلاسل الإمداد والرقابة الذكية</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/10 mt-1">
              أمن ومصادق بالكامل
            </span>
          </div>
        </div>

        {/* كتل إحصائيات التقرير */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
          <div className="space-y-1">
            <span className="block text-[11px] text-slate-400 font-bold">قيمة مستودع الأدوية</span>
            <span className="block text-lg font-black text-slate-800 dark:text-slate-100">{totalValue.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[11px] text-slate-400 font-bold">معدل توافر الأصناف</span>
            <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">{availabilityRate}%</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[11px] text-slate-400 font-bold">أصناف تتطلب تدخلاً عاجلاً</span>
            <span className="block text-lg font-black text-rose-600 dark:text-rose-400">{criticalItems.length} صنف</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[11px] text-slate-400 font-bold">أصناف تحت تصنيف ROP</span>
            <span className="block text-lg font-black text-amber-500">{reorderItems.length} صنف</span>
          </div>
        </div>

        {/* ملخص التحليل المادي واللوجستي */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-r-3 border-blue-600 pr-2">
            أولاً: ملخص توزيع الأصناف الطبية (ABC Analysis)
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            يبلغ إجمالي عدد الأصناف الطبية الفعالة المسجلة <strong className="text-slate-700 dark:text-slate-200">{items.length} صنفاً</strong>.
            وتتوزع كالتالي:
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/40 dark:border-rose-900/20">
              <span className="block text-[10px] text-slate-400">الفئة A (عالية القيمة)</span>
              <span className="block text-lg font-black text-rose-600 dark:text-rose-400 mt-1">{aClassCount}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">تمثل ~70% من الميزانية</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/40 dark:border-amber-900/20">
              <span className="block text-[10px] text-slate-400">الفئة B (متوسطة القيمة)</span>
              <span className="block text-lg font-black text-amber-600 mt-1">{bClassCount}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">تمثل ~20% من الميزانية</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/20">
              <span className="block text-[10px] text-slate-400">الفئة C (منخفضة القيمة)</span>
              <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">{cClassCount}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">تمثل ~10% من الميزانية</span>
            </div>
          </div>
        </div>

        {/* جدول الأصناف الطبية الحرجة المستهدفة */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-r-3 border-rose-500 pr-2">
            ثانياً: الأصناف الطبية الحرجة المهددة بالنفاد
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            تم رصد الأصناف التالية التي تقل كميتها الحالية عن الحد الأدنى لمخزون الأمان المقر من لجنة الجودة:
          </p>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-right text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 font-bold">
                <tr>
                  <th className="px-4 py-2.5">الكود</th>
                  <th className="px-4 py-2.5">اسم الصنف</th>
                  <th className="px-4 py-2.5">الكمية الحالية</th>
                  <th className="px-4 py-2.5">الحد الأدنى المطلوب</th>
                  <th className="px-4 py-2.5">المورد والمسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {criticalItems.length > 0 ? (
                  criticalItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30">
                      <td className="px-4 py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{item.id}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                      <td className="px-4 py-2.5 text-rose-600 dark:text-rose-400 font-bold">{item.quantity}</td>
                      <td className="px-4 py-2.5 font-bold">{item.minThreshold}</td>
                      <td className="px-4 py-2.5 text-slate-400">{item.supplier}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      لا توجد أي أصناف حرجة مسجلة حالياً بالمخزن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* قسم التوصيات والذكاء الاصطناعي الرديف للتقرير */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>ثالثاً: التوصيات الإدارية المقترحة تلقائياً</span>
          </h3>
          
          <div className="bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-850/80 space-y-3">
            <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">١</span>
              <p className="leading-relaxed">
                يرجى تفويض إدارة المشتريات فورا بمراسلة <strong>شركة نجد الطبية</strong> ومورد الأدوية لرفع مستويات <strong>مخزن الأمان</strong> وإصدار طلبات ROP.
              </p>
            </div>
            <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">٢</span>
              <p className="leading-relaxed">
                اعتماد فترات توريد أسرع للأدوية المصنفة <strong>A-X</strong> بهدف الحفاظ على دورة رأس المال وتفادي تخزين كميات متزايدة.
              </p>
            </div>
            <div className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">٣</span>
              <p className="leading-relaxed">
                تصفية وإعادة بيع أو توزيع الأصناف المصنفة <strong>راكدة</strong> التي تزيد أيام تغطيتها عن 200 يوم لتقليل تكلفة حيازة المخزن.
              </p>
            </div>
          </div>
        </div>

        {/* التوقيعات الرسمية في التقرير */}
        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100 dark:border-slate-850 text-xs">
          <div className="text-right space-y-4">
            <span className="block font-bold text-slate-500 dark:text-slate-400">توقيع ومصادقة أمين المستودعات:</span>
            <div className="h-10 border-b border-dashed border-slate-300 w-48"></div>
            <span className="block text-slate-400 text-[10px]">قسم جرد المستودعات والمهمات الطبية</span>
          </div>
          
          <div className="text-left space-y-4 flex flex-col items-end">
            <span className="block font-bold text-slate-500 dark:text-slate-400">توقيع مدير الشؤون الإدارية واللوجستية:</span>
            <div className="h-10 border-b border-dashed border-slate-300 w-48"></div>
            <span className="block text-slate-400 text-[10px] text-right w-48">المجلس الطبي العام لإدارة المستشفى</span>
          </div>
        </div>

      </div>

      {/* تعليمات خاصة بالطباعة */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area, #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          /* تجنب ظهور الفوتر والروابط الافتراضية للطباعة */
          @page {
            size: auto;
            margin: 15mm;
          }
        }
      `}</style>

    </div>
  );
}
