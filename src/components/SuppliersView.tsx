import React, { useState } from 'react';
import { Truck, Star, Phone, ShieldCheck, Mail, ArrowUpRight, Award, Plus, Calendar } from 'lucide-react';
import { MedicalItem } from '../types';

interface SuppliersViewProps {
  items: MedicalItem[];
}

export default function SuppliersView({ items }: SuppliersViewProps) {
  // توليد الموردين الفريدين من مصفوفة الأصناف وحساب بيانات واقعية لهم
  const uniqueSupplierNames = Array.from(new Set(items.map(i => i.supplier)));

  const mockSuppliers = uniqueSupplierNames.map((name, index) => {
    // تحديد تقييم وأرقام بناءً على الاسم لتبقى مستقرة وثابتة
    const scoreSeed = (name.length * 7) % 20;
    const performanceScore = 80 + scoreSeed; // بين 80 و 99
    const leadTime = Math.max(3, (name.length * 3) % 15); // بين 3 و 14 يوم
    const contactPhone = `+20 10 ${2000 + (index * 13)} ${5000 + (index * 29)}`;
    const rating = parseFloat((4.0 + (scoreSeed / 10)).toFixed(1)); // بين 4.0 و 5.0
    const ordersCount = 15 + ((name.length * 4) % 35); // بين 15 و 50 أمر توريد

    return {
      name,
      performanceScore,
      leadTime,
      contact: contactPhone,
      ordersCount,
      rating
    };
  }).sort((a, b) => b.performanceScore - a.performanceScore);

  return (
    <div className="space-y-6 text-right animate-fade-in font-sans" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">بوابة إدارة الموردين والشركات الطبية المعتمدة</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            مراقبة الأداء التشغيلي للموردين، سرعة التوريد (Lead Time)، ومؤشرات التقييم لضمان جودة الإمداد الطبي المستدام
          </p>
        </div>
        <button 
          onClick={() => alert('ميزة إضافة مورد جديد تتطلب صلاحيات المشرف العام بالمديرية')}
          className="px-4 py-2.5 bg-[#0055D4] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مورد معتمد</span>
        </button>
      </div>

      {/* لوحة المؤشرات للموردين */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 shrink-0">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400">متوسط كفاءة التوريد</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-50">94.8%</span>
            <span className="block text-[9px] text-emerald-500 font-bold mt-0.5">ممتاز (فئة A+)</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0055D4] shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400">إجمالي الموردين المقيدين</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-50">{mockSuppliers.length} مورد</span>
            <span className="block text-[9px] text-slate-400 font-bold mt-0.5">تغطية لكافة الأقسام العلاجية</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400">متوسط فترة الانتظار</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-50">6.4 أيام</span>
            <span className="block text-[9px] text-amber-500 font-bold mt-0.5">ضمن الحدود اللوجستية الآمنة</span>
          </div>
        </div>
      </div>

      {/* جدول الموردين الاحترافي */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0055D4]" />
            <span>سجل أداء الموردين المعتمدين لدى المستشفى العام</span>
          </h2>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-3 py-1 rounded-full">تحديث فوري للأرقام</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <th className="p-3.5 font-bold">اسم المورد (Supplier Name)</th>
                <th className="p-3.5 font-bold text-center">مؤشر الأداء (Performance Score)</th>
                <th className="p-3.5 font-bold text-center">زمن الاستجابة (Lead Time)</th>
                <th className="p-3.5 font-bold">وسيلة التواصل (Contact)</th>
                <th className="p-3.5 font-bold text-center">أوامر التوريد (Orders Count)</th>
                <th className="p-3.5 font-bold text-center">التقييم العام (Rating)</th>
                <th className="p-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
              {mockSuppliers.map((supplier) => {
                let ratingColor = 'text-amber-500';
                if (supplier.rating >= 4.7) ratingColor = 'text-emerald-500';

                return (
                  <tr key={supplier.name} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-black text-slate-850 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0055D4] flex items-center justify-center shrink-0 font-extrabold text-[10px]">
                          {supplier.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block text-slate-800 dark:text-slate-50">{supplier.name}</span>
                          <span className="block text-[9px] text-slate-400 font-bold mt-0.5">مورد معتمد بوزارة الصحة</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono font-black text-slate-800 dark:text-slate-100">{supplier.performanceScore}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${supplier.performanceScore >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${supplier.performanceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-center font-mono">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 font-bold">
                        {supplier.leadTime} يوم
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{supplier.contact}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{supplier.name.replace(/\s+/g, '').toLowerCase()}@supplier.gov.eg</span>
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-350">
                      {supplier.ordersCount} أمر
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                        <Star className={`w-3.5 h-3.5 fill-current ${ratingColor}`} />
                        <span className={`font-mono font-black ${ratingColor}`}>{supplier.rating}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button 
                        onClick={() => alert(`الاتصال السريع بنظام التوريد الخارجي لـ ${supplier.name}`)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0055D4] hover:bg-[#0055D4] hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
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
