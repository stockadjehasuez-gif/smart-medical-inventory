import React, { useState, useEffect } from 'react';
import { HeartPulse, Bot, Loader2, AlertCircle } from 'lucide-react';
import { MedicalItem, InventoryAlert, ChatMessage, UserProfile, ViewTab } from './types';
import { 
  INITIAL_ITEMS, runFullInventoryAnalysis, generateSmartAlerts, 
  getInventoryAvailabilityRate, getTotalInventoryValue, getCriticalItems 
} from './utils/inventoryEngine';

// استيراد المكونات الفرعية المقسمة برمجياً لتجنب تخطي حد التوكنات
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import AnalysisView from './components/AnalysisView';
import ReorderView from './components/ReorderView';
import PredictionView from './components/PredictionView';
import ReportsView from './components/ReportsView';
import AssistantView from './components/AssistantView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import AuthScreen from './components/AuthScreen';
import UserManagementView from './components/UserManagementView';

export default function App() {
  // شاشة التحميل الاحترافية الأولية للتطبيق
  const [appLoading, setAppLoading] = useState(true);

  // حالة الجلسة والمصادقة (تبدأ بـ null لطلب تسجيل الدخول الموثوق أولاً)
  const [user, setUser] = useState<UserProfile | null>(null);

  // البيانات والمخزون الطبي والتحليل التلقائي الكلي
  const [items, setItems] = useState<MedicalItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);

  // حالة الدردشة والمساعد الذكي
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // التبويب والوضع الليلي
  const [currentTab, setCurrentTab] = useState<ViewTab>('landing');
  const [darkMode, setDarkMode] = useState(false);

  // شاشة تحميل أولية لمحاكاة تهيئة السحابة والاتصالات الأمنية
  useEffect(() => {
    const timer = setTimeout(() => {
      // تحميل وتصنيف الأصناف الطبية الأولية بنجاح
      const analyzed = runFullInventoryAnalysis(INITIAL_ITEMS);
      setItems(analyzed);
      setAlerts(generateSmartAlerts(analyzed));
      setAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // دالة تحديث الحساب
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  // دالة تسجيل الخروج من البوابة الأمنية
  const handleLogout = () => {
    setUser(null);
    setCurrentTab('landing');
    setChatHistory([]);
  };

  // دالة إطلاق إشعار أو إضافة أصناف طبية جديدة (مع إعادة تشغيل التحليل)
  const handleAddItems = (newItems: Partial<MedicalItem>[]) => {
    const updated = [...items];
    
    newItems.forEach(newItem => {
      const idx = updated.findIndex(i => i.id === newItem.id);
      if (idx > -1) {
        // تحديث الكمية والمعلومات
        updated[idx] = { 
          ...updated[idx], 
          ...newItem,
          quantity: updated[idx].quantity + (newItem.quantity || 0)
        };
      } else {
        // صنف طبي جديد بالكامل
        updated.push({
          id: newItem.id || `MED-${Math.floor(100 + Math.random() * 900)}`,
          name: newItem.name || 'مستلزم جديد',
          category: newItem.category || 'عام',
          quantity: newItem.quantity || 100,
          monthlyConsumption: newItem.monthlyConsumption || 50,
          unitPrice: newItem.unitPrice || 10,
          minThreshold: newItem.minThreshold || 50,
          supplier: newItem.supplier || 'مورد عام للمستشفى',
          lastSupplyDate: newItem.lastSupplyDate || new Date().toISOString().split('T')[0],
          leadTimeDays: newItem.leadTimeDays || 10,
          safetyStock: newItem.safetyStock || Math.round((newItem.minThreshold || 50) * 0.4),
        });
      }
    });

    const analyzed = runFullInventoryAnalysis(updated);
    setItems(analyzed);
    setAlerts(generateSmartAlerts(analyzed));
  };

  // دالة تعديل صنف مفرد
  const handleUpdateItem = (id: string, updatedFields: Partial<MedicalItem>) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });

    const analyzed = runFullInventoryAnalysis(updated);
    setItems(analyzed);
    setAlerts(generateSmartAlerts(analyzed));
  };

  // دالة حذف صنف طبي
  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    const analyzed = runFullInventoryAnalysis(updated);
    setItems(analyzed);
    setAlerts(generateSmartAlerts(analyzed));
  };

  // دالة إخفاء / حذف تنبيه
  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  // دالة سريعة لإعادة الطلب الفوري وإضافة الكمية مباشرة للمستودع
  const handleOrderCompleted = (itemId: string, orderQuantity: number) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + orderQuantity,
          lastSupplyDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });

    const analyzed = runFullInventoryAnalysis(updated);
    setItems(analyzed);
    setAlerts(generateSmartAlerts(analyzed));
  };

  // دالة توجيه سريعة لطلب توريد
  const handleQuickOrderDirectly = (item: MedicalItem) => {
    setCurrentTab('predictions'); // الانتقال لمراقبة إعادة الطلب وجدولة التوريد
  };

  // دالة إرسال رسالة للمساعد الذكي واستدعاء خادم الـ Gemini API الآمن
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `MSG-USER-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsLoadingChat(true);
    setChatError(null);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          inventory: items
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'فشل الاتصال بخادم المساعد الذكي.');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `MSG-AI-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };

      setChatHistory(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      console.error('Chat Error:', err);
      setChatError(err.message || 'عذراً، فشل المساعد الذكي في معالجة بيانات المستودع حالياً.');
    } finally {
      setIsLoadingChat(false);
    }
  };

  // تفريغ سجل المحادثة
  const handleClearHistory = () => {
    setChatHistory([]);
    setChatError(null);
  };

  // مؤشرات الجرد المباشرة الكلية
  const totalValue = getTotalInventoryValue(items);
  const availabilityRate = getInventoryAvailabilityRate(items);
  const criticalCount = getCriticalItems(items).length;
  
  const categories = Array.from(new Set(items.map(i => i.category))) as string[];

  // شاشة تحميل أولية ترحيبية
  if (appLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4" dir="rtl">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          <HeartPulse className="w-7 h-7 text-blue-600 absolute animate-pulse" />
        </div>
        <div className="text-center space-y-1.5 animate-pulse">
          <span className="block font-black text-slate-800 text-lg tracking-wide">مساعد إدارة المخزون الطبي الذكي</span>
          <span className="block text-slate-400 text-xs font-semibold">جاري تحضير مصفوفة التحليلات وتأمين قواعد البيانات...</span>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك مستخدم مسجل، اعرض شاشة المصادقة الطبيةERP أولاً
  if (!user) {
    return <AuthScreen onLoginSuccess={setUser} />;
  }

  return (
    <div className={darkMode ? 'dark text-slate-100 bg-slate-950 min-h-screen' : 'text-slate-800 bg-slate-50 min-h-screen'}>
      <div className="flex flex-col lg:flex-row min-h-screen font-sans" dir="rtl">
        
        {/* شريط الملاحة والقائمة الجانبية (Sidebar) - موضوعة على اليمين للـ RTL */}
        <Navigation 
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          user={user}
          onLogout={handleLogout}
          criticalAlertCount={criticalCount}
        />

        {/* مساحة العرض الرئيسية المحتواة */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {/* الانتقال الشرطي والسلس بين علامات التبويب */}
          <div className="transition-all duration-250 ease-out">
            {currentTab === 'landing' && (
              <LandingPage 
                onNavigate={setCurrentTab}
                totalItems={items.length}
                criticalCount={criticalCount}
                totalValue={totalValue}
                availabilityRate={availabilityRate}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryView 
                items={items}
                onAddItems={handleAddItems}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                categories={categories}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView 
                items={items}
                alerts={alerts}
                onDismissAlert={handleDismissAlert}
                onNavigate={setCurrentTab}
                onQuickOrder={handleQuickOrderDirectly}
                onAddItems={handleAddItems}
              />
            )}

            {currentTab === 'abc-analysis' && (
              <AnalysisView 
                items={items}
              />
            )}

            {currentTab === 'predictions' && (
              <ReorderView 
                items={items}
                onOrderCompleted={handleOrderCompleted}
              />
            )}

            {currentTab === 'predictions' && (
              <div className="pt-8 border-t border-slate-100 dark:border-slate-850">
                <PredictionView 
                  items={items}
                />
              </div>
            )}

            {currentTab === 'reports' && (
              <ReportsView 
                items={items}
                availabilityRate={availabilityRate}
                totalValue={totalValue}
              />
            )}

            {currentTab === 'assistant' && (
              <AssistantView 
                items={items}
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isLoadingChat}
                errorMessage={chatError}
                onClearHistory={handleClearHistory}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView 
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentTab === 'user-management' && (
              <UserManagementView 
                currentUser={user}
                onSwitchUser={(newUser) => {
                  setUser(newUser);
                  setCurrentTab('landing');
                }}
              />
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
