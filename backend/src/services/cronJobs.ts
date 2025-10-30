import cron from "node-cron";
import { Notification } from "../models/Notification";
import { NotificationService } from "./notificationService";

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
        // Send both push and email notifications
        await NotificationService.sendPushNotification(notification._id.toString());
        await NotificationService.sendEmailNotification(notification._id.toString());
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

  console.log("✅ Cron jobs started");
}
