import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, MessageSquare, AlertCircle, RefreshCw, ChevronLeft, Loader2 } from 'lucide-react';
import { MedicalItem, ChatMessage } from '../types';

interface AssistantViewProps {
  items: MedicalItem[];
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearHistory: () => void;
}

export default function AssistantView({
  items,
  chatHistory,
  onSendMessage,
  isLoading,
  errorMessage,
  onClearHistory
}: AssistantViewProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // الأسئلة الاسترشادية السريعة المطلوبة بالبرومبت
  const quickQuestions = [
    'ما هي الأصناف الحرجة؟',
    'ما الأصناف التي ستنفد خلال شهر؟',
    'ما قيمة المخزون الحالية؟',
    'ما أعلى الأصناف استهلاكاً؟',
    'ما الأصناف التي يجب طلبها هذا الأسبوع؟',
    'ما نسبة توافر المخزون؟',
    'ما نتائج تحليل ABC وخلاصته؟'
  ];

  // التمرير التلقائي لأسفل الدردشة عند تلقي رسالة جديدة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickQuestionClick = (q: string) => {
    if (isLoading) return;
    onSendMessage(q);
  };

  return (
    <div id="assistant-view-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 text-right animate-fade-in" dir="rtl">
      
      {/* القسم الجانبي: الأسئلة السريعة والنصائح الاستباقية */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">أسئلة استرشادية سريعة</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            انقر على أي سؤال من الأسئلة الجاهزة المعتمدة بالأدنى ليقوم مستشار التخطيط الذكي بتحليل مستودعك والرد فوراً:
          </p>
          
          <div className="flex flex-col gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleQuickQuestionClick(q)}
                className="w-full text-right px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-300 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-850/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{q}</span>
                <ChevronLeft className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xs space-y-3">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">ملاحظة حول أمن وسرية البيانات:</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            يقوم المساعد الذكي بمعالجة وفهم كود الصنف واسمه وفئته الحالية بشكل آلي على الخادم ومحمي بالكامل ولا يتم تخزين أي أسرار في المتصفح.
          </p>
        </div>
      </div>

      {/* لوحة الدردشة والمحادثة الحية */}
      <div className="lg:col-span-8 flex flex-col h-[75vh] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        
        {/* هيدر الدردشة */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
              <Bot className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="block font-black text-slate-800 dark:text-slate-100 text-sm">مستشار سلاسل الإمداد الطبي الذكي</span>
              <span className="block text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                متصل وجاهز للتحليل الفوري
              </span>
            </div>
          </div>

          <button 
            onClick={onClearHistory}
            className="text-slate-400 hover:text-rose-500 font-bold text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            مسح المحادثة
          </button>
        </div>

        {/* جسم الرسائل */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/10">
          
          {/* رسالة ترحيبية افتراضية من الذكاء الاصطناعي */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/10 text-xs text-slate-700 dark:text-slate-300 max-w-[85%] leading-relaxed">
              أهلاً بك! أنا مساعدك الذكي لإدارة المخزون الطبي المشترك بالمستشفى. 
              <br />
              لقد قمت بتحميل وفهم بيانات <strong>{items.length} أصناف طبية</strong> من مستودعك حالياً.
              <br />
              يمكنك سؤالي عن: الأصناف المهددة بالنفاد، قيمة المخزون، أو اقتراحات لإعادة طلب فئات ABC. كيف يمكنني مساعدتك اللوجستية اليوم؟
            </div>
          </div>

          {/* الرسائل المتبادلة */}
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-2xs ${
                  isUser 
                    ? 'bg-blue-600 text-white font-extrabold text-[10px]' 
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {isUser ? 'م' : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-2xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* مؤشر التحميل والتفكير */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-400 text-xs flex items-center gap-2">
                <span>جاري معالجة بيانات المستودع الطبي والتفكير...</span>
              </div>
            </div>
          )}

          {/* عرض رسالة خطأ الاتصال */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 text-xs rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <span className="block font-black text-sm">خطأ في الاتصال بالذكاء الاصطناعي</span>
                <p>{errorMessage}</p>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  تلميح: تأكد من إعداد مفتاح GEMINI_API_KEY بنجاح من قائمة الأسرار الجانبية في نظام التشغيل.
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* حقل إدخال الرسالة */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 bg-white dark:bg-slate-900">
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder="اكتب سؤالك هنا باللغة العربية (مثال: ما قيمة المخزون الحالي؟)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/50 dark:border-slate-800/80 focus:border-blue-500 focus:outline-hidden disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-500/10"
          >
            <Send className="w-4 h-4 scale-x-[-1]" />
            <span className="hidden md:inline">أرسل للتحليل</span>
          </button>
        </form>

      </div>

    </div>
  );
}
