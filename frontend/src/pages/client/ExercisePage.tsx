import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClientLayout from "../../components/ClientLayout";
import { ArrowRight, Save, Send } from "lucide-react";

const ExercisePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/exercises/${id}`);
      setExercise(res.data.exercise);

      // Load existing responses
      const existingResponses: any = {};
      res.data.exercise.responses.forEach((r: any) => {
        existingResponses[r.fieldId] = r.value;
      });
      setResponses(existingResponses);
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در بارگذاری تمرین");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (fieldId: string, value: any) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleSave = async (isComplete: boolean = false) => {
    setSaving(true);
    try {
      const responseArray = Object.entries(responses).map(([fieldId, value]) => ({
        fieldId,
        value,
      }));

      await axios.post(`${process.env.REACT_APP_API_URL}/api/exercises/${id}/response`, {
        responses: responseArray,
        isComplete,
      });

      if (isComplete) {
        alert("تمرین با موفقیت تکمیل شد!");
        navigate("/dashboard");
      } else {
        alert("پاسخ‌های شما ذخیره شد");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "خطا در ذخیره پاسخ‌ها");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: any) => {
    const value = responses[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleResponseChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            required={field.required}
          />
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(field.id, e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                  required={field.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleResponseChange(field.id, newValues);
                  }}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {Array.from(
                { length: (field.max || 5) - (field.min || 1) + 1 },
                (_, i) => i + (field.min || 1)
              ).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleResponseChange(field.id, num)}
                  className={`w-12 h-12 rounded-full border-2 font-semibold transition ${
                    value === num
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{field.min || 1}</span>
              <span>{field.max || 5}</span>
            </div>
          </div>
        );

      case "time":
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleResponseChange(field.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleResponseChange(field.id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required={field.required}
          />
        );

      default:
        return null;
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

  const template = exercise.exerciseTemplateId;

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت به داشبورد
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>

            {template.description && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  <span className="text-yellow-600 text-2xl pl-1">☀</span> {template.description}
                </p>
              </div>
            )}

            {template.instructions && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line font-semibold">
                  <span className="text-yellow-600 text-2xl pl-1">⁂</span>
                  {template.instructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(true);
          }}
          className="space-y-6"
        >
          {template.fields
            .sort((a: any, b: any) => a.order - b.order)
            .map((field: any) => (
              <div key={field.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <label className="block text-xl font-semibold text-gray-900 mb-4">
                  {field.label}
                  {field.required && <span className="text-red-500 mr-1">*</span>}
                </label>
                <h3 className="font-bold my-2">
                  <span className="text-green-600 bg-green-500 ml-1 py-0.5 px-1.5 rounded-full text-lg">
                    ❔
                  </span>
                  {field.placeholder}
                </h3>
                <p className="text-md my-2 bg-green-50"> ↩ {field.desc}</p>
                {renderField(field)}
              </div>
            ))}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                ذخیره موقت
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {saving ? "در حال ارسال..." : "تکمیل تمرین"}
              </button>
            </div>
          </div>
        </form>

        {/* Completion Message */}
        {saving && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-6">
            <p className="text-gray-700 leading-relaxed">{template.completionMessage}</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ExercisePage;
