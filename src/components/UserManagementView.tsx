import React, { useState } from 'react';
import { 
  UserPlus, Users, Mail, Send, CheckCircle2, Loader2, 
  ShieldAlert, Building2, Download, Upload, Inbox, ArrowLeftRight 
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserManagementViewProps {
  currentUser: UserProfile;
  onSwitchUser: (newUser: UserProfile) => void;
}

export default function UserManagementView({ currentUser, onSwitchUser }: UserManagementViewProps) {
  // قائمة المستخدمين المسجلين في النظام
  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      name: 'همام مصطفى',
      email: 'stockadj.eha.suez@gmail.com',
      role: 'مدير إمداد المستشفى',
      facility: 'مستشفى السويس العام',
      avatarSeed: 'هـ'
    },
    {
      name: 'د. أحمد محمود',
      email: 'ahmed.mahmoud@hospital.gov',
      role: 'رئيس الصيادلة وأمين العهد',
      facility: 'مستشفى السويس العام',
      avatarSeed: 'أ'
    },
    {
      name: 'أ. مروة السعيد',
      email: 'marwa.saeed@hospital.gov',
      role: 'أخصائي سلاسل الإمداد الطبي',
      facility: 'مستشفى السويس العام',
      avatarSeed: 'م'
    }
  ]);

  // حقول نموذج إنشاء مستخدم جديد
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('أخصائي سلاسل الإمداد الطبي');
  const [newFacility, setNewFacility] = useState('مستشفى السويس العام');

  // حالات الإرسال والمحاكاة
  const [isSending, setIsSending] = useState(false);
  const [sentEmailData, setSentEmailData] = useState<{ name: string; email: string; role: string; facility: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // دالة التعامل مع تقديم نموذج إنشاء مستخدم
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    setIsSending(true);
    setSentEmailData(null);

    // محاكاة إرسال بريد إلكتروني آمن عبر النظام للرعاية الصحية
    setTimeout(() => {
      const newUser: UserProfile = {
        name: newName,
        email: newEmail,
        role: newRole,
        facility: newFacility,
        avatarSeed: newName.charAt(0)
      };

      setUsersList(prev => [...prev, newUser]);
      setIsSending(false);
      setSentEmailData({
        name: newName,
        email: newEmail,
        role: newRole,
        facility: newFacility
      });
      setShowNotification(true);

      // مسح الحقول بعد التقديم الناجح
      setNewName('');
      setNewEmail('');
    }, 1500);
  };

  // تصدير مستخدمي النظام إلى ملف CSV
  const handleExportUsers = () => {
    const headers = ['الاسم الكامل', 'البريد الإلكتروني', 'المسمى الوظيفي والمسؤولية', 'المنشأة الطبية'];
    const rows = usersList.map(u => [u.name, u.email, u.role, u.facility]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `مستخدمي_نظام_إمداد_المستشفيات_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // استيراد مستخدمين من ملف CSV مع التحقق الدقيق من سلامة التنسيق
  const handleImportUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setImportError('الملف فارغ أو تعذر قراءته بشكل سليم.');
          return;
        }

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
          setImportError('تنسيق غير كافٍ: يجب أن يحتوي الملف على سطر للترويسة (العناوين) وسطر واحد من البيانات على الأقل.');
          return;
        }

        // تفتيش الترويسة للتأكد من الملاءمة والتحقق
        const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
        const hasName = headers.some(h => h.includes('الاسم') || h.toLowerCase().includes('name'));
        const hasEmail = headers.some(h => h.includes('البريد') || h.toLowerCase().includes('email') || h.toLowerCase().includes('mail'));

        if (!hasName || !hasEmail) {
          setImportError('فشل التحقق من التنسيق: يجب أن يحتوي الملف المستورد كحد أدنى على عمودي "الاسم" و "البريد الإلكتروني" بالترويسة لتمكين إلحاق الحسابات.');
          return;
        }

        // استخراج السجلات وإضافتها
        const importedUsers: UserProfile[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
          if (row.length < 2 || !row[0] || !row[1]) continue;

          importedUsers.push({
            name: row[0],
            email: row[1],
            role: row[2] || 'أخصائي سلاسل الإمداد الطبي',
            facility: row[3] || currentUser.facility || 'مستشفى السويس العام',
            avatarSeed: row[0].charAt(0)
          });
        }

        if (importedUsers.length === 0) {
          setImportError('تنسيق البيانات داخل ملف CSV غير صحيح أو الأعمدة فارغة.');
          return;
        }

        setUsersList(prev => [...prev, ...importedUsers]);
        setImportSuccess(`تم بنجاح استيراد ${importedUsers.length} مستخدم من الملف وإدراجهم بالنظام!`);
      } catch (err) {
        setImportError('حدث خطأ غير متوقع أثناء معالجة وقراءة ملف CSV. يرجى مراجعة التنسيق.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="user-management-view" className="space-y-8 py-2 text-right" dir="rtl">
      
      {/* هيدر الصفحة */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">بوابة إلحاق وإدارة مستخدمي المستشفى</h1>
        <p className="text-slate-400 dark:text-slate-50 text-sm mt-1">تتيح لك كمدير إمداد إنشاء حسابات طاقم المستودع، إرسال خطابات تفعيل الدخول، واستيراد وتصدير قائمة مستخدمي البوابة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* العمود الأيمن: نموذج إنشاء حساب جديد وتوليد الإيميل */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">إنشاء وتفويض حساب جديد للعمل بالنظام</h2>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">الاسم الثنائي / الثلاثي للمستخدم</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. كمال عثمان"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">البريد الإلكتروني المؤسسي</label>
                  <input
                    type="email"
                    required
                    placeholder="example@hospital.gov"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المسمى الوظيفي والدور اللوجستي</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="رئيس الصيادلة وأمين العهد">رئيس الصيادلة وأمين العهد</option>
                    <option value="أخصائي سلاسل الإمداد الطبي">أخصائي سلاسل الإمداد الطبي</option>
                    <option value="أمين مستودع المستلزمات">أمين مستودع المستلزمات</option>
                    <option value="مدير جرد المستودعات الطبية">مدير جرد المستودعات الطبية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">المنشأة الطبية التابع لها</label>
                  <input
                    type="text"
                    required
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {isSending ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/20">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>جاري إنشاء الحساب وإرسال البريد الترحيبي وتوليد رابط الأمان...</span>
                </div>
              ) : showNotification && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-900/20">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="block font-bold">تم تسجيل المستخدم وإرسال إيميل التفعيل!</span>
                    <span className="block text-[10px] mt-0.5 text-slate-400 dark:text-slate-500">يمكنك مشاهدة محاكاة صندوق البريد المستلم للمستخدم الجديد بالأسفل.</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-normal">
                  * سيتم إرسال بريد أمان مرمز تلقائياً يحتوي على زر تسجيل دخول بلمسة واحدة.
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد الإرسال والإنشاء</span>
                </button>
              </div>
            </form>
          </div>

          {/* محاكي الإيميل الوارد التفاعلي الفوري */}
          {sentEmailData && (
            <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Inbox className="w-5 h-5 text-indigo-500 animate-bounce" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">محاكي علبة الوارد للمستخدم الجديد (للتحقق من سلامة وصول الإيميل)</h3>
              </div>

              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden text-xs">
                {/* ترويسة الإيميل */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-150 dark:border-slate-800/80 space-y-1 text-slate-500 dark:text-slate-400">
                  <div><strong>من:</strong> نظام إدارة إمداد المستشفيات الموحد &lt;no-reply@suez-hospital.gov.eg&gt;</div>
                  <div><strong>إلى:</strong> {sentEmailData.name} &lt;{sentEmailData.email}&gt;</div>
                  <div><strong>الموضوع:</strong> دعوتك للوصول إلى لوحة المتابعة الطبية - {sentEmailData.facility}</div>
                </div>

                {/* محتوى الإيميل */}
                <div className="p-6 space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-slate-800 dark:text-slate-100">أهلاً بك زميلنا العزيز {sentEmailData.name}،</p>
                  
                  <p>
                    لقد قام زميلك <strong>{currentUser.name}</strong> ({currentUser.role}) بدعوتك للانضمام إلى منصة إدارة وتنبؤ المخزون اللوجستي لـ <strong>{sentEmailData.facility}</strong>.
                  </p>

                  <p>
                    تم تفويض حسابك الآن برتبة <strong>{sentEmailData.role}</strong> لتمكينك من جرد، مراجعة، وتقديم طلبات ROP الخاصة بالمستلزمات والأدوية الطبية.
                  </p>

                  <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/20 space-y-1">
                    <div className="font-bold text-blue-700 dark:text-blue-400">تفاصيل حسابك للمصادقة:</div>
                    <div>البريد الإلكتروني المعتمد: {sentEmailData.email}</div>
                    <div>المنشأة المعتمدة: {sentEmailData.facility}</div>
                    <div>الحالة: بانتظار الولوج الأول للتفعيل</div>
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUser({
                          name: sentEmailData.name,
                          email: sentEmailData.email,
                          role: sentEmailData.role,
                          facility: sentEmailData.facility,
                          avatarSeed: sentEmailData.name.charAt(0)
                        });
                      }}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 transition-transform active:scale-[0.98]"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>تفعيل الحساب والدخول كالمستخدم الجديد الآن</span>
                    </button>
                    <span className="block text-[10px] text-slate-400 mt-2">عند الضغط على الزر، سيتم تسجيل خروج الجلسة الحالية وتسجيل دخولك تلقائياً باسم {sentEmailData.name} للتجربة الفورية.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* العمود الأيسر: جدول مستخدمي النظام الحاليين + الاستيراد والتصدير */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* أزرار الاستيراد والتصدير المدمجة للامتثال لشرط الاستيراد والتصدير بكل الأماكن */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-3">تصدير واستيراد قائمة الموظفين والمستخدمين</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleExportUsers}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-bold"
                >
                  <Download className="w-5 h-5 text-emerald-500" />
                  <span>تصدير المستخدمين</span>
                </button>

                <label className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 font-bold text-center">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span>استيراد مستخدمين</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportUsers}
                    className="hidden"
                  />
                </label>
              </div>

              {importError && (
                <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/20 text-[10px]">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/20 text-[10px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}
            </div>

            {/* قائمة المستخدمين الحالية */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">المستخدمون المفوضون باللوحة ({usersList.length})</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">مستشفى السويس</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {usersList.map((usr, idx) => {
                  const isActiveUser = usr.email === currentUser.email;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                        isActiveUser 
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/70 dark:border-blue-900/40 shadow-xs' 
                          : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-extrabold uppercase">
                          {usr.avatarSeed}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{usr.name}</span>
                            {isActiveUser && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-blue-600 text-white text-[8px] font-extrabold">نشط حالياً</span>
                            )}
                          </div>
                          <span className="block text-slate-400 text-[10px] mt-0.5">{usr.role}</span>
                          <span className="block text-[10px] text-slate-400 font-mono" dir="ltr">{usr.email}</span>
                        </div>
                      </div>

                      {!isActiveUser && (
                        <button
                          type="button"
                          onClick={() => onSwitchUser(usr)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer"
                        >
                          بديل
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
