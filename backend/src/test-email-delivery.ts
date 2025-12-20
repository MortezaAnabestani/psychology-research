import { transporter } from "./config/email";
import * as dotenv from "dotenv";

dotenv.config();

async function testEmailDelivery() {
  console.log("🔍 Email Configuration Test");
  console.log("============================");
  console.log(`📧 Email Host: ${process.env.EMAIL_HOST}`);
  console.log(`📧 Email Port: ${process.env.EMAIL_PORT}`);
  console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`📧 Email From Name: ${process.env.EMAIL_FROM_NAME}`);
  console.log("============================\n");

  try {
    // تست اتصال
    console.log("🔌 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    // ارسال ایمیل تست
    const testEmail = process.env.TEST_EMAIL || "anabestani.morteza@gmail.com";
    console.log(`📨 Sending test email to: ${testEmail}`);

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "پژوهش روانشناسی"}" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: "تست ارسال ایمیل - Test Email Delivery",
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; padding: 20px;">
          <h2>تست ارسال ایمیل</h2>
          <p>این یک ایمیل تست است که از سرور ${process.env.EMAIL_HOST} ارسال شده.</p>
          <hr/>
          <h3>اطلاعات تکنیکال:</h3>
          <ul>
            <li>سرور: ${process.env.EMAIL_HOST}</li>
            <li>پورت: ${process.env.EMAIL_PORT}</li>
            <li>فرستنده: ${process.env.EMAIL_USER}</li>
            <li>زمان ارسال: ${new Date().toLocaleString("fa-IR")}</li>
          </ul>
          <hr/>
          <p><strong>اگر این ایمیل را دریافت کردید، یعنی سیستم ایمیل شما به درستی کار می‌کند!</strong></p>
          <p style="color: red;"><strong>لطفاً پوشه Spam/Junk خود را هم بررسی کنید.</strong></p>
        </div>
      `,
      // اضافه کردن headers برای بهبود تحویل
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    console.log("\n✅ Email sent successfully!");
    console.log("============================");
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📝 Response: ${info.response}`);
    console.log(`🎯 Accepted: ${info.accepted?.join(", ") || "N/A"}`);
    console.log(`❌ Rejected: ${info.rejected?.join(", ") || "None"}`);
    console.log("============================\n");

    console.log("⚠️  نکات مهم:");
    console.log("1. پوشه Spam/Junk خود را بررسی کنید");
    console.log("2. اگر ایمیل نرسید، ممکن است مشکل از SPF/DKIM باشد");
    console.log("3. برای بررسی SPF record دامنه خود:");
    console.log(`   nslookup -type=TXT ${process.env.EMAIL_USER?.split("@")[1]}`);
    console.log("4. بررسی کنید که IP سرور شما در blacklist نباشد:");
    console.log("   https://mxtoolbox.com/blacklists.aspx");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Error occurred:");
    console.error(error);
    process.exit(1);
  }
}

testEmailDelivery();
