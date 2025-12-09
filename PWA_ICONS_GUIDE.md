# راهنمای اضافه کردن آیکون‌های PWA

آیکون‌های فعلی در مسیر `frontend/public/` خالی هستند (0 byte). برای استفاده از PWA، باید آیکون‌های واقعی اضافه کنید.

## 📋 آیکون‌های مورد نیاز:

1. **icon-192x192.png** - آیکون استاندارد (192×192 پیکسل)
2. **icon-512x512.png** - آیکون با کیفیت بالا (512×512 پیکسل)
3. **badge-72x72.png** (اختیاری) - برای نوتیفیکیشن‌ها (72×72 پیکسل)
4. **favicon.ico** (اختیاری) - آیکون مرورگر

---

## 🎨 روش 1: استفاده از ابزار آنلاین (آسان)

### گام 1: طراحی یک آیکون اصلی

یک تصویر مربع با ابعاد حداقل **512×512 پیکسل** طراحی کنید. می‌توانید از:
- Canva: https://www.canva.com
- Figma: https://www.figma.com
- یا Photoshop

### گام 2: تولید خودکار سایزهای مختلف

از یکی از این سرویس‌ها استفاده کنید:

**RealFaviconGenerator** (توصیه می‌شود):
1. برو به: https://realfavicongenerator.net
2. تصویر اصلیت رو آپلود کن
3. گزینه‌های "Android Chrome" و "Web App Manifest" رو فعال کن
4. دکمه "Generate your Favicons and HTML code" رو بزن
5. فایل ZIP رو دانلود کن و فایل‌های زیر رو استخراج کن:
   - `android-chrome-192x192.png` → نام رو عوض کن به `icon-192x192.png`
   - `android-chrome-512x512.png` → نام رو عوض کن به `icon-512x512.png`

**PWA Asset Generator**:
```bash
npx @pwa/asset-generator [path-to-source-image] public/icons
```

---

## 🖼️ روش 2: طراحی دستی

### مشخصات آیکون:

**icon-192x192.png:**
- سایز: 192×192 پیکسل
- فرمت: PNG با پس‌زمینه شفاف یا رنگی
- کاربرد: نمایش در صفحه اصلی موبایل و App Drawer

**icon-512x512.png:**
- سایز: 512×512 پیکسل
- فرمت: PNG با پس‌زمینه شفاف یا رنگی
- کاربرد: نمایش در صفحه Splash Screen

**نکات طراحی:**
- از رنگ‌های ساده و قابل تشخیص استفاده کنید
- متن کوتاه یا لوگو (حداکثر 1-2 حرف برای وضوح)
- Padding کافی اطراف آیکون (حدود 10٪ از عرض)
- برای پس‌زمینه شفاف، از رنگ روشنی استفاده نکنید (در حالت Dark Mode بد به نظر می‌رسد)

---

## 📂 مسیر قرارگیری فایل‌ها:

بعد از آماده کردن آیکون‌ها، آن‌ها را در این مسیر قرار دهید:

```
frontend/public/
├── icon-192x192.png    ← آیکون استاندارد
├── icon-512x512.png    ← آیکون HD
├── badge-72x72.png     ← (اختیاری) برای نوتیفیکیشن
└── favicon.ico         ← (اختیاری) آیکون مرورگر
```

---

## 🎨 نمونه آیکون ساده با Text

اگر فعلاً وقت طراحی ندارید، می‌توانید با این کد HTML در Canva یک آیکون ساده بسازید:

### مشخصات:
- **پس‌زمینه**: رنگ ثابت (مثلاً #4F46E5 - رنگ Indigo)
- **متن**: "پژوهش" یا "PR" (Persian Research)
- **فونت**: فونت فارسی مثل Vazir یا IRANSans
- **رنگ متن**: سفید (#FFFFFF)

### مثال در Canva:
1. ساخت یک کادر مربع 512×512
2. پس‌زمینه: رنگ #4F46E5
3. متن: "پژوهش" یا "PR"
4. فونت: Bold، رنگ سفید
5. Export: PNG با کیفیت بالا

---

## ✅ تست آیکون‌ها:

بعد از اضافه کردن آیکون‌ها:

### گام 1: Build کردن Frontend

```bash
cd frontend
npm run build
```

### گام 2: بررسی در مرورگر

1. سایت رو باز کن
2. DevTools → Application → Manifest
3. ببین آیکون‌ها درست نمایش داده می‌شن یا نه

### گام 3: تست نصب PWA

1. در Chrome یا Edge، از منو "Install App" رو انتخاب کن
2. یا از `Inst all Prompt` که به صورت خودکار نمایش داده میشه استفاده کن
3. بعد از نصب، آیکون روی Home Screen رو بررسی کن

---

## 🔧 عیب‌یابی:

### مشکل: آیکون نمایش داده نمی‌شود

**راه حل:**
1. Cache مرورگر رو پاک کن
2. Service Worker رو Unregister کن:
   - DevTools → Application → Service Workers → Unregister
3. صفحه رو Refresh کن (Ctrl+Shift+R)

### مشکل: آیکون کیفیت پایینی داره

**راه حل:**
- از تصویر با Resolution بالاتر استفاده کن (حداقل 512×512)
- مطمئن شو فرمت PNG است (نه JPG)
- از Compression بیش از حد جلوگیری کن

---

## 📚 منابع:

- [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Icon Design Guidelines - Google](https://developers.google.com/web/fundamentals/web-app-manifest#icons)

---

## 🎯 خلاصه:

1. ✅ یک تصویر 512×512 طراحی کن
2. ✅ از ابزار آنلاین برای تولید سایزهای مختلف استفاده کن
3. ✅ فایل‌ها رو در `frontend/public/` قرار بده
4. ✅ Build کن و تست کن
5. ✅ PWA رو نصب کن و آیکون رو بررسی کن

**تاریخ ایجاد:** 2025-12-07
