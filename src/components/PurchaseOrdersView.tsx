import React, { useState } from 'react';
import { ShoppingCart, Star, Calendar, ShieldCheck, Check, Clock, Eye, AlertCircle, RefreshCw, X } from 'lucide-react';
import { MedicalItem } from '../types';

interface PurchaseOrdersViewProps {
  items: MedicalItem[];
}

export default function PurchaseOrdersView({ items }: PurchaseOrdersViewProps) {
  // توليد بعض البيانات التمثيلية لأوامر الشراء من الأصناف والبيانات الحقيقية
  const initialPurchaseOrders = [
    { id: 'PO-2026-0421', supplier: 'الشركة المصرية لتجارة الأدوية', status: 'delivered', expectedDelivery: '2026-05-12', priority: 'high', approvalStatus: 'approved', totalCost: 185000 },
    { id: 'PO-2026-0422', supplier: 'الشركة العالمية للمستلزمات الطبية', status: 'shipped', expectedDelivery: '2026-07-01', priority: 'medium', approvalStatus: 'approved', totalCost: 74000 },
    { id: 'PO-2026-0423', supplier: 'النيل للأدوية والصناعات الكيماوية', status: 'pending', expectedDelivery: '2026-07-15', priority: 'high', approvalStatus: 'pending_director', totalCost: 312000 },
    { id: 'PO-2026-0424', supplier: 'أكديما للصناعات الدوائية', status: 'pending', expectedDelivery: '2026-07-18', priority: 'low', approvalStatus: 'approved', totalCost: 45000 },
    { id: 'PO-2026-0425', supplier: 'الجمهورية لتجارة الأدوية والمستلزمات', status: 'shipped', expectedDelivery: '2026-07-03', priority: 'high', approvalStatus: 'approved', totalCost: 98000 },
    { id: 'PO-2026-0426', supplier: 'إيفا فارما للأدوية والمستحضرات', status: 'pending', expectedDelivery: '2026-07-22', priority: 'medium', approvalStatus: 'draft', totalCost: 156000 },
    { id: 'PO-2026-0427', supplier: 'العربية للصناعات الطبية (اميكو)', status: 'delivered', expectedDelivery: '2026-05-30', priority: 'low', approvalStatus: 'approved', totalCost: 28000 },
  ];

  const [orders, setOrders] = useState(initialPurchaseOrders);

  // دالة تحديث حالة الموافقة
  const handleApprove = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, approvalStatus: 'approved' };
      }
      return order;
    }));
    alert(`تمت الموافقة وتوقيع أمر الشراء ${orderId} رقمياً بنجاح، وجاري توجيهه لجهة التمويل بالمديرية!`);
  };

  return (
    <div className="space-y-6 text-right animate-fade-in font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">لوحة مراقبة وأوامر الشراء والتعميد المالي (POs)</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          إصدار، توقيع، ومتابعة تتبع أوامر الشراء الموجهة لشركات الأدوية والمستلزمات بالتكامل مع منظومة الهيئة العليا للشراء الموحد
        </p>
      </div>

      {/* لوحة المؤشرات لأوامر الشراء */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400">إجمالي طلبات الشراء</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-50">{orders.length} أمر</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0055D4]">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400">بانتظار موافقة المدير</span>
            <span className="text-xl font-black text-amber-500">
              {orders.filter(o => o.approvalStatus === 'pending_director').length} أوامر
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400">تحت الشحن والتوريد</span>
            <span className="text-xl font-black text-[#0055D4]">
              {orders.filter(o => o.status === 'shipped').length} أوامر
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#0055D4]">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400">الموازنة الكلية للتعميدات</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {orders.reduce((sum, o) => sum + o.totalCost, 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* جدول أوامر الشراء */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#0055D4]" />
            <span>قائمة أوامر الشراء والتوريد (Purchase Orders Ledger)</span>
          </h2>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-black px-3 py-1 rounded-full border border-emerald-500/20">قنوات شراء رسمية معتمدة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <th className="p-3.5 font-bold">رقم أمر الشراء (PO Number)</th>
                <th className="p-3.5 font-bold">المورد (Supplier)</th>
                <th className="p-3.5 font-bold text-center">حالة التوريد (Status)</th>
                <th className="p-3.5 font-bold text-center">التسليم المتوقع (Expected Delivery)</th>
                <th className="p-3.5 font-bold text-center">الأولوية (Priority)</th>
                <th className="p-3.5 font-bold text-center">حالة الاعتماد (Approval Status)</th>
                <th className="p-3.5 font-bold text-center">القيمة التقديرية</th>
                <th className="p-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
              {orders.map((order) => {
                // تلوين الأولوية
                let priorityClass = 'bg-slate-100 text-slate-600';
                let priorityText = 'عادية';
                if (order.priority === 'high') {
                  priorityClass = 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 border border-rose-500/10';
                  priorityText = 'عاجل جداً';
                } else if (order.priority === 'medium') {
                  priorityClass = 'bg-amber-50 dark:bg-amber-950/30 text-amber-500 border border-amber-500/10';
                  priorityText = 'متوسطة';
                }

                // تلوين حالة التوريد
                let statusClass = 'bg-slate-100 text-slate-600';
                let statusText = 'قيد الدراسة';
                if (order.status === 'delivered') {
                  statusClass = 'bg-emerald-500/10 text-emerald-500';
                  statusText = 'تم استلامه بالمستوع';
                } else if (order.status === 'shipped') {
                  statusClass = 'bg-blue-500/10 text-blue-500';
                  statusText = 'مشحون بالطريق';
                } else if (order.status === 'pending') {
                  statusClass = 'bg-amber-500/10 text-amber-500';
                  statusText = 'بانتظار شحن المورد';
                }

                // تلوين حالة الاعتماد
                let approvalClass = 'bg-slate-100 text-slate-600';
                let approvalText = 'مسودة';
                if (order.approvalStatus === 'approved') {
                  approvalClass = 'bg-emerald-500 text-white';
                  approvalText = 'تم الاعتماد والتوقيع';
                } else if (order.approvalStatus === 'pending_director') {
                  approvalClass = 'bg-amber-500 text-white';
                  approvalText = 'بانتظار موافقة مدير المديرية';
                } else if (order.approvalStatus === 'draft') {
                  approvalClass = 'bg-slate-400 text-white';
                  approvalText = 'مسودة تحت المراجعة';
                }

                return (
                  <tr key={order.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-black text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0055D4] shrink-0"></span>
                        <span>{order.id}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-850 dark:text-slate-100 font-bold">
                      {order.supplier}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-mono text-slate-500 dark:text-slate-400">
                      {order.expectedDelivery}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${priorityClass}`}>
                        {priorityText}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${approvalClass}`}>
                        {approvalText}
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-mono font-black text-slate-850 dark:text-slate-100">
                      {order.totalCost.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 })}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.approvalStatus === 'pending_director' && (
                          <button 
                            onClick={() => handleApprove(order.id)}
                            className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>اعتماد الآن</span>
                          </button>
                        )}
                        <button 
                          onClick={() => alert(`عرض المرفقات والبنود التفصيلية لأمر التوريد المستندي ${order.id}`)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
