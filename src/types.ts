export interface MedicalItem {
  id: string; // كود الصنف
  name: string; // اسم الصنف
  category: string; // الفئة
  quantity: number; // الكمية الحالية
  monthlyConsumption: number; // معدل الاستهلاك الشهري
  unitPrice: number; // سعر الوحدة
  minThreshold: number; // الحد الأدنى للمخزون
  supplier: string; // المورد
  lastSupplyDate: string; // تاريخ آخر توريد
  leadTimeDays: number; // فترة التوريد باليوم
  safetyStock: number; // مخزون الأمان
  xyzCategory?: 'X' | 'Y' | 'Z'; // تصنيف الاستقرار (XYZ)
  abcCategory?: 'A' | 'B' | 'C'; // تصنيف الأهمية الاقتصادية (ABC)
}

export interface ABCXYZAnalysisSummary {
  abcACount: number;
  abcBCount: number;
  abcCCount: number;
  xyzXCount: number;
  xyzYCount: number;
  xyzZCount: number;
  totalValue: number;
  abcValueA: number;
  abcValueB: number;
  abcValueC: number;
}

export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: 'critical' | 'reorder' | 'stagnant' | 'late_supply';
  message: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  facility: string;
  avatarSeed: string;
}

export type ViewTab =
  | 'landing'
  | 'inventory'
  | 'predictions'
  | 'abc-analysis'
  | 'dashboard'
  | 'reports'
  | 'assistant'
  | 'settings'
  | 'profile'
  | 'user-management';
