# 🧠 سیستم مدیریت پژوهش روانشناسی

یک سیستم جامع و حرفه‌ای برای مدیریت پرسشنامه‌های پژوهش روانشناسی با قابلیت پیگیری مراجعان، ارسال نوتیفیکیشن‌های هوشمند و تحلیل آماری پیشرفته.

## ✨ ویژگی‌های کلیدی

### 🔐 سیستم احراز هویت

- ورود و ثبت‌نام امن با JWT
- دو نقش: **ادمین** و **مراجع**
- تغییر رمز عبور
- مدیریت پروفایل کاربری

### 👨‍💼 پنل مدیریت (ادمین)

- **داشبورد جامع** با نمودارهای تعاملی
- **مدیریت مراجعان:** افزودن، ویرایش، حذف و اختصاص به گروه‌ها
- **ساخت تمرین سفارشی:** قابلیت ساخت تمرین با انواع فیلدها
- **گزارش‌های پیشرفته:** نمودارهای مختلف و آمار تفصیلی
- **Export داده‌ها:** دانلود Excel کامل از پاسخ‌های مراجعان
- **تنظیمات پیشرفته:** مدیریت دسترسی‌ها و زمان‌بندی‌ها

### 👤 پنل کاربری (مراجع)

- **داشبورد شخصی:** نمایش پیشرفت و تمرین‌های در دسترس
- **انجام تمرین‌ها:** رابط کاربری ساده و کاربرپسند
- **ذخیره موقت:** امکان ادامه تمرین‌های ناتمام
- **تاریخچه:** دسترسی به تمرین‌های گذشته (قابل کنترل توسط ادمین)
- **نوتیفیکیشن‌ها:** دریافت یادآوری‌های به موقع

### 📊 دو گروه پژوهشی

#### گروه کنترل (خودپایشی)

1. پیش‌بینی موقعیت اجتماعی
2. توجه به افکار و احساسات در لحظه
3. یادآوری رویداد اجتماعی
4. ثبت رویدادهای تعاملی روزانه
5. پیش‌بینی مهم‌ترین رویداد روز

#### گروه مداخله (تجویز هیجان مثبت)

1. مزه‌مزه‌کردن لحظه‌های کوچک
2. تجربه تضاد هیجانی
3. پیش‌بینی مثبت
4. تمرکز روی لحظات خوشایند
5. شمارش موفقیت‌های کوچک

### 🔔 سیستم نوتیفیکیشن هوشمند

- **ارسال خودکار:** پیام‌های زمان‌بندی‌شده بر اساس تنظیمات
- **سه نوع پیام:**
  - پیام صبحگاهی (زمان انتخابی کاربر)
  - پیام‌های تصادفی (در بازه‌های زمانی مشخص)
  - پیام‌های زمان‌بندی‌شده (ساعت ثابت)
- **دو کانال ارسال:**
  - Push Notification (PWA)
  - ایمیل
- **یادآوری خودکار:** برای تمرین‌های ناتمام

### 📱 PWA (Progressive Web App)

- **نصب روی گوشی:** تجربه app-like
- **آفلاین:** امکان کار بدون اینترنت
- **نوتیفیکیشن‌های پوش:** دریافت اعلان‌ها مانند اپلیکیشن
- **سرعت بالا:** بارگذاری سریع و کارآمد

### 📈 تحلیل و آمار

- **نمودارهای تعاملی:** Pie Chart, Bar Chart, Line Chart
- **آمار لحظه‌ای:** تعداد مراجعان، نرخ تکمیل، فعالیت‌های اخیر
- **مقایسه گروه‌ها:** تحلیل تفاوت بین گروه کنترل و مداخله
- **Export Excel:** دانلود کامل داده‌ها برای تحلیل در نرم‌افزارهای آماری

## 🛠️ تکنولوژی‌های استفاده‌شده

### Backend

- **Node.js** + **Express**: سرور RESTful API
- **TypeScript**: Type-safe development
- **MongoDB** + **Mongoose**: پایگاه داده NoSQL
- **JWT**: احراز هویت امن
- **Nodemailer**: ارسال ایمیل
- **Web-Push**: نوتیفیکیشن‌های پوش
- **Node-Cron**: زمان‌بندی خودکار
- **ExcelJS**: تولید فایل Excel

### Frontend

- **React** + **TypeScript**: کتابخانه UI
- **React Router**: مدیریت مسیرها
- **Axios**: ارتباط با API
- **Tailwind CSS**: استایل‌دهی مدرن
- **Recharts**: نمودارهای تعاملی
- **Lucide React**: آیکون‌های زیبا

## 📦 ساختار پروژه

