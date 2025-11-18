import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Filter, Download, FileText, FileSpreadsheet, ChevronDown, ChevronUp } from "lucide-react";

const AdminResponses: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [expandedResponses, setExpandedResponses] = useState<{ [key: string]: boolean }>({});

  // Filters
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    fetchClients();
    fetchResponses();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/clients`);
      setClients(res.data.clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedClient) params.clientId = selectedClient;
      if (selectedGroup) params.groupType = selectedGroup;
      if (selectedExercise) params.templateId = selectedExercise;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/responses`, { params });
      setResponses(res.data.responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [selectedClient, selectedGroup, selectedExercise]);

  const toggleResponse = (id: string) => {
    setExpandedResponses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExportExcel = async () => {
    try {
      window.open(`${process.env.REACT_APP_API_URL}/api/admin/export`, "_blank");
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  const handleExportWord = async () => {
    try {
      window.open(`${process.env.REACT_APP_API_URL}/api/admin/export-word`, "_blank");
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">پاسخ‌های مراجعان</h1>
            <p className="text-gray-600 mt-1">مشاهده و مدیریت پاسخ‌های ثبت شده</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FileSpreadsheet className="w-5 h-5" />
              خروجی Excel
            </button>
            <button
              onClick={handleExportWord}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FileText className="w-5 h-5" />
              خروجی Word
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">فیلترها</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مراجع</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">همه مراجعان</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">گروه</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">همه گروه‌ها</option>
                <option value="control">گروه کنترل</option>
                <option value="intervention">گروه مداخله</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">همه</option>
                <option value="completed">تکمیل شده</option>
                <option value="in_progress">در حال انجام</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responses List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : responses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">هیچ پاسخی یافت نشد</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              تعداد پاسخ‌ها: <span className="font-semibold text-gray-900">{responses.length}</span>
            </div>
            {responses.map((response) => (
              <div key={response._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition"
                  onClick={() => toggleResponse(response._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{response.client.name}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            response.group.type === "control"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {response.group.name}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {response.exercise.title}
                        </span>
                        {response.completedAt && (
                          <span className="text-xs text-gray-500">
                            تکمیل شده: {new Date(response.completedAt).toLocaleDateString("fa-IR")}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {response.client.email} • {response.responses.length} پاسخ
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedResponses[response._id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Responses Detail */}
                {expandedResponses[response._id] && (
                  <div className="p-6 space-y-4">
                    {response.responses.map((answer: any, idx: number) => (
                      <div key={idx} className="border-r-4 border-indigo-500 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{answer.fieldLabel}</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {answer.fieldType}
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                          {answer.value}
                        </div>
                        {answer.answeredAt && (
                          <div className="text-xs text-gray-500 mt-2">
                            پاسخ داده شده در: {new Date(answer.answeredAt).toLocaleString("fa-IR")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResponses;
