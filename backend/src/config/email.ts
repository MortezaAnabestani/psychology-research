import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

// بارگذاری تنظیمات محیطی
dotenv.config();

// بررسی تنظیمات ایمیل
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn("⚠️  Warning: EMAIL_USER or EMAIL_PASSWORD not configured. Email sending will not work.");
}

// تعیین اینکه آیا باید از SSL استفاده شود یا نه
// پورت 465 نیاز به secure: true دارد
// پورت 587 از STARTTLS استفاده می‌کند و secure: false نیاز دارد
const emailPort = parseInt(process.env.EMAIL_PORT || "587");
const isSecure = emailPort === 465;

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: emailPort,
  secure: isSecure, // true برای 465، false برای سایر پورت‌ها
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // تنظیمات اضافی برای بهبود سازگاری با هاست‌های مختلف
  tls: {
    // برای هاست‌هایی که گواهی خودامضا دارند
    rejectUnauthorized: false,
  },
  // تنظیمات برای بهبود تحویل ایمیل
  pool: true, // استفاده از connection pool
  maxConnections: 5,
  maxMessages: 100,
  // تنظیمات برای جلوگیری از ارسال مستقیم به Gmail
  requireTLS: !isSecure, // فقط برای پورت 587
  dnsTimeout: 30000,
});

// SMTP relay برای Gmail (اختیاری - اگر می‌خواهید فقط برای Gmail از سرویس دیگری استفاده کنید)
const gmailTransporter = process.env.GMAIL_RELAY_HOST
  ? nodemailer.createTransport({
      host: process.env.GMAIL_RELAY_HOST,
      port: parseInt(process.env.GMAIL_RELAY_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.GMAIL_RELAY_USER || process.env.EMAIL_USER,
        pass: process.env.GMAIL_RELAY_PASSWORD || process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    })
  : null;

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  // بررسی اینکه آیا تنظیمات ایمیل وجود دارد
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("❌ Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file");
    return {
      success: false,
      error: "Email configuration is not complete. Please set EMAIL_USER and EMAIL_PASSWORD in .env file",
    };
  }

  // اعتبارسنجی آدرس ایمیل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error(`❌ Invalid email address: ${to}`);
    return {
      success: false,
      error: `Invalid email address: ${to}`,
    };
  }

  // انتخاب transporter مناسب
  const isGmail = to.toLowerCase().includes("@gmail.com");
  const selectedTransporter = isGmail && gmailTransporter ? gmailTransporter : transporter;

  if (isGmail && gmailTransporter) {
    console.log(`📧 Using Gmail relay for ${to}`);
  }

  try {
    const info = await selectedTransporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "پژوهش روانشناسی"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Headers اضافی برای بهبود تحویل و جلوگیری از spam
      headers: {
        "X-Mailer": "Psychology Research Platform",
        "X-Priority": "3",
        "List-Unsubscribe": `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
      },
      // تنظیمات اضافی
      priority: "normal",
      encoding: "utf-8",
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`   MessageID: ${info.messageId}`);
    console.log(`   Accepted: ${info.accepted?.join(", ") || "N/A"}`);
    console.log(`   Rejected: ${info.rejected?.join(", ") || "None"}`);

    return { success: true };
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);

    // ارائه راهنمایی برای خطاهای رایج
    let errorMessage = error.message;
    if (error.message.includes("Authentication failed")) {
      errorMessage = "Authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD";
    } else if (error.message.includes("ETIMEDOUT") || error.message.includes("ECONNREFUSED")) {
      errorMessage = "Connection failed. Please check EMAIL_HOST and EMAIL_PORT";
    } else if (error.message.includes("Invalid login")) {
      errorMessage = "Invalid credentials. Please verify EMAIL_USER and EMAIL_PASSWORD";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
