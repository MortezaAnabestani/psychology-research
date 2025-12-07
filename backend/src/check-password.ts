/**
 * اسکریپت بررسی دقیق رمز عبور
 */

import * as dotenv from 'dotenv';
dotenv.config();

const password = process.env.EMAIL_PASSWORD;

console.log('='.repeat(60));
console.log('🔍 بررسی دقیق PASSWORD');
console.log('='.repeat(60));

if (!password) {
  console.log('❌ PASSWORD تنظیم نشده است!');
  process.exit(1);
}

console.log(`طول: ${password.length} کاراکتر`);
console.log(`طول بعد از trim: ${password.trim().length} کاراکتر`);

if (password.length !== password.trim().length) {
  console.log('⚠️  فضای خالی در ابتدا یا انتها وجود دارد!');
}

console.log('\n📝 کاراکترهای رمز عبور (به صورت hex):');
for (let i = 0; i < Math.min(password.length, 20); i++) {
  const char = password[i];
  const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
  const display = char === ' ' ? '(space)' : char;
  console.log(`  [${i}]: '${display}' -> 0x${hex}`);
}

if (password.length > 20) {
  console.log(`  ... و ${password.length - 20} کاراکتر دیگر`);
}

console.log('\n🔐 نکات:');
if (password.includes('@')) {
  console.log('  ⚠️  رمز شامل @ است');
}
if (password.includes('%')) {
  console.log('  ⚠️  رمز شامل % است');
}
if (password.includes('#')) {
  console.log('  ⚠️  رمز شامل # است');
}
if (password.includes('&')) {
  console.log('  ⚠️  رمز شامل & است');
}
if (password.includes('$')) {
  console.log('  ⚠️  رمز شامل $ است');
}
if (password.includes(' ')) {
  console.log('  ⚠️  رمز شامل فضای خالی است');
}

console.log('\n💡 پیشنهاد:');
console.log('  اگر رمز شامل کاراکترهای خاص است، بهتره یک رمز ساده‌تر موقتی بذارید');
console.log('  مثل: Test123456');
