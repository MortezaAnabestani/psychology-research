import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshNotifications();

      // Poll for new notifications every 2 minutes
      const interval = setInterval(refreshNotifications, 120000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const refreshNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n: any) => !n.readAt).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/${id}/read`);
      await refreshNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};
