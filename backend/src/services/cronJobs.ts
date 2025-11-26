import cron from "node-cron";
import { Notification } from "../models/Notification";
import { NotificationService } from "./notificationService";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { UserExercise, ExerciseStatus } from "../models/UserExercise";
import { User } from "../models/User";
import { SMSService } from "./smsService";
import { sendEmail } from "../config/email";

export function startCronJobs() {
  // Check for pending notifications every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

      const pendingNotifications = await Notification.find({
        sentAt: null,
        scheduledFor: {
          $gte: now,
          $lte: fiveMinutesFromNow,
        },
      });

      for (const notification of pendingNotifications) {
        // Send push, email, and SMS notifications
        await NotificationService.sendPushNotification(notification._id.toString());
        await NotificationService.sendEmailNotification(notification._id.toString());
        await NotificationService.sendSMSNotification(notification._id.toString());
      }
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  // Send reminder for incomplete exercises (daily at 8 PM)
  cron.schedule("0 20 * * *", async () => {
    try {
      const incompleteExercises = await UserExercise.find({
        status: "in_progress",
        lastAccessedAt: {
          $lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Not accessed in last 24 hours
        },
      }).populate("userId");

      for (const exercise of incompleteExercises) {
        const user: any = exercise.userId;

        await sendEmail(
          user.email,
          "یادآوری تمرین ناتمام",
          `
            <div dir="rtl" style="font-family: Tahoma, Arial;">
              <h2>سلام ${user.name} عزیز</h2>
              <p>شما یک تمرین ناتمام دارید. لطفاً برای ادامه تمرین وارد سایت شوید.</p>
              <a href="${process.env.CLIENT_URL}/exercises/${exercise._id}" 
                 style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                ادامه تمرین
              </a>
            </div>
          `
        );
      }
    } catch (error) {
      console.error("Reminder cron job error:", error);
    }
  });

  // Send motivational SMS twice daily at random times (9 AM - 9 PM)
  // Check every hour during working hours (9 AM - 9 PM) and send based on random logic
  let motivationalSMSSentToday = {
    first: false,
    second: false,
    date: new Date().toDateString(),
  };

  cron.schedule("0 9-21 * * *", async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();

    // Reset daily flags
    if (currentDate !== motivationalSMSSentToday.date) {
      motivationalSMSSentToday = {
        first: false,
        second: false,
        date: currentDate,
      };
    }

    // First wave: between 9 AM - 3 PM
    if (currentHour >= 9 && currentHour < 15 && !motivationalSMSSentToday.first) {
      const shouldSend = Math.random() < 0.3; // 30% chance each hour
      if (shouldSend) {
        await sendMotivationalSMS();
        motivationalSMSSentToday.first = true;
        console.log(`📱 First wave motivational SMS sent at ${now.toLocaleTimeString()}`);
      }
    }

    // Second wave: between 3 PM - 9 PM
    if (currentHour >= 15 && currentHour < 21 && !motivationalSMSSentToday.second) {
      const shouldSend = Math.random() < 0.3; // 30% chance each hour
      if (shouldSend) {
        await sendMotivationalSMS();
        motivationalSMSSentToday.second = true;
        console.log(`📱 Second wave motivational SMS sent at ${now.toLocaleTimeString()}`);
      }
    }
  });

  console.log(`✅ Cron jobs started`);
  console.log(`📱 Motivational SMS will be sent randomly twice daily during working hours (9-21)`);
}

async function sendMotivationalSMS() {
  try {
    // Find all templates with motivational SMS enabled
    const templates = await ExerciseTemplate.find({
      "motivationalSMS.enabled": true,
    });

    for (const template of templates) {
      if (!template.motivationalSMS?.message) continue;

      // Find all active user exercises for this template
      const activeExercises = await UserExercise.find({
        exerciseTemplateId: template._id,
        status: { $in: [ExerciseStatus.AVAILABLE, ExerciseStatus.IN_PROGRESS] },
      }).populate("userId");

      for (const exercise of activeExercises) {
        const user: any = exercise.userId;

        if (!user?.phone) continue;

        try {
          await SMSService.sendSMS(user.phone, template.motivationalSMS.message);
          console.log(`✅ Motivational SMS sent to ${user.phone} for template ${template.title}`);
        } catch (error) {
          console.error(`❌ Failed to send motivational SMS to ${user.phone}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Motivational SMS cron job error:", error);
  }
}
