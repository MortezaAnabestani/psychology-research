import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClientLayout from "../../components/ClientLayout";
import { ClipboardList, Lock, CheckCircle2, Clock, TrendingUp, Award, Target, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const wellcomeForControl = ` ${user?.name} عزیز! به بخش پایش خود در موقعیت های اجتماعی  خوش آمدید.

در این تمرین‌ها، شما یاد می‌گیرید که چطور بدون قضاوت، توجه‌تان را به تجربه‌های روزمره‌ی خود مانند افکار، احساسات و رفتارها معطوف کنید. بر خلاف تمرین‌هایی که روی هیجانات مثبت تمرکز دارند، هدف این تمرین‌ها افزایش توانایی شما برای مشاهده‌ی دقیق آنچه درونتان می‌گذرد است، بدون اینکه لازم باشد آن‌ها را تغییر دهید یا بهترشان کنید.
در طول روز، چند تمرین ساده خواهید داشت که به شما کمک می‌کنند:

•	نسبت به افکار و احساساتتان در موقعیت‌های اجتماعی آگاه‌تر شوید.

•	تجربه‌های روزمره را بدون فیلتر مثبت یا منفی بررسی کنید.

•	خودتان را بهتر بشناسید، بدون آنکه نیاز باشد قضاوت یا ارزیابی انجام دهید.

هر تمرین، فرصتی است برای ثبت و بازتاب تجربه‌هایتان به شکلی خنثی و دقیق.
`;
  const wellcomeForIntervention = `${user?.name} عزیز! به بخش «دیدن و نگه داشتن لحظه‌های خوشایند در موقعیت‌های اجتماعی» خوش آمدید.
در این تمرین‌ها، شما یاد می‌گیرید که چگونه با تمرکز دقیق و آگاهانه روی هیجانات مثبت روزمره، تجربه‌های خوشایند خود را بیشتر درک و تقویت کنید. هدف ما کمک به شماست تا بتوانید هیجانات مثبت را بهتر حس کرده و از آنها لذت ببرید، حتی در موقعیت‌هایی که معمولاً برایتان استرس‌آور هستند.
در طول روز، چند تمرین ساده خواهید داشت که به شما کمک می‌کنند:
• توجه بیشتری به لحظه‌های مثبت و دلپذیر در موقعیت‌های اجتماعی داشته باشید.
• هیجانات مثبت را به صورت کامل تجربه و savor کنید، بدون اینکه آن‌ها را سریع رد کنید یا به سمت اضطراب سوق دهید.
• تاب‌آوری هیجانی خود را در برابر تضادهای هیجانی افزایش دهید و بهتر با نوسانات خلقی کنار بیایید.
هر تمرین فرصتی است برای ثبت و بازتاب تجربه‌هایتان به شکلی دقیق و مثبت.
`;

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
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />;
      case "available":
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
      default:
        return <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
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
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      case "available":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">سلام {user?.name} عزیز!</h1>
            </div>
            <p className="text-indigo-100 text-sm sm:text-base lg:text-lg">به داشبورد شخصی خود خوش آمدید</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Completed Card */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-green-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 sm:p-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">تمرین‌های تکمیل‌شده</p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  {dashboardData?.statistics?.completed}
                </p>
              </div>
            </div>
          </div>

          {/* Total Card */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 sm:p-3 rounded-xl">
                    <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">کل تمرین‌ها</p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{dashboardData?.statistics?.total}</p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-2 sm:p-3 rounded-xl">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">نرخ پیشرفت</p>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {dashboardData?.statistics?.completionRate}%
                  </p>
                  <div className="flex-1 mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${dashboardData?.statistics?.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Groups */}
        {Object.entries(dashboardData?.exercisesByGroup || {}).map(([groupType, data]: any) => (
          <div
            key={groupType}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                <h2 className="text-xl sm:text-2xl font-bold">
                  {groupType === "control" ? "گروه کنترل - خودپایشی" : "گروه مداخله - تجویز هیجان مثبت"}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-blue-100">
                شروع: {new Date(data.assignment.startDate).toLocaleDateString("fa-IR")}
              </p>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 border-b border-indigo-100">
              <p className="text-xs sm:text-sm text-justify text-gray-700 leading-relaxed whitespace-pre-line">
                {groupType === "control" ? wellcomeForControl : wellcomeForIntervention}
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 sm:p-6 border-b border-red-100">
              <div className="flex items-start gap-3">
                <div className="bg-red-500 p-1.5 rounded-lg flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-2 text-sm sm:text-base">توجه مهم:</h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    هر روز یک پیام از طرف ما دریافت می‌کنید. این پیام‌ها به عنوان یادآوری برای انجام تمرین روزانه و
                    تقویت توجه به هیجانات مثبت طراحی شده‌اند. برای اینکه این پیام‌ها بیشترین اثرگذاری را داشته
                    باشند، لطفاً مشخص کنید که مایلید هر روز صبح، پیام تمرین در چه ساعتی برایتان ارسال شود (در
                    بازه‌ی زمانی بین ساعت ۷ تا ۱۱:۳۰ صبح).
                  </p>
                  <p className="text-xs sm:text-sm text-green-700 mt-2 font-medium">
                    ✅ پیشنهاد ما: زمانی را انتخاب کنید که معمولاً بیدار و آماده‌اید تمرین روز را ببینید، مثلاً قبل از
                    شروع کلاس یا کار.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {data.exercises.map((exercise: any, index: number) => (
                  <Link
                    key={exercise._id}
                    to={exercise.status !== "locked" ? `/exercises/${exercise._id}` : "#"}
                    className={`group relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      exercise.status === "locked"
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : "border-indigo-200 bg-gradient-to-br from-white to-indigo-50 hover:border-indigo-400 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                    }`}
                    onClick={(e) => exercise.status === "locked" && e.preventDefault()}
                  >
                    {/* Exercise Number */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 font-bold text-lg sm:text-xl transition-all ${
                        exercise.status === "locked"
                          ? "bg-gray-100 border-gray-300 text-gray-400"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 text-white shadow-lg group-hover:scale-110"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Exercise Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
                        {exercise.exerciseTemplateId.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
                        {exercise.exerciseTemplateId.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {getStatusIcon(exercise.status)}
                      <span
                        className={`hidden sm:inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
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

        {/* Recent Notifications */}
        {dashboardData?.unreadNotifications?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">پیام‌های اخیر</h2>
            </div>
            <div className="space-y-3">
              {dashboardData.unreadNotifications.slice(0, 5).map((notification: any) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-gray-900 break-words">{notification.message}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
