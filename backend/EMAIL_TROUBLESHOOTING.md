# راهنمای رفع مشکلات ارسال ایمیل

## مشکل: ایمیل ارسال می‌شود اما به دست گیرنده نمی‌رسد

### علل احتمالی:

#### 1. ایمیل در پوشه Spam/Junk افتاده
**راه حل:**
- پوشه Spam/Junk خود را بررسی کنید
- ایمیل را به عنوان "Not Spam" علامت بزنید
- آدرس ایمیل فرستنده را به Contacts اضافه کنید

#### 2. مشکلات SPF Record
**بررسی:**
```bash
nslookup -type=TXT mashaayekhi.ir
# یا
dig TXT mashaayekhi.ir
```

**راه حل:**
SPF record خود را در DNS تنظیمات دامنه اضافه کنید:
```
v=spf1 mx a ip4:YOUR_SERVER_IP ~all
```

جایگزین کردن `YOUR_SERVER_IP` با IP سرور شما.

#### 3. عدم وجود DKIM
DKIM یک امضای دیجیتال است که اصالت ایمیل را تأیید می‌کند.

**راه حل:**
از هاست خود بخواهید DKIM را فعال کند یا از پنل cPanel/DirectAdmin آن را تنظیم کنید.

#### 4. عدم وجود DMARC
**راه حل:**
یک DMARC record به DNS خود اضافه کنید:
```
_dmarc.mashaayekhi.ir TXT "v=DMARC1; p=none; rua=mailto:dmarc@mashaayekhi.ir"
```

#### 5. Reverse DNS (PTR Record)
بررسی کنید که IP سرور شما به دامنه شما reverse resolve می‌شود.

**بررسی:**
```bash
host YOUR_SERVER_IP
```

باید نام دامنه شما را نشان دهد.

#### 6. IP سرور در Blacklist
**بررسی:**
- https://mxtoolbox.com/blacklists.aspx
- https://www.spamhaus.org/lookup/

اگر IP شما در blacklist است، باید درخواست حذف دهید.

#### 7. Gmail Bulk Sender Guidelines
اگر به Gmail ارسال می‌کنید:
- از SPF، DKIM و DMARC استفاده کنید
- نرخ spam شکایت را پایین نگه دارید
- لینک unsubscribe اضافه کنید (در کد اضافه شده)

### تست و بررسی

#### 1. اجرای اسکریپت تست:
```bash
npm run test:email:delivery
```

#### 2. بررسی Mail Headers
در Gmail:
- ایمیل را باز کنید
- روی سه نقطه کلیک کنید
- "Show original" را انتخاب کنید
- بررسی کنید:
  - SPF: PASS
  - DKIM: PASS
  - DMARC: PASS

#### 3. استفاده از Gmail Postmaster Tools
https://postmaster.google.com

این ابزار به شما کمک می‌کند reputation دامنه خود را نزد Gmail ببینید.

#### 4. تست با mail-tester.com
یک ایمیل به آدرسی که mail-tester به شما می‌دهد بفرستید و امتیاز خود را ببینید.

### تنظیمات توصیه شده در .env

```env
# SMTP Settings
EMAIL_HOST=mail.mashaayekhi.ir
EMAIL_PORT=465
EMAIL_USER=noreply@mashaayekhi.ir
EMAIL_PASSWORD=your-password
EMAIL_FROM_NAME=پژوهش روانشناسی

# برای تست
TEST_EMAIL=your-email@gmail.com
```

### نکات مهم

1. **از subdomain استفاده کنید**: مثلاً `noreply@mashaayekhi.ir` به جای ایمیل شخصی
2. **Rate limiting**: تعداد ایمیل‌های ارسالی در ساعت را محدود کنید
3. **Warming up**: در ابتدا تعداد کم ایمیل بفرستید و به تدریج افزایش دهید
4. **Content quality**: از spam words جلوگیری کنید
5. **Unsubscribe link**: همیشه لینک unsubscribe اضافه کنید

### دستورات مفید

```bash
# تست اتصال SMTP
telnet mail.mashaayekhi.ir 465

# بررسی DNS records
dig mashaayekhi.ir ANY

# بررسی MX records
dig mashaayekhi.ir MX

# بررسی SPF
dig mashaayekhi.ir TXT

# بررسی DMARC
dig _dmarc.mashaayekhi.ir TXT
```

### منابع مفید

- [Google Email Sender Guidelines](https://support.google.com/mail/answer/81126)
- [SPF Record Generator](https://www.spfwizard.net/)
- [DMARC Guide](https://dmarc.org/)
- [MXToolbox](https://mxtoolbox.com/)
