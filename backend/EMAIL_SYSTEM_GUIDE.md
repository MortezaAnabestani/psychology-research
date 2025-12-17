# راهنمای کامل سیستم ارسال ایمیل

این فایل تمام شیوه‌های ارسال ایمیل در برنامه و بهبودهای اعمال شده را شرح می‌دهد.

## 📋 فهرست محتوا

1. [شیوه‌های ارسال ایمیل](#شیوه‌های-ارسال-ایمیل)
2. [بهبودهای اعمال شده](#بهبودهای-اعمال-شده)
3. [تنظیمات مورد نیاز](#تنظیمات-مورد-نیاز)
4. [نحوه تست](#نحوه-تست)
5. [رفع مشکلات رایج](#رفع-مشکلات-رایج)

---

## 🔄 شیوه‌های ارسال ایمیل

در این برنامه **5 شیوه ارسال ایمیل** وجود دارد:

### 1️⃣ ایمیل خوش‌آمدگویی (Welcome Email)

**محل:** `backend/src/routes/auth.ts` (خطوط 27-45)

**زمان ارسال:** هنگام ثبت‌نام کاربر جدید

**محتوا:**
- پیام خوش‌آمدگویی
- اطلاعات ورود (ایمیل)
- لینک ورود به سایت
- توصیه به تغییر رمز عبور

**نحوه کار:**
```typescript
const emailResult = await sendEmail(
  email,
  "خوش آمدید به برنامه پژوهش",
  htmlContent
);

if (!emailResult.success) {
  console.warn(`⚠️ Welcome email failed: ${emailResult.error}`);
}
```

**نکته:** عدم ارسال ایمیل مانع ثبت‌نام کاربر نمی‌شود.

---

### 2️⃣ ایمیل نوتیفیکیشن تمرین (Exercise Notification)

**محل:** `backend/src/services/notificationService.ts` (خطوط 157-201)

**زمان ارسال:** براساس زمان‌بندی تمرینات

**محتوا:**
- پیام یادآوری تمرین
- لینک مستقیم به تمرین

**نحوه کار:**
```typescript
static async sendEmailNotification(notificationId: string) {
  // دریافت اطلاعات نوتیفیکیشن و کاربر
  // بررسی معتبر بودن ایمیل
  const result = await sendEmail(user.email, subject, html);

  if (result.success) {
    // ثبت زمان ارسال
    notification.sentAt = new Date();
    await notification.save();
  }
}
```

**بهبودها:**
- ✅ بررسی وجود کاربر و ایمیل معتبر
- ✅ فقط در صورت موفقیت، زمان ارسال ثبت می‌شود
- ✅ خطاها لاگ می‌شوند

---

### 3️⃣ ایمیل یادآوری تمرین ناتمام (Incomplete Exercise Reminder)

**محل:** `backend/src/services/cronJobs.ts` (خطوط 36-77)

**زمان ارسال:** روزانه ساعت 20:00 (Cron Job)

**شرط ارسال:** تمرینات در حال انجام که بیش از 24 ساعت به آن‌ها دسترسی نداشته

**محتوا:**
- یادآوری تمرین ناتمام
- لینک ادامه تمرین

**نحوه کار:**
```typescript
cron.schedule("0 20 * * *", async () => {
  const incompleteExercises = await UserExercise.find({
    status: "in_progress",
    lastAccessedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  for (const exercise of incompleteExercises) {
    if (!user?.email) continue;

    const result = await sendEmail(...);
    // مدیریت خطا
  }
});
```

**بهبودها:**
- ✅ بررسی وجود ایمیل قبل از ارسال
- ✅ استفاده از `continue` برای کاربران بدون ایمیل
- ✅ لاگ کردن خطاها

---

### 4️⃣ ایمیل گروهی (Bulk Message)

**محل:** `backend/src/routes/admin.ts` (خطوط 784-836)

**کاربر:** فقط ادمین

**کاربرد:** ارسال پیام دسته‌جمعی به کاربران

**محتوا:** محتوای دلخواه ادمین

**نحوه کار:**
```typescript
for (const user of users) {
  if (!user.email) {
    errors++;
    continue;
  }

  const result = await sendEmail(user.email, subject, html);

  if (result.success) {
    emailSent++;
  } else {
    errors++;
    console.error(`Failed: ${result.error}`);
  }
}

// بازگشت آمار
res.json({
  stats: { totalUsers, emailSent, smsSent, errors }
});
```

**بهبودها:**
- ✅ شمارش دقیق ایمیل‌های موفق و ناموفق
- ✅ برگشت آمار کامل به ادمین
- ✅ مدیریت کاربران بدون ایمیل

---

### 5️⃣ ایمیل تست (Test Email)

**محل:** `backend/src/test-notifications.ts` (خطوط 90-161)

**کاربرد:** تست سیستم ایمیل

**محتوا:**
- پیام تست موفقیت‌آمیز
- اطلاعات تنظیمات SMTP
- زمان ارسال

**نحوه استفاده:**
```bash
cd backend
npm run test:notifications
```

**بهبودها:**
- ✅ استفاده از API جدید با مدیریت خطا
- ✅ راهنمایی برای خطاهای رایج
- ✅ پیام‌های واضح و مفید

---

## ✨ بهبودهای اعمال شده

### 1. تغییر تایپ بازگشتی `sendEmail`

**قبل:**
```typescript
export const sendEmail = async (to: string, subject: string, html: string) => {
  // در صورت خطا، throw می‌کرد
  throw error;
}
```

**بعد:**
```typescript
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> => {
  // در صورت خطا، شیء با جزئیات برمی‌گرداند
  return { success: false, error: "..." };
}
```

**مزایا:**
- ✅ عدم نیاز به try/catch در همه جا
- ✅ مدیریت یکپارچه خطاها
- ✅ امکان ادامه اجرای برنامه حتی در صورت خطا

---

### 2. اعتبارسنجی آدرس ایمیل

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(to)) {
  return { success: false, error: `Invalid email address: ${to}` };
}
```

**مزایا:**
- ✅ جلوگیری از ارسال به ایمیل‌های نامعتبر
- ✅ کاهش خطاهای SMTP
- ✅ صرفه‌جویی در منابع

---

### 3. بررسی تنظیمات قبل از ارسال

```typescript
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  return {
    success: false,
    error: "Email configuration is not complete"
  };
}
```

**مزایا:**
- ✅ پیام خطای واضح
- ✅ عدم crash برنامه
- ✅ راهنمایی کاربر

---

### 4. پیام‌های خطای بهتر

```typescript
let errorMessage = error.message;
if (error.message.includes("Authentication failed")) {
  errorMessage = "Authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD";
} else if (error.message.includes("ETIMEDOUT")) {
  errorMessage = "Connection failed. Please check EMAIL_HOST and EMAIL_PORT";
}
```

**مزایا:**
- ✅ راهنمایی دقیق برای رفع مشکل
- ✅ شناسایی خودکار نوع خطا
- ✅ کاهش زمان debugging

---

### 5. استفاده از EMAIL_FROM_NAME

```typescript
from: `"${process.env.EMAIL_FROM_NAME || "پژوهش روانشناسی"}" <${process.env.EMAIL_USER}>`
```

**مزایا:**
- ✅ قابلیت سفارشی‌سازی نام فرستنده
- ✅ ظاهر حرفه‌ای‌تر ایمیل‌ها
- ✅ مقدار پیش‌فرض برای راحتی

---

### 6. لاگ کردن MessageID

```typescript
console.log(`✅ Email sent successfully to ${to} - MessageID: ${info.messageId}`);
```

**مزایا:**
- ✅ امکان ردیابی ایمیل‌ها
- ✅ debugging آسان‌تر
- ✅ گزارش‌گیری بهتر

---

## ⚙️ تنظیمات مورد نیاز

فایل `.env` را ویرایش کنید:

```bash
# تنظیمات ایمیل
EMAIL_USER=mail@yourdomain.com
EMAIL_PASSWORD=your-password-here
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_FROM_NAME=پژوهش روانشناسی

# آدرس فرانت‌اند (برای لینک‌ها در ایمیل)
CLIENT_URL=https://yourdomain.com
```

### راهنمای انتخاب پورت:

- **587**: TLS/STARTTLS (توصیه می‌شود)
- **465**: SSL
- **25**: بدون رمزنگاری (توصیه نمی‌شود)

---

## 🧪 نحوه تست

### 1. تست کامل سیستم

```bash
cd backend
npm run test:notifications
```

این اسکریپت موارد زیر را تست می‌کند:
- ✅ تنظیمات ایمیل
- ✅ تنظیمات SMS
- ✅ ارسال ایمیل واقعی
- ✅ بررسی خطاها

---

### 2. تست مستقیم (بدون استفاده از email.ts)

```bash
cd backend
npx ts-node src/test-direct-email.ts
```

این اسکریپت:
- ✅ مستقیماً با nodemailer کار می‌کند
- ✅ لاگ‌های کامل debug نشان می‌دهد
- ✅ برای troubleshooting عمیق مفید است

---

### 3. تست در کد

```typescript
import { sendEmail } from './config/email';

const result = await sendEmail(
  'test@example.com',
  'Test Subject',
  '<h1>Test</h1>'
);

if (result.success) {
  console.log('✅ Email sent');
} else {
  console.error('❌ Failed:', result.error);
}
```

---

## 🔧 رفع مشکلات رایج

### مشکل 1: Authentication Failed

**علت:** نام کاربری یا رمز عبور اشتباه

**راه حل:**
1. `EMAIL_USER` و `EMAIL_PASSWORD` را در `.env` بررسی کنید
2. مطمئن شوید فضای خالی اضافی ندارند
3. برای Gmail، از App Password استفاده کنید (نه رمز عبور اصلی)

---

### مشکل 2: Connection Timeout

**علت:** مشکل در اتصال به سرور SMTP

**راه حل:**
1. `EMAIL_HOST` و `EMAIL_PORT` را بررسی کنید
2. فایروال سرور را چک کنید
3. پورت 587 را امتحان کنید
4. از `telnet EMAIL_HOST EMAIL_PORT` برای تست اتصال استفاده کنید

---

### مشکل 3: Invalid Email Address

**علت:** فرمت ایمیل نامعتبر

**راه حل:**
1. ایمیل‌ها باید به صورت `user@domain.com` باشند
2. فضاهای خالی را حذف کنید
3. کاراکترهای خاص نامعتبر را بردارید

---

### مشکل 4: ایمیل به Spam می‌رود

**راه حل:**
1. SPF Record را در DNS تنظیم کنید
2. DKIM را فعال کنید
3. از ایمیل تجاری استفاده کنید (نه Gmail رایگان)
4. محتوای ایمیل را بهینه کنید
5. از لینک‌های مشکوک خودداری کنید

---

### مشکل 5: تنظیمات ایمیل وجود ندارد

**پیام خطا:**
```
Email configuration is not complete. Please set EMAIL_USER and EMAIL_PASSWORD
```

**راه حل:**
1. فایل `.env` را در ریشه `backend` بسازید
2. `EMAIL_USER` و `EMAIL_PASSWORD` را تنظیم کنید
3. سرور را restart کنید

---

## 📊 مقایسه قبل و بعد

| ویژگی | قبل | بعد |
|-------|-----|-----|
| مدیریت خطا | throw می‌کرد | شیء با جزئیات برمی‌گرداند |
| اعتبارسنجی ایمیل | ❌ | ✅ |
| پیام خطای واضح | ❌ | ✅ |
| بررسی تنظیمات | جزئی | کامل |
| لاگ MessageID | ❌ | ✅ |
| نام فرستنده سفارشی | ❌ | ✅ |
| مدیریت کاربران بدون ایمیل | ضعیف | قوی |
| آمار ارسال گروهی | ناقص | کامل |

---

## 🎯 نتیجه‌گیری

سیستم ارسال ایمیل با بهبودهای زیر به‌روزرسانی شد:

1. ✅ **مدیریت خطای بهتر** - عدم crash برنامه در صورت خطا
2. ✅ **اعتبارسنجی کامل** - بررسی ایمیل و تنظیمات قبل از ارسال
3. ✅ **پیام‌های واضح** - راهنمایی دقیق برای رفع مشکلات
4. ✅ **لاگ کامل** - ردیابی آسان ایمیل‌ها
5. ✅ **قابلیت سفارشی‌سازی** - استفاده از EMAIL_FROM_NAME
6. ✅ **مقاوم‌تر** - ادامه کار حتی در صورت خطا

---

## 📞 پشتیبانی

در صورت بروز مشکل:

1. لاگ‌های سرور را بررسی کنید
2. اسکریپت‌های تست را اجرا کنید
3. این مستندات را مطالعه کنید
4. از ChatGPT برای کمک استفاده کنید

---

**تاریخ به‌روزرسانی:** 2025-12-17

**نسخه:** 2.0
