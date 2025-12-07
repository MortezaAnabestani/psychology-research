/**
 * تست ارسال SMS با کاوه‌نگار
 */

import * as dotenv from 'dotenv';
import { SMSService } from './services/smsService';

dotenv.config();

console.log('='.repeat(60));
console.log('📱 تست سیستم پیامک کاوه‌نگار');
console.log('='.repeat(60));

// بررسی تنظیمات
const apiKey = process.env.KAVENEGAR_API_KEY;
const sender = process.env.KAVENEGAR_SENDER;

console.log('\n🔍 تنظیمات:');
console.log(`  API Key: ${apiKey ? apiKey.substring(0, 10) + '***' : '❌ تنظیم نشده'}`);
console.log(`  Sender: ${sender || '❌ تنظیم نشده'}`);

if (!apiKey) {
  console.log('\n❌ KAVENEGAR_API_KEY تنظیم نشده!');
  console.log('لطفاً در فایل .env این مقدار را تنظیم کنید:');
  console.log('  KAVENEGAR_API_KEY=your-api-key-here');
  process.exit(1);
}

// شماره تست - این را به شماره واقعی خودت تغییر بده!
const testPhoneNumber = '09123456789'; // ⚠️ این را عوض کن!

console.log('\n⚠️  توجه: برای ارسال واقعی، شماره تست را تغییر دهید!');
console.log(`  فعلی: ${testPhoneNumber}`);
console.log('  در خط 24 فایل src/test-sms.ts این شماره را به شماره خودتان تغییر دهید.');

async function testSMS() {
  console.log('\n' + '-'.repeat(60));
  console.log('📨 تست 1: ارسال پیامک ساده');
  console.log('-'.repeat(60));

  try {
    const message = `تست سیستم پیامک پژوهش روانشناسی
زمان: ${new Date().toLocaleString('fa-IR')}
این یک پیامک تست است.`;

    console.log(`\n📤 در حال ارسال پیامک به ${testPhoneNumber}...`);
    console.log(`پیام: ${message}`);

    const result = await SMSService.sendSMS(testPhoneNumber, message);

    if (result) {
      console.log('\n✅ پیامک با موفقیت ارسال شد!');
      console.log('📱 لطفاً گوشی خود را بررسی کنید.');
    } else {
      console.log('\n❌ ارسال پیامک ناموفق بود.');
      console.log('لطفاً موارد زیر را بررسی کنید:');
      console.log('  1. API Key صحیح است؟');
      console.log('  2. اعتبار کاوه‌نگار کافی است؟');
      console.log('  3. شماره موبایل صحیح است؟');
    }

  } catch (error: any) {
    console.log('\n❌ خطا در ارسال:', error.message);
  }

  console.log('\n' + '-'.repeat(60));
  console.log('📨 تست 2: بررسی اعتبار حساب');
  console.log('-'.repeat(60));

  console.log('\n💡 برای بررسی اعتبار، وارد پنل کاوه‌نگار شوید:');
  console.log('   https://panel.kavenegar.com');
  console.log('   و موجودی خود را چک کنید.');
}

// اجرا
testSMS().then(() => {
  console.log('\n✨ تست کامل شد!\n');
});
