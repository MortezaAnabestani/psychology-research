import * as dotenv from "dotenv";

dotenv.config();

console.log("📧 Email Configuration Debug");
console.log("===============================");
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || "NOT SET"}`);
console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || "NOT SET"}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER || "NOT SET"}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? "***SET***" : "NOT SET"}`);
console.log(`EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || "NOT SET"}`);
console.log("===============================");

if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
  console.error("❌ EMAIL_HOST or EMAIL_USER is not set!");
  console.log("\n⚠️  Make sure your .env file contains:");
  console.log("EMAIL_HOST=mail.mashaayekhi.ir");
  console.log("EMAIL_USER=noreply@mashaayekhi.ir");
  console.log("EMAIL_PASSWORD=your-password");
  console.log("EMAIL_PORT=465");
}

if (process.env.EMAIL_HOST?.includes("gmail")) {
  console.error("\n❌ WARNING: You are using Gmail SMTP!");
  console.log("Gmail blocks direct sending. Use your hosting SMTP instead:");
  console.log("EMAIL_HOST=mail.mashaayekhi.ir");
}
