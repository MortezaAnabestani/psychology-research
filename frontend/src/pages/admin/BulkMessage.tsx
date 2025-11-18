import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Send, Mail, MessageSquare, Users, CheckCircle } from "lucide-react";

const BulkMessage: React.FC = () => {
  const [groupType, setGroupType] = useState("all");
  const [messageType, setMessageType] = useState("both");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);

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

    if (
      !window.confirm(
        `آیا مطمئن هستید که می‌خواهید این پیام را به گروه "${
          groupType === "all" ? "همه" : groupType === "control" ? "کنترل" : "مداخله"
        }" ارسال کنید؟`
      )
    ) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-bulk-message`, {
        message,
        subject,
        groupType,
        messageType,
      });

      setResult(res.data.stats);
      alert(res.data.message);

      // Reset form
      setMessage("");
      setSubject("");
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
            ارسال پیامک یا ایمیل به گروه خاصی از مراجعان
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline ml-1" />
                انتخاب گروه هدف
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
                  <div className="text-xs text-gray-500 mt-1">ارسال به تمام کلاینت‌ها</div>
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
                  <div className="text-xs text-gray-500 mt-1">فقط گروه خودپایشی</div>
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
                  <div className="text-xs text-gray-500 mt-1">فقط گروه تجویز هیجان</div>
                </button>
              </div>
            </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موضوع ایمیل
                </label>
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
