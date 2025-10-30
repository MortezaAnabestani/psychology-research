import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Plus, Edit, Trash2, UserPlus, Mail } from "lucide-react";

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
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
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در اختصاص گروه");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت مراجعان</h1>
            <p className="text-gray-600 mt-1">لیست و مدیریت کاربران</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            افزودن مراجع جدید
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاریخ ثبت‌نام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
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
        )}
      </div>

      {/* Modal */}
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
    </AdminLayout>
  );
};

export default AdminClients;
