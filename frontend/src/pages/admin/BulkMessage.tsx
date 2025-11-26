import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Send, Mail, MessageSquare, Users, CheckCircle, UserCheck } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
}

const BulkMessage: React.FC = () => {
  const [selectionMode, setSelectionMode] = useState<"group" | "individual">("group");
  const [groupType, setGroupType] = useState("all");
  const [messageType, setMessageType] = useState("both");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Individual selection states
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users when group type changes in individual mode
  useEffect(() => {
    if (selectionMode === "individual") {
      fetchUsers();
    }
  }, [groupType, selectionMode]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users-by-group`, {
        params: { groupType },
      });
      setAvailableUsers(res.data.users);
      setSelectedUserIds([]); // Reset selection when group changes
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("خطا در دریافت لیست کاربران");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === availableUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(availableUsers.map((u) => u._id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("لطفاً متن پیام را وارد کنید");
      return;
    }

    if ((messageType === "email" || messageType === "both") && !subject.trim()) {
      alert("لطفاً موضوع ایمیل را وارد کنید");
      return;
    }

    if (selectionMode === "individual" && selectedUserIds.length === 0) {
      alert("لطفاً حداقل یک نفر را انتخاب کنید");
      return;
    }

    const confirmMessage =
      selectionMode === "individual"
        ? `آیا مطمئن هستید که می‌خواهید این پیام را به ${selectedUserIds.length} نفر ارسال کنید؟`
        : `آیا مطمئن هستید که می‌خواهید این پیام را به گروه "${
            groupType === "all" ? "همه" : groupType === "control" ? "کنترل" : "مداخله"
          }" ارسال کنید؟`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-bulk-message`, {
        message,
        subject,
        groupType: selectionMode === "group" ? groupType : undefined,
        messageType,
        selectedUserIds: selectionMode === "individual" ? selectedUserIds : undefined,
      });

      setResult(res.data.stats);
      alert(res.data.message);

      // Reset form
      setMessage("");
      setSubject("");
      setSelectedUserIds([]);
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در ارسال پیام");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ارسال پیام دسته‌ای</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            ارسال پیامک یا ایمیل به گروه خاصی از مراجعان یا افراد منتخب
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selection Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">روش انتخاب</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectionMode("group")}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectionMode === "group"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-semibold">ارسال گروهی</div>
                  <div className="text-xs text-gray-500 mt-1">ارسال به کل گروه</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionMode("individual")}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectionMode === "individual"
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserCheck className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-semibold">انتخاب فردی</div>
                  <div className="text-xs text-gray-500 mt-1">انتخاب افراد خاص</div>
                </button>
              </div>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline ml-1" />
                {selectionMode === "group" ? "انتخاب گروه هدف" : "انتخاب گروه برای فیلتر"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setGroupType("all")}
                  className={`p-4 border-2 rounded-lg transition ${
                    groupType === "all"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">همه مراجعان</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectionMode === "group" ? "ارسال به تمام کلاینت‌ها" : "نمایش همه"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGroupType("control")}
                  className={`p-4 border-2 rounded-lg transition ${
                    groupType === "control"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">گروه کنترل</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectionMode === "group" ? "فقط گروه خودپایشی" : "نمایش کنترل"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGroupType("intervention")}
                  className={`p-4 border-2 rounded-lg transition ${
                    groupType === "intervention"
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">گروه مداخله</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectionMode === "group" ? "فقط گروه تجویز هیجان" : "نمایش مداخله"}
                  </div>
                </button>
              </div>
            </div>

            {/* Individual User Selection */}
            {selectionMode === "individual" && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    انتخاب افراد ({selectedUserIds.length} از {availableUsers.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {selectedUserIds.length === availableUsers.length ? "لغو انتخاب همه" : "انتخاب همه"}
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="text-center py-4 text-gray-500">در حال بارگذاری...</div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">کاربری یافت نشد</div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {availableUsers.map((user) => (
                      <label
                        key={user._id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          selectedUserIds.includes(user._id)
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user._id)}
                          onChange={() => handleUserToggle(user._id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500" dir="ltr">
                            {user.email}
                          </div>
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-400" dir="ltr">
                            📱 {user.phone}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع ارسال</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMessageType("both")}
                  className={`p-4 border-2 rounded-lg transition ${
                    messageType === "both"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">ایمیل + پیامک</div>
                  <div className="text-xs text-gray-500 mt-1">ارسال هر دو</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMessageType("email")}
                  className={`p-4 border-2 rounded-lg transition ${
                    messageType === "email"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Mail className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-semibold">فقط ایمیل</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMessageType("sms")}
                  className={`p-4 border-2 rounded-lg transition ${
                    messageType === "sms"
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-semibold">فقط پیامک</div>
                </button>
              </div>
            </div>

            {/* Subject (only for email) */}
            {(messageType === "email" || messageType === "both") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موضوع ایمیل</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="مثال: یادآوری مهم درباره تمرین‌ها"
                  required
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                متن پیام
                {messageType === "sms" || messageType === "both" ? (
                  <span className="text-xs text-gray-500 mr-2">(توصیه: حداکثر 160 کاراکتر برای پیامک)</span>
                ) : null}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="متن پیام خود را اینجا بنویسید..."
                required
              />
              <div className="text-xs text-gray-500 mt-1">تعداد کاراکتر: {message.length}</div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {sending ? "در حال ارسال..." : "ارسال پیام"}
              </button>

              {result && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ارسال شد
                </div>
              )}
            </div>
          </form>

          {/* Result Stats */}
          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">نتیجه ارسال:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">تعداد کل</div>
                  <div className="text-xl font-bold text-gray-900">{result.totalUsers}</div>
                </div>
                <div>
                  <div className="text-gray-600">ایمیل ارسال شده</div>
                  <div className="text-xl font-bold text-green-600">{result.emailSent}</div>
                </div>
                <div>
                  <div className="text-gray-600">پیامک ارسال شده</div>
                  <div className="text-xl font-bold text-blue-600">{result.smsSent}</div>
                </div>
                <div>
                  <div className="text-gray-600">خطا</div>
                  <div className="text-xl font-bold text-red-600">{result.errors}</div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">⚠️ نکات مهم:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• در حالت "انتخاب فردی" می‌توانید افراد خاصی را برای ارسال پیام انتخاب کنید</li>
              <li>• پیامک فقط برای مراجعانی ارسال می‌شود که شماره موبایل وارد کرده‌اند</li>
              <li>• هزینه هر پیامک از حساب کاوه‌نگار کسر می‌شود</li>
              <li>• برای پیامک‌های طولانی، متن به چند پیامک تقسیم می‌شود</li>
              <li>• ایمیل به تمام مراجعان انتخاب شده ارسال می‌شود</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BulkMessage;
