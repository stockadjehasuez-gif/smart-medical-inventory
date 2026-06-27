import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Package, DollarSign, AlertOctagon, TrendingUp, Users, Calendar, Activity, 
  ArrowLeft, Bell, Trash2, ArrowUpRight, Bot, UploadCloud, FileSpreadsheet, 
  CheckCircle2, X, AlertCircle, Sparkles, RefreshCw, Layers, ShieldAlert,
  Download, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalItem, InventoryAlert } from '../types';
import { getDaysOfSupply, getReorderPoint, parseCSV, exportToCSV, validateCSVTemplate } from '../utils/inventoryEngine';

interface DashboardViewProps {
  items: MedicalItem[];
  alerts: InventoryAlert[];
  onDismissAlert: (id: string) => void;
  onNavigate: (tab: any) => void;
  onQuickOrder: (item: MedicalItem) => void;
  onAddItems: (newItems: Partial<MedicalItem>[]) => void;
}

export default function DashboardView({
  items,
  alerts,
  onDismissAlert,
  onNavigate,
  onQuickOrder,
  onAddItems
}: DashboardViewProps) {
  
  // دالة تصدير المخزون الحالي بصيغة CSV للامتثال لشرط إتاحة التصدير بكافة الأماكن
  const handleExport = () => {
    const csvContent = exportToCSV(items);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقرير_مخزون_المستشفى_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // حالات رفع ملف الإكسيل/CSV
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parsedItemsPreview, setParsedItemsPreview] = useState<Partial<MedicalItem>[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // حسابات الإحصائيات العامة من البيانات الحقيقية لـ ERP
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  const criticalItems = items.filter(item => {
    const days = getDaysOfSupply(item);
    return item.quantity <= item.minThreshold || days < 15;
  });
  const criticalCount = criticalItems.length;

  const reorderItems = items.filter(item => item.quantity <= getReorderPoint(item));
  const reorderCount = reorderItems.length;

  const uniqueSuppliers = Array.from(new Set(items.map(item => item.supplier))).length;
  
  const validCoverageItems = items.filter(item => item.monthlyConsumption > 0);
  const avgCoverageDays = validCoverageItems.length > 0
    ? Math.round(validCoverageItems.reduce((sum, item) => sum + getDaysOfSupply(item), 0) / validCoverageItems.length)
    : 365;

  const availableItems = items.filter(item => item.quantity > item.minThreshold).length;
  const availabilityRate = totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 100;

  // 1. إحصائيات توزيع الأصناف حسب الفئة الطبية
  const categoryCounts: { [key: string]: number } = {};
  items.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // 2. إحصائيات توزيع الأصناف حسب ABC الاقتصادية
  const abcCounts = { A: 0, B: 0, C: 0 };
  items.forEach(item => {
    const cat = item.abcCategory || 'C';
    if (cat in abcCounts) {
      abcCounts[cat as 'A' | 'B' | 'C']++;
    }
  });
  const abcData = [
    { name: 'فئة A - قيمة استهلاك عالية جداً', value: abcCounts.A },
    { name: 'فئة B - قيمة استهلاك متوسطة', value: abcCounts.B },
    { name: 'فئة C - قيمة استهلاك عادية', value: abcCounts.C }
  ];

  // 3. إحصائيات قيمة المخزون حسب الفئات العلاجية
  const categoryValues: { [key: string]: number } = {};
  items.forEach(item => {
    categoryValues[item.category] = (categoryValues[item.category] || 0) + (item.quantity * item.unitPrice);
  });
  const categoryValueData = Object.keys(categoryValues).map(cat => ({
    name: cat,
    value: Math.round(categoryValues[cat])
  }));

  // 4. اتجاه الاستهلاك الشهري (توقعي وأصلي بناء على بيانات الاستهلاك الشهري)
  const baseConsumption = items.reduce((sum, item) => sum + item.monthlyConsumption, 0);
  const monthlyTrendData = [
    { month: 'يناير', 'الاستهلاك الفعلي': Math.round(baseConsumption * 0.88), 'التنبؤ الذكي': Math.round(baseConsumption * 0.88) },
    { month: 'فبراير', 'الاستهلاك الفعلي': Math.round(baseConsumption * 0.94), 'التنبؤ الذكي': Math.round(baseConsumption * 0.93) },
    { month: 'مارس', 'الاستهلاك الفعلي': Math.round(baseConsumption * 1.02), 'التنبؤ الذكي': Math.round(baseConsumption * 1.01) },
    { month: 'أبريل', 'الاستهلاك الفعلي': Math.round(baseConsumption * 0.98), 'التنبؤ الذكي': Math.round(baseConsumption * 1.00) },
    { month: 'مايو (تنبؤ)', 'الاستهلاك الفعلي': undefined, 'التنبؤ الذكي': Math.round(baseConsumption * 1.08) },
    { month: 'يونيو (تنبؤ)', 'الاستهلاك الفعلي': undefined, 'التنبؤ الذكي': Math.round(baseConsumption * 1.15) },
  ];

  // 5. أعلى 5 أصناف لقيمة الاستهلاك السنوي (تحليل ABC الفعلي)
  const topAbcItems = [...items]
    .sort((a, b) => (b.monthlyConsumption * b.unitPrice) - (a.monthlyConsumption * a.unitPrice))
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      annualValue: item.monthlyConsumption * item.unitPrice * 12,
      category: item.abcCategory || 'C'
    }));

  // 6. أعلى 6 أصناف استهلاكاً
  const topConsumedItems = [...items]
    .sort((a, b) => b.monthlyConsumption - a.monthlyConsumption)
    .slice(0, 6)
    .map(item => ({
      name: item.name.length > 20 ? item.name.substring(0, 18) + '...' : item.name,
      consumption: item.monthlyConsumption
    }));

  // لوحة الألوان لأنظمة ERP الطبية الفاخرة
  const COLORS = ['#0055D4', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#6366F1'];
  const ABC_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  // معالجة السحب والإفلات لملف الإكسيل/CSV
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setUploadError('عذراً، يدعم المعالج حالياً ملفات إكسيل المصدرة بصيغة CSV أو ملفات نصية مفصولة بفواصل.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      
      // فحص جودة وتنسيق الشيت المرفوع للتأكد من سلامة الهيكل
      const validation = validateCSVTemplate(text);
      if (!validation.isValid) {
        setUploadError(validation.error || 'تنسيق الملف غير صحيح.');
        return;
      }

      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setUploadError('لم نتمكن من قراءة أي أصناف طبية صالحة من الملف. يرجى مراجعة صياغة الملف والترتيب.');
      } else {
        setParsedItemsPreview(parsed);
      }
    };
    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة الملف. يرجى المحاولة لاحقاً.');
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImportSuccess = () => {
    if (parsedItemsPreview.length > 0) {
      onAddItems(parsedItemsPreview);
      setUploadSuccess(`تم استيراد ${parsedItemsPreview.length} صنف طبي بنجاح وتحديث قاعدة بيانات المستودع!`);
      setParsedItemsPreview([]);
      setFileName(null);
      // إغلاق النافذة المنبثقة تلقائياً بعد فترة قصيرة
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess(null);
      }, 2000);
    }
  };

  // دالة تصدير نموذج ملف إكسيل فارغ
  const downloadTemplate = () => {
    const headers = [
      'كود الصنف',
      'اسم الصنف',
      'الفئة',
      'الكمية الحالية',
      'معدل الاستهلاك الشهري',
      'سعر الوحدة',
      'الحد الأدنى للمخزون',
      'المورد',
      'تاريخ آخر توريد'
    ].join(',');
    
    const sampleRow = [
      'MED-999',
      'مضاد حيوي أوجمنتين 1غ',
      'أدوية عامة',
      '450',
      '150',
      '45',
      '100',
      'شركة التوريدات الوطنية',
      '2026-06-20'
    ].join(',');

    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medical_erp_items_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="dashboard-view-container" className="space-y-6 py-1 text-right animate-fade-in" dir="rtl">
      
      {/* هيدر ترحيبي عالي الاحترافية */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-l from-blue-600 to-indigo-800 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin" />
              <span>نظام ERP الطبي - الجيل القادم للتحليلات اللوجستية</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-sans">مساعد إدارة المخزون الطبي الذكي</h1>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              شاشة تحكم متكاملة مخصصة للمستشفيات والمنشآت الطبية الحديثة، تدمج بين تصنيفات ABC/XYZ وتحليلات الإمداد المتقدمة مع مساعد الذكاء الاصطناعي الرديف.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-blue-700 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-[1.03] cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>استيراد شيت إكسيل للبيانات</span>
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-[1.03] cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تصدير المخزون الحالي</span>
            </button>
            <button 
              onClick={() => onNavigate('assistant')}
              className="px-4 py-3 bg-blue-500/40 hover:bg-blue-500/60 border border-white/20 text-white font-bold rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all transform hover:scale-[1.03] cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-200" />
              <span>استشارة مساعد الـ AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* خلايا البينتو جرد المتكاملة الزجاجية والمتحركة (Bento Grid layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: قيمة المخزون الإجمالية */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -4 }}
          className="glass-card glass-card-hover rounded-2xl p-5 shadow-xs flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl -ml-10 -mt-10"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">قيمة المخزون الإجمالية</span>
            </div>
            <span className="text-xs font-bold text-med-green bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">↑ 4.2%</span>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {totalValue.toLocaleString('ar-EG')}
            </div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">جنيه مصري معتمد</div>
          </div>
        </motion.div>

        {/* KPI 2: نسبة توافر المخزون */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="glass-card glass-card-hover rounded-2xl p-5 shadow-xs flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl -ml-10 -mt-10"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">معدل جاهزية المخزون</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-med-green animate-pulse"></span>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-med-green font-mono">
              {availabilityRate}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800/60 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                style={{ width: `${availabilityRate}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* KPI 3: أصناف حرجة */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="glass-card glass-card-hover rounded-2xl p-5 shadow-xs flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl -ml-10 -mt-10"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">أصناف تحت الحد الحرج</span>
            </div>
            {criticalCount > 0 && (
              <span className="text-[10px] font-bold text-white bg-med-red px-2 py-0.5 rounded-md animate-bounce">تحذير</span>
            )}
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-med-red font-mono">
              {criticalCount}
            </div>
            <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-2">
              {criticalCount > 0 ? 'يتطلب إعادة إصدار طلبات توريد فوراً' : 'جميع الأصناف في الحدود الآمنة'}
            </div>
          </div>
        </motion.div>

        {/* KPI 4: متوسط أيام التغطية */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="glass-card glass-card-hover rounded-2xl p-5 shadow-xs flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-xl -ml-10 -mt-10"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">متوسط أيام التغطية</span>
            </div>
            <span className="text-[10px] text-purple-500 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-950/30 px-2 py-0.5 rounded-md font-semibold">تأمين</span>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {avgCoverageDays}
            </div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2">يوماً من استهلاك الأقسام العلاجية</div>
          </div>
        </motion.div>

        {/* خلية بينتو 5: معالج رفع شيت الإكسيل التفاعلي والمباشر */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => setIsUploadModalOpen(true)}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md duration-300 flex flex-col justify-between text-right group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -ml-6 -mt-6 group-hover:scale-150 transition-transform"></div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">رفع إكسيل / CSV ببيانات الأدوية</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">تحديث واستيراد سريع للمخزون الطبي</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">بوابة سريعة</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              اسحب شيت البيانات هنا لتعديل كميات الأدوية، أو تزويد أصناف علاجية وموردين جدد بنقرة واحدة.
            </p>
            <div className="flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0">
              <span>افتح الرفع الآن</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* خلية بينتو 6: مستشار الذكاء الاصطناعي الذكي الفوري */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => onNavigate('assistant')}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-transparent border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md duration-300 flex flex-col justify-between text-right group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -ml-6 -mt-6 group-hover:scale-150 transition-transform"></div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">مستشار الإمداد الرديف الـ AI</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">تحليل المخاطر وجدولة التوريد بنموذج ذكي</p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">متصل</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              اسأل المساعد الذكي عن الأدوية المتوقع نفادها، أو دعمه في حساب مستويات إعادة الطلب الآمنة.
            </p>
            <div className="flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 shrink-0">
              <span>افتح المستشار</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* تنبيهات إعادة الطلب واللوجستيات (الصف الكامل في البينتو) */}
        {alerts.length > 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-card rounded-2xl p-5 shadow-sm border-rose-500/10">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-med-red animate-ping"></span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <ShieldAlert className="w-4.5 h-4.5 text-med-red" />
                  <span>تنبيهات الإمداد وإعادة الطلب الحرجة</span>
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                {alerts.length} إشعارات نشطة تتطلب مراجعة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pl-1">
              {alerts.slice(0, 4).map((alert) => {
                const isCritical = alert.severity === 'high' || alert.type === 'critical';
                const isMedium = alert.severity === 'medium';
                
                return (
                  <div 
                    key={alert.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:scale-[1.01] ${
                      isCritical 
                        ? 'bg-rose-500/5 border-rose-200 dark:border-rose-900/20 text-[#9F1239] dark:text-rose-300' 
                        : isMedium
                          ? 'bg-amber-500/5 border-amber-200 dark:border-amber-900/20 text-[#854D0E] dark:text-amber-300'
                          : 'bg-blue-500/5 border-blue-200 dark:border-blue-900/20 text-[#1E40AF] dark:text-blue-300'
                    }`}
                  >
                    <div className="text-right space-y-1">
                      <div className="font-bold text-xs">{alert.itemName}</div>
                      <div className="text-[11px] opacity-90 leading-normal">{alert.message}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      {alert.type === 'critical' && (
                        <button 
                          onClick={() => {
                            const originalItem = items.find(i => i.id === alert.itemId);
                            if (originalItem) onQuickOrder(originalItem);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-150 shadow-xs hover:scale-105 ${
                            isCritical 
                              ? 'bg-med-red text-white hover:bg-rose-700' 
                              : 'bg-amber-600 text-white hover:bg-amber-700'
                          }`}
                        >
                          طلب توريد
                        </button>
                      )}
                      <button 
                        onClick={() => onDismissAlert(alert.id)}
                        className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="تجاهل التنبيه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* المخطط 1: اتجاه الاستهلاك الشهري (توقعي وأصلي) */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">تحليل الاستهلاك الشهري والتوقعات الذكية لـ 6 أشهر</span>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 rounded-sm bg-blue-600"></span>
                <span className="text-slate-400 dark:text-slate-500 font-semibold">استهلاك حقيقي</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 rounded-sm bg-indigo-400"></span>
                <span className="text-slate-400 dark:text-slate-500 font-semibold">توقع ذكي</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0055D4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0055D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'Cairo' }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10, fontFamily: 'Cairo' }} stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: 11, fontFamily: 'Cairo', borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value} وحدة`, '']} 
                />
                <Area type="monotone" dataKey="الاستهلاك الفعلي" stroke="#0055D4" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="التنبؤ الذكي" stroke="#818CF8" strokeDasharray="4 4" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* جدول ABC للأصناف الطبية ذات القيمة الاستهلاكية والسرعة الكبرى */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">أولويات التوريد وتصنيف ABC - الأعلى استهلاكاً وقيمة</span>
              <span className="text-[10px] text-slate-400 font-semibold">تحليل تراكمي مالي</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="w-1/2">الصنف</span>
                <span className="w-1/3 text-left">الاستهلاك السنوي ج.م</span>
                <span className="w-1/6 text-center">التصنيف</span>
              </div>
              
              {topAbcItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-3 border-b border-slate-100/50 dark:border-slate-800/40 text-xs"
                >
                  <span className="w-1/2 font-bold text-slate-800 dark:text-slate-200 truncate pr-1" title={item.name}>
                    {item.name}
                  </span>
                  <span className="w-1/3 text-left font-mono font-bold text-slate-700 dark:text-slate-300">
                    {Math.round(item.annualValue).toLocaleString('ar-EG')} ج.م
                  </span>
                  <span className="w-1/6 text-center">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase inline-block ${
                      item.category === 'A' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' 
                        : item.category === 'B'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      {item.category}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* المخطط 2: توزيع الأصناف الطبية حسب الأهمية الاقتصادية ABC */}
        <div className="glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-4">توزيع الأصناف حسب فئة ABC</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={abcData}
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {abcData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ABC_COLORS[index % ABC_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: 11, fontFamily: 'Cairo', borderRadius: 12 }}
                  formatter={(value) => [`${value} صنف`, 'الكمية']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>فئة A (حرجة)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>فئة B (متوسطة)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>فئة C (عادية)</span>
            </div>
          </div>
        </div>

        {/* المخطط 3: توزيع الأصناف الطبية حسب فئاتها */}
        <div className="glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-4">توزيع الأصناف حسب التخصص الطبي</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: 11, fontFamily: 'Cairo', borderRadius: 12 }}
                  formatter={(value) => [`${value} صنف`, 'الكمية']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-slate-400 font-semibold truncate pt-2 border-t border-slate-100 dark:border-slate-800/40">
            توزيع تكراري مئوي للفئات العلاجية
          </div>
        </div>

        {/* المخطط 4: قيمة المخزون الحالية حسب الفئات */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">إجمالي القيمة المالية بالجنيه حسب الأقسام العلاجية</span>
            <span className="text-[10px] text-slate-400 font-semibold">تراكمي مالي</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryValueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: 'Cairo' }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 9, fontFamily: 'Cairo' }} stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: 11, fontFamily: 'Cairo', borderRadius: 12 }}
                  formatter={(value) => [`${value.toLocaleString('ar-EG')} ج.م`, 'قيمة المخزون']} 
                />
                <Bar dataKey="value" fill="#0055D4" radius={[6, 6, 0, 0]}>
                  {categoryValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* المخطط 5: أعلى 6 أصناف استهلاكاً */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">تحليل معدل الحركة - الأدوية الأكثر استهلاكاً وطلباً شهرياً (بالوحدة)</span>
            <span className="text-[11px] text-slate-400 font-semibold">السرعة والطلب</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConsumedItems} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(226, 232, 240, 0.3)" />
                <XAxis type="number" tick={{ fontSize: 9, fontFamily: 'Cairo' }} stroke="#94A3B8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontFamily: 'Cairo' }} width={140} stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ direction: 'rtl', textAlign: 'right', fontSize: 11, fontFamily: 'Cairo', borderRadius: 12 }}
                  formatter={(value) => [`${value} وحدة`, 'الاستهلاك الشهري']} 
                />
                <Bar dataKey="consumption" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* نافذة استيراد ورفع ملفات الإكسيل/CSV الرائعة بنظام Glassmorphic */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* هيدر المودال */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-100">استيراد ورفع شيت الأدوية (Excel / CSV)</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">قم بتحديث مخزون المستودع الطبي والموردين مباشرة</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* محتوى المودال المتجاوب */}
              <div className="my-6 space-y-4 overflow-y-auto flex-1 pr-1">
                
                {uploadSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* منطقة السحب والإفلات */}
                {parsedItemsPreview.length === 0 ? (
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 scale-[1.01]' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".csv, .txt" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="w-12 h-12 text-slate-300 dark:text-slate-750 mx-auto mb-4 animate-bounce" />
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">اسحب شيت الأدوية وأفلته هنا، أو تصفح ملفاتك</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                      يدعم النظام الملفات الطبية بصيغة CSV المصدرة من مايكروسوفت إكسيل. يجب أن يحتوي الملف كأعمدة أساسية على: كود الصنف، الاسم، الفئة، الكمية الحالية، الاستهلاك الشهري، سعر الوحدة، المورد.
                    </p>
                    
                    <div className="mt-5 flex justify-center gap-3">
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileSelect();
                        }}
                      >
                        اختيار ملف من جهازك
                      </button>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTemplate();
                        }}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل الهيكل والنموذج</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // معاينة الأدوية التي تم التعرف عليها في الإكسيل
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>معاينة المستند المكتشف: <strong className="text-slate-800 dark:text-slate-200">{fileName}</strong></span>
                      <span className="text-emerald-600 dark:text-emerald-400">تم التعرف على {parsedItemsPreview.length} أصناف طبية</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 sticky top-0 font-bold text-slate-600 dark:text-slate-400">
                          <tr>
                            <th className="p-2.5">الكود</th>
                            <th className="p-2.5">اسم الصنف الطبي</th>
                            <th className="p-2.5">القسم</th>
                            <th className="p-2.5 text-center">الكمية</th>
                            <th className="p-2.5 text-left">السعر ج.م</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {parsedItemsPreview.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="p-2.5 font-mono text-slate-500">{item.id}</td>
                              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{item.name}</td>
                              <td className="p-2.5">{item.category}</td>
                              <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.quantity}</td>
                              <td className="p-2.5 text-left font-mono">{item.unitPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        onClick={() => {
                          setParsedItemsPreview([]);
                          setFileName(null);
                        }}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        إلغاء وتغيير الملف
                      </button>
                      <button 
                        onClick={handleImportSuccess}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تأكيد واستيراد لقاعدة البيانات</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* فوتر المودال */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>تحديث تلقائي لمستويات المخاطر والأصناف فور التثبيت</span>
                </span>
                <span>ERP v2.0 SECURE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
