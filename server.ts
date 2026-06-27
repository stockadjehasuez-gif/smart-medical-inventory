import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// التوصيف الذاتي للشركة والحفاظ على سرية مفتاح الوصول
let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('مفتاح واجهة برمجة التطبيقات GEMINI_API_KEY غير متوفر في إعدادات التطبيق. يرجى تهيئته في لوحة التحكم.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// مسار فحص الحالة
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// مسار المساعد الذكي المعتمد على نموذج Gemini 3.5 Flash
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, inventory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    const ai = getAI();

    // صياغة سياق المخزون الطبي للذكاء الاصطناعي باللغة العربية
    let inventoryContext = '';
    if (inventory && Array.isArray(inventory)) {
      inventoryContext = inventory.map((item: any) => {
        const days = Math.round(item.quantity / ((item.monthlyConsumption / 30) || 1));
        return `- كود: ${item.id} | الاسم: ${item.name} | الفئة: ${item.category} | الكمية الحالية: ${item.quantity} | الاستهلاك الشهري: ${item.monthlyConsumption} | سعر الوحدة: ${item.unitPrice} | الحد الأدنى: ${item.minThreshold} | المورد: ${item.supplier} | أيام التغطية المتوقعة: ${days} يوم | تصنيف ABC: ${item.abcCategory || 'C'} | تصنيف XYZ: ${item.xyzCategory || 'X'}`;
      }).join('\n');
    }

    // صياغة التعليمات البرمجية الدقيقة للمستودع الطبي باللغة العربية
    const systemInstruction = `أنت خبير إمداد طبي وسلاسل توريد ذكي ومساعد متخصص في إدارة المخزون الطبي للمستشفيات والمراكز الصحية باللغة العربية.
مهمتك هي تحليل المخزون الطبي المتاح، الإجابة على استفسارات المستخدمين بدقة ووضوح واحترافية عالية، واقتراح كميات إعادة طلب ذكية وتحديد المخاطر.

سياق المخزون الطبي الفعلي الحالي في المستودع هو كالتالي:
${inventoryContext}

قواعد الإجابة:
1. أجب دائماً باللغة العربية الفصحى المبسطة وبطابع مهني وطبي واثق وسهل القراءة.
2. استخدم نقاطاً واضحة وجداول مبسطة عند عرض الإحصائيات أو الأصناف المقترحة لإعادة الطلب.
3. عند السؤال عن "الأصناف الحرجة"، حدد الأصناف التي تقل كميتها الحالية عن الحد الأدنى للمخزون أو التي ستنفد قريباً (أيام التغطية أقل من 15 يوم).
4. عند السؤال عن "تحليل ABC"، اشرح أن فئة A تمثل الأصناف الأعلى قيمة اقتصادية وتأثيراً (استهلاك سنوي مرتفع جداً)، وفئة B متوسطة، وفئة C منخفضة القيمة. اذكر أمثلة من قائمة المخزون.
5. شجع المستخدم على اتخاذ قرارات الشراء بناءً على ROP (نقطة إعادة الطلب الذكية) ومستوى الأمان.
6. إذا طلب المستخدم نصائح لتحسين سلاسل الإمداد الطبية، قدم توصيات واقعية ومبسطة كتقليل الرواكد ووضع كميات أمان ملائمة.
7. لا تتحدث عن الأكواد البرمجية الداخلية أو البنية التحتية للخوادم. ركز كلياً على الجانب الطبي اللوجستي وسلاسل الإمداد المخصصة للمستشفيات.`;

    // إعداد سجل المحادثة
    const contents = [];
    
    // إضافة سجل الدردشة السابق إذا وجد
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // إضافة الرسالة الحالية للمستخدم
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // استدعاء واجهة الذكاء الاصطناعي مع تعليمات النظام
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'عذراً، لم أتمكن من معالجة الطلب في الوقت الحالي.';
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'فشل في استدعاء الذكاء الاصطناعي',
      details: error.message || 'خطأ غير معروف في خادم المساعد الذكي.'
    });
  }
});

// تهيئة بيئة العمل المشتركة للواجهة الأمامية والخلفية
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // في بيئة التطوير، يتم دمج خادم Vite كميدل وير لخدمة الملفات بشكل فوري
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // في بيئة الإنتاج، نخدم الملفات الساكنة التي تم تجميعها في مجلد dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
