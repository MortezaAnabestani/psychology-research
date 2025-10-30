import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, Users, Activity } from "lucide-react";

const AdminStatistics: React.FC = () => {
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

  const handleExport = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/export`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `research-data-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("خطا در دانلود فایل");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  // Data for charts
  const completionData = [
    { name: "تکمیل‌شده", value: statistics?.completedExercises || 0, color: "#10B981" },
    { name: "در حال انجام", value: statistics?.inProgressExercises || 0, color: "#F59E0B" },
    {
      name: "قفل",
      value:
        (statistics?.totalExercises || 0) -
        (statistics?.completedExercises || 0) -
        (statistics?.inProgressExercises || 0),
      color: "#6B7280",
    },
  ];

  const groupData = [
    { name: "کنترل", value: statistics?.groupDistribution?.control || 0 },
    { name: "مداخله", value: statistics?.groupDistribution?.intervention || 0 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">گزارش‌ها و آمار</h1>
            <p className="text-gray-600 mt-1">تحلیل جامع داده‌های پژوهش</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-5 h-5" />
            دانلود Excel
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <Users className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90">کل مراجعان</p>
            <p className="text-3xl font-bold mt-2">{statistics?.totalClients || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <Activity className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90">کل تمرین‌ها</p>
            <p className="text-3xl font-bold mt-2">{statistics?.totalExercises || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90">تکمیل‌شده</p>
            <p className="text-3xl font-bold mt-2">{statistics?.completedExercises || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90">نرخ تکمیل</p>
            <p className="text-3xl font-bold mt-2">{statistics?.completionRate || 0}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">وضعیت تمرین‌ها</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Group Distribution Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">توزیع گروه‌ها</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مراجع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تمرین</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics?.recentActivity?.map((activity: any) => (
                  <tr key={activity._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.userId?.name || "نامشخص"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activity.exerciseTemplateId?.title || "نامشخص"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "in_progress"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activity.status === "completed"
                          ? "تکمیل‌شده"
                          : activity.status === "in_progress"
                          ? "در حال انجام"
                          : "قفل"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.updatedAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
