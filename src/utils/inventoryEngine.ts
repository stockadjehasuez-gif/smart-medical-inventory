import { MedicalItem, InventoryAlert, ABCXYZAnalysisSummary } from '../types';

// بيانات تجريبية واقعية للمستشفى باللغة العربية
export const INITIAL_ITEMS: MedicalItem[] = [
  {
    id: 'MED-101',
    name: 'أنسولين سريع المفعول (قلم)',
    category: 'أدوية السكري',
    quantity: 120,
    monthlyConsumption: 240,
    unitPrice: 85,
    minThreshold: 150,
    supplier: 'الشركة العربية للأدوية والمستلزمات',
    lastSupplyDate: '2026-05-15',
    leadTimeDays: 10,
    safetyStock: 60,
    xyzCategory: 'X', // استهلاك مستقر جداً
  },
  {
    id: 'MED-102',
    name: 'أقراص ميتفورمين 500 ملغ',
    category: 'أدوية السكري',
    quantity: 1200,
    monthlyConsumption: 1000,
    unitPrice: 15,
    minThreshold: 800,
    supplier: 'شركة الخليج للصناعات الدوائية (جلفار)',
    lastSupplyDate: '2026-06-01',
    leadTimeDays: 7,
    safetyStock: 200,
    xyzCategory: 'X',
  },
  {
    id: 'MED-103',
    name: 'لقاح الإنفلونزا الموسمي',
    category: 'اللقاحات والأمصال',
    quantity: 450,
    monthlyConsumption: 300,
    unitPrice: 120,
    minThreshold: 100,
    supplier: 'شركة الأمصال واللقاحات العالمية',
    lastSupplyDate: '2026-05-20',
    leadTimeDays: 14,
    safetyStock: 50,
    xyzCategory: 'Y', // استهلاك موسمي / متغير
  },
  {
    id: 'SUR-201',
    name: 'خيوط جراحية نايلون 3-0 مع إبرة',
    category: 'المستلزمات الجراحية',
    quantity: 35,
    monthlyConsumption: 120,
    unitPrice: 45,
    minThreshold: 60,
    supplier: 'العربية للتجهيزات الطبية والجراحية',
    lastSupplyDate: '2026-04-10',
    leadTimeDays: 12,
    safetyStock: 25,
    xyzCategory: 'Y',
  },
  {
    id: 'SUR-202',
    name: 'شاش جراحي معقم 10*10 سم',
    category: 'المستلزمات الجراحية',
    quantity: 5000,
    monthlyConsumption: 4500,
    unitPrice: 1.5,
    minThreshold: 3000,
    supplier: 'مصنع الأقنعة والشاش الطبي الوطني',
    lastSupplyDate: '2026-06-10',
    leadTimeDays: 5,
    safetyStock: 800,
    xyzCategory: 'X',
  },
  {
    id: 'MED-301',
    name: 'مسكن آلام باراسيتامول 1غ (حقن)',
    category: 'المسكنات والتخدير',
    quantity: 900,
    monthlyConsumption: 1500,
    unitPrice: 28,
    minThreshold: 1000,
    supplier: 'الشركة العربية للأدوية والمستلزمات',
    lastSupplyDate: '2026-06-05',
    leadTimeDays: 8,
    safetyStock: 300,
    xyzCategory: 'X',
  },
  {
    id: 'MED-302',
    name: 'مخدر عام بروبوفول 10ملغ/مل',
    category: 'المسكنات والتخدير',
    quantity: 120,
    monthlyConsumption: 140,
    unitPrice: 190,
    minThreshold: 150,
    supplier: 'مورد التخدير ومستلزمات الرعاية المركزة',
    lastSupplyDate: '2026-05-18',
    leadTimeDays: 15,
    safetyStock: 40,
    xyzCategory: 'Y',
  },
  {
    id: 'DEV-401',
    name: 'جهاز قياس ضغط الدم الرقمي المحمول',
    category: 'الأجهزة الحيوية والتشخيص',
    quantity: 18,
    monthlyConsumption: 4,
    unitPrice: 350,
    minThreshold: 15,
    supplier: 'شركة تقنيات التشخيص المتقدمة',
    lastSupplyDate: '2026-02-12',
    leadTimeDays: 20,
    safetyStock: 5,
    xyzCategory: 'Z', // استهلاك غير منتظم
  },
  {
    id: 'DEV-402',
    name: 'شرائط قياس نسبة السكر في الدم',
    category: 'الأجهزة الحيوية والتشخيص',
    quantity: 2500,
    monthlyConsumption: 2000,
    unitPrice: 18,
    minThreshold: 1500,
    supplier: 'شركة تقنيات التشخيص المتقدمة',
    lastSupplyDate: '2026-06-02',
    leadTimeDays: 7,
    safetyStock: 400,
    xyzCategory: 'X',
  },
  {
    id: 'MED-501',
    name: 'مضاد حيوي سيفتركسون 1غ (حقن)',
    category: 'المضادات الحيوية',
    quantity: 1100,
    monthlyConsumption: 1200,
    unitPrice: 42,
    minThreshold: 900,
    supplier: 'الشركة العربية للأدوية والمستلزمات',
    lastSupplyDate: '2026-06-12',
    leadTimeDays: 6,
    safetyStock: 250,
    xyzCategory: 'X',
  },
  {
    id: 'MED-502',
    name: 'أقراص أموكسيسيلين 500 ملغ',
    category: 'المضادات الحيوية',
    quantity: 80,
    monthlyConsumption: 800,
    unitPrice: 22,
    minThreshold: 500,
    supplier: 'شركة الخليج للصناعات الدوائية (جلفار)',
    lastSupplyDate: '2026-05-02',
    leadTimeDays: 7,
    safetyStock: 150,
    xyzCategory: 'Y',
  },
  {
    id: 'CAR-601',
    name: 'أقراص أتورفاستاتين 20ملغ (كوليسترول)',
    category: 'أمراض القلب والشرايين',
    quantity: 1500,
    monthlyConsumption: 1200,
    unitPrice: 55,
    minThreshold: 1000,
    supplier: 'شركة نجد الطبية للمستحضرات',
    lastSupplyDate: '2026-05-25',
    leadTimeDays: 10,
    safetyStock: 250,
    xyzCategory: 'X',
  },
  {
    id: 'CAR-602',
    name: 'حقنة هيبارين لمنع التجلط 5000 وحدة',
    category: 'أمراض القلب والشرايين',
    quantity: 60,
    monthlyConsumption: 400,
    unitPrice: 70,
    minThreshold: 300,
    supplier: 'شركة نجد الطبية للمستحضرات',
    lastSupplyDate: '2026-05-30',
    leadTimeDays: 8,
    safetyStock: 100,
    xyzCategory: 'Y',
  },
  {
    id: 'DEV-701',
    name: 'مجسات قياس نسبة الأكسجين بالدم (Spo2)',
    category: 'الأجهزة الحيوية والتشخيص',
    quantity: 14,
    monthlyConsumption: 25,
    unitPrice: 480,
    minThreshold: 30,
    supplier: 'شركة تقنيات التشخيص المتقدمة',
    lastSupplyDate: '2026-03-15',
    leadTimeDays: 18,
    safetyStock: 8,
    xyzCategory: 'Z',
  },
  {
    id: 'MED-801',
    name: 'ترياق لدغات الأفاعي والعقارب',
    category: 'اللقاحات والأمصال',
    quantity: 12,
    monthlyConsumption: 2,
    unitPrice: 950,
    minThreshold: 10,
    supplier: 'شركة الأمصال واللقاحات العالمية',
    lastSupplyDate: '2025-11-20',
    leadTimeDays: 25,
    safetyStock: 5,
    xyzCategory: 'Z', // استهلاك نادر جداً وغير متوقع ولكن مرتفع الثمن
  },
  {
    id: 'DEV-802',
    name: 'مقياس حرارة غير تلامسي بالأشعة تحت الحمراء',
    category: 'الأجهزة الحيوية والتشخيص',
    quantity: 45,
    monthlyConsumption: 2,
    unitPrice: 180,
    minThreshold: 10,
    supplier: 'شركة تقنيات التشخيص المتقدمة',
    lastSupplyDate: '2025-12-05',
    leadTimeDays: 15,
    safetyStock: 4,
    xyzCategory: 'Z', // استهلاك منخفض جداً حالياً (راكد)
  }
];

