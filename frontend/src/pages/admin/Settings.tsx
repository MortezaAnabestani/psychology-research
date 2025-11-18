import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Save } from "lucide-react";

const AdminSettings: React.FC = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        name,
        phone,
      });
      setUser(res.data.user);
      alert("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در به‌روزرسانی پروفایل");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }

    if (newPassword.length < 6) {
      alert("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setChangingPassword(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/change-password`, {
        oldPassword,
        newPassword,
      });
      alert("رمز عبور با موفقیت تغییر یافت");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در تغییر رمز عبور");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">تنظیمات</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 px-6 text-center font-medium transition ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5 inline-block ml-2" />
                پروفایل
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-4 px-6 text-center font-medium transition ${
                  activeTab === "password"
                    ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Lock className="w-5 h-5 inline-block ml-2" />
                تغییر رمز عبور
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره موبایل
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">برای دریافت پیام‌های خودکار</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نقش
                  </label>
                  <input
                    type="text"
                    value="مدیر سیستم"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">حداقل ۶ کاراکتر</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {changingPassword ? "در حال تغییر..." : "تغییر رمز عبور"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
