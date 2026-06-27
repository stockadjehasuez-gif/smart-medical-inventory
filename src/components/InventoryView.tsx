import React, { useState, useRef } from 'react';
import { 
  Search, Filter, Plus, FileSpreadsheet, Download, Edit2, Trash2, 
  UploadCloud, CheckCircle2, X, AlertCircle, RefreshCw 
} from 'lucide-react';
import { MedicalItem } from '../types';
import { exportToCSV, parseCSV, getDaysOfSupply, getReorderPoint, validateCSVTemplate } from '../utils/inventoryEngine';

interface InventoryViewProps {
  items: MedicalItem[];
  onAddItems: (newItems: Partial<MedicalItem>[]) => void;
  onUpdateItem: (id: string, updatedFields: Partial<MedicalItem>) => void;
  onDeleteItem: (id: string) => void;
  categories: string[];
}

export default function InventoryView({
  items,
  onAddItems,
  onUpdateItem,
  onDeleteItem,
  categories
}: InventoryViewProps) {
  
  // حالات الجدول والتصفية والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedABC, setSelectedABC] = useState('');
  const [selectedXYZ, setSelectedXYZ] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'quantity' | 'monthlyConsumption' | 'unitPrice'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // حالات نافذة الإضافة والتعديل
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicalItem | null>(null);

  // حقول النموذج لإضافة/تعديل صنف
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formQuantity, setFormQuantity] = useState(0);
  const [formMonthlyConsumption, setFormMonthlyConsumption] = useState(0);
  const [formUnitPrice, setFormUnitPrice] = useState(0);
  const [formMinThreshold, setFormMinThreshold] = useState(0);
  const [formSupplier, setFormSupplier] = useState('');
  const [formLastSupply, setFormLastSupply] = useState('');

  // حالات رفع الملفات
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // إدارة تفعيل نافذة الإضافة
  const openAddModal = () => {
    setEditingItem(null);
    setFormId(`MED-${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormCategory(categories[0] || 'عام');
    setFormQuantity(100);
    setFormMonthlyConsumption(50);
    setFormUnitPrice(10);
    setFormMinThreshold(50);
    setFormSupplier('');
    setFormLastSupply(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  // إدارة تفعيل نافذة التعديل
  const openEditModal = (item: MedicalItem) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormMonthlyConsumption(item.monthlyConsumption);
    setFormUnitPrice(item.unitPrice);
    setFormMinThreshold(item.minThreshold);
    setFormSupplier(item.supplier);
    setFormLastSupply(item.lastSupplyDate);
    setIsModalOpen(true);
  };

  // معالجة إرسال النموذج
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload: Partial<MedicalItem> = {
      id: formId,
      name: formName,
      category: formCategory,
      quantity: Number(formQuantity),
      monthlyConsumption: Number(formMonthlyConsumption),
      unitPrice: Number(formUnitPrice),
      minThreshold: Number(formMinThreshold),
      supplier: formSupplier || 'مورد غير مسمى',
      lastSupplyDate: formLastSupply,
      leadTimeDays: editingItem ? editingItem.leadTimeDays : 10,
      safetyStock: editingItem ? editingItem.safetyStock : Math.round(Number(formMinThreshold) * 0.4),
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, payload);
    } else {
      onAddItems([payload]);
    }
    setIsModalOpen(false);
  };

  // تصدير البيانات إلى ملف CSV وتنزيله تلقائياً
  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(items);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `medical_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // إدارة أحداث السحب والإفلات لملف CSV
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
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setUploadError('عذراً، يجب تحميل ملف CSV أو ملف نصي مفصول بفواصل فقط.');
      setUploadSuccess(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // التحقق من صحة تنسيق النموذج أولاً للتأكد من ملاءمة الملف المستورد
      const validation = validateCSVTemplate(text);
      if (!validation.isValid) {
        setUploadError(validation.error || 'تنسيق الملف غير صحيح.');
        setUploadSuccess(null);
        return;
      }

      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        onAddItems(parsed);
        setUploadSuccess(`نجح استيراد ${parsed.length} صنف طبي من الملف بنجاح!`);
        setUploadError(null);
      } else {
        setUploadError('لم نتمكن من قراءة البيانات بالشكل الصحيح. تأكد من مطابقة صيغة النموذج.');
        setUploadSuccess(null);
      }
    };
    reader.onerror = () => {
      setUploadError('حدث خطأ غير متوقع أثناء معالجة الملف.');
    };
    reader.readAsText(file);
  };

  // تصفية وترتيب الأصناف
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesABC = selectedABC ? item.abcCategory === selectedABC : true;
    const matchesXYZ = selectedXYZ ? item.xyzCategory === selectedXYZ : true;

    return matchesSearch && matchesCategory && matchesABC && matchesXYZ;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === 'string') {
      return sortOrder === 'asc' 
        ? (valueA as string).localeCompare(valueB as string)
        : (valueB as string).localeCompare(valueA as string);
    } else {
      return sortOrder === 'asc'
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });

  const toggleSort = (field: 'id' | 'quantity' | 'monthlyConsumption' | 'unitPrice') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div id="inventory-view-container" className="space-y-8 py-2 text-right animate-fade-in" dir="rtl">
      
      {/* هيدر الصفحة والترويسة والبحث */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">تحليل وإدارة المخزون الطبي</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            البحث في المستودع، التصفية المتقدمة بالفئات ومستويات ROP والـ ABC، والتحميل السريع لملفات المستشفيات
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            id="btn-add-item"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-600/10"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 border border-emerald-200/50 dark:border-emerald-900/30 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV لبرنامج Excel</span>
          </button>
        </div>
      </div>

      {/* قسم السحب والإفلات لرفع الملفات الذكية */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">استيراد وتحديث المخزون الطبي من ملف Excel / CSV</h3>
        
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3
            ${dragActive 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-950/10'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, .txt"
            className="hidden" 
          />
          <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-600" />
          <div>
            <span className="block font-bold text-sm text-slate-700 dark:text-slate-300">اسحب ملف CSV للمخزون أو انقر هنا للرفع</span>
            <span className="block text-slate-400 text-xs mt-1">يجب أن يتضمن الأعمدة: كود الصنف، اسم الصنف، الفئة، الكمية، الاستهلاك، السعر، الحد الأدنى، المورد</span>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* لوحة البحث والتصفية المتقدمة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
        
        {/* البحث النصي */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="ابحث بالاسم، الكود، المورد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        {/* تصفية الفئة */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="">جميع الفئات الطبية</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* تصفية ABC */}
        <div>
          <select
            value={selectedABC}
            onChange={(e) => setSelectedABC(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="">جميع تصنيفات ABC</option>
            <option value="A">الفئة A (مرتفع القيمة)</option>
            <option value="B">الفئة B (متوسط القيمة)</option>
            <option value="C">الفئة C (منخفض القيمة)</option>
          </select>
        </div>

        {/* تصفية XYZ */}
        <div>
          <select
            value={selectedXYZ}
            onChange={(e) => setSelectedXYZ(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="">جميع تصنيفات XYZ (الاستقرار)</option>
            <option value="X">X (طلب مستقر)</option>
            <option value="Y">Y (طلب متغير)</option>
            <option value="Z">Z (طلب غير منتظم)</option>
          </select>
        </div>

      </div>

      {/* جدول البيانات الرئيسي */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs" dir="rtl">
            <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 uppercase font-bold border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('id')}>
                  كود الصنف {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4">اسم الصنف الطبي</th>
                <th className="px-6 py-4">الفئة</th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('quantity')}>
                  الكمية الحالية {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('monthlyConsumption')}>
                  الاستهلاك الشهري {sortBy === 'monthlyConsumption' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => toggleSort('unitPrice')}>
                  سعر الوحدة {sortBy === 'unitPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4">أيام التغطية</th>
                <th className="px-6 py-4 text-center">التصنيف</th>
                <th className="px-6 py-4 text-left">إجراءات</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => {
                  const days = getDaysOfSupply(item);
                  const isCritical = item.quantity <= item.minThreshold || days < 15;
                  
                  return (
                    <tr 
                      key={item.id}
                      className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-850/20 ${isCritical ? 'bg-rose-50/20 dark:bg-rose-950/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-mono font-bold">{item.id}</td>
                      <td className="px-6 py-4">
                        <span className="block font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{item.supplier}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{item.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${isCritical ? 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30' : 'text-slate-800 dark:text-slate-200'}`}>
                          {item.quantity.toLocaleString('ar-SA')}
                        </span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">الحد الأدنى: {item.minThreshold}</span>
                      </td>
                      <td className="px-6 py-4">{item.monthlyConsumption.toLocaleString('ar-SA')} / شهر</td>
                      <td className="px-6 py-4 font-mono font-semibold">{item.unitPrice.toLocaleString('ar-EG')} ج.م</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${days < 15 ? 'text-rose-600 dark:text-rose-400' : days < 30 ? 'text-amber-500' : 'text-slate-500'}`}>
                          {days > 365 ? 'أكثر من عام' : `${days} يوم`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            item.abcCategory === 'A' 
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                              : item.abcCategory === 'B'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}>
                            ABC: {item.abcCategory || 'C'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                            XYZ: {item.xyzCategory || 'X'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>لا توجد أصناف طبية مطابقة لخيارات البحث أو التصفية الحالية.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة الإضافة والتعديل التفاعلية (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 text-right" dir="rtl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                {editingItem ? `تعديل صنف: ${editingItem.name}` : 'إضافة صنف طبي جديد'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">كود الصنف (فريد)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingItem}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الفئة الطبية</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">اسم الصنف الطبي بالكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شاش معقم، ميتفورمين..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الكمية المتوفرة</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الاستهلاك الشهري</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formMonthlyConsumption}
                    onChange={(e) => setFormMonthlyConsumption(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">سعر الوحدة (ج.م)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الحد الأدنى للمخزون</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">تاريخ آخر توريد</label>
                  <input
                    type="date"
                    required
                    value={formLastSupply}
                    onChange={(e) => setFormLastSupply(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المورد الرئيسي للمستشفى</label>
                <input
                  type="text"
                  placeholder="مثال: الشركة العربية للأدوية..."
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة الآن'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
