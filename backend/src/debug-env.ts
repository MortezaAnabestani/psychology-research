/**
 * اسکریپت Debug برای بررسی متغیرهای محیطی
 */

import * as dotenv from 'dotenv';

// بارگذاری .env
dotenv.config();

console.log('='.repeat(60));
console.log('🔍 بررسی متغیرهای محیطی (.env)');
console.log('='.repeat(60));

const vars = [
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_HOST',
  'EMAIL_PORT',
];

for (const varName of vars) {
  const value = process.env[varName];

  if (!value) {
    console.log(`❌ ${varName}: undefined یا خالی`);
  } else if (value.trim() === '') {
    console.log(`❌ ${varName}: رشته خالی (فقط فضای خالی)`);
  } else {
    // نمایش طول و کاراکترهای اول/آخر برای debug
    const displayValue = varName.includes('PASSWORD')
      ? `${value.substring(0, 3)}*** (طول: ${value.length})`
      : `${value} (طول: ${value.length})`;

    console.log(`✅ ${varName}: ${displayValue}`);

    // چک کردن فضای خالی اضافی
    if (value !== value.trim()) {
      console.log(`   ⚠️  توجه: فضای خالی اضافی در ابتدا یا انتها وجود دارد!`);
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log('📋 بررسی فرمت:');
console.log('='.repeat(60));

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;

if (emailUser) {
  if (!emailUser.includes('@')) {
    console.log('❌ EMAIL_USER باید شامل @ باشد (مثل: mail@mashaayekhi.ir)');
  } else {
    console.log('✅ EMAIL_USER فرمت صحیحی دارد');
  }
}

if (emailHost) {
  if (emailHost.includes('@')) {
    console.log('❌ EMAIL_HOST نباید شامل @ باشد (باید فقط mail.mashaayekhi.ir باشد)');
  } else {
    console.log('✅ EMAIL_HOST فرمت صحیحی دارد');
  }
}

if (emailPass) {
  if (emailPass.length < 3) {
    console.log('⚠️  EMAIL_PASSWORD خیلی کوتاه است');
  } else {
    console.log('✅ EMAIL_PASSWORD طول مناسبی دارد');
  }
}

console.log('\n' + '='.repeat(60));
console.log('🔐 تست اتصال nodemailer:');
console.log('='.repeat(60));

import nodemailer from 'nodemailer';

const emailPort = parseInt(process.env.EMAIL_PORT || "587");
const isSecure = emailPort === 465;

console.log(`
تنظیمات nodemailer:
  host: ${emailHost}
  port: ${emailPort}
  secure: ${isSecure}
  user: ${emailUser}
  pass: ${emailPass ? '***' : 'خالی!'}
`);

try {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: isSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  console.log('✅ Transporter ساخته شد');

  // تست verify
  console.log('\n🔄 در حال تست اتصال به سرور...');
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ خطا در اتصال به سرور SMTP:');
      console.log(error.message);
    } else {
      console.log('✅ اتصال به سرور SMTP موفقیت‌آمیز بود!');
    }
  });

} catch (error: any) {
  console.log('❌ خطا در ساخت transporter:', error.message);
}
