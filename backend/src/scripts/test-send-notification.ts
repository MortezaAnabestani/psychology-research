import mongoose from "mongoose";
import dotenv from "dotenv";
import { Notification } from "../models/Notification";
import { NotificationService } from "../services/notificationService";

dotenv.config();

async function testSendNotification() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // Find a pending notification
    const pendingNotif = await Notification.findOne({ sentAt: null })
      .populate("userId", "name email phone")
      .populate("exerciseId");

    if (!pendingNotif) {
      console.log("⚠️  No pending notifications found. Creating a test notification...");

      // Get first user
      const User = mongoose.model("User");
      const UserExercise = mongoose.model("UserExercise");

      const user = await User.findOne({ role: "client" });
      const exercise = await UserExercise.findOne({ userId: user?._id });

      if (!user || !exercise) {
        console.log("❌ No user or exercise found to create test notification");
        await mongoose.disconnect();
        return;
      }

      const testNotif = await Notification.create({
        userId: user._id,
        exerciseId: exercise._id,
        type: "morning",
        message: "این یک پیام تستی است. لطفاً تمرین خود را انجام دهید.",
        scheduledFor: new Date(), // Schedule for now
      });

      console.log("✅ Test notification created");
      console.log(`   User: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Message: ${testNotif.message}`);

      // Send it
      console.log("\n📨 Sending test notification...");

      console.log("\n1️⃣ Sending push notification...");
      await NotificationService.sendPushNotification((testNotif._id as any).toString());

      console.log("2️⃣ Sending email notification...");
      await NotificationService.sendEmailNotification((testNotif._id as any).toString());

      console.log("3️⃣ Sending SMS notification...");
      await NotificationService.sendSMSNotification((testNotif._id as any).toString());

      console.log("\n✅ All notifications sent!");
    } else {
      const user: any = pendingNotif.userId;
      console.log(`📨 Found pending notification for ${user.name}`);
      console.log(`   Scheduled for: ${pendingNotif.scheduledFor}`);
      console.log(`   Message: ${pendingNotif.message}`);

      console.log("\n📨 Sending notification...");

      console.log("\n1️⃣ Sending push notification...");
      await NotificationService.sendPushNotification((pendingNotif._id as any).toString());

      console.log("2️⃣ Sending email notification...");
      await NotificationService.sendEmailNotification((pendingNotif._id as any).toString());

      console.log("3️⃣ Sending SMS notification...");
      await NotificationService.sendSMSNotification((pendingNotif._id as any).toString());

      console.log("\n✅ All notifications sent!");
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testSendNotification();
