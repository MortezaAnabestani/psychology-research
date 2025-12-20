import webpush from "web-push";
import { Notification } from "../models/Notification";
import { UserExercise, ExerciseStatus } from "../models/UserExercise";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { User } from "../models/User";
import { sendEmail } from "../config/email";
import { SMSService } from "./smsService";

// Configure web-push
// Only configure VAPID if all required environment variables are present
if (process.env.VAPID_EMAIL && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  // VAPID_EMAIL must be a valid URL (either mailto: or https://)
  const vapidSubject = process.env.VAPID_EMAIL.startsWith('mailto:') || process.env.VAPID_EMAIL.startsWith('https://')
    ? process.env.VAPID_EMAIL
    : `mailto:${process.env.VAPID_EMAIL}`;

  webpush.setVapidDetails(
    vapidSubject,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('⚠️  VAPID configuration incomplete. Push notifications will not work.');
}

export class NotificationService {
  // Schedule notifications for a new exercise
  static async scheduleExerciseNotifications(userExerciseId: string) {
    try {
      const userExercise = await UserExercise.findById(userExerciseId)
        .populate("exerciseTemplateId")
        .populate("groupAssignmentId")
        .populate("userId");

      if (!userExercise) {
        console.warn(`⚠️ UserExercise ${userExerciseId} not found for notification scheduling`);
        return;
      }

      const template: any = userExercise.exerciseTemplateId;
      const assignment: any = userExercise.groupAssignmentId;
      const user: any = userExercise.userId;

      if (!template || !assignment || !user) {
        console.warn(`⚠️ Missing data for scheduling notifications: template=${!!template}, assignment=${!!assignment}, user=${!!user}`);
        return;
      }

      // Check if user has set their morning notification time
      if (!assignment.morningNotificationTime) {
        console.warn(`⚠️ User ${user.name} (${user._id}) has not set morning notification time. Skipping notification scheduling.`);
        return;
      }

      // Schedule notifications based on template configuration
      for (const notifConfig of template.notifications) {
        const notifications = this.generateNotificationTimes(notifConfig, assignment.morningNotificationTime);

        for (const { time, message } of notifications) {
          await Notification.create({
            userId: user._id,
            exerciseId: userExercise._id,
            type: notifConfig.type,
            message,
            scheduledFor: time,
          });

          console.log(`✅ Scheduled notification for ${user.name} at ${time.toLocaleString('fa-IR')}: ${message.substring(0, 50)}...`);
        }
      }
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  }

  // Generate notification times based on configuration
  private static generateNotificationTimes(
    config: any,
    userMorningTime: string
  ): Array<{ time: Date; message: string }> {
    const notifications: Array<{ time: Date; message: string }> = [];
    const now = new Date();

    if (config.scheduleType === "user_time") {
      // Use user's selected morning time
      const [hours, minutes] = userMorningTime.split(":").map(Number);
      const time = new Date(now);
      time.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (time <= now) {
        time.setDate(time.getDate() + 1);
      }

      notifications.push({
        time,
        message: config.messages[0] || "یادآوری تمرین روزانه",
      });
    } else if (config.scheduleType === "fixed") {
      // Use fixed times
      config.times?.forEach((timeStr: string, index: number) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const time = new Date(now);
        time.setHours(hours, minutes, 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (time <= now) {
          time.setDate(time.getDate() + 1);
        }

        notifications.push({
          time,
          message: config.messages[index] || "یادآوری تمرین",
        });
      });
    } else if (config.scheduleType === "random") {
      // Generate random times within ranges
      config.timeRanges?.forEach((range: any, index: number) => {
        const time = this.getRandomTimeInRange(range.start, range.end);

        // If the time has already passed today, schedule for tomorrow
        if (time <= now) {
          time.setDate(time.getDate() + 1);
        }

        notifications.push({
          time,
          message: config.messages[index] || "یادآوری تمرین",
        });
      });
    }

    return notifications;
  }

  // Get random time within a range
  private static getRandomTimeInRange(start: string, end: string): Date {
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    const randomMinutes = Math.floor(Math.random() * (endTime - startTime) + startTime);
    const hours = Math.floor(randomMinutes / 60);
    const minutes = randomMinutes % 60;

    const time = new Date();
    time.setHours(hours, minutes, 0, 0);

    return time;
  }

  // Send push notification
  static async sendPushNotification(notificationId: string) {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) return;

      const user = await User.findById(notification.userId);
      if (!user) return;

      const subscription = (user.preferences as any)?.pushSubscription;

      if (subscription) {
        const payload = JSON.stringify({
          title: "پژوهش روانشناسی",
          body: notification.message,
          icon: "/icon-192x192.png",
          badge: "/badge-72x72.png",
          data: {
            url: `/exercises/${notification.exerciseId}`,
            notificationId: notification._id,
          },
        });

        try {
          await webpush.sendNotification(subscription, payload);
          notification.sentAt = new Date();
          await notification.save();
        } catch (error: any) {
          if (error.statusCode === 410) {
            // Subscription expired, remove it
            user.preferences = {
              ...user.preferences,
              pushSubscription: undefined,
            };
            await user.save();
          }
        }
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }

  // Send email notification
  static async sendEmailNotification(notificationId: string) {
    try {
      const notification = await Notification.findById(notificationId)
        .populate("userId")
        .populate("exerciseId");

      if (!notification) {
        console.warn(`⚠️ Notification ${notificationId} not found`);
        return;
      }

      const user: any = notification.userId;

      // بررسی اینکه کاربر ایمیل معتبر دارد
      if (!user || !user.email) {
        console.warn(`⚠️ User has no email address for notification ${notificationId}`);
        return;
      }

      const exerciseLink = `${process.env.CLIENT_URL}/exercises/${notification.exerciseId}`;

      const result = await sendEmail(
        user.email,
        "یادآوری تمرین روزانه",
        `
          <div dir="rtl" style="font-family: Tahoma, Arial;">
            <h2>سلام ${user.name} عزیز</h2>
            <p>${notification.message}</p>
            <a href="${exerciseLink}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
              ورود به تمرین
            </a>
          </div>
        `
      );

      if (result.success) {
        notification.sentAt = new Date();
        await notification.save();
      } else {
        console.error(`❌ Failed to send email notification to ${user.email}: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  // Send SMS notification
  static async sendSMSNotification(notificationId: string) {
    try {
      const notification = await Notification.findById(notificationId)
        .populate("userId")
        .populate("exerciseId");

      if (!notification) return;

      const user: any = notification.userId;

      // Check if user has phone number
      if (!user.phone) {
        console.log(`SMS not sent: User ${user.name} has no phone number`);
        return;
      }

      // Prepare SMS message
      const message = `${notification.message}\n\nبرای انجام تمرین وارد پنل شوید.\nپژوهش روانشناسی`;

      // Send SMS
      const success = await SMSService.sendSMS(user.phone, message);

      if (success) {
        // Mark as sent only if not already marked by email/push
        if (!notification.sentAt) {
          notification.sentAt = new Date();
          await notification.save();
        }
      }
    } catch (error) {
      console.error("Error sending SMS notification:", error);
    }
  }

  // Reschedule all pending notifications for a user when they update their morning time
  static async rescheduleUserNotifications(userId: string, groupAssignmentId: string, newMorningTime: string) {
    try {
      // Find all user exercises for this group assignment
      const userExercises = await UserExercise.find({
        userId,
        groupAssignmentId,
        status: { $in: [ExerciseStatus.AVAILABLE, ExerciseStatus.IN_PROGRESS] }
      }).populate("exerciseTemplateId");

      console.log(`🔄 Rescheduling notifications for user ${userId}, found ${userExercises.length} active exercises`);

      for (const userExercise of userExercises) {
        const template: any = userExercise.exerciseTemplateId;
        if (!template || !template.notifications) continue;

        // Delete all pending notifications for this exercise
        const deletedCount = await Notification.deleteMany({
          userId,
          exerciseId: userExercise._id,
          sentAt: null, // Only delete notifications that haven't been sent yet
        });

        console.log(`🗑️ Deleted ${deletedCount.deletedCount} pending notifications for exercise ${template.title}`);

        // Recreate notifications with the new time
        for (const notifConfig of template.notifications) {
          if (notifConfig.scheduleType === "user_time") {
            const notifications = this.generateNotificationTimes(notifConfig, newMorningTime);

            for (const { time, message } of notifications) {
              await Notification.create({
                userId,
                exerciseId: userExercise._id,
                type: notifConfig.type,
                message,
                scheduledFor: time,
              });

              console.log(`✅ Rescheduled notification for ${time.toLocaleString('fa-IR')}: ${message.substring(0, 50)}...`);
            }
          }
        }
      }

      console.log(`✅ Successfully rescheduled all notifications for user ${userId}`);
    } catch (error) {
      console.error("Error rescheduling notifications:", error);
    }
  }
}
