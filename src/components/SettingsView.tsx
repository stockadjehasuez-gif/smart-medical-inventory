import React, { useState } from 'react';
import { Settings, ShieldCheck, Sun, Moon, Bell, HelpCircle, Save, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsView({ darkMode, onToggleDarkMode }: SettingsViewProps) {
  // حالات ضبط المعاملات
  const [defaultLeadTime, setDefaultLeadTime] = useState(10);
  const [safetyBuffer, setSafetyBuffer] = useState(15);
  const [currency, setCurrency] = useState('ج.م');
  const [notifyMinStock, setNotifyMinStock] = useState(true);
  const [notifyROP, setNotifyROP] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div id="settings-view-container" className="max-w-3xl mx-auto space-y-8 py-2 text-right" dir="rtl">
      
      {/* هيدر الصفحة */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">إعدادات النظام والخدمات اللوجستية</h1>
        <p className="text-slate-400 dark:text-slate-50 text-sm mt-1">ضبط معاملات التوريد، نظام الإشعارات، والخيارات البصرية للمستودع الطبي</p>
      </div>

      {/* لوحة التحكم */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-4">تكوين إعدادات المستودع الكلية</h3>

        <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold">
          
          {/* المظهر والخيارات المرئية */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-700 dark:text-slate-300 text-xs">أولاً: الخيارات المرئية للوحة</h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150/40 dark:border-slate-850 flex items-center justify-between">
              <div>
                <span className="block font-bold text-slate-850 dark:text-slate-200">الوضع الداكن (Dark Mode)</span>
                <span className="block text-slate-400 text-[10px] mt-0.5">تقليل إجهاد العين لمديري المخزن بالليل والنهار</span>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-700 font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>تفعيل الوضع المضيء</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>تفعيل الوضع الليلي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* الثوابت الطبية واللوجستية */}
          <div className="space-y-4 pt-2">
            <h4 className="font-black text-slate-700 dark:text-slate-300 text-xs">ثانياً: ثوابت جرد وتوريد المستشفى</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">العملة الافتراضية للتقارير</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="ج.م">جنيه مصري (ج.م)</option>
                  <option value="ر.س">ريال سعودي (ر.س)</option>
                  <option value="د.إ">درهم إماراتي (د.إ)</option>
                  <option value="دولار">دولار أمريكي ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">فترة التوريد الافتراضية (أيام)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={defaultLeadTime}
                  onChange={(e) => setDefaultLeadTime(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">نسبة مخزون الأمان المستهدفة (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={safetyBuffer}
                  onChange={(e) => setSafetyBuffer(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* تفعيل وتعديل إشعارات المستودع */}
          <div className="space-y-4 pt-2">
            <h4 className="font-black text-slate-700 dark:text-slate-300 text-xs">ثالثاً: تفضيلات الإشعارات والإنذار المبكر</h4>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyMinStock}
                  onChange={(e) => setNotifyMinStock(e.target.checked)}
                  className="rounded-md border-slate-250 dark:border-slate-800 text-blue-600 accent-blue-600"
                />
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-200">إشعار عند هبوط الصنف عن الحد الأدنى (الأصناف الحرجة)</span>
                  <span className="block text-slate-400 text-[10px] mt-0.5">يعرض وميضاً باللون الأحمر في قائمة الإشعارات فور هبوط المخزون</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyROP}
                  onChange={(e) => setNotifyROP(e.target.checked)}
                  className="rounded-md border-slate-250 dark:border-slate-800 text-blue-600 accent-blue-600"
                />
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-200">إشعار فوري عند بلوغ نقطة ROP المقررة</span>
                  <span className="block text-slate-400 text-[10px] mt-0.5">تحفيز أتمتة أوامر الشراء فوراً لتقليل حدوث العجز بالمستشفى</span>
                </div>
              </label>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تم حفظ تفضيلات وإعدادات مستودع المستشفى بنجاح!</span>
            </div>
          )}

          {/* أزرار الحفظ */}
          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات والمصادقة</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
