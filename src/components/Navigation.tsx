import React, { useState } from 'react';
import { 
  Home, Database, Brain, Layers, BarChart2, FileText, Bot, Settings, User, 
  Menu, X, Sun, Moon, ShieldAlert, LogOut, HeartPulse, Users 
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
    { id: 'landing', label: 'الرئيسية', icon: Home },
    { id: 'inventory', label: 'تحليل المخزون', icon: Database },
    { id: 'predictions', label: 'التنبؤ بالاحتياجات', icon: Brain },
    { id: 'abc-analysis', label: 'تحليل ABC-XYZ', icon: Layers },
    { id: 'dashboard', label: 'لوحة المؤشرات', icon: BarChart2 },
    { id: 'reports', label: 'التقارير الذكية', icon: FileText },
    { id: 'user-management', label: 'بوابة المستخدمين', icon: Users },
    { id: 'assistant', label: 'المساعد الذكي', icon: Bot, badge: true },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div id="navigation-sidebar-container" className="relative">
      {/* الشريط العلوي للجوال */}
      <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 flex items-center justify-between z-40 relative shadow-xs" dir="rtl">
        <button
          id="btn-toggle-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span className="font-black text-slate-800 dark:text-slate-100 text-sm">مخزون طبي ذكي</span>
        </div>

        <button
          id="btn-toggle-dark-mode-mobile"
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* شاشة تظليل الخلفية على الهاتف */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/40 z-30 transition-opacity"
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
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-med-blue flex items-center justify-center text-white font-extrabold text-sm shadow-xs select-none shrink-0">
              H+
            </div>
            <div>
              <span className="block font-black text-slate-800 dark:text-slate-50 text-sm leading-tight">ميد-لوجيستيك</span>
              <span className="block text-slate-400 text-[10px] uppercase tracking-wider font-semibold">النسخة الذكية 2.0</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id as ViewTab)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-blue-600/5 dark:bg-blue-950/40 text-med-blue dark:text-blue-400 border-r-4 border-med-blue rounded-l-xl rounded-r-none font-black' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-med-blue dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && criticalAlertCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {criticalAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* معلومات المستخدم بالأسفل وزر تبديل الوضع الليلي */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
          
          {/* تبديل السمة للكمبيوتر */}
          <div className="hidden lg:flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400">الوضع الليلي</span>
            <button
              id="btn-toggle-dark-mode"
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* الملف الشخصي للمستخدم */}
          <div 
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-right overflow-hidden">
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</span>
              <span className="block text-slate-400 text-xs truncate">{user.role}</span>
            </div>
          </div>

          {/* تسجيل الخروج */}
          <button
            id="btn-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من النظام</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
