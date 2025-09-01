import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useScrollLock from "../../../customhooks/useScrollLock";

const ItemModal = ({ onClose, onItemSaved, itemToEdit }) => {
  useScrollLock(true);
  const isEditing = !!itemToEdit;

  const [form, setForm] = useState({
    name: "",
    supplier: "",
    category: "",
    brand: "",
    stock: [],
    unit: "Pcs",
    status: "Active",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get("/suppliers");
        setSuppliers(data);
      } catch (err) {
        toast.error("Failed to load suppliers");
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (isEditing && itemToEdit) {
      setForm({ ...itemToEdit });
    } else {
      setForm({
        name: "",
        supplier: "",
        category: "",
        brand: "",
        stock: [],
        unit: "Pcs",
        status: "Active",
        description: "",
      });
    }
    setErrors({});
  }, [itemToEdit, isEditing]);

  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Item name is required";
    if (!form.supplier) newErrors.supplier = "Supplier is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.brand.trim()) newErrors.brand = "Brand is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    if (!form.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // clear error on typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await axios.put(`/items/${itemToEdit._id}`, form);
        toast.success("Item updated");
      } else {
        await axios.post("/item", form);
        toast.success("Item added");
      }
      onItemSaved();
      onClose();
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-full max-w-sm p-4 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-800 tracking-wide">
          {isEditing ? "Edit Item" : "Add Item"}
        </h2>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {/* Item Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Item Name"
              className={`border px-3 py-1.5 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-violet-500"
              }`}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1">{errors.name}</span>
            )}
          </div>

          {/* Supplier Dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className={`border px-3 py-1.5 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.supplier
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select Supplier</option>
              {suppliers
                .filter((s) => s.status === "Active")
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
            </select>
            {errors.supplier && (
              <span className="text-xs text-red-500 mt-1">
                {errors.supplier}
              </span>
            )}
          </div>

          {/* Category & Brand */}
          {["category", "brand"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 capitalize">
                {field} <span className="text-red-500">*</span>
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className={`border px-3 py-1.5 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors[field]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-violet-500"
                }`}
              />
              {errors[field] && (
                <span className="text-xs text-red-500 mt-1">
                  {errors[field]}
                </span>
              )}
            </div>
          ))}

          {/* Unit */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className={`border px-3 py-1.5 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.unit
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="Pcs">Pcs</option>
              <option value="Feet">Feet</option>
              <option value="Kg">Kg</option>
              <option value="Litre">Litre</option>
            </select>
            {errors.unit && (
              <span className="text-xs text-red-500 mt-1">{errors.unit}</span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`border px-3 py-1.5 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <span className="text-xs text-red-500 mt-1">{errors.status}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col mt-3">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter item description"
            className="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 shadow-sm resize-none"
            rows={3}
          />
        </div>

        {/* Buttons */}
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
};

export default ItemModal;
