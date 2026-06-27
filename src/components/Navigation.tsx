import React, { useState } from 'react';
import { 
  Home, Database, Brain, Layers, BarChart2, FileText, Bot, Settings, User, 
  Menu, X, Sun, Moon, ShieldAlert, LogOut, HeartPulse, Users, Truck, ShoppingCart, TrendingUp, Info, Activity
} from 'lucide-react';
import { ViewTab, UserProfile } from '../types';

interface NavigationProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile;
  onLogout: () => void;
  criticalAlertCount: number;
}

export default function Navigation({
  currentTab,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  user,
  onLogout,
  criticalAlertCount
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'لوحة المؤشرات العامة', icon: BarChart2 },
    { id: 'inventory', label: 'إدارة المخزون الطبي', icon: Database },
    { id: 'categories', label: 'تصنيفات المواد والفئات', icon: Layers },
    { id: 'suppliers', label: 'سجل الموردين والأداء', icon: Truck },
    { id: 'purchase-requests', label: 'طلبات الشراء والـ ROP', icon: Activity },
    { id: 'purchase-orders', label: 'أوامر الشراء (POs)', icon: ShoppingCart },
    { id: 'forecast', label: 'التنبؤ الذكي بالطلب', icon: Brain },
    { id: 'abc-analysis', label: 'تحليل الأهمية ABC', icon: Layers },
    { id: 'xyz-analysis', label: 'تحليل استقرار XYZ', icon: TrendingUp },
    { id: 'reports', label: 'التقارير التنفيذية', icon: FileText },
    { id: 'assistant', label: 'مستشار الإمداد AI', icon: Bot, badge: true },
    { id: 'settings', label: 'إعدادات النظام الـ ERP', icon: Settings },
    { id: 'about', label: 'حول بوابة الإمداد', icon: Info },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div id="navigation-sidebar-container" className="relative font-sans select-none shrink-0 lg:w-64">
      {/* الشريط العلوي للجوال */}
      <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-4 flex items-center justify-between z-40 relative shadow-xs" dir="rtl">
        <button
          id="btn-toggle-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span className="font-black text-slate-800 dark:text-slate-100 text-sm">ERP Supply Chain</span>
        </div>

        <button
          id="btn-toggle-dark-mode-mobile"
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* شاشة تظليل الخلفية على الهاتف */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/40 z-35 transition-opacity"
        />
      )}

      {/* قائمة التنقل الجانبية - Sidebar للكمبيوتر والجوال */}
      <aside className={`
        fixed lg:sticky top-0 bottom-0 right-0 z-40
        w-64 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800
        flex flex-col h-screen transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `} dir="rtl">
        
        {/* هيدر القائمة الجانبية */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0055D4] to-[#003ba3] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/10 shrink-0">
              H+
            </div>
            <div className="overflow-hidden">
              <span className="block font-black text-slate-800 dark:text-slate-50 text-sm leading-tight truncate">سلاسل الإمداد الطبية</span>
              <span className="block text-emerald-500 dark:text-emerald-400 text-[9px] font-bold tracking-wider uppercase">Fiori Core System</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id as ViewTab)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer rounded-xl
                  ${isActive 
                    ? 'bg-blue-600/5 dark:bg-blue-950/30 text-[#0055D4] dark:text-blue-400 border-r-4 border-[#0055D4] rounded-r-none font-extrabold' 
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0055D4] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && criticalAlertCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500 text-white animate-pulse">
                    {criticalAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* معلومات المستخدم بالأسفل وزر تبديل الوضع الليلي */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
          
          {/* تبديل السمة للكمبيوتر */}
          <div className="hidden lg:flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-400">الوضع الليلي المتكيف</span>
            <button
              id="btn-toggle-dark-mode"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* الملف الشخصي للمستخدم */}
          <div 
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-200/40"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0055D4] to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs uppercase shrink-0">
              {user.avatarSeed || user.name.charAt(0)}
            </div>
            <div className="flex-1 text-right overflow-hidden">
              <span className="block text-xs font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{user.name}</span>
              <span className="block text-[10px] text-slate-400 truncate mt-0.5">{user.role}</span>
            </div>
          </div>

          {/* تسجيل الخروج */}
          <button
            id="btn-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-extrabold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
