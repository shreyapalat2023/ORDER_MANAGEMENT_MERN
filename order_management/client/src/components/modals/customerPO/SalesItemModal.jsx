import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

export default function SalesItemModal({ onClose, onSave, editItem, itemList = [] }) {
    const isEditing = !!editItem;

    const [item, setItem] = useState("");
    const [availableQty, setAvailableQty] = useState(0);
    const [allocatedQty, setAllocatedQty] = useState("");
    const [remainingQty, setRemainingQty] = useState(0);
    const [unitCost, setUnitCost] = useState("");
    const [tax, setTax] = useState("");
    const [salesPrice, setSalesPrice] = useState(0);

    // Handle field population
    useEffect(() => {
        if (isEditing && editItem) {
            setItem(editItem.item?._id || "");
            setAvailableQty(editItem.availableQty || 0);
            setAllocatedQty(editItem.quantity || "");
            setUnitCost(editItem.unitCost || "");
            setTax(editItem.tax || "");
            setSalesPrice(editItem.salesPrice || "");
        }
    }, [editItem]);

    useEffect(() => {
        if (item) {
            const selected = itemList.find((i) => i._id === item);
            if (selected) {
                setAvailableQty(selected.totalStock || 0);
                const remaining = selected.totalStock - parseInt(allocatedQty || 0);
                setRemainingQty(remaining > 0 ? remaining : 0);
            }
        }
    }, [item, allocatedQty]);

    useEffect(() => {
        const qty = parseInt(allocatedQty || 0);
        const cost = parseFloat(unitCost || 0);
        const taxPercent = parseFloat(tax || 0);
        const taxAmount = (qty * cost * taxPercent) / 100;
        const total = qty * cost + taxAmount;
        setSalesPrice(total);
    }, [allocatedQty, unitCost, tax]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!item || !allocatedQty || !unitCost || !tax) {
            toast.error("All required fields must be filled");
            return;
        }

        const selectedItem = itemList.find((i) => i._id === item);

        const newItem = {
            item: selectedItem._id,
            qty: parseInt(allocatedQty),
            unitCost: parseFloat(unitCost),
            tax: parseFloat(tax),
            salesPrice: parseFloat(salesPrice),
        };

        onSave(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-teal-800">
                        {isEditing ? "Edit SalesItem" : "Add SalesItem"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    >
                        <CloseOutlined />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Item select */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            Item:
                        </label>
                        <select
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Select item</option>
                            {itemList
                            .filter((it) => it.status === "Active")
                            .map((it) => (
                                <option key={it._id} value={it._id}>
                                    {it.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between gap-4">
                        <div className="w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">Available Qty:</label>
                            <div className="border rounded px-3 py-2 bg-gray-100">{availableQty}</div>
                        </div>
                        <div className="w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">
                                Allocated Qty: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={allocatedQty}
                                onChange={(e) => setAllocatedQty(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Remaining Qty:</label>
                        <div className="border rounded px-3 py-2 bg-gray-100">{remainingQty}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Unit Cost: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Tax (%): <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Sales Price:</label>
                        <input
                            type="text"
                            readOnly
                            value={salesPrice.toFixed(2)}
                            className="w-full border rounded px-3 py-2 bg-gray-100"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                            style={{
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                            }}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
