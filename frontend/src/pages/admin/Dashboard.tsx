import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Users, ClipboardList, TrendingUp, CheckCircle, Clock, Activity } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/statistics`);
      setStatistics(res.data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      name: "تعداد مراجعان",
      value: statistics?.totalClients || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "تمرین‌های فعال",
      value: statistics?.totalExercises || 0,
      icon: ClipboardList,
      color: "bg-purple-500",
    },
    {
      name: "تمرین‌های تکمیل‌شده",
      value: statistics?.completedExercises || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      name: "در حال انجام",
      value: statistics?.inProgressExercises || 0,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      name: "نرخ تکمیل",
      value: `${statistics?.completionRate || 0}%`,
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">داشبورد مدیریت</h1>
          <p className="text-gray-600 mt-1">خلاصه‌ای از وضعیت پژوهش</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">توزیع گروه‌ها</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">گروه کنترل</span>
                  <span className="font-semibold">{statistics?.groupDistribution?.control || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((statistics?.groupDistribution?.control || 0) / (statistics?.totalClients || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">گروه مداخله</span>
                  <span className="font-semibold">{statistics?.groupDistribution?.intervention || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((statistics?.groupDistribution?.intervention || 0) /
                          (statistics?.totalClients || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
            <div className="space-y-3">
              {statistics?.recentActivity?.slice(0, 5).map((activity: any) => (
                <div key={activity._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.userId?.name}</p>
                    <p className="text-xs text-gray-600">{activity.exerciseTemplateId?.title}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.updatedAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/clients"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-blue-900">مدیریت مراجعان</span>
            </Link>
            <Link
              to="/admin/templates"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition"
            >
              <ClipboardList className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-purple-900">قالب‌های تمرین</span>
            </Link>
            <Link
              to="/admin/statistics"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition"
            >
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-900">گزارش‌ها و آمار</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
