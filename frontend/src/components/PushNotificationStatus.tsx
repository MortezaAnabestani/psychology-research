import React, { useState, useEffect } from "react";
import { Bell, BellOff, Check, AlertCircle } from "lucide-react";
import { subscribeToPushNotifications } from "../utils/pwaSetup";

const PushNotificationStatus: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    try {
      await subscribeToPushNotifications();
      setPermission(Notification.permission);
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!("Notification" in window)) {
    return null; // Browser doesn't support notifications
  }

  if (permission === "granted") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-green-900">اعلان‌ها فعال است</h4>
          <p className="text-xs text-green-700 mt-1">
            شما پیام‌های یادآوری را دریافت خواهید کرد
          </p>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <BellOff className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-900">اعلان‌ها مسدود شده</h4>
          <p className="text-xs text-red-700 mt-1">
            برای فعال‌سازی، از تنظیمات مرورگر اجازه دهید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-yellow-900">فعال‌سازی اعلان‌ها</h4>
        <p className="text-xs text-yellow-700 mt-1 mb-2">
          برای دریافت یادآوری‌های تمرین، اعلان‌ها را فعال کنید
        </p>
        <button
          onClick={handleEnableNotifications}
          disabled={isSubscribing}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubscribing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>در حال فعال‌سازی...</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>فعال‌سازی اعلان‌ها</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PushNotificationStatus;
