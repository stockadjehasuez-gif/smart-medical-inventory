import { MedicalItem, InventoryAlert, ABCXYZAnalysisSummary } from '../types';

// بيانات تجريبية واقعية للمستشفى باللغة العربية
export const INITIAL_ITEMS: MedicalItem[] = [
  // 1. أدوية السكري
  { id: 'DIA-101', name: 'أنسولين سريع المفعول NovoRapid (قلم)', category: 'أدوية السكري', quantity: 180, monthlyConsumption: 240, unitPrice: 85, minThreshold: 150, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-15', leadTimeDays: 10, safetyStock: 60, xyzCategory: 'X' },
  { id: 'DIA-102', name: 'أقراص ميتفورمين Glucophage 500 ملغ', category: 'أدوية السكري', quantity: 1200, monthlyConsumption: 1000, unitPrice: 15, minThreshold: 800, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-06-01', leadTimeDays: 7, safetyStock: 200, xyzCategory: 'X' },
  { id: 'DIA-103', name: 'أنسولين طويل المفعول Lantus (قلم)', category: 'أدوية السكري', quantity: 140, monthlyConsumption: 190, unitPrice: 110, minThreshold: 100, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-12', leadTimeDays: 9, safetyStock: 50, xyzCategory: 'X' },
  { id: 'DIA-104', name: 'أقراص جليبنكلاميد Daonil 5 ملغ', category: 'أدوية السكري', quantity: 600, monthlyConsumption: 500, unitPrice: 18, minThreshold: 400, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-20', leadTimeDays: 8, safetyStock: 100, xyzCategory: 'X' },
  { id: 'DIA-105', name: 'شرائط قياس نسبة السكر Accu-Chek', category: 'أدوية السكري', quantity: 2500, monthlyConsumption: 2000, unitPrice: 18, minThreshold: 1500, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-06-02', leadTimeDays: 7, safetyStock: 400, xyzCategory: 'X' },

  // 2. اللقاحات والأمصال
  { id: 'VAC-201', name: 'لقاح الإنفلونزا الموسمي Vaxigrip', category: 'اللقاحات والأمصال', quantity: 450, monthlyConsumption: 300, unitPrice: 120, minThreshold: 100, supplier: 'شركة الأمصال واللقاحات العالمية', lastSupplyDate: '2026-05-20', leadTimeDays: 14, safetyStock: 50, xyzCategory: 'Y' },
  { id: 'VAC-202', name: 'ترياق لدغات الأفاعي والعقارب المشترك', category: 'اللقاحات والأمصال', quantity: 22, monthlyConsumption: 5, unitPrice: 950, minThreshold: 15, supplier: 'شركة الأمصال واللقاحات العالمية', lastSupplyDate: '2025-11-20', leadTimeDays: 25, safetyStock: 5, xyzCategory: 'Z' },
  { id: 'VAC-203', name: 'لقاح التهاب الكبد الوبائي ب (للبالغين)', category: 'اللقاحات والأمصال', quantity: 180, monthlyConsumption: 120, unitPrice: 75, minThreshold: 80, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-04-18', leadTimeDays: 15, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'VAC-204', name: 'لقاح داء الكلب المعقم الرابيس', category: 'اللقاحات والأمصال', quantity: 35, monthlyConsumption: 10, unitPrice: 320, minThreshold: 15, supplier: 'شركة الأمصال واللقاحات العالمية', lastSupplyDate: '2026-03-10', leadTimeDays: 20, safetyStock: 8, xyzCategory: 'Z' },
  { id: 'VAC-205', name: 'لقاح شلل الأطفال الفموي OPV', category: 'اللقاحات والأمصال', quantity: 800, monthlyConsumption: 600, unitPrice: 45, minThreshold: 500, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-25', leadTimeDays: 10, safetyStock: 150, xyzCategory: 'X' },

  // 3. المستلزمات الجراحية
  { id: 'SUR-301', name: 'خيوط جراحية نايلون 3-0 مع إبرة دائرية', category: 'المستلزمات الجراحية', quantity: 85, monthlyConsumption: 150, unitPrice: 45, minThreshold: 100, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-04-10', leadTimeDays: 12, safetyStock: 25, xyzCategory: 'Y' },
  { id: 'SUR-302', name: 'شاش جراحي معقم 10*10 سم (صندوق 100)', category: 'المستلزمات الجراحية', quantity: 450, monthlyConsumption: 600, unitPrice: 85, minThreshold: 300, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-06-10', leadTimeDays: 5, safetyStock: 80, xyzCategory: 'X' },
  { id: 'SUR-303', name: 'خيوط جراحية معقمة حرير Silk 2-0', category: 'المستلزمات الجراحية', quantity: 120, monthlyConsumption: 180, unitPrice: 50, minThreshold: 80, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-15', leadTimeDays: 10, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'SUR-304', name: 'خيوط جراحية قابلة للامتصاص Vicryl 1-0', category: 'المستلزمات الجراحية', quantity: 65, monthlyConsumption: 110, unitPrice: 95, minThreshold: 50, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-02', leadTimeDays: 14, safetyStock: 20, xyzCategory: 'Y' },
  { id: 'SUR-305', name: 'شريط جراحي لاصق مضاد للماء 5 سم', category: 'المستلزمات الجراحية', quantity: 380, monthlyConsumption: 300, unitPrice: 12, minThreshold: 150, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-22', leadTimeDays: 6, safetyStock: 50, xyzCategory: 'X' },
  { id: 'SUR-306', name: 'مشرط جراحي ذو استخدام واحد مقاس 11', category: 'المستلزمات الجراحية', quantity: 140, monthlyConsumption: 250, unitPrice: 8, minThreshold: 100, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-04-30', leadTimeDays: 10, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'SUR-307', name: 'مشرط جراحي ذو استخدام واحد مقاس 15', category: 'المستلزمات الجراحية', quantity: 180, monthlyConsumption: 220, unitPrice: 8, minThreshold: 100, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-05', leadTimeDays: 10, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'SUR-308', name: 'ملاقط جراحية معقمة أحادية الاستخدام', category: 'المستلزمات الجراحية', quantity: 95, monthlyConsumption: 80, unitPrice: 24, minThreshold: 50, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-18', leadTimeDays: 12, safetyStock: 15, xyzCategory: 'Z' },
  { id: 'SUR-309', name: 'شاش فازلين معقم لحالات الحروق 10*10 سم', category: 'المستلزمات الجراحية', quantity: 240, monthlyConsumption: 180, unitPrice: 35, minThreshold: 100, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-06-03', leadTimeDays: 7, safetyStock: 40, xyzCategory: 'X' },
  { id: 'SUR-310', name: 'دباسة جروح جلدية معقمة للاستخدام لمرة واحدة', category: 'المستلزمات الجراحية', quantity: 55, monthlyConsumption: 70, unitPrice: 110, minThreshold: 30, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-04-12', leadTimeDays: 15, safetyStock: 10, xyzCategory: 'Y' },

  // 4. المسكنات والتخدير
  { id: 'ANA-401', name: 'مسكن آلام باراسيتامول 1غ (حقن وريدي)', category: 'المسكنات والتخدير', quantity: 950, monthlyConsumption: 1500, unitPrice: 28, minThreshold: 1000, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-05', leadTimeDays: 8, safetyStock: 300, xyzCategory: 'X' },
  { id: 'ANA-402', name: 'مخدر عام بروبوفول Propofol 10 ملغ/مل', category: 'المسكنات والتخدير', quantity: 110, monthlyConsumption: 140, unitPrice: 190, minThreshold: 120, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-05-18', leadTimeDays: 15, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'ANA-403', name: 'مسكن ترامادول هيدروكلوريد 50 ملغ (حقن)', category: 'المسكنات والتخدير', quantity: 380, monthlyConsumption: 400, unitPrice: 12, minThreshold: 200, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-25', leadTimeDays: 10, safetyStock: 80, xyzCategory: 'X' },
  { id: 'ANA-404', name: 'أقراص باراسيتامول Panadol 500 ملغ (علبة)', category: 'المسكنات والتخدير', quantity: 4500, monthlyConsumption: 5000, unitPrice: 6, minThreshold: 3000, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-12', leadTimeDays: 5, safetyStock: 800, xyzCategory: 'X' },
  { id: 'ANA-405', name: 'مخدر موضعي ليدوكائين زيلوكائين 2% (حقن)', category: 'المسكنات والتخدير', quantity: 280, monthlyConsumption: 350, unitPrice: 32, minThreshold: 200, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-05-28', leadTimeDays: 9, safetyStock: 60, xyzCategory: 'X' },
  { id: 'ANA-406', name: 'حقن ديكلوفيناك الصوديوم Voltaren 75 ملغ', category: 'المسكنات والتخدير', quantity: 1400, monthlyConsumption: 1800, unitPrice: 14, minThreshold: 1000, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-06-08', leadTimeDays: 6, safetyStock: 300, xyzCategory: 'X' },
  { id: 'ANA-407', name: 'فنتانيل مخدر مركزي 0.1 ملغ (حقن)', category: 'المسكنات والتخدير', quantity: 190, monthlyConsumption: 150, unitPrice: 45, minThreshold: 100, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-04-20', leadTimeDays: 14, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'ANA-408', name: 'حقن كيتامين هيدروكلوريد 50 ملغ/مل', category: 'المسكنات والتخدير', quantity: 75, monthlyConsumption: 90, unitPrice: 125, minThreshold: 50, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-05-02', leadTimeDays: 12, safetyStock: 20, xyzCategory: 'Y' },
  { id: 'ANA-409', name: 'أقراص إيبوبروفين Brufen 400 ملغ', category: 'المسكنات والتخدير', quantity: 2200, monthlyConsumption: 1500, unitPrice: 10, minThreshold: 1000, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-30', leadTimeDays: 7, safetyStock: 300, xyzCategory: 'X' },
  { id: 'ANA-410', name: 'حقن نالكسون هيدروكلوريد (ترياق مورفين)', category: 'المسكنات والتخدير', quantity: 45, monthlyConsumption: 15, unitPrice: 185, minThreshold: 20, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-03-15', leadTimeDays: 18, safetyStock: 5, xyzCategory: 'Z' },

  // 5. الأجهزة الحيوية والتشخيص
  { id: 'DEV-501', name: 'جهاز قياس ضغط الدم الرقمي المحمول Omron', category: 'الأجهزة الحيوية والتشخيص', quantity: 18, monthlyConsumption: 4, unitPrice: 350, minThreshold: 15, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-02-12', leadTimeDays: 20, safetyStock: 5, xyzCategory: 'Z' },
  { id: 'DEV-502', name: 'مجسات قياس نسبة الأكسجين بالدم Spo2 للأطفال', category: 'الأجهزة الحيوية والتشخيص', quantity: 14, monthlyConsumption: 25, unitPrice: 480, minThreshold: 30, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-03-15', leadTimeDays: 18, safetyStock: 8, xyzCategory: 'Z' },
  { id: 'DEV-503', name: 'مقياس حرارة غير تلامسي بالأشعة تحت الحمراء', category: 'الأجهزة الحيوية والتشخيص', quantity: 45, monthlyConsumption: 12, unitPrice: 180, minThreshold: 15, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2025-12-05', leadTimeDays: 15, safetyStock: 4, xyzCategory: 'Z' },
  { id: 'DEV-504', name: 'جهاز تخطيط القلب الكهربائي ECG ثلاثي القنوات', category: 'الأجهزة الحيوية والتشخيص', quantity: 5, monthlyConsumption: 1, unitPrice: 4500, minThreshold: 3, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2025-10-10', leadTimeDays: 30, safetyStock: 1, xyzCategory: 'Z' },
  { id: 'DEV-505', name: 'رول ورق تخطيط القلب الحراري ECG', category: 'الأجهزة الحيوية والتشخيص', quantity: 320, monthlyConsumption: 150, unitPrice: 22, minThreshold: 100, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-18', leadTimeDays: 8, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'DEV-506', name: 'جهاز استنشاق رذاذ منزلي للأطفال Nebulizer', category: 'الأجهزة الحيوية والتشخيص', quantity: 40, monthlyConsumption: 15, unitPrice: 260, minThreshold: 20, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2026-04-05', leadTimeDays: 14, safetyStock: 5, xyzCategory: 'Z' },
  { id: 'DEV-507', name: 'أجهزة قياس الحرارة الرقمية الطبية عن طريق الأذن', category: 'الأجهزة الحيوية والتشخيص', quantity: 85, monthlyConsumption: 30, unitPrice: 195, minThreshold: 40, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-02', leadTimeDays: 12, safetyStock: 10, xyzCategory: 'Y' },
  { id: 'DEV-508', name: 'ميزان قياس نسبة الهيموغلوبين المحمول HemoCue', category: 'الأجهزة الحيوية والتشخيص', quantity: 8, monthlyConsumption: 2, unitPrice: 2400, minThreshold: 4, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2025-08-15', leadTimeDays: 25, safetyStock: 1, xyzCategory: 'Z' },
  { id: 'DEV-509', name: 'شرائط قياس الهيموغلوبين بالدم HemoCue Microcuvettes', category: 'الأجهزة الحيوية والتشخيص', quantity: 450, monthlyConsumption: 300, unitPrice: 14, minThreshold: 200, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-06-03', leadTimeDays: 10, safetyStock: 50, xyzCategory: 'X' },
  { id: 'DEV-510', name: 'جهاز قياس ضغط الدم الزئبقي السريري الكلاسيكي', category: 'الأجهزة الحيوية والتشخيص', quantity: 24, monthlyConsumption: 5, unitPrice: 420, minThreshold: 15, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2025-11-20', leadTimeDays: 20, safetyStock: 3, xyzCategory: 'Z' },

  // 6. المضادات الحيوية
  { id: 'ANT-601', name: 'مضاد حيوي سيفتركسون Ceftriaxone 1غ (حقن)', category: 'المضادات الحيوية', quantity: 1100, monthlyConsumption: 1200, unitPrice: 42, minThreshold: 900, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-12', leadTimeDays: 6, safetyStock: 250, xyzCategory: 'X' },
  { id: 'ANT-602', name: 'أقراص أموكسيسيلين Amoxil 500 ملغ', category: 'المضادات الحيوية', quantity: 120, monthlyConsumption: 800, unitPrice: 22, minThreshold: 500, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-02', leadTimeDays: 7, safetyStock: 150, xyzCategory: 'Y' },
  { id: 'ANT-603', name: 'شراب أموكسيسيلين كلافولانات Augmentin 228 ملغ', category: 'المضادات الحيوية', quantity: 380, monthlyConsumption: 450, unitPrice: 48, minThreshold: 300, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-28', leadTimeDays: 8, safetyStock: 100, xyzCategory: 'Y' },
  { id: 'ANT-604', name: 'حقن فانكومايسين Vancomycin 500 ملغ وريدي', category: 'المضادات الحيوية', quantity: 240, monthlyConsumption: 180, unitPrice: 85, minThreshold: 120, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-15', leadTimeDays: 12, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'ANT-605', name: 'أقراص سيبروفلوكساسين Cipro 500 ملغ', category: 'المضادات الحيوية', quantity: 950, monthlyConsumption: 800, unitPrice: 35, minThreshold: 600, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-06-03', leadTimeDays: 8, safetyStock: 150, xyzCategory: 'X' },
  { id: 'ANT-606', name: 'أقراص سيفالكسين Cephalar 500 ملغ', category: 'المضادات الحيوية', quantity: 1400, monthlyConsumption: 1100, unitPrice: 24, minThreshold: 800, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-22', leadTimeDays: 9, safetyStock: 200, xyzCategory: 'X' },
  { id: 'ANT-607', name: 'مراهم جينتاميسين عينية 0.3% (Gentamicin)', category: 'المضادات الحيوية', quantity: 450, monthlyConsumption: 300, unitPrice: 12, minThreshold: 200, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-10', leadTimeDays: 7, safetyStock: 50, xyzCategory: 'X' },
  { id: 'ANT-608', name: 'حقن ميروبينيم Meronem 1 غرام وريدي', category: 'المضادات الحيوية', quantity: 180, monthlyConsumption: 150, unitPrice: 240, minThreshold: 100, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-12', leadTimeDays: 14, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'ANT-609', name: 'حقن لينيزوليد Linezolid 600 ملغ وريدي', category: 'المضادات الحيوية', quantity: 95, monthlyConsumption: 70, unitPrice: 310, minThreshold: 50, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-04-28', leadTimeDays: 15, safetyStock: 20, xyzCategory: 'Y' },
  { id: 'ANT-610', name: 'أقراص أزيثرومايسين Azithromycin 250 ملغ', category: 'المضادات الحيوية', quantity: 650, monthlyConsumption: 500, unitPrice: 40, minThreshold: 300, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-14', leadTimeDays: 8, safetyStock: 100, xyzCategory: 'Y' },

  // 7. أمراض القلب والشرايين
  { id: 'CAR-701', name: 'أقراص أتورفاستاتين Lipitor 20 ملغ (كوليسترول)', category: 'أمراض القلب والشرايين', quantity: 1500, monthlyConsumption: 1200, unitPrice: 55, minThreshold: 1000, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-25', leadTimeDays: 10, safetyStock: 250, xyzCategory: 'X' },
  { id: 'CAR-702', name: 'حقنة هيبارين Heparin لمنع التجلط 5000 وحدة', category: 'أمراض القلب والشرايين', quantity: 60, monthlyConsumption: 400, unitPrice: 70, minThreshold: 300, supplier: 'شركة نجد الطّمية للمستحضرات', lastSupplyDate: '2026-05-30', leadTimeDays: 8, safetyStock: 100, xyzCategory: 'Y' },
  { id: 'CAR-703', name: 'أقراص أملوديبين Norvasc 5 ملغ لضغط الدم', category: 'أمراض القلب والشرايين', quantity: 1800, monthlyConsumption: 1500, unitPrice: 28, minThreshold: 1200, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-03', leadTimeDays: 7, safetyStock: 300, xyzCategory: 'X' },
  { id: 'CAR-704', name: 'أقراص ليزينوبريل Zestril 10 ملغ لضغط الدم', category: 'أمراض القلب والشرايين', quantity: 1400, monthlyConsumption: 1200, unitPrice: 32, minThreshold: 1000, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-24', leadTimeDays: 9, safetyStock: 200, xyzCategory: 'X' },
  { id: 'CAR-705', name: 'أقراص أسبرين حماية قلبيّة Aspirin 81 ملغ', category: 'أمراض القلب والشرايين', quantity: 5000, monthlyConsumption: 4000, unitPrice: 3, minThreshold: 3000, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-08', leadTimeDays: 5, safetyStock: 800, xyzCategory: 'X' },
  { id: 'CAR-706', name: 'حقن أدرينالين إبينفرين 1 ملغ (حالات الإنعاش)', category: 'أمراض القلب والشرايين', quantity: 680, monthlyConsumption: 500, unitPrice: 15, minThreshold: 400, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-06-10', leadTimeDays: 6, safetyStock: 100, xyzCategory: 'X' },
  { id: 'CAR-707', name: 'أقراص كلوبيدوجريل Plavix 75 ملغ (مسيل دم)', category: 'أمراض القلب والشرايين', quantity: 950, monthlyConsumption: 800, unitPrice: 125, minThreshold: 600, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-18', leadTimeDays: 11, safetyStock: 150, xyzCategory: 'X' },
  { id: 'CAR-708', name: 'حبوب دdigoxin لانقباض القلب Lanoxin 0.25 ملغ', category: 'أمراض القلب والشرايين', quantity: 450, monthlyConsumption: 300, unitPrice: 18, minThreshold: 200, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-15', leadTimeDays: 10, safetyStock: 50, xyzCategory: 'X' },
  { id: 'CAR-709', name: 'أمبولات نتروجليسرين وريدي 50 ملغ/10 مل', category: 'أمراض القلب والشرايين', quantity: 120, monthlyConsumption: 90, unitPrice: 160, minThreshold: 60, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-04-12', leadTimeDays: 12, safetyStock: 20, xyzCategory: 'Y' },
  { id: 'CAR-710', name: 'حقن تينيكتيبلاز Metalyse 50 ملغ (مذيب جلطة)', category: 'أمراض القلب والشرايين', quantity: 12, monthlyConsumption: 8, unitPrice: 6500, minThreshold: 5, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2026-03-01', leadTimeDays: 20, safetyStock: 2, xyzCategory: 'Z' },

  // 8. المستهلكات الطبية العامة (كانيولا، سرنجات، جونز، جوانتي، كمامات، مساحيق كحولية)
  { id: 'GEN-801', name: 'إبرة كانيولا وريدية مقاس 20G (اللون الوردي)', category: 'المستهلكات الطبية العامة', quantity: 150, monthlyConsumption: 1200, unitPrice: 4.5, minThreshold: 800, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-10', leadTimeDays: 8, safetyStock: 200, xyzCategory: 'X' },
  { id: 'GEN-802', name: 'إبرة كانيولا وريدية مقاس 22G (اللون الأزرق)', category: 'المستهلكات الطبية العامة', quantity: 1800, monthlyConsumption: 1500, unitPrice: 4.5, minThreshold: 1000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-15', leadTimeDays: 8, safetyStock: 250, xyzCategory: 'X' },
  { id: 'GEN-803', name: 'حقنة سرنجة معقمة بمكبس سعة 3 مل', category: 'المستهلكات الطبية العامة', quantity: 800, monthlyConsumption: 4000, unitPrice: 1.2, minThreshold: 3000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-10', leadTimeDays: 7, safetyStock: 800, xyzCategory: 'X' },
  { id: 'GEN-804', name: 'حقنة سرنجة معقمة بمكبس سعة 5 مل', category: 'المستهلكات الطبية العامة', quantity: 4500, monthlyConsumption: 4500, unitPrice: 1.5, minThreshold: 3000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-03', leadTimeDays: 7, safetyStock: 800, xyzCategory: 'X' },
  { id: 'GEN-805', name: 'حقنة سرنجة معقمة بمكبس سعة 10 مل', category: 'المستهلكات الطبية العامة', quantity: 3200, monthlyConsumption: 3000, unitPrice: 2.2, minThreshold: 2000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-01', leadTimeDays: 7, safetyStock: 500, xyzCategory: 'X' },
  { id: 'GEN-806', name: 'قفازات فحص طبية لاتكس غير معقمة مقاس S', category: 'المستهلكات الطبية العامة', quantity: 1500, monthlyConsumption: 2000, unitPrice: 24, minThreshold: 1200, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-18', leadTimeDays: 6, safetyStock: 300, xyzCategory: 'X' },
  { id: 'GEN-807', name: 'قفازات فحص طبية لاتكس غير معقمة مقاس M', category: 'المستهلكات الطبية العامة', quantity: 2800, monthlyConsumption: 3000, unitPrice: 24, minThreshold: 1800, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-20', leadTimeDays: 6, safetyStock: 400, xyzCategory: 'X' },
  { id: 'GEN-808', name: 'قفازات فحص طبية لاتكس غير معقمة مقاس L', category: 'المستهلكات الطبية العامة', quantity: 3200, monthlyConsumption: 2500, unitPrice: 24, minThreshold: 1500, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-22', leadTimeDays: 6, safetyStock: 400, xyzCategory: 'X' },
  { id: 'GEN-809', name: 'قفازات جراحية معقمة حرّة البودرة مقاس 7.5', category: 'المستهلكات الطبية العامة', quantity: 650, monthlyConsumption: 800, unitPrice: 85, minThreshold: 500, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-28', leadTimeDays: 10, safetyStock: 150, xyzCategory: 'X' },
  { id: 'GEN-810', name: 'قفازات جراحية معقمة حرّة البودرة مقاس 8.0', category: 'المستهلكات الطبية العامة', quantity: 580, monthlyConsumption: 800, unitPrice: 85, minThreshold: 500, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-29', leadTimeDays: 10, safetyStock: 150, xyzCategory: 'X' },
  { id: 'GEN-811', name: 'كمامات طبية وقائية 3 طبقات برباط مطاطي', category: 'المستهلكات الطبية العامة', quantity: 18000, monthlyConsumption: 15000, unitPrice: 0.4, minThreshold: 10000, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-06-05', leadTimeDays: 5, safetyStock: 2000, xyzCategory: 'X' },
  { id: 'GEN-812', name: 'كمامات تنفس عالية الحماية والفلترة N95', category: 'المستهلكات الطبية العامة', quantity: 4500, monthlyConsumption: 3000, unitPrice: 6.5, minThreshold: 2000, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-18', leadTimeDays: 7, safetyStock: 500, xyzCategory: 'Y' },
  { id: 'GEN-813', name: 'مسحات كحولية طبية معقمة Isopropyl 70%', category: 'المستهلكات الطبية العامة', quantity: 24000, monthlyConsumption: 20000, unitPrice: 0.15, minThreshold: 15000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-04', leadTimeDays: 5, safetyStock: 3000, xyzCategory: 'X' },
  { id: 'GEN-814', name: 'رداء جراحي معقم ذو استخدام واحد Gown (صندوق)', category: 'المستهلكات الطبية العامة', quantity: 180, monthlyConsumption: 350, unitPrice: 185, minThreshold: 250, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-05-10', leadTimeDays: 10, safetyStock: 50, xyzCategory: 'Y' },
  { id: 'GEN-815', name: 'بدلة عزل طبية كاملة واقية للمختبرات PPE', category: 'المستهلكات الطبية العامة', quantity: 95, monthlyConsumption: 150, unitPrice: 220, minThreshold: 100, supplier: 'العربية للتجهيزات الطبية والجراحية', lastSupplyDate: '2026-04-18', leadTimeDays: 12, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'GEN-816', name: 'شاش طبي غير معقم 5*5 سم (صندوق 100)', category: 'المستهلكات الطبية العامة', quantity: 450, monthlyConsumption: 300, unitPrice: 18, minThreshold: 200, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-25', leadTimeDays: 6, safetyStock: 50, xyzCategory: 'X' },
  { id: 'GEN-817', name: 'شريط طبي ورقي لاصق هيبو-آليرجيك 2.5 سم', category: 'المستهلكات الطبية العامة', quantity: 650, monthlyConsumption: 500, unitPrice: 8, minThreshold: 300, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-06-02', leadTimeDays: 6, safetyStock: 80, xyzCategory: 'X' },
  { id: 'GEN-818', name: 'غطاء رأس جراحي غير منسوج (أزرق - صندوق)', category: 'المستهلكات الطبية العامة', quantity: 380, monthlyConsumption: 400, unitPrice: 35, minThreshold: 200, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-14', leadTimeDays: 8, safetyStock: 50, xyzCategory: 'X' },
  { id: 'GEN-819', name: 'أغطية أحذية طبية واقية (صندوق 100 حبة)', category: 'المستهلكات الطبية العامة', quantity: 420, monthlyConsumption: 500, unitPrice: 28, minThreshold: 300, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-15', leadTimeDays: 8, safetyStock: 50, xyzCategory: 'X' },
  { id: 'GEN-820', name: 'لاصق جروح طبي مبطن صغير (علبة 100 لاصق)', category: 'المستهلكات الطبية العامة', quantity: 850, monthlyConsumption: 600, unitPrice: 12, minThreshold: 400, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-18', leadTimeDays: 7, safetyStock: 100, xyzCategory: 'X' },

  // 9. مستلزمات الرعاية المركزة والطوارئ
  { id: 'ICU-901', name: 'قسطرة بولية سيليكون معقمة مقاس 16Fr', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 95, monthlyConsumption: 180, unitPrice: 42, minThreshold: 120, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-02', leadTimeDays: 11, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'ICU-902', name: 'قسطرة بولية سيليكون معقمة مقاس 14Fr', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 110, monthlyConsumption: 160, unitPrice: 42, minThreshold: 100, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-03', leadTimeDays: 11, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'ICU-903', name: 'أنبوب تنفس رغامي ذو بالون Endotracheal 7.5', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 45, monthlyConsumption: 120, unitPrice: 65, minThreshold: 80, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-04-10', leadTimeDays: 12, safetyStock: 25, xyzCategory: 'Y' },
  { id: 'ICU-904', name: 'أنبوب تنفس رغامي ذو بالون Endotracheal 8.0', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 50, monthlyConsumption: 110, unitPrice: 65, minThreshold: 70, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-04-12', leadTimeDays: 12, safetyStock: 25, xyzCategory: 'Y' },
  { id: 'ICU-905', name: 'أنبوب تغذية أنفي معدي سيليكون 16Fr (Levin)', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 80, monthlyConsumption: 140, unitPrice: 28, minThreshold: 100, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-18', leadTimeDays: 10, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'ICU-906', name: 'أكياس جمع البول المعقمة سعة 2 لتر مع صمام', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 850, monthlyConsumption: 1200, unitPrice: 6, minThreshold: 800, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-01', leadTimeDays: 7, safetyStock: 200, xyzCategory: 'X' },
  { id: 'ICU-907', name: 'مرشح تصفية هواء لمرضى الرعاية المركزة HME Filter', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 190, monthlyConsumption: 240, unitPrice: 38, minThreshold: 150, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-05-15', leadTimeDays: 10, safetyStock: 45, xyzCategory: 'Y' },
  { id: 'ICU-908', name: 'وعاء تجميع حاد للتخلص من الإبر مستهلكة (3 لتر)', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 320, monthlyConsumption: 200, unitPrice: 24, minThreshold: 150, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-19', leadTimeDays: 8, safetyStock: 40, xyzCategory: 'X' },
  { id: 'ICU-909', name: 'حقيبة إسعافات أولية متكاملة للطوارئ الميدانية', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 15, monthlyConsumption: 5, unitPrice: 450, minThreshold: 10, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2025-12-10', leadTimeDays: 15, safetyStock: 3, xyzCategory: 'Z' },
  { id: 'ICU-910', name: 'هلام تشحيم طبي معقم K-Y Gel (أنبوب 82 غرام)', category: 'مستلزمات الرعاية المركزة والطوارئ', quantity: 480, monthlyConsumption: 400, unitPrice: 15, minThreshold: 300, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-22', leadTimeDays: 7, safetyStock: 80, xyzCategory: 'X' },

  // 10. المحاليل الوريدية والغذائية
  { id: 'SOL-001', name: 'محلول ملحي طبيعي Sodium Chloride 0.9% (500مل)', category: 'المحاليل الوريدية والغذائية', quantity: 40, monthlyConsumption: 5000, unitPrice: 8.5, minThreshold: 3500, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-20', leadTimeDays: 5, safetyStock: 1000, xyzCategory: 'X' },
  { id: 'SOL-002', name: 'محلول جلوكوز سكري Dextrose 5% (500 مل)', category: 'المحاليل الوريدية والغذائية', quantity: 3800, monthlyConsumption: 4000, unitPrice: 9, minThreshold: 2500, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-25', leadTimeDays: 5, safetyStock: 800, xyzCategory: 'X' },
  { id: 'SOL-003', name: 'محلول مغذي رينجر لاكتات Ringer Lactate (500مل)', category: 'المحاليل الوريدية والغذائية', quantity: 2400, monthlyConsumption: 3000, unitPrice: 11, minThreshold: 2000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-01', leadTimeDays: 5, safetyStock: 600, xyzCategory: 'X' },
  { id: 'SOL-004', name: 'جهاز إعطاء محاليل وريدية IV Set مع منظم تدفق', category: 'المحاليل الوريدية والغذائية', quantity: 20, monthlyConsumption: 4500, unitPrice: 2.8, minThreshold: 3000, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-18', leadTimeDays: 6, safetyStock: 800, xyzCategory: 'X' },
  { id: 'SOL-005', name: 'محلول بديل البلازما هيدروكسي إيثيل النشا 6%', category: 'المحاليل الوريدية والغذائية', quantity: 180, monthlyConsumption: 120, unitPrice: 140, minThreshold: 80, supplier: 'مورد التخدير ومستلزمات الرعاية المركزة', lastSupplyDate: '2026-04-12', leadTimeDays: 14, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'SOL-006', name: 'محلول معقم بيتادين لتطهير الجروح 10% (1 لتر)', category: 'المحاليل الوريدية والغذائية', quantity: 220, monthlyConsumption: 150, unitPrice: 95, minThreshold: 100, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-24', leadTimeDays: 8, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'SOL-007', name: 'محلول تنظيف اليدين الكحولي المعقم (عبوة 500 مل)', category: 'المحاليل الوريدية والغذائية', quantity: 950, monthlyConsumption: 800, unitPrice: 18, minThreshold: 500, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-03', leadTimeDays: 6, safetyStock: 150, xyzCategory: 'X' },
  { id: 'SOL-008', name: 'مناديل مطهرة كحولية للأسطح والأجهزة الطبية', category: 'المحاليل الوريدية والغذائية', quantity: 450, monthlyConsumption: 300, unitPrice: 38, minThreshold: 200, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-05-28', leadTimeDays: 8, safetyStock: 50, xyzCategory: 'X' },
  { id: 'SOL-009', name: 'محلول غسيل كلوى بيكربونات (جالون 10 لتر)', category: 'المحاليل الوريدية والغذائية', quantity: 380, monthlyConsumption: 500, unitPrice: 65, minThreshold: 300, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2026-06-01', leadTimeDays: 9, safetyStock: 100, xyzCategory: 'X' },
  { id: 'SOL-010', name: 'مياه معقمة للتنفس والترطيب ومستلزمات الأكسجين', category: 'المحاليل الوريدية والغذائية', quantity: 1100, monthlyConsumption: 1200, unitPrice: 12, minThreshold: 800, supplier: 'الشركة المصرية للمستلزمات الطبية (سيروم)', lastSupplyDate: '2026-06-05', leadTimeDays: 5, safetyStock: 250, xyzCategory: 'X' },

  // 11. مستلزمات المختبرات وبنوك الدم
  { id: 'LAB-101', name: 'أنبوب تجميع دم أرجواني EDTA (عبوة 100 حبة)', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 240, monthlyConsumption: 300, unitPrice: 115, minThreshold: 150, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-20', leadTimeDays: 8, safetyStock: 50, xyzCategory: 'X' },
  { id: 'LAB-102', name: 'أنبوب تجميع دم أحمر Serum (عبوة 100 حبة)', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 280, monthlyConsumption: 300, unitPrice: 115, minThreshold: 150, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-22', leadTimeDays: 8, safetyStock: 50, xyzCategory: 'X' },
  { id: 'LAB-103', name: 'أنبوب تجميع دم أزرق Coagulation (عبوة 100 حبة)', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 180, monthlyConsumption: 200, unitPrice: 125, minThreshold: 100, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-24', leadTimeDays: 8, safetyStock: 35, xyzCategory: 'X' },
  { id: 'LAB-104', name: 'إبر سحب دم معقمة مقاس 21G سريعة السحب', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 3800, monthlyConsumption: 4000, unitPrice: 1.8, minThreshold: 2500, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-06-02', leadTimeDays: 7, safetyStock: 600, xyzCategory: 'X' },
  { id: 'LAB-105', name: 'جهاز سحب دم مفرغ بالفراغ Vacuum Holder', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 950, monthlyConsumption: 800, unitPrice: 3.5, minThreshold: 500, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-28', leadTimeDays: 8, safetyStock: 150, xyzCategory: 'X' },
  { id: 'LAB-106', name: 'شرائح ميكروسكوب زجاجية ذات حافة مصقولة', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 1100, monthlyConsumption: 800, unitPrice: 22, minThreshold: 600, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-15', leadTimeDays: 10, safetyStock: 150, xyzCategory: 'X' },
  { id: 'LAB-107', name: 'أغطية شرائح ميكروسكوب زجاجية مربعة (صندوق)', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 850, monthlyConsumption: 600, unitPrice: 18, minThreshold: 400, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-16', leadTimeDays: 10, safetyStock: 100, xyzCategory: 'X' },
  { id: 'LAB-108', name: 'شرائط اختبار تحديد فصائل الدم السريعة', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 420, monthlyConsumption: 300, unitPrice: 85, minThreshold: 200, supplier: 'شركة تقنيات التشخيص المتقدمة', lastSupplyDate: '2026-05-18', leadTimeDays: 12, safetyStock: 50, xyzCategory: 'Y' },
  { id: 'LAB-109', name: 'فلاتر كلى صناعية عالية التدفق لغسيل الكلى', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 120, monthlyConsumption: 180, unitPrice: 320, minThreshold: 100, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2026-04-12', leadTimeDays: 14, safetyStock: 40, xyzCategory: 'Y' },
  { id: 'LAB-110', name: 'أنابيب ليات توصيل الدم لغسيل الكلى (مستهلكة)', category: 'مستلزمات المختبرات وبنوك الدم', quantity: 140, monthlyConsumption: 180, unitPrice: 85, minThreshold: 100, supplier: 'سويس فارما للتجهيزات الطبية', lastSupplyDate: '2026-04-12', leadTimeDays: 14, safetyStock: 40, xyzCategory: 'Y' },

  // 12. أدوية ومستلزمات أخرى متنوعة
  { id: 'OTH-201', name: 'فيتامين د3 بتركيز 50000 وحدة دولية أقراص', category: 'أمراض القلب والشرايين', quantity: 1600, monthlyConsumption: 1200, unitPrice: 35, minThreshold: 800, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-06-03', leadTimeDays: 7, safetyStock: 200, xyzCategory: 'X' },
  { id: 'OTH-202', name: 'مكمل حديد وحمض الفوليك Ferrous sulfate أقراص', category: 'أمراض القلب والشرايين', quantity: 2400, monthlyConsumption: 2000, unitPrice: 12, minThreshold: 1500, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-28', leadTimeDays: 8, safetyStock: 300, xyzCategory: 'X' },
  { id: 'OTH-203', name: 'شراب موسع شعب هوائية سالبوتامول Ventolin', category: 'المسكنات والتخدير', quantity: 850, monthlyConsumption: 1000, unitPrice: 14, minThreshold: 800, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-05', leadTimeDays: 7, safetyStock: 200, xyzCategory: 'Y' },
  { id: 'OTH-204', name: 'حقن منع التشنج والصرع ديازيبام Valium 10 ملغ', category: 'المسكنات والتخدير', quantity: 140, monthlyConsumption: 120, unitPrice: 28, minThreshold: 80, supplier: 'شركة نجد الطبية للمستحضرات', lastSupplyDate: '2026-05-18', leadTimeDays: 11, safetyStock: 30, xyzCategory: 'Y' },
  { id: 'OTH-205', name: 'حبوب أوميبرازول Losec 20 ملغ لحموضة المعدة', category: 'المسكنات والتخدير', quantity: 1900, monthlyConsumption: 1500, unitPrice: 42, minThreshold: 1000, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-02', leadTimeDays: 6, safetyStock: 300, xyzCategory: 'X' },
  { id: 'OTH-206', name: 'شاش جبس طبي سريع التصلد Cast 15 سم', category: 'المستلزمات الجراحية', quantity: 380, monthlyConsumption: 300, unitPrice: 28, minThreshold: 200, supplier: 'مصنع الأقنعة والشاش الطبي الوطني', lastSupplyDate: '2026-05-14', leadTimeDays: 10, safetyStock: 50, xyzCategory: 'X' },
  { id: 'OTH-207', name: 'كريم ميكونازول مضاد فطريات جلدي 2%', category: 'المسكنات والتخدير', quantity: 650, monthlyConsumption: 500, unitPrice: 18, minThreshold: 300, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-20', leadTimeDays: 9, safetyStock: 80, xyzCategory: 'Y' },
  { id: 'OTH-208', name: 'كريم هيدروكورتيزون مضاد للالتهابات الجلدية 1%', category: 'المسكنات والتخدير', quantity: 480, monthlyConsumption: 400, unitPrice: 15, minThreshold: 250, supplier: 'شركة الخليج للصناعات الدوائية (جلفار)', lastSupplyDate: '2026-05-22', leadTimeDays: 9, safetyStock: 80, xyzCategory: 'Y' },
  { id: 'OTH-209', name: 'قطرة عيون معقمة مرطبة ومخففة للجفاف', category: 'المسكنات والتخدير', quantity: 950, monthlyConsumption: 800, unitPrice: 32, minThreshold: 500, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-06-04', leadTimeDays: 8, safetyStock: 100, xyzCategory: 'X' },
  { id: 'OTH-210', name: 'قطرة عيون توبراميسين مضاد حيوي عيني', category: 'المسكنات والتخدير', quantity: 380, monthlyConsumption: 450, unitPrice: 24, minThreshold: 300, supplier: 'الشركة العربية للأدوية والمستلزمات', lastSupplyDate: '2026-05-25', leadTimeDays: 8, safetyStock: 80, xyzCategory: 'Y' }
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
