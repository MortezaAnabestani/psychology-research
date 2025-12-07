import nodemailer from "nodemailer";

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
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  // بررسی اینکه آیا تنظیمات ایمیل وجود دارد
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("❌ Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file");
    throw new Error("Email configuration is not complete");
  }

  try {
    await transporter.sendMail({
      from: `"پژوهش روانشناسی" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};
