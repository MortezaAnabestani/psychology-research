// frontend/src/pages/admin/Templates.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    groupType: "control",
    order: 1,
    description: "",
    instructions: "",
    completionMessage: "",
    fields: [] as any[],
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/templates`);
      setTemplates(res.data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTemplate) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/templates/${selectedTemplate._id}`,
          formData
        );
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/templates`, formData);
      }
      setShowModal(false);
      resetForm();
      fetchTemplates();
      alert("تمرین با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("خطا در ذخیره تمرین");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/templates/${id}`);
        fetchTemplates();
      } catch (error: any) {
        alert(error.response?.data?.message || "خطا در حذف تمرین");
      }
    }
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        {
          id: `field_${Date.now()}`,
          type: "text",
          label: "",
          desc: "",
          placeholder: "",
          required: false,
          order: formData.fields.length + 1,
        },
      ],
    });
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormData({ ...formData, fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: newFields });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      groupType: "control",
      order: 1,
      description: "",
      instructions: "",
      completionMessage: "",
      fields: [],
    });
    setSelectedTemplate(null);
  };

  const openEditModal = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      groupType: template.groupType,
      order: template.order,
      description: template.description,
      instructions: template.instructions,
      completionMessage: template.completionMessage || "",
      fields: template.fields || [],
    });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت قالب‌های تمرین</h1>
            <p className="text-gray-600 mt-1">ساخت و ویرایش تمرین‌های سفارشی</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            ایجاد تمرین جدید
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          template.groupType === "control"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {template.groupType === "control" ? "گروه کنترل" : "گروه مداخله"}
                      </span>
                      <span className="text-sm text-gray-500">تمرین #{template.order}</span>
                      {template.isCustom && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          سفارشی
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(template)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {template.isCustom && (
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">تعداد درخواستها:</span>
                    <span className="font-medium">{template.fields?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">نوتیفیکیشن‌ها:</span>
                    <span className="font-medium">{template.notifications?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTemplate ? "ویرایش تمرین" : "ایجاد تمرین جدید"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان تمرین *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع گروه *</label>
                  <select
                    value={formData.groupType}
                    onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="control">گروه کنترل</option>
                    <option value="intervention">گروه مداخله</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره ترتیب *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دستورالعمل *</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">پیام پایانی</label>
                <textarea
                  value={formData.completionMessage}
                  onChange={(e) => setFormData({ ...formData, completionMessage: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Fields Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">فرم درخواست‌ها</h3>
                  <button
                    type="button"
                    onClick={addField}
                    className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن درخواست
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          درخواست{" "}
                          <span className="text-white bg-green-700 mx-1 px-1.5 border border-green-600 rounded-full">
                            {index + 1}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">نوع درخواست</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, "type", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="text">متن کوتاه</option>
                            <option value="textarea">متن بلند</option>
                            <option value="radio">انتخابی (یکی)</option>
                            <option value="checkbox">انتخابی (چند)</option>
                            <option value="scale">مقیاس</option>
                            <option value="time">زمان</option>
                            <option value="date">تاریخ</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">برچسب سؤال</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(index, "label", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="سوال خود را وارد کنید"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">سوال راهنما</label>
                          <input
                            type="text"
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(index, "placeholder", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">توضیحات سوال</label>
                          <textarea
                            value={field.desc}
                            onChange={(e) => updateField(index, "desc", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-30 text-sm"
                            placeholder="توضیحات سوال خود را وارد کنید"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(index, "required", e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-xs text-gray-700">اجباری</span>
                          </label>
                        </div>

                        {(field.type === "radio" || field.type === "checkbox") && (
                          <div className="col-span-2">
                            <label className="block text-xs text-gray-600 mb-1">
                              گزینه‌ها (با کاما جدا کنید)
                            </label>
                            <input
                              type="text"
                              value={(field.options || []).join(", ")}
                              onChange={(e) =>
                                updateField(
                                  index,
                                  "options",
                                  e.target.value.split(",").map((o: string) => o.trim())
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="گزینه 1, گزینه 2, گزینه 3"
                            />
                          </div>
                        )}

                        {field.type === "scale" && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">حداقل</label>
                              <input
                                type="number"
                                value={field.min || 1}
                                onChange={(e) => updateField(index, "min", parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">حداکثر</label>
                              <input
                                type="number"
                                value={field.max || 5}
                                onChange={(e) => updateField(index, "max", parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {formData.fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      هیچ درخواستی اضافه نشده است. روی "افزودن درخواست" کلیک کنید.
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Save className="w-5 h-5" />
                  ذخیره تمرین
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
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

export default Templates;