// 1- حساب أيام التغطية (Days of Supply)
// الكمية الحالية ÷ متوسط الاستهلاك اليومي (الاستهلاك الشهري ÷ 30)
export function getDaysOfSupply(item: MedicalItem): number {
  if (item.monthlyConsumption <= 0) return 9999; // مخزون يغطي لفترة طويلة جداً
  const dailyConsumption = item.monthlyConsumption / 30;
  return Math.round(item.quantity / dailyConsumption);
}

// 2- حساب نقطة إعادة الطلب الذكية (Reorder Point - ROP)
// ROP = (متوسط الاستهلاك اليومي * فترة التوريد باليوم) + مخزون الأمان
export function getReorderPoint(item: MedicalItem): number {
  const dailyConsumption = item.monthlyConsumption / 30;
  return Math.round((dailyConsumption * item.leadTimeDays) + item.safetyStock);
}

// 3- تطبيق تحليل ABC
// باستخدام قيمة الاستهلاك السنوي (Annual Consumption Value)
// Annual Value = الاستهلاك الشهري * 12 * سعر الوحدة
export function runABCAnalysis(items: MedicalItem[]): MedicalItem[] {
  const itemsWithValues = items.map(item => {
    const annualConsumptionValue = item.monthlyConsumption * 12 * item.unitPrice;
    return { ...item, annualConsumptionValue };
  });

  // فرز تنازلي حسب القيمة الاستهلاكية السنوية
  itemsWithValues.sort((a, b) => b.annualConsumptionValue - a.annualConsumptionValue);

  const totalAnnualValue = itemsWithValues.reduce((sum, item) => sum + item.annualConsumptionValue, 0);

  let cumulativeValue = 0;
  return itemsWithValues.map(item => {
    cumulativeValue += item.annualConsumptionValue;
    const cumulativePercent = (cumulativeValue / (totalAnnualValue || 1)) * 100;

    let abcCategory: 'A' | 'B' | 'C' = 'C';
    if (cumulativePercent <= 72) {
      abcCategory = 'A'; // أعلى الأصناف قيمة وتأثيراً (~70%)
    } else if (cumulativePercent <= 92) {
      abcCategory = 'B'; // أصناف متوسطة الأهمية والقيمة (~20%)
    } else {
      abcCategory = 'C'; // أصناف منخفضة القيمة وتستهلك كميات كبيرة أو مبعثرة (~10%)
    }

    // إرجاع الصنف الأصلي مع التصنيف الجديد
    const { annualConsumptionValue: _, ...originalItem } = item;
    return {
      ...originalItem,
      abcCategory,
    };
  });
}

