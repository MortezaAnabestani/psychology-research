import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Plus, Edit, Trash2, UserPlus, Mail, Clock, Lock, Unlock, ListTodo } from "lucide-react";

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientExercises, setClientExercises] = useState<any>({});
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/clients`);
      setClients(res.data.clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/clients/${selectedClient._id}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/clients`, formData);
      }
      setShowModal(false);
      setFormData({ name: "", email: "", password: "" });
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/clients/${id}`);
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAssignGroup = async (clientId: string, groupType: string) => {
    const time = window.prompt("ساعت دریافت پیام صبحگاهی (مثال: 08:00):");
    if (!time) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/assign-group`, {
        userId: clientId,
        groupType,
        morningNotificationTime: time,
      });
      alert("کاربر با موفقیت به گروه اختصاص یافت");
      fetchClients();
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در اختصاص گروه");
    }
  };

  const handleManageExercises = async (client: any) => {
    setSelectedClient(client);
    setShowExercisesModal(true);
    setLoadingExercises(true);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/clients/${client._id}/progress`);
      setClientExercises(res.data.progress);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      alert("خطا در دریافت تمرین‌های مراجع");
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleToggleExerciseLock = async (exerciseId: string, currentStatus: string) => {
    try {
      const endpoint = currentStatus === "locked" ? "unlock-exercise" : "lock-exercise";
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/${endpoint}`, {
        userId: selectedClient._id,
        exerciseId,
      });

      // Refresh exercises
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/clients/${selectedClient._id}/progress`
      );
      setClientExercises(res.data.progress);
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در تغییر وضعیت تمرین");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت مراجعان</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">لیست و مدیریت کاربران</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            افزودن مراجع جدید
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      تاریخ ثبت‌نام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">گروه‌ها</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">زمان انتخابی</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">{client.name.charAt(0)}</span>
                          </div>
                          <div className="mr-3">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.isActive ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {client.groupAssignments && client.groupAssignments.length > 0 ? (
                            client.groupAssignments.map((assignment: any, idx: number) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 text-xs font-semibold rounded-full inline-block ${
                                  assignment.groupType === "control"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {assignment.groupType === "control" ? "کنترل" : "مداخله"}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">بدون گروه</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 text-sm">
                          {client.groupAssignments && client.groupAssignments.length > 0 ? (
                            client.groupAssignments.map((assignment: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">
                                  {assignment.morningNotificationTime || "انتخاب نشده"}
                                </span>
                                <span className="text-gray-400">
                                  ({assignment.groupType === "control" ? "کنترل" : "مداخله"})
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleManageExercises(client)}
                            className="text-green-600 hover:text-green-800"
                            title="مدیریت تمرین‌ها"
                          >
                            <ListTodo className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAssignGroup(client._id, "control")}
                            className="text-blue-600 hover:text-blue-800"
                            title="اختصاص به گروه کنترل"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAssignGroup(client._id, "intervention")}
                            className="text-purple-600 hover:text-purple-800"
                            title="اختصاص به گروه مداخله"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setFormData({ name: client.name, email: client.email, password: "" });
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {clients.map((client) => (
                <div key={client._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-lg">{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-600">{client.email}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    تاریخ ثبت‌نام: {new Date(client.createdAt).toLocaleDateString("fa-IR")}
                  </div>

                  {/* Groups and Times Info */}
                  {client.groupAssignments && client.groupAssignments.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium text-gray-600">گروه‌ها:</span>
                        {client.groupAssignments.map((assignment: any, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              assignment.groupType === "control"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {assignment.groupType === "control" ? "کنترل" : "مداخله"}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600">زمان‌های انتخابی:</span>
                        {client.groupAssignments.map((assignment: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs mr-2">
                            <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">
                              {assignment.morningNotificationTime || "انتخاب نشده"}
                            </span>
                            <span className="text-gray-400">
                              ({assignment.groupType === "control" ? "کنترل" : "مداخله"})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleManageExercises(client)}
                      className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition text-sm"
                    >
                      <ListTodo className="w-4 h-4" />
                      مدیریت تمرین‌ها
                    </button>
                    <button
                      onClick={() => handleAssignGroup(client._id, "control")}
                      className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      گروه کنترل
                    </button>
                    <button
                      onClick={() => handleAssignGroup(client._id, "intervention")}
                      className="flex-1 min-w-[45%] flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-100 transition text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      گروه مداخله
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setFormData({ name: client.name, email: client.email, password: "" });
                        setShowModal(true);
                      }}
                      className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal - Add/Edit Client */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedClient ? "ویرایش مراجع" : "افزودن مراجع جدید"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              {!selectedClient && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedClient(null);
                    setFormData({ name: "", email: "", password: "" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Manage Exercises */}
      {showExercisesModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowExercisesModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                مدیریت تمرین‌های {selectedClient?.name}
              </h2>
              <button
                onClick={() => setShowExercisesModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {loadingExercises ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : Object.keys(clientExercises).length === 0 ? (
              <div className="text-center py-12 text-gray-500">این کاربر هنوز به هیچ گروهی اختصاص نیافته است</div>
            ) : (
              <div className="space-y-6">
                {Object.entries(clientExercises).map(([groupType, data]: [string, any]) => (
                  <div key={groupType} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      className={`p-4 font-bold text-white ${
                        groupType === "control"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gradient-to-r from-purple-500 to-purple-600"
                      }`}
                    >
                      {groupType === "control" ? "گروه کنترل - خودپایشی" : "گروه مداخله - تجویز هیجان مثبت"}
                    </div>
                    <div className="p-4 space-y-3">
                      {data.exercises && data.exercises.length > 0 ? (
                        data.exercises.map((exercise: any) => (
                          <div
                            key={exercise._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">
                                  {exercise.exerciseTemplateId?.title || "بدون عنوان"}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    exercise.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : exercise.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : exercise.status === "available"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {exercise.status === "completed"
                                    ? "تکمیل شده"
                                    : exercise.status === "in_progress"
                                    ? "در حال انجام"
                                    : exercise.status === "available"
                                    ? "در دسترس"
                                    : "قفل"}
                                </span>
                              </div>
                              {exercise.completedAt && (
                                <div className="text-xs text-gray-500 mt-1">
                                  تکمیل شده در: {new Date(exercise.completedAt).toLocaleDateString("fa-IR")}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleToggleExerciseLock(exercise._id, exercise.status)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition ${
                                exercise.status === "locked"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                              }`}
                              disabled={exercise.status === "completed"}
                              title={
                                exercise.status === "completed"
                                  ? "تمرین تکمیل شده را نمی‌توان قفل کرد"
                                  : exercise.status === "locked"
                                  ? "باز کردن قفل"
                                  : "قفل کردن"
                              }
                            >
                              {exercise.status === "locked" ? (
                                <>
                                  <Unlock className="w-4 h-4" />
                                  باز کردن قفل
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  قفل کردن
                                </>
                              )}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">تمرینی یافت نشد</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClients;
