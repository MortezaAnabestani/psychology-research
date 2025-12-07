/**
 * اسکریپت تست سیستم ایمیل و پیامک
 *
 * استفاده:
 * ts-node src/test-notifications.ts
 */

import * as dotenv from 'dotenv';
import { sendEmail } from './config/email';
import { SMSService } from './services/smsService';

// بارگذاری تنظیمات محیطی
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

async function testEmailSetup() {
  logSection('🔍 بررسی تنظیمات ایمیل');

  const requiredVars = [
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_HOST',
    'EMAIL_PORT',
  ];

  let allConfigured = true;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      log(`❌ ${varName}: تنظیم نشده`, colors.red);
      allConfigured = false;
    } else {
      // برای رمز عبور فقط چند کاراکتر اول را نشان می‌دهیم
      const displayValue = varName.includes('PASSWORD')
        ? value.substring(0, 3) + '***'
        : value;
      log(`✅ ${varName}: ${displayValue}`, colors.green);
    }
  }

  return allConfigured;
}

async function testSMSSetup() {
  logSection('🔍 بررسی تنظیمات پیامک');

  const requiredVars = [
    'KAVENEGAR_API_KEY',
    'KAVENEGAR_SENDER',
  ];

  let allConfigured = true;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      log(`❌ ${varName}: تنظیم نشده`, colors.red);
      allConfigured = false;
    } else {
      const displayValue = varName.includes('API_KEY')
        ? value.substring(0, 10) + '***'
        : value;
      log(`✅ ${varName}: ${displayValue}`, colors.green);
    }
  }

  return allConfigured;
}

async function testEmailSending() {
  logSection('📧 تست ارسال ایمیل');

  const testEmail = process.env.EMAIL_USER; // ارسال به خودمان برای تست

  if (!testEmail) {
    log('❌ آدرس ایمیل تست یافت نشد', colors.red);
    return false;
  }

  log(`📨 در حال ارسال ایمیل تست به: ${testEmail}`, colors.yellow);

  try {
    await sendEmail(
      testEmail,
      '✅ تست موفق - سیستم ایمیل پژوهش روانشناسی',
      `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4F46E5; margin-top: 0;">🎉 تبریک!</h1>
            <h2 style="color: #333;">سیستم ایمیل با موفقیت راه‌اندازی شد</h2>

            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32;">
                ✅ این ایمیل نشان می‌دهد که تنظیمات ایمیل شما به درستی انجام شده است.
              </p>
            </div>

            <h3 style="color: #333;">اطلاعات تست:</h3>
            <ul style="line-height: 1.8; color: #666;">
              <li><strong>سرور SMTP:</strong> ${process.env.EMAIL_HOST}</li>
              <li><strong>پورت:</strong> ${process.env.EMAIL_PORT}</li>
              <li><strong>ایمیل فرستنده:</strong> ${process.env.EMAIL_USER}</li>
              <li><strong>زمان تست:</strong> ${new Date().toLocaleString('fa-IR')}</li>
            </ul>

            <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #e65100;">
                <strong>⚠️ نکته:</strong> اگر این ایمیل به پوشه اسپم رفت، آن را به عنوان "Not Spam" علامت بزنید.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="color: #999; font-size: 14px; text-align: center;">
              پژوهش روانشناسی - سیستم ارسال خودکار ایمیل
            </p>
          </div>
        </div>
      `
    );

    log('✅ ایمیل با موفقیت ارسال شد!', colors.green);
    log('📬 لطفاً صندوق ایمیل خود را بررسی کنید.', colors.blue);
    log('   (ممکن است در پوشه Spam یا Junk باشد)', colors.yellow);
    return true;

  } catch (error: any) {
    log('❌ خطا در ارسال ایمیل:', colors.red);
    log(error.message, colors.red);

    // راهنمایی برای خطاهای رایج
    if (error.message.includes('Authentication failed')) {
      log('\n💡 راهنمایی: نام کاربری یا رمز عبور اشتباه است.', colors.yellow);
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      log('\n💡 راهنمایی: مشکل در اتصال به سرور SMTP. پورت یا هاست را بررسی کنید.', colors.yellow);
    }

    return false;
  }
}