// 4- تطبيق تحليل XYZ بناءً على استقرار الطلب
// X: طلب مستقر جداً (معدل استهلاك شهري مرتفع أو محدد مسبقاً)
// Y: طلب متغير وموسمي
// Z: طلب متذبذب وغير متوقع
export function runXYZAnalysis(items: MedicalItem[]): MedicalItem[] {
  return items.map(item => {
    let xyzCategory: 'X' | 'Y' | 'Z' = 'X';
    if (item.xyzCategory) {
      xyzCategory = item.xyzCategory;
    } else {
      // حساب تصنيف افتراضي بناء على الفئات وتوصيف الأصناف
      if (item.category.includes('اللقاحات') || item.category.includes('موسمي')) {
        xyzCategory = 'Y';
      } else if (item.monthlyConsumption < 10 || item.category.includes('الأجهزة')) {
        xyzCategory = 'Z';
      } else {
        xyzCategory = 'X';
      }
    }
    return { ...item, xyzCategory };
  });
}

// دمج تحليل ABC و XYZ معاً
export function runFullInventoryAnalysis(items: MedicalItem[]): MedicalItem[] {
  const abcItems = runABCAnalysis(items);
  return runXYZAnalysis(abcItems);
}

// 5- حساب نسبة توفر المخزون (Inventory Availability Rate)
// نسبة الأصناف التي تزيد كميتها عن الحد الأدنى
export function getInventoryAvailabilityRate(items: MedicalItem[]): number {
  if (items.length === 0) return 0;
  const availableItems = items.filter(item => item.quantity > item.minThreshold).length;
  return Math.round((availableItems / items.length) * 100);
}

// حساب القيمة الإجمالية للمخزون الحالي
export function getTotalInventoryValue(items: MedicalItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
}

