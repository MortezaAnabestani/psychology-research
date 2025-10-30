import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, ClipboardList, BarChart3, Settings, LogOut, Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "داشبورد" },
    { path: "/admin/clients", icon: Users, label: "مراجعان" },
    { path: "/admin/templates", icon: ClipboardList, label: "قالب‌های تمرین" },
    { path: "/admin/statistics", icon: BarChart3, label: "گزارش‌ها و آمار" },
    { path: "/admin/settings", icon: Settings, label: "تنظیمات" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600">پنل مدیریت</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="mr-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-5">
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
