import React, { useState } from 'react';
import { HeartPulse, KeyRound, Mail, User, ShieldCheck, Activity, Users } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // الحقول
  const [name, setName] = useState('همام مصطفى');
  const [email, setEmail] = useState('stockadj.eha.suez@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('مدير إمداد المستشفى');
  const [facility, setFacility] = useState('مستشفى السويس العام');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // إنشاء جلسة مستخدم للتجربة
    const userProfile: UserProfile = {
      name: name || 'همام مصطفى',
      email: email || 'stockadj.eha.suez@gmail.com',
      role: role || 'مدير إمداد المستشفى',
      facility: facility || 'مستشفى السويس العام',
      avatarSeed: name ? name.charAt(0) : 'هـ'
    };
    
    onLoginSuccess(userProfile);
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 text-right" dir="rtl">
      
      {/* بطاقة المصادقة واللوحة الرئيسية */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* البانر العلوي المزخرف */}
        <div className="bg-linear-to-br from-blue-700 to-indigo-900 text-white p-6 text-center space-y-3 relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-xl"></div>
          
          <div className="relative z-10 space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-400/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-xl">مساعد إدارة المخزون الطبي الذكي</h2>
              <span className="text-[10px] uppercase tracking-wider text-blue-200">بوابة الدخول الموحدة للرعاية الصحية الذكية</span>
            </div>
          </div>
        </div>

        {/* جسم الاستمارة */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs font-semibold">
          
          <div className="flex items-center justify-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${!isSignUp ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400'}`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${isSignUp ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400'}`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {isSignUp && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الاسم الثنائي للمسؤول</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المسمى الوظيفي / الدور</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="مدير مستودع الأدوية الرئيسي">مدير مستودع الأدوية الرئيسي</option>
                  <option value="رئيس الصيادلة وأمين العهد">رئيس الصيادلة وأمين العهد</option>
                  <option value="أخصائي سلاسل الإمداد الطبي">أخصائي سلاسل الإمداد الطبي</option>
                  <option value="مدير جرد المستلزمات الطبية">مدير جرد المستلزمات الطبية</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المنشأة الطبية / المستشفى</label>
                <input
                  type="text"
                  required={isSignUp}
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* الحقول الأساسية المشتركة */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5">البريد الإلكتروني للعمل بالمستشفى</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@hospital.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5">كلمة المرور المشفرة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* تذكرني */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded-md bg-slate-50 dark:bg-slate-950 border-slate-200 accent-blue-600" />
              <span>تذكر بيانات الدخول بالمنشأة</span>
            </label>
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">هل نسيت كلمة المرور؟</span>
          </div>

          <button
            type="submit"
            id="btn-auth-submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transform transition-transform active:scale-[0.99] cursor-pointer"
          >
            {isSignUp ? 'تأكيد إنشاء الحساب والولوج' : 'تسجيل الدخول الآمن للوحة'}
          </button>

          {/* حسابات تجريبية سريعة */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            <span className="block text-[10px] text-slate-400">للتجربة السريعة الفورية دون إدخال بيانات:</span>
            <button
              type="button"
              onClick={() => {
                onLoginSuccess({
                  name: 'همام مصطفى',
                  email: 'stockadj.eha.suez@gmail.com',
                  role: 'مدير إمداد المستشفى',
                  facility: 'مستشفى السويس العام',
                  avatarSeed: 'هـ'
                });
              }}
              className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              استخدم بيانات المسئول التجريبية الافتراضية ←
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
