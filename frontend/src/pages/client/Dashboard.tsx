import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClientLayout from "../../components/ClientLayout";
import { ClipboardList, Lock, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const ClientDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/client/dashboard`);
      setDashboardData(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ClientLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "available":
        return <ClipboardList className="w-5 h-5 text-blue-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "تکمیل‌شده";
      case "in_progress":
        return "در حال انجام";
      case "available":
        return "در دسترس";
      default:
        return "قفل";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "available":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">خوش آمدید!</h1>
          <p className="text-indigo-100">
            به برنامه پژوهش روانشناسی خوش آمدید. در این صفحه می‌توانید تمرین‌های خود را مشاهده و انجام دهید.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تمرین‌های تکمیل‌شده</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.statistics?.completed}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل تمرین‌ها</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.statistics?.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نرخ پیشرفت</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.statistics?.completionRate}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Groups */}
        {Object.entries(dashboardData?.exercisesByGroup || {}).map(([groupType, data]: any) => (
          <div
            key={groupType}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {groupType === "control" ? "گروه کنترل - خودپایشی" : "گروه مداخله - تجویز هیجان مثبت"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                شروع: {new Date(data.assignment.startDate).toLocaleDateString("fa-IR")}
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {data.exercises.map((exercise: any, index: number) => (
                  <Link
                    key={exercise._id}
                    to={exercise.status !== "locked" ? `/exercises/${exercise._id}` : "#"}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                      exercise.status === "locked"
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : "border-indigo-200 bg-indigo-50 hover:border-indigo-300 hover:shadow-md"
                    }`}
                    onClick={(e) => exercise.status === "locked" && e.preventDefault()}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-indigo-200">
                      <span className="text-xl font-bold text-indigo-600">{index + 1}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{exercise.exerciseTemplateId.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {exercise.exerciseTemplateId.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusIcon(exercise.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          exercise.status
                        )}`}
                      >
                        {getStatusText(exercise.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Notifications */}
        {dashboardData?.unreadNotifications?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">پیام‌های اخیر</h2>
            <div className="space-y-3">
              {dashboardData.unreadNotifications.slice(0, 5).map((notification: any) => (
                <div key={notification._id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.sentAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
