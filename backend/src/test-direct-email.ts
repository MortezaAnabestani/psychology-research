/**
 * تست ارسال ایمیل مستقیم (بدون استفاده از email.ts)
 */

import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// بارگذاری .env
dotenv.config();

console.log('='.repeat(60));
console.log('📧 تست ارسال ایمیل مستقیم');
console.log('='.repeat(60));

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;
const emailPort = parseInt(process.env.EMAIL_PORT || '587');

console.log('\nتنظیمات:');
console.log(`  Host: ${emailHost}`);
console.log(`  Port: ${emailPort}`);
console.log(`  User: ${emailUser}`);
console.log(`  Pass: ${emailPass ? '***' : 'EMPTY!'}`);

if (!emailUser || !emailPass) {
  console.log('\n❌ EMAIL_USER یا EMAIL_PASSWORD تنظیم نشده!');
  process.exit(1);
}

const isSecure = emailPort === 465;

console.log(`  Secure: ${isSecure}`);
console.log('\n' + '-'.repeat(60));

// ساخت transporter
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: isSecure,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false, // برای تست
  },
  debug: true, // فعال کردن debug
  logger: true, // فعال کردن logger
});

console.log('✅ Transporter ساخته شد\n');

// ارسال ایمیل تست
async function sendTestEmail() {
  try {
    console.log('📨 در حال ارسال ایمیل تست...\n');

    const info = await transporter.sendMail({
      from: `"پژوهش روانشناسی - تست" <${emailUser}>`,
      to: emailUser, // به خودمان می‌فرستیم
      subject: '✅ تست موفق - ایمیل سیستم کار می‌کند!',
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px;">
          <h1 style="color: #4CAF50;">🎉 عالی!</h1>
          <p>سیستم ایمیل با موفقیت راه‌اندازی شد.</p>
          <p><strong>زمان ارسال:</strong> ${new Date().toLocaleString('fa-IR')}</p>
          <hr>
          <p style="color: #999; font-size: 12px;">پژوهش روانشناسی - سیستم ارسال خودکار</p>
        </div>
      `,
    });

    console.log('\n✅ ایمیل با موفقیت ارسال شد!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📊 Response: ${info.response}`);

  } catch (error: any) {
    console.log('\n❌ خطا در ارسال:');
    console.log(error);
  }
}

sendTestEmail();
