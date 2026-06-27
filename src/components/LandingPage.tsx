import React from 'react';
import { ShieldCheck, ArrowLeft, Layers, FileText, Bot, Settings, Database, Activity, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: ViewTab) => void;
  totalItems: number;
  criticalCount: number;
  totalValue: number;
  availabilityRate: number;
}

export default function LandingPage({
  onNavigate,
  totalItems,
  criticalCount,
  totalValue,
  availabilityRate
}: LandingPageProps) {
  return (
    <div id="landing-page-container" className="space-y-12 py-4 animate-fade-in text-right" dir="rtl">
      {/* قسم الترحيب الرئيسي والبطاقة التعريفية */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-8 md:p-12 shadow-xl border border-blue-600/20">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-emerald-300 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              نظام إدارة سلاسل الإمداد الطبية المعتمد
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              مساعد إدارة المخزون الطبي الذكي
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl leading-relaxed">
              منصة ذكية متكاملة مصممة للمشروعات الصحية الكبرى لتحليل المخزون الدوائي والمستلزمات الجراحية، التنبؤ بحجم الطلب المستقبلي، وجدولة التوريد تلقائياً بالذكاء الاصطناعي مع إمكانيات Glassmorphism الفاخرة واستيراد شيت إكسيل.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="btn-start-analysis"
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>افتح لوحة المؤشرات (Bento)</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                id="btn-ask-assistant"
                onClick={() => onNavigate('assistant')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <Bot className="w-5 h-5 text-blue-300" />
                <span>استشر المساعد الذكي</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl p-6">
              {/* شعار طبي احترافي */}
              <div className="absolute inset-0 m-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 animate-pulse"></div>
              <div className="z-10 text-center space-y-3">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-400/20">
                  <Activity className="w-10 h-10 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="block font-black text-xl tracking-wider text-emerald-400">SMART INVENTORY</span>
                  <span className="block text-xs uppercase tracking-widest text-blue-200">الرعاية الصحية الذكية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المؤشرات السريعة للمخزون (KPI Cards) الزجاجية والمتحركة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-card glass-card-hover shadow-xs flex items-center gap-5"
        >
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold">إجمالي الأصناف</span>
            <span className="block text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{totalItems}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-card glass-card-hover shadow-xs flex items-center gap-5"
        >
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold">الأصناف الحرجة</span>
            <span className="block text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">{criticalCount}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-card glass-card-hover shadow-xs flex items-center gap-5"
        >
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold">القيمة المالية</span>
            <span className="block text-xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">
              {totalValue.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-card glass-card-hover shadow-xs flex items-center gap-5"
        >
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold">نسبة التوافر</span>
            <span className="block text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{availabilityRate}%</span>
          </div>
        </motion.div>
      </div>

      {/* بوابات الانتقال السريع للموديولات الرئيسية */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>بوابات التحليل والإمداد الذكي بالمنشأة</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div 
            id="gate-dashboard"
            onClick={() => onNavigate('dashboard')}
            className="group p-6 rounded-2xl glass-card border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">لوحة المؤشرات التفاعلية (Bento)</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 leading-relaxed">
              تحليل فوري للمخاطر وتوقعات النقص وتوزيع التخصصات الطبية، مع إمكانية تحميل شيتات البيانات المصدرة بنقرة واحدة.
            </p>
          </div>

          <div 
            id="gate-inventory"
            onClick={() => onNavigate('inventory')}
            className="group p-6 rounded-2xl glass-card border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">قاعدة الأدوية والكميات</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 leading-relaxed">
              استيراد وإضافة الأصناف الطبية وتعديلها يدوياً أو عبر الرفع الجماعي للملفات، مع ميزات البحث المتقدم والتصفية الذكية.
            </p>
          </div>

          <div 
            id="gate-abc"
            onClick={() => onNavigate('abc-analysis')}
            className="group p-6 rounded-2xl glass-card border border-slate-150 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs transition-all duration-300 hover:shadow-md cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">تحليل ABC - XYZ الذكي</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 leading-relaxed">
              تقييم الأدوية حسب قيمتها الاقتصادية ومعدلات استهلاكها لمساعدة إدارة المستشفى في ترتيب أولويات التوريد وتوزيع رأس المال.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
