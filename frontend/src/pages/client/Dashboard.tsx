import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClientLayout from "../../components/ClientLayout";
import { ClipboardList, Lock, CheckCircle2, Clock, TrendingUp } from "lucide-react";
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
        <div className="bg-gradient-to-r from-yellow-50 to-blue-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2"> {user?.name} عزیز، خوش آمدید!</h1>
          <p className="text-indigo-100"></p>
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
            <div className="bg-gradient-to-r from-blue-400 to-blue-700 rounded-2xl rounded-b-none p-8 text-white mb-6">
              <p className="text-md text-justify font-bold mb-2">
                {groupType === "control" ? wellcomeForControl : wellcomeForIntervention}
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-400 to-red-700 p-8 text-white mb-6">
              <p className="text-md text-justify font-bold mb-2">
                توجه: هر روز یک پیام از طرف ما دریافت می‌کنید. این پیام‌ها به عنوان یادآوری برای انجام تمرین
                روزانه و تقویت توجه به هیجانات مثبت طراحی شده‌اند. برای اینکه این پیام‌ها بیشترین اثرگذاری را
                داشته باشند، لطفاً مشخص کنید که مایلید هر روز صبح، پیام تمرین در چه ساعتی برایتان ارسال شود
                (در بازه‌ی زمانی بین ساعت ۷ تا ۱۱:۳۰ صبح). این زمان را شما تعیین می‌کنید و هر روز پیام دقیقاً
                در همان ساعت برایتان ارسال خواهد شد.
                <br />✅ پیشنهاد ما: زمانی را انتخاب کنید که معمولاً بیدار و آماده‌اید تمرین روز را ببینید،
                مثلاً قبل از شروع کلاس یا کار. <br /> 👇 لطفاً یکی از گزینه‌های زیر را انتخاب کنید یا ساعت
                دلخواه خود را وارد نمایید:
              </p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-y border-gray-300 flex justify-between items-center">
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
