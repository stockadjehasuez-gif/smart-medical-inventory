import React from 'react';
import { HeartPulse, ShieldCheck, Award, FileText, Globe, Terminal, Info } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6 text-right animate-fade-in font-sans max-w-4xl mx-auto py-4" dir="rtl">
      {/* هيدر الصفحة بتصميم زجاجي فاخر */}
      <div className="bg-[#0055D4] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-blue-600/10 blur-xl"></div>
        <div className="absolute -left-16 -top-16 w-48 h-48 rounded-full bg-emerald-500 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <HeartPulse className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <span className="block text-emerald-300 font-extrabold text-xs uppercase tracking-wider">نظام تخطيط وإدارة موارد المنشآت الصحية الموحد</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Healthcare Supply Chain Management System</h1>
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-2xl mt-3 font-semibold">
              البوابة الإلكترونية المعتمدة بوزارة الصحة لإدارة سلسلة الإمداد وجرد المستلزمات الطبية والأدوية، وحساب مؤشرات إعادة الطلب والطلب التنبئي بالذكاء الاصطناعي لتأمين عهد المستشفيات والمراكز العلاجية.
            </p>
          </div>
        </div>
      </div>

      {/* بطاقات الاعتماد والامتثال اللوجستي المعياري */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 dark:text-slate-50 text-base">اعتماد التوجيهات اللوجستية للصحة</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
            يتطابق المحرك الرياضي واللوجستي لهذا النظام بالكامل مع توصيات **منظمة الصحة العالمية (WHO)** للتخزين الجيد للأدوية (GSP) وحساب مستويات حدود مخزون الأمان ونقاط إعادة الطلب اللوجستية للرعاية الصحية.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#0055D4]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 dark:text-slate-50 text-base">شهادة الجودة ومكاملة الأنظمة الحكومية</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-semibold">
            بوابة الإمداد الطبي الموحد مهيأة للمكاملة السريعة عبر واجهات برمجية آمنة مع منصة الهيئة المصرية للشراء الموحد والإمداد الطبي ومنظومة التأمين الصحي الشامل لتبادل أوراق التوريد آلياً.
          </p>
        </div>
      </div>

      {/* تفاصيل إصدار المنظومة والمواصفات الفنية */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-850 pb-3">المواصفات والتحقق الفني المعتمد (Technical Profile)</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-center space-y-1">
            <span className="block text-slate-400 text-[10px]">إصدار النظام النواتي</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono text-xs">v3.0.4-LTS</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-center space-y-1">
            <span className="block text-slate-400 text-[10px]">خوارزمية التنبؤ</span>
            <span className="text-slate-800 dark:text-slate-200 text-[11px]">التنعيم الأسي الذكي</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-center space-y-1">
            <span className="block text-slate-400 text-[10px]">قواعد الأمان والامتثال</span>
            <span className="text-emerald-500 text-[11px]">نشطة (MOH-SEC)</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-center space-y-1">
            <span className="block text-slate-400 text-[10px]">منفذ التكامل الخارجي</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono text-xs">REST / JSON API</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl flex items-center justify-between text-[11px] text-slate-400 font-bold">
          <span>جهة الترخيص: المجلس الأعلى للمستشفيات الجامعية ووزارة الصحة العامة والسكان</span>
          <span>دعم فني: support.hscm@hospital.gov.eg</span>
        </div>
      </div>
    </div>
  );
}
