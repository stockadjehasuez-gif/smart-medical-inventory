import React, { useState } from 'react';
import { Layers, HelpCircle, CheckCircle2, TrendingUp, Sparkles, Filter, Download, UploadCloud, AlertCircle } from 'lucide-react';
import { MedicalItem } from '../types';
import { getDaysOfSupply, parseCSV, exportToCSV, validateCSVTemplate } from '../utils/inventoryEngine';

interface AnalysisViewProps {
  items: MedicalItem[];
  onAddItems?: (newItems: Partial<MedicalItem>[]) => void;
}

export default function AnalysisView({ items, onAddItems }: AnalysisViewProps) {
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<{ abc: 'A' | 'B' | 'C'; xyz: 'X' | 'Y' | 'Z' } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // دالة تصدير بيانات مصفوفة ABC للامتثال الكامل للمتطلبات
  const handleExport = () => {
    const csvContent = exportToCSV(items);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تحليل_ABC_XYZ_المستشفى_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // دالة استيراد وتحديث البيانات فوراً من شيت إكسيل مع تفعيل الفحص والتحقق
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
        setImportSuccess(`تم استيراد وتحديث ${parsed.length} صنف طبي في التحليل بنجاح!`);
      } else if (!onAddItems) {
        setImportError('ميزة التحديث غير مهيأة حالياً في هذا الجزء من التطبيق.');
      } else {
        setImportError('لم نتمكن من قراءة البيانات بالشكل الصحيح.');
      }
    };
    reader.readAsText(file);
  };

  // إجمالي القيمة السنوية المستهلكة لجميع الأصناف
  const itemsWithAnnualValue = items.map(item => {
    const annualValue = item.monthlyConsumption * 12 * item.unitPrice;
    return { ...item, annualValue };
  });

  const totalAnnualValue = itemsWithAnnualValue.reduce((sum, item) => sum + item.annualValue, 0);

  // تصنيف مصفوفة ABC-XYZ
  const matrix: { [key: string]: MedicalItem[] } = {
    'A-X': [], 'A-Y': [], 'A-Z': [],
    'B-X': [], 'B-Y': [], 'B-Z': [],
    'C-X': [], 'C-Y': [], 'C-Z': []
  };

  items.forEach(item => {
    const abc = item.abcCategory || 'C';
    const xyz = item.xyzCategory || 'X';
    const key = `${abc}-${xyz}`;
    if (key in matrix) {
      matrix[key].push(item);
    }
  });

  const getCellRecommendation = (abc: 'A' | 'B' | 'C', xyz: 'X' | 'Y' | 'Z') => {
    if (abc === 'A' && xyz === 'X') {
      return 'أصناف حرجة وقيمة جداً وذات طلب مستقر. يوصى بعقود توريد طويلة المدى لتقليل تكلفة الحيازة وبدون الاحتفاظ بفائض مخزون ضخم.';
    }
    if (abc === 'A' && xyz === 'Y') {
      return 'أصناف عالية القيمة ولكنها موسمية أو متغيرة. يوصى بمراقبة وثيقة جداً وضبط حدود الأمان ROP تماشياً مع فصول السنة.';
    }
    if (abc === 'A' && xyz === 'Z') {
      return 'أصناف مرتفعة القيمة وذات استهلاك غير متوقع (مثل الأمصال النادرة). يتطلب مراجعة بشرية مستمرة وطلبات توريد مخصصة عند الحاجة.';
    }
    if (abc === 'B' && xyz === 'X') {
      return 'أصناف متوسطة الأهمية وذات طلب مستقر. يمكن جدولتها بشكل آلي شهرياً أو ربع سنوي بجهد إداري بسيط.';
    }
    if (abc === 'B' && xyz === 'Y') {
      return 'أصناف متوسطة وذات استهلاك متغير. يتطلب تعديل ROP دورياً كل 3 أشهر.';
    }
    if (abc === 'B' && xyz === 'Z') {
      return 'أصناف متوسطة غير منتظمة الطلب. ينصح بالاحتفاظ بحد أمان معقول (Safety Stock) لتفادي مفاجآت نفاد الكمية.';
    }
    if (abc === 'C' && xyz === 'X') {
      return 'أصناف رخيصة الثمن ومستقرة الاستهلاك (مثل الشاش والسرنجات). ينصح بالطلب بكميات ضخمة دفعة واحدة لتقليل تكلفة الشحن والجهد الإداري.';
    }
    if (abc === 'C' && xyz === 'Y') {
      return 'أصناف منخفضة القيمة متغيرة الطلب. تكفي مراجعتها نصف سنوياً والطلب الآلي.';
    }
    return 'أصناف منخفضة القيمة ونادرة الطلب جداً. يوصى بالشراء الفوري فقط عند الحاجة وعدم تخزينها مطلقاً تفادياً لتلفها أو ركودها.';
  };

  const getCellColor = (abc: 'A' | 'B' | 'C', xyz: 'X' | 'Y' | 'Z') => {
    if (abc === 'A') return 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-400';
    if (abc === 'B') return 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-400';
    return 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-400';
  };

  const activeMatrixItems = selectedMatrixCell 
    ? matrix[`${selectedMatrixCell.abc}-${selectedMatrixCell.xyz}`]
    : [];

  return (
    <div id="analysis-view-container" className="space-y-8 py-2 text-right" dir="rtl">
      
      {/* العنوان الرئيسي والوصف */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">مصفوفة تحليل ABC-XYZ الذكية للمستشفيات</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          مستشار التخطيط التلقائي لتصنيف الموارد الطبية بالاعتماد على التكلفة السنوية التراكمية (ABC) ودرجة موثوقية الطلب (XYZ)
        </p>
      </div>

      {/* أدوات الاستيراد والتصدير المدمجة للامتثال لشرط إتاحة التصدير بكافة الأماكن */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">التحكم في بيانات مصفوفة ABC-XYZ</h4>
              <span className="text-[10px] text-slate-400 block mt-0.5">يمكنك تصدير تحليلات المصفوفة أو استيراد شيت جديد للتحديث فوراً</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border border-indigo-100/30"
            >
              <Download className="w-4 h-4" />
              <span>تصدير تحليلات المصفوفة</span>
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
      </div>

      {/* بطاقات الشرح والتعريف اللوجستي */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">تحليل الأهمية المالية ABC</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            يقوم النظام بحساب إجمالي قيمة استهلاك الصنف سنوياً (الكمية × السعر) وتصنيفها كالتالي:
          </p>
          <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>• <strong className="text-rose-600 dark:text-rose-400">الفئة A:</strong> الأصناف الأعلى قيمة واستحواذاً على الميزانية (~70% من القيمة المالية الكلية).</li>
            <li>• <strong className="text-amber-500">الفئة B:</strong> أصناف متوسطة الأهمية المالية (~20% من القيمة الكلية).</li>
            <li>• <strong className="text-emerald-600 dark:text-emerald-400">الفئة C:</strong> الأصناف الأرخص والأقل كلفة ولكنها تستهلك كميات كبيرة (~10% من الميزانية).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">تحليل استقرار الطلب XYZ</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            يقوم النظام بتصنيف التوريد والطلب الطبي حسب استقرار الاستهلاك اليومي والأسبوعي:
          </p>
          <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>• <strong className="text-blue-600 dark:text-blue-400">الفئة X:</strong> أصناف ذات استهلاك ثابت ومستقر جداً طول العام، ويسهل التنبؤ بها بدقة مطلقة.</li>
            <li>• <strong className="text-violet-500">الفئة Y:</strong> أصناف متذبذبة الاستهلاك أو موسمية (مثل لقاحات الشتاء، أدوية حساسية الصيف).</li>
            <li>• <strong className="text-teal-600 dark:text-teal-400">الفئة Z:</strong> أصناف نادرة الاستهلاك وغير مستقرة، يصعب التنبؤ بها وتتطلب مخزون أمان مرن.</li>
          </ul>
        </div>
      </div>

      {/* مصفوفة ABC-XYZ التفاعلية ثلاثية الأبعاد */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-base">جدول مصفوفة الدمج الكروسي (انقر على خلية لعرض التفاصيل)</h3>
          <span className="text-[11px] text-slate-400">الدمج يربط القيمة المالية وموثوقية سلاسل الإمداد معاً</span>
        </div>

        {/* شبكة المصفوفة التفاعلية */}
        <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto" dir="rtl">
          {/* عمود الترويسة الأيسر */}
          <div className="flex items-center justify-center font-bold text-slate-400 text-xs">ABC \ XYZ</div>
          <div className="p-3 text-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-slate-700 dark:text-slate-300">الاستقرار X (ثابت)</div>
          <div className="p-3 text-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-slate-700 dark:text-slate-300">التغير Y (موسمي)</div>
          <div className="p-3 text-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-slate-700 dark:text-slate-300">التذبذب Z (نادر)</div>

          {/* الصف A */}
          <div className="p-3 flex items-center justify-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-rose-600">القيمة A (مرتفع)</div>
          {['X', 'Y', 'Z'].map((xyz) => {
            const count = matrix[`A-${xyz}`].length;
            const isSelected = selectedMatrixCell?.abc === 'A' && selectedMatrixCell?.xyz === xyz;
            return (
              <button
                key={`A-${xyz}`}
                onClick={() => setSelectedMatrixCell({ abc: 'A', xyz: xyz as 'X' | 'Y' | 'Z' })}
                className={`p-5 rounded-xl border text-center transition-all cursor-pointer ${getCellColor('A', xyz as 'X' | 'Y' | 'Z')} ${isSelected ? 'ring-3 ring-blue-500 scale-[1.03] shadow-md' : ''}`}
              >
                <span className="block font-black text-lg">{count}</span>
                <span className="block text-[10px] mt-1">الخلية A-{xyz}</span>
              </button>
            );
          })}

          {/* الصف B */}
          <div className="p-3 flex items-center justify-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-amber-500">القيمة B (متوسط)</div>
          {['X', 'Y', 'Z'].map((xyz) => {
            const count = matrix[`B-${xyz}`].length;
            const isSelected = selectedMatrixCell?.abc === 'B' && selectedMatrixCell?.xyz === xyz;
            return (
              <button
                key={`B-${xyz}`}
                onClick={() => setSelectedMatrixCell({ abc: 'B', xyz: xyz as 'X' | 'Y' | 'Z' })}
                className={`p-5 rounded-xl border text-center transition-all cursor-pointer ${getCellColor('B', xyz as 'X' | 'Y' | 'Z')} ${isSelected ? 'ring-3 ring-blue-500 scale-[1.03] shadow-md' : ''}`}
              >
                <span className="block font-black text-lg">{count}</span>
                <span className="block text-[10px] mt-1">الخلية B-{xyz}</span>
              </button>
            );
          })}

          {/* الصف C */}
          <div className="p-3 flex items-center justify-center font-black text-xs bg-slate-50 dark:bg-slate-950/50 rounded-xl text-emerald-600">القيمة C (منخفض)</div>
          {['X', 'Y', 'Z'].map((xyz) => {
            const count = matrix[`C-${xyz}`].length;
            const isSelected = selectedMatrixCell?.abc === 'C' && selectedMatrixCell?.xyz === xyz;
            return (
              <button
                key={`C-${xyz}`}
                onClick={() => setSelectedMatrixCell({ abc: 'C', xyz: xyz as 'X' | 'Y' | 'Z' })}
                className={`p-5 rounded-xl border text-center transition-all cursor-pointer ${getCellColor('C', xyz as 'X' | 'Y' | 'Z')} ${isSelected ? 'ring-3 ring-blue-500 scale-[1.03] shadow-md' : ''}`}
              >
                <span className="block font-black text-lg">{count}</span>
                <span className="block text-[10px] mt-1">الخلية C-{xyz}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* تفاصيل الخلية النشطة المختارة والتوصيات الذكية */}
      {selectedMatrixCell ? (
        <div id="active-matrix-details" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                استراتيجية التوريد المقترحة للخلية ({selectedMatrixCell.abc}-{selectedMatrixCell.xyz})
              </h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-semibold">
              {getCellRecommendation(selectedMatrixCell.abc, selectedMatrixCell.xyz)}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">الأصناف المدرجة في هذه الخلية ({activeMatrixItems.length} أصناف)</h4>
            
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800/85 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-bold">
                  <tr>
                    <th className="px-4 py-3">كود الصنف</th>
                    <th className="px-4 py-3">اسم الصنف</th>
                    <th className="px-4 py-3">الفئة الطبية</th>
                    <th className="px-4 py-3">الكمية الحالية</th>
                    <th className="px-4 py-3">الاستهلاك الشهري</th>
                    <th className="px-4 py-3">قيمة الاستهلاك السنوي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {activeMatrixItems.length > 0 ? (
                    activeMatrixItems.map((item) => {
                      const annualValue = item.monthlyConsumption * 12 * item.unitPrice;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{item.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                          <td className="px-4 py-3 text-slate-400">{item.category}</td>
                          <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                          <td className="px-4 py-3">{item.monthlyConsumption} / شهر</td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {annualValue.toLocaleString('ar-EG')} ج.م
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        لا توجد أصناف طبية مدرجة في هذا النطاق حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-xs">
          <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <span>يرجى النقر على أي خلية في مصفوفة ABC-XYZ بالأعلى لعرض التوصيات اللوجستية وقائمة الأدوية والمستلزمات الطبية المتطابقة.</span>
        </div>
      )}

    </div>
  );
}
