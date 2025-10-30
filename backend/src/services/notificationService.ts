import webpush from "web-push";
import { Notification } from "../models/Notification";
import { UserExercise } from "../models/UserExercise";
import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { User } from "../models/User";
import { sendEmail } from "../config/email";

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export class NotificationService {
  // Schedule notifications for a new exercise
  static async scheduleExerciseNotifications(userExerciseId: string) {
    try {
      const userExercise = await UserExercise.findById(userExerciseId)
        .populate("exerciseTemplateId")
        .populate("groupAssignmentId")
        .populate("userId");

      if (!userExercise) return;

      const template: any = userExercise.exerciseTemplateId;
      const assignment: any = userExercise.groupAssignmentId;
      const user: any = userExercise.userId;

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
    const today = new Date();

    if (config.scheduleType === "user_time") {
      // Use user's selected morning time
      const [hours, minutes] = userMorningTime.split(":").map(Number);
      const time = new Date(today);
      time.setHours(hours, minutes, 0, 0);

      notifications.push({
        time,
        message: config.messages[0] || "یادآوری تمرین روزانه",
      });
    } else if (config.scheduleType === "fixed") {
      // Use fixed times
      config.times?.forEach((timeStr: string, index: number) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const time = new Date(today);
        time.setHours(hours, minutes, 0, 0);

        notifications.push({
          time,
          message: config.messages[index] || "یادآوری تمرین",
        });
      });
    } else if (config.scheduleType === "random") {
      // Generate random times within ranges
      config.timeRanges?.forEach((range: any, index: number) => {
        const time = this.getRandomTimeInRange(range.start, range.end);

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

      if (!notification) return;

      const user: any = notification.userId;
      const exerciseLink = `${process.env.CLIENT_URL}/exercises/${notification.exerciseId}`;

      await sendEmail(
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

      notification.sentAt = new Date();
      await notification.save();
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }
}
