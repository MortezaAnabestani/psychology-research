/**
 * اسکریپت debug برای بررسی دقیق کاوه‌نگار
 */

import * as dotenv from 'dotenv';
import Kavenegar from 'kavenegar';

dotenv.config();

console.log('='.repeat(60));
console.log('🔍 Debug کامل کاوه‌نگار');
console.log('='.repeat(60));

const apiKey = process.env.KAVENEGAR_API_KEY;
const sender = process.env.KAVENEGAR_SENDER;

console.log('\n📋 تنظیمات:');
console.log(`  API Key: ${apiKey || '❌ خالی'}`);
console.log(`  API Key Length: ${apiKey?.length || 0}`);
console.log(`  Sender: ${sender || '❌ خالی'}`);

if (!apiKey) {
  console.log('\n❌ API Key موجود نیست!');
  process.exit(1);
}

console.log('\n🔗 URL که ساخته می‌شود:');
console.log(`  https://api.kavenegar.com/v1/${apiKey}/sms/send.json`);

console.log('\n📞 تست 1: بررسی اطلاعات حساب');
console.log('-'.repeat(60));

try {
  const api = Kavenegar.KavenegarApi({ apikey: apiKey });

  // تست AccountInfo
  api.AccountInfo({}, (response: any, status: number, message: any) => {
    console.log('\n📊 نتیجه AccountInfo:');
    console.log(`  Status: ${status}`);
    console.log(`  Message: ${message}`);

    if (status === 200) {
      console.log('✅ API Key صحیح است!');
      console.log('  Response:', JSON.stringify(response, null, 2));

      // اگر AccountInfo موفق بود، پیامک تست بفرست
      testSend(api);
    } else if (status === 404) {
      console.log('\n❌ خطای 404: API Key پیدا نشد!');
      console.log('راهنمایی:');
      console.log('  1. وارد پنل کاوه‌نگار شوید: https://panel.kavenegar.com');
      console.log('  2. تنظیمات → API Key');
      console.log('  3. مطمئن شوید API Key را صحیح کپی کرده‌اید');
      console.log('  4. فضای خالی اضافی نداشته باشد');
    } else if (status === 401) {
      console.log('\n❌ خطای 401: احراز هویت ناموفق');
      console.log('  API Key اشتباه است یا منقضی شده');
    } else {
      console.log('\n❌ خطای ناشناخته');
      console.log('  Response:', response);
    }
  });

} catch (error: any) {
  console.log('\n❌ خطای Exception:', error.message);
  console.log(error);
}

function testSend(api: any) {
  console.log('\n📞 تست 2: ارسال پیامک');
  console.log('-'.repeat(60));

  const testPhone = '09123456789'; // شماره تست - عوضش کن!

  console.log(`\n📤 ارسال به: ${testPhone}`);
  console.log(`  Sender: ${sender}`);

  api.Send(
    {
      message: 'تست کاوه‌نگار - پژوهش روانشناسی',
      sender: sender,
      receptor: testPhone,
    },
    (response: any, status: number, message: any) => {
      console.log('\n📊 نتیجه Send:');
      console.log(`  Status: ${status}`);
      console.log(`  Message: ${message}`);

      if (status === 200) {
        console.log('✅ پیامک ارسال شد!');
        console.log('  Response:', JSON.stringify(response, null, 2));
      } else {
        console.log('❌ ارسال ناموفق');
        console.log('  Response:', response);

        if (status === 422) {
          console.log('\n💡 خطای 422 معمولاً به این دلایل است:');
          console.log('  - شماره گیرنده اشتباه');
          console.log('  - شماره فرستنده (sender) اشتباه یا تایید نشده');
          console.log('  - متن پیام خالی یا خیلی طولانی');
        }
      }
    }
  );
}