// تحديد الأصناف الحرجة
// 1. وصلت للحد الأدنى (الكمية <= الحد الأدنى)
// 2. ستنفد قريباً (أيام التغطية < 15 يوم)
export function getCriticalItems(items: MedicalItem[]): MedicalItem[] {
  return items.filter(item => {
    const days = getDaysOfSupply(item);
    return item.quantity <= item.minThreshold || days < 15;
  });
}

// تحديد الأصناف الراكدة
// الكمية مرتفعة جداً ومعدل الاستهلاك منخفض (أيام التغطية > 180 يوم والاستهلاك منخفض)
export function getStagnantItems(items: MedicalItem[]): MedicalItem[] {
  return items.filter(item => {
    const days = getDaysOfSupply(item);
    return days > 180 && item.monthlyConsumption <= 5;
  });
}

// توليد تنبيهات ذكية وتلقائية بناءً على البيانات الحالية للمخزون
export function generateSmartAlerts(items: MedicalItem[]): InventoryAlert[] {
  const alerts: InventoryAlert[] = [];
  let idCounter = 1;

  items.forEach(item => {
    const days = getDaysOfSupply(item);
    const rop = getReorderPoint(item);

    // 1- تنبيه حرج جداً: نفاد أو قرب نفاد المخزون تحت الحد الأدنى
    if (item.quantity === 0) {
      alerts.push({
        id: `ALT-${idCounter++}`,
        itemId: item.id,
        itemName: item.name,
        type: 'critical',
        message: `الصنف المذكور نفد بالكامل (0 وحدات). يرجى طلب توريد مستعجل جداً لتجنب توقف العمليات العلاجية.`,
        severity: 'high',
        date: new Date().toISOString().split('T')[0],
      });
    } else if (item.quantity < item.minThreshold) {
      alerts.push({
        id: `ALT-${idCounter++}`,
        itemId: item.id,
        itemName: item.name,
        type: 'critical',
        message: `مستوى المخزون الحالي (${item.quantity}) أقل من الحد الأدنى المسموح به (${item.minThreshold}). يغطي فقط لـ ${days} أيام.`,
        severity: 'high',
        date: new Date().toISOString().split('T')[0],
      });
    }

    // 2- تنبيه نقطة إعادة الطلب الذكية
    if (item.quantity > item.minThreshold && item.quantity <= rop) {
      alerts.push({
        id: `ALT-${idCounter++}`,
        itemId: item.id,
        itemName: item.name,
        type: 'reorder',
        message: `وصل المخزون لنقطة إعادة الطلب الذكية ROP (${rop} وحدات). فترة التوريد المتوقعة هي ${item.leadTimeDays} أيام.`,
        severity: 'medium',
        date: new Date().toISOString().split('T')[0],
      });
    }

    // 3- تنبيه الأصناف الراكدة
    if (days > 200 && item.monthlyConsumption <= 3 && item.quantity > 10) {
      alerts.push({
        id: `ALT-${idCounter++}`,
        itemId: item.id,
        itemName: item.name,
        type: 'stagnant',
        message: `صنف راكد ذو استهلاك ضئيل جداً (${item.monthlyConsumption} شهرياً). الكمية تكفي لـ ${days} يوم. يرجى تجنب طلبات توريد جديدة.`,
        severity: 'low',
        date: new Date().toISOString().split('T')[0],
      });
    }
  });

  return alerts;
}

