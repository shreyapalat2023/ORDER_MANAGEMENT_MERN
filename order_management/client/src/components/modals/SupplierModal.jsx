import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useScrollLock from "../../customhooks/useScrollLock.js";

export default function SupplierModal({ onClose, onSupplierSaved, supplierToEdit }) {
  useScrollLock(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    gstn: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const isEditing = !!supplierToEdit;

  useEffect(() => {
    if (isEditing && supplierToEdit) {
      setForm({
        name: supplierToEdit.name || "",
        email: supplierToEdit.email || "",
        phone: supplierToEdit.phone ? String(supplierToEdit.phone) : "",
        address: supplierToEdit.address || "",
        state: supplierToEdit.state || "",
        city: supplierToEdit.city || "",
        gstn: supplierToEdit.gstn || "",
        status: supplierToEdit.status || "Active",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        city: "",
        gstn: "",
        status: "Active",
      });
    }
  }, [supplierToEdit, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
  };

  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Supplier name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!form.gstn.trim()) {
      newErrors.gstn = "GST Number is required";
    } else {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(form.gstn)) {
        newErrors.gstn = "Invalid GST Number format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/suppliers/${supplierToEdit._id}`, form);
        toast.success("Supplier updated");
      } else {
        await axios.post("/supplier", form);
        toast.success("Supplier added");
      }
      onSupplierSaved();
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);  // ✅ Show exact backend error
      } else {
        toast.error("Failed to save Customer");
      }
      console.error("Customer save error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-full max-w-sm p-4 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-800 tracking-wide">
          {isEditing ? "Edit Supplier" : "Add Supplier"}
        </h2>

        {/* Scrollable form */}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {[
            { label: "Supplier Name", name: "name", required: true },
            { label: "Email", name: "email", required: true },
            { label: "Phone", name: "phone", required: true },
            { label: "Address", name: "address", required: true },
            { label: "State", name: "state", required: false },
            { label: "City", name: "city", required: false },
            { label: "GSTN", name: "gstn", required: true },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className={`border px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm
                  ${errors[field.name] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-violet-500"}`}
              />
              {errors[field.name] && (
                <span className="text-xs text-red-500 mt-1">{errors[field.name]}</span>
              )}
            </div>
          ))}

          {/* Status dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
            }}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
