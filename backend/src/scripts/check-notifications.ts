import mongoose from "mongoose";
import dotenv from "dotenv";
import { Notification } from "../models/Notification";
import { UserExercise } from "../models/UserExercise";
import { User } from "../models/User";
import { GroupAssignment } from "../models/GroupAssignment";

dotenv.config();

async function checkNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // Check all notifications
    const allNotifications = await Notification.find()
      .populate("userId", "name email")
      .populate("exerciseId")
      .sort("-createdAt")
      .limit(20);

    console.log(`\n📊 Total notifications in database: ${await Notification.countDocuments()}`);
    console.log(`\n📋 Last 20 notifications:`);

    allNotifications.forEach((notif: any, index) => {
      const user = notif.userId;
      const status = notif.sentAt ? "✅ Sent" : "⏳ Pending";
      const scheduledTime = new Date(notif.scheduledFor).toLocaleString('fa-IR');

      console.log(`\n${index + 1}. ${status}`);
      console.log(`   User: ${user?.name || 'Unknown'} (${user?.email || 'N/A'})`);
      console.log(`   Message: ${notif.message.substring(0, 60)}...`);
      console.log(`   Scheduled for: ${scheduledTime}`);
      console.log(`   Created at: ${new Date(notif.createdAt).toLocaleString('fa-IR')}`);
      if (notif.sentAt) {
        console.log(`   Sent at: ${new Date(notif.sentAt).toLocaleString('fa-IR')}`);
      }
    });

    // Check pending notifications
    const now = new Date();
    const pendingNotifications = await Notification.find({
      sentAt: null,
      scheduledFor: { $lte: now }
    }).populate("userId", "name email");

    console.log(`\n⚠️  Pending notifications that should have been sent: ${pendingNotifications.length}`);

    if (pendingNotifications.length > 0) {
      console.log(`\n📌 Details:`);
      pendingNotifications.forEach((notif: any, index) => {
        console.log(`\n${index + 1}. User: ${notif.userId?.name}`);
        console.log(`   Scheduled: ${new Date(notif.scheduledFor).toLocaleString('fa-IR')}`);
        console.log(`   Message: ${notif.message}`);
      });
    }

    // Check upcoming notifications
    const upcomingNotifications = await Notification.find({
      sentAt: null,
      scheduledFor: { $gt: now }
    }).populate("userId", "name email").sort("scheduledFor").limit(10);

    console.log(`\n📅 Upcoming notifications (next 10):`);
    upcomingNotifications.forEach((notif: any, index) => {
      console.log(`\n${index + 1}. User: ${notif.userId?.name}`);
      console.log(`   Scheduled: ${new Date(notif.scheduledFor).toLocaleString('fa-IR')}`);
      console.log(`   Message: ${notif.message.substring(0, 60)}...`);
    });

    // Check users with morning notification time set
    const usersWithMorningTime = await GroupAssignment.find({
      morningNotificationTime: { $exists: true, $ne: null }
    }).populate("userId", "name email");

    console.log(`\n👥 Users with morning notification time set: ${usersWithMorningTime.length}`);
    usersWithMorningTime.forEach((assignment: any, index) => {
      console.log(`${index + 1}. ${assignment.userId?.name} - ${assignment.morningNotificationTime}`);
    });

    // Check user exercises
    const userExercises = await UserExercise.find()
      .populate("userId", "name email")
      .populate("exerciseTemplateId", "title")
      .populate("groupAssignmentId");

    console.log(`\n📝 Total user exercises: ${userExercises.length}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkNotifications();
