# راهنمای سریع راه‌اندازی (Quick Start)

این راهنما برای راه‌اندازی سریع پروژه روی هاست است.

---

## گام 1️⃣: آپلود فایل‌های پروژه

فایل‌های پروژه را روی هاست آپلود کنید:
```
/home/user/psychology-research/
├── backend/
├── frontend/
└── ...
```

---

## گام 2️⃣: نصب Dependencies

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## گام 3️⃣: تنظیم فایل .env

### 📁 مسیر: `backend/.env`

فایل `.env` را در مسیر `backend/` ایجاد کنید و تنظیمات زیر را وارد کنید:

```env
# ==============================================
# DATABASE
# ==============================================
MONGODB_URI=mongodb://localhost:27017/psychology-research
# یا برای MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/psychology-research

# ==============================================
# SERVER
# ==============================================
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# ==============================================
# JWT
# ==============================================
JWT_SECRET=your-jwt-secret-here

# ==============================================
# EMAIL (ایمیل)
# ==============================================
EMAIL_USER=mail@mashaayekhi.ir
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=mail.mashaayekhi.ir
EMAIL_PORT=587

# ==============================================
# SMS (پیامک - کاوه‌نگار)
# ==============================================
KAVENEGAR_API_KEY=your-kavenegar-api-key
KAVENEGAR_SENDER=10008663

# ==============================================
# WEB PUSH
# ==============================================
VAPID_EMAIL=mail@mashaayekhi.ir
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 🔐 نکات امنیتی:
```bash
# محدود کردن دسترسی به فایل .env:
chmod 600 backend/.env
```

---

## گام 4️⃣: پیدا کردن تنظیمات ایمیل از cPanel

### روش 1: از Email Accounts

1. وارد **cPanel** هاست شوید
2. به بخش **Email Accounts** (حساب‌های ایمیل) بروید
3. روی دکمه **Connect Devices** کنار ایمیل خود کلیک کنید
4. تنظیمات SMTP را یادداشت کنید:

```
Incoming Server: mail.mashaayekhi.ir
Outgoing Server (SMTP): mail.mashaayekhi.ir
SMTP Port: 587
Username: mail@mashaayekhi.ir
Password: [رمز عبور ایمیل شما]
```

### روش 2: از MX Entry

1. در cPanel به بخش **MX Entry** بروید
2. سرور mail را یادداشت کنید (معمولاً `mail.yourdomain.com`)

### پورت‌های معمول:
- **587**: TLS/STARTTLS ✅ (توصیه می‌شود)
- **465**: SSL
- **25**: بدون رمزنگاری (توصیه نمی‌شود)

---

## گام 5️⃣: دریافت API Key کاوه‌نگار

### اگر هنوز حساب ندارید:

1. به https://panel.kavenegar.com بروید
2. ثبت‌نام کنید
3. احراز هویت کنید (1-2 روز کاری)
4. اعتبار خود را شارژ کنید

### دریافت API Key:

1. وارد پنل کاوه‌نگار شوید
2. **تنظیمات** > **API Key**
3. کلید را کپی کرده و در `.env` قرار دهید

### سرویس مورد نیاز:
- **سرویس پایه (Simple Send)**: برای ارسال پیامک‌های ساده
- برآورد هزینه: حدود 40 ریال به ازای هر پیامک
- **پیشنهاد شارژ اولیه**: بسته 5000 پیامکی (حدود 200 هزار تومان)

---

## گام 6️⃣: تولید کلیدهای VAPID

برای نوتیفیکیشن‌های وب:

```bash
# نصب ابزار
npm install -g web-push

# تولید کلیدها
web-push generate-vapid-keys
```

خروجی را در `.env` قرار دهید.

---

## گام 7️⃣: Build کردن پروژه

### Backend:
```bash
cd backend
npm run build
```

### Frontend:
```bash
cd frontend
npm run build
```

---

## گام 8️⃣: تست تنظیمات

### تست ایمیل و SMS:
```bash
cd backend
npm run test:notifications
```

این اسکریپت:
- ✅ تنظیمات را بررسی می‌کند
- ✅ یک ایمیل تست ارسال می‌کند
- ✅ وضعیت SMS را چک می‌کند

---

## گام 9️⃣: راه‌اندازی سرور

### روش 1: استفاده از PM2 (توصیه می‌شود)

```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی Backend
cd backend
pm2 start dist/app.js --name psychology-backend

# مشاهده لاگ‌ها
pm2 logs psychology-backend

# راه‌اندازی خودکار با بوت سیستم
pm2 startup
pm2 save
```

### روش 2: استفاده از node مستقیم

```bash
cd backend
npm start
```

---

## گام 🔟: Seed کردن دیتابیس

اگر دیتابیس خالی است، داده‌های اولیه را اضافه کنید:

```bash
cd backend
npm run seed
```

این دستور:
- یک حساب ادمین ایجاد می‌کند
- تمپلیت‌های تمرین را اضافه می‌کند

### اطلاعات ورود ادمین:
```
ایمیل: admin@mashaayekhi.ir
رمز عبور: admin123456
```

**⚠️ مهم:** بعد از اولین ورود، رمز عبور را تغییر دهید!

---

## ✅ چک‌لیست نهایی

- [ ] فایل‌ها روی هاست آپلود شدند
- [ ] Dependencies نصب شدند (npm install)
- [ ] فایل `.env` ایجاد و تنظیم شد
- [ ] تنظیمات ایمیل از cPanel دریافت شد
- [ ] API Key کاوه‌نگار دریافت و تنظیم شد
- [ ] کلیدهای VAPID تولید شدند
- [ ] پروژه build شد (npm run build)
- [ ] تست تنظیمات انجام شد (npm run test:notifications)
- [ ] دیتابیس seed شد (npm run seed)
- [ ] سرور با PM2 راه‌اندازی شد
- [ ] Frontend هم راه‌اندازی شد
- [ ] رمز عبور ادمین تغییر کرد

---

## 🆘 کمک و پشتیبانی

### مشکلات رایج:

#### ❌ "Cannot connect to MongoDB"
```bash
# بررسی کنید که MongoDB روی سرور نصب و اجرا شده باشد:
sudo systemctl status mongod

# یا از MongoDB Atlas استفاده کنید
```

#### ❌ "Email sending failed"
```bash
# تست تنظیمات ایمیل:
npm run test:notifications

# بررسی لاگ‌ها:
pm2 logs psychology-backend
```

#### ❌ "SMS not sending"
- موجودی کاوه‌نگار را چک کنید
- API Key را دوباره بررسی کنید
- شماره‌های گیرنده را بررسی کنید (باید فرمت صحیح داشته باشند)

### مستندات تفصیلی:

برای اطلاعات بیشتر:
- 📄 **EMAIL_SMS_SETUP.md**: راهنمای کامل تنظیمات ایمیل و SMS
- 📄 **README.md**: مستندات کامل پروژه

---

## 📞 تماس

در صورت بروز مشکل، لاگ‌های خطا را بررسی کنید:

```bash
# لاگ‌های PM2:
pm2 logs

# لاگ‌های Node.js:
tail -f /path/to/logs/app.log
```

---

**آخرین به‌روزرسانی:** 2025-12-07