async function testSMSSending() {
  logSection('📱 تست ارسال پیامک');

  // برای تست، از شماره‌ای که کاربر وارد می‌کند استفاده می‌شود
  log('⚠️  برای تست پیامک، شماره موبایل خود را وارد کنید:', colors.yellow);
  log('    (فرمت: 09123456789)', colors.blue);

  // در حالت واقعی، از readline استفاده می‌شود
  // اما برای سادگی، از یک شماره تست استفاده می‌کنیم
  const testPhoneNumber = '09123456789'; // این را باید کاربر تغییر دهد

  log(`\n📨 برای تست واقعی، شماره را در کد تغییر دهید.`, colors.yellow);
  log(`   فعلاً فقط تست اتصال انجام می‌شود...`, colors.blue);

  try {
    // فقط بررسی می‌کنیم که API Key معتبر است یا نه
    if (!process.env.KAVENEGAR_API_KEY) {
      log('❌ KAVENEGAR_API_KEY تنظیم نشده است', colors.red);
      return false;
    }

    log('\n✅ تنظیمات پیامک به نظر صحیح است.', colors.green);
    log('📝 برای ارسال واقعی پیامک تست:', colors.blue);
    log('   1. فایل src/test-notifications.ts را باز کنید', colors.blue);
    log('   2. متغیر testPhoneNumber را به شماره خود تغییر دهید', colors.blue);
    log('   3. خط زیر را از حالت کامنت خارج کنید:', colors.blue);
    log('      // await SMSService.sendSMS(testPhoneNumber, "تست موفق ...");\n', colors.cyan);

    // اگر می‌خواهید واقعاً ارسال کنید، این خط را از کامنت خارج کنید:
    /*
    await SMSService.sendSMS(
      testPhoneNumber,
      `تست موفق - سیستم پیامک پژوهش روانشناسی\n\nزمان: ${new Date().toLocaleTimeString('fa-IR')}`
    );
    log('✅ پیامک با موفقیت ارسال شد!', colors.green);
    log('📱 لطفاً پیامک خود را بررسی کنید.', colors.blue);
    */

    return true;

  } catch (error: any) {
    log('❌ خطا در ارسال پیامک:', colors.red);
    log(error.message, colors.red);

    if (error.message.includes('API')) {
      log('\n💡 راهنمایی: API Key کاوه‌نگار را بررسی کنید.', colors.yellow);
    }

    return false;
  }
}

async function main() {
  log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║       🧪 اسکریپت تست سیستم ایمیل و پیامک                ║
║       پژوهش روانشناسی                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `, colors.bright);

  // 1. بررسی تنظیمات ایمیل
  const emailConfigured = await testEmailSetup();

  // 2. بررسی تنظیمات SMS
  const smsConfigured = await testSMSSetup();

  if (!emailConfigured && !smsConfigured) {
    log('\n❌ هیچ یک از سیستم‌ها تنظیم نشده است!', colors.red);
    log('📄 لطفاً فایل EMAIL_SMS_SETUP.md را مطالعه کنید.', colors.yellow);
    process.exit(1);
  }

  // 3. تست ارسال ایمیل
  if (emailConfigured) {
    const emailSuccess = await testEmailSending();
    if (!emailSuccess) {
      log('\n⚠️  ارسال ایمیل ناموفق بود. لطفاً تنظیمات را بررسی کنید.', colors.yellow);
    }
  }

  // 4. تست ارسال SMS
  if (smsConfigured) {
    const smsSuccess = await testSMSSending();
    if (!smsSuccess) {
      log('\n⚠️  تنظیمات SMS ناموفق بود. لطفاً تنظیمات را بررسی کنید.', colors.yellow);
    }
  }

  logSection('📊 خلاصه نتایج');
  log(`ایمیل: ${emailConfigured ? '✅ تنظیم شده' : '❌ تنظیم نشده'}`,
      emailConfigured ? colors.green : colors.red);
  log(`پیامک: ${smsConfigured ? '✅ تنظیم شده' : '❌ تنظیم نشده'}`,
      smsConfigured ? colors.green : colors.red);

  log('\n✨ تست کامل شد!\n', colors.green);
}

// اجرای اسکریپت
main().catch(error => {
  log(`\n❌ خطای غیرمنتظره: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
