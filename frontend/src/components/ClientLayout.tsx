import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Bell, LogOut, Settings } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 shadow-sm z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-indigo-600 ">پژوهش روانشناسی</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none">
                {user?.name}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/dashboard"
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <Link
                to="/settings"
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">{children}</main>
    </div>
  );
};

export default ClientLayout;