// دالة محاكاة لتصدير البيانات إلى صيغة CSV
export function exportToCSV(items: MedicalItem[]): string {
  const headers = [
    'كود الصنف',
    'اسم الصنف',
    'الفئة',
    'الكمية الحالية',
    'معدل الاستهلاك الشهري',
    'سعر الوحدة',
    'الحد الأدنى للمخزون',
    'المورد',
    'تاريخ آخر توريد',
    'أيام التغطية',
    'نقطة إعادة الطلب',
    'تصنيف ABC',
    'تصنيف XYZ'
  ];

  const rows = items.map(item => [
    item.id,
    item.name,
    item.category,
    item.quantity,
    item.monthlyConsumption,
    item.unitPrice,
    item.minThreshold,
    item.supplier,
    item.lastSupplyDate,
    getDaysOfSupply(item),
    getReorderPoint(item),
    item.abcCategory || 'N/A',
    item.xyzCategory || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}

// دالة للتحقق من صحة تنسيق النموذج المستورد
export function validateCSVTemplate(text: string): { isValid: boolean; error?: string } {
  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) {
      return { isValid: false, error: 'الملف المرفق فارغ تماماً. يرجى اختيار ملف يحتوي على سطر الترويسة والبيانات.' };
    }
    if (lines.length < 2) {
      return { isValid: false, error: 'تنسيق غير كافٍ: يجب أن يحتوي الملف على سطر للترويسة (العناوين) وسطر واحد على الأقل من البيانات.' };
    }

    // قراءة العناوين وتطهيرها من علامات الاقتباس والمسافات
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    
    // التحقق من الأعمدة الأساسية اللازمة للتعريف والعمليات الرياضية
    const hasId = headers.some(h => h.includes('كود') || h.includes('id') || h.includes('الكود') || h.includes('رمز'));
    const hasName = headers.some(h => h.includes('اسم') || h.includes('name') || h.includes('الاسم'));
    const hasQuantity = headers.some(h => h.includes('كمية') || h.includes('quantity') || h.includes('الكمية'));
    const hasPrice = headers.some(h => h.includes('سعر') || h.includes('price') || h.includes('السعر'));

    if (!hasId) {
      return { isValid: false, error: 'فشل التحقق من التنسيق: لم يتم العثور على عمود يمثل "كود الصنف" أو "id" في السطر الأول للملف.' };
    }
    if (!hasName) {
      return { isValid: false, error: 'فشل التحقق من التنسيق: لم يتم العثور على عمود يمثل "اسم الصنف" أو "name" في السطر الأول للملف.' };
    }
    if (!hasQuantity) {
      return { isValid: false, error: 'فشل التحقق من التنسيق: لم يتم العثور على عمود يمثل "الكمية الحالية" أو "quantity" لضبط الحسابات الرياضية.' };
    }
    if (!hasPrice) {
      return { isValid: false, error: 'فشل التحقق من التنسيق: لم يتم العثور على عمود يمثل "سعر الوحدة" أو "price" لضبط التقييم الاقتصادي للمخزون.' };
    }

    return { isValid: true };
  } catch (err) {
    return { isValid: false, error: 'حدث خطأ غير متوقع أثناء معالجة وفحص بنية الملف. تأكد من سلامة صياغته كملف CSV.' };
  }
}

// دالة محاكاة لاستيراد البيانات من ملف CSV
export function parseCSV(text: string): Partial<MedicalItem>[] {
  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) return [];

    // محاولة التعرف على ترتيب الأعمدة بناء على السطر الأول
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    
    const parsedItems: Partial<MedicalItem>[] = [];

    for (let i = 1; i < lines.length; i++) {
      // تقسيم السطر مع مراعاة علامات الاقتباس للقيم التي تحتوي على فواصل
      const row: string[] = [];
      let insideQuote = false;
      let currentVal = '';
      
      const charArray = lines[i].split('');
      for (let j = 0; j < charArray.length; j++) {
        const char = charArray[j];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          row.push(currentVal.trim());
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      row.push(currentVal.trim());

      if (row.length < 4) continue;

      // إنشاء عنصر جزئي
      const item: Partial<MedicalItem> = {
        id: row[0] || `MED-${Math.floor(100 + Math.random() * 900)}`,
        name: row[1] || 'صنف طبي غير مسمى',
        category: row[2] || 'عام',
        quantity: isNaN(Number(row[3])) ? 0 : Number(row[3]),
        monthlyConsumption: isNaN(Number(row[4])) ? 50 : Number(row[4]),
        unitPrice: isNaN(Number(row[5])) ? 10 : Number(row[5]),
        minThreshold: isNaN(Number(row[6])) ? 30 : Number(row[6]),
        supplier: row[7] || 'مورد عام',
        lastSupplyDate: row[8] || new Date().toISOString().split('T')[0],
        leadTimeDays: 10,
        safetyStock: Math.round((isNaN(Number(row[6])) ? 30 : Number(row[6])) * 0.4),
      };

      parsedItems.push(item);
    }
    return parsedItems;
  } catch (error) {
    console.error('Error parsing CSV', error);
    return [];
  }
}
