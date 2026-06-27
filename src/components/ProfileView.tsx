import React, { useState } from 'react';
import { User, Mail, Building2, ShieldCheck, Award, Heart, CheckCircle2, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function ProfileView({ user, onUpdateUser }: ProfileViewProps) {
  const [name, setName] = useState(user.name);
  const [facility, setFacility] = useState(user.facility);
  const [role, setRole] = useState(user.role);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      facility,
      role,
      avatarSeed: name.charAt(0)
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div id="profile-view-container" className="max-w-3xl mx-auto space-y-8 py-2 text-right" dir="rtl">
      
      {/* هيدر الصفحة */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">الملف الشخصي للمسؤول</h1>
        <p className="text-slate-400 dark:text-slate-50 text-sm mt-1">تعديل معلومات المسؤول الطبي وإعدادات الأمان بالمستودع</p>
      </div>

      {/* بطاقة عرض الحساب والرمز */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        <div className="md:col-span-3 flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-blue-600/10 uppercase">
            {user.name.charAt(0)}
          </div>
        </div>

        <div className="md:col-span-9 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-50">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/10">
              {user.role}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>المنشأة المعتمدة: {user.facility}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>البريد الموحد: {user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>صلاحيات الوصول: مدير لوجستي معتمد (كاملة)</span>
            </div>
          </div>
        </div>

      </div>

      {/* استمارة تعديل البيانات الطبية للمسؤول */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xs space-y-6">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-4">تعديل معلومات الجلسة والمسؤول</h3>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الاسم الكامل للمسؤول</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المنشأة الصحية / المستشفى</label>
              <input
                type="text"
                required
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المسمى الوظيفي والدور</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تم تحديث معلومات الجلسة الطبية للمسؤول بنجاح!</span>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
            >
              <Save className="w-4 h-4" />
              <span>حفظ البيانات وتحديث الجلسة</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
