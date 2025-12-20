import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Check, ExternalLink } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Refresh notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.readAt) {
      await markAsRead(notification._id);
    }

    if (notification.exerciseId) {
      navigate(`/exercises/${notification.exerciseId}`);
      setIsOpen(false);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.readAt);
    for (const notification of unreadNotifications) {
      await markAsRead(notification._id);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} دقیقه پیش`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ساعت پیش`;
    } else {
      return d.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[32rem] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-800">اعلان‌ها</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} جدید
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/50 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={markAllAsRead}
                className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition"
              >
                <Check className="w-4 h-4" />
                <span>علامت‌گذاری همه به‌عنوان خوانده‌شده</span>
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">اعلانی وجود ندارد</p>
                <p className="text-gray-400 text-xs mt-1">
                  اعلان‌های شما در اینجا نمایش داده می‌شود
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
                      !notification.readAt ? "bg-blue-50/50" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Unread indicator */}
                      <div className="flex-shrink-0 pt-1">
                        {!notification.readAt ? (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-relaxed ${
                            !notification.readAt
                              ? "text-gray-900 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.scheduledFor)}
                          </span>
                          {notification.exerciseId && (
                            <div className="flex items-center gap-1 text-xs text-indigo-600">
                              <ExternalLink className="w-3 h-3" />
                              <span>مشاهده تمرین</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-center text-gray-500">
                {notifications.length} اعلان نمایش داده شده
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