```
psychology-research/
├── backend/
│   ├── src/
│   │   ├── config/         # تنظیمات (DB, Email)
│   │   ├── middleware/     # Auth, Error Handler
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # Business Logic
│   │   ├── seeds/          # داده‌های اولیه
│   │   └── types/          # TypeScript Types
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── context/        # Context API
│   │   ├── pages/          # صفحات اصلی
│   │   └── utils/          # توابع کمکی
│   └── public/
│       ├── manifest.json   # PWA Manifest
│       └── service-worker.js
└── README.md
```

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

```bash
Node.js v18+
MongoDB v6+
npm or yarn
```

### مراحل نصب

1. **Clone کردن پروژه**

```bash
git clone <repository-url>
cd psychology-research
```

2. **نصب Backend**

```bash
cd backend
npm install
cp .env.example .env
# ویرایش فایل .env
npm run seed
npm run dev
```

3. **نصب Frontend**

```bash
cd frontend
npm install
cp .env.example .env
# ویرایش فایل .env
npm start
```

4. **دسترسی به سایت**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### اطلاعات ورود پیش‌فرض

```
ایمیل: admin@example.com

رمز عبور: admin123
```

## 📚 مستندات API

### Authentication

```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
PUT  /api/auth/change-password
POST /api/auth/subscribe (Push notifications)
```

### Admin Routes

```
GET  /api/admin/clients
POST /api/admin/clients
PUT  /api/admin/clients/:id
DELETE /api/admin/clients/:id
POST /api/admin/assign-group
GET  /api/admin/templates
POST /api/admin/templates
GET  /api/admin/statistics
GET  /api/admin/export
```

### Client Routes

```
GET  /api/client/dashboard
GET  /api/client/exercises/available
GET  /api/client/exercises/history
POST /api/client/set-notification-time
```

### Exercise Routes

```
GET  /api/exercises/:id
POST /api/exercises/:id/response
POST /api/exercises/:id/start
```

### Notification Routes

```
GET  /api/notifications
PUT  /api/notifications/:id/read
PUT  /api/notifications/:id/clicked
```

## 🔒 امنیت

- **JWT Authentication**: توکن‌های امن با انقضای 30 روزه
- **Password Hashing**: bcrypt با salt rounds 12
- **CORS Protection**: محدودیت دامنه‌های مجاز
- **Helmet**: تنظیمات امنیتی HTTP headers
- **Rate Limiting**: محدودیت درخواست‌ها (قابل افزودن)
- **Input Validation**: اعتبارسنجی ورودی‌ها

## 📊 نمونه داده‌های Export

فایل Excel شامل:

- اطلاعات مراجع (نام، ایمیل، تاریخ ثبت‌نام)
- نوع گروه (کنترل/مداخله)
- عنوان و شماره تمرین
- پاسخ‌های کامل
- تاریخ شروع و اتمام
- زمان صرف‌شده

## 🎨 طراحی UI/UX

### پنل ادمین

- رنگ اصلی: Indigo (#6366F1)
- لی‌اوت: Sidebar + Main Content
- نمودارهای متنوع و جذاب
- Responsive برای همه دستگاه‌ها

### پنل کاربر

- طراحی ساده و کاربرپسند
- گرادیانت‌های نرم
- فونت واضح و خوانا (راست‌چین)
- دکمه‌های بزرگ و قابل کلیک

## 🧪 تست

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deploy

### Backend (PM2)

```bash
npm run build
pm2 start dist/app.js --name psychology-api
```

### Frontend (Build)

```bash
npm run build
# Deploy build folder to static hosting
```

## 📝 TODO / Future Features

- [ ] چت آنلاین بین ادمین و مراجع
- [ ] ویدئوکال برای جلسات مشاوره
- [ ] یادداشت‌های شخصی مراجع
- [ ] گزارش PDF برای ادمین
- [ ] تحلیل متنی پاسخ‌ها با AI
- [ ] چند زبانه (فارسی/انگلیسی)
- [ ] اپلیکیشن موبایل Native

## 🤝 مشارکت

1. Fork کردن پروژه
2. ساخت branch جدید (`git checkout -b feature/AmazingFeature`)
3. Commit تغییرات (`git commit -m 'Add some AmazingFeature'`)
4. Push به branch (`git push origin feature/AmazingFeature`)
5. باز کردن Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 توسعه‌دهنده

ساخته شده با ❤️ برای پیشرفت علم روانشناسی

## 📧 تماس

- ایمیل: support@example.com
- وبسایت: https://example.com

---

**⭐ اگر این پروژه برای شما مفید بود، لطفاً یک ستاره بدهید!**
