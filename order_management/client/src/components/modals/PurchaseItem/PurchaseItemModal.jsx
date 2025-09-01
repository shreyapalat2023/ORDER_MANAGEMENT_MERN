import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";

export default function PurchaseItemModal({ onClose, onSave, initialItem, customerPO }) {
    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState(initialItem?.item || "");
    const [availableQty, setAvailableQty] = useState(initialItem?.availableQty || 0);
    const [allocatedQty, setAllocatedQty] = useState(initialItem?.qty || "");
    const [unitCost, setUnitCost] = useState(initialItem?.unitCost || "");
    const [purchasePrice, setPurchasePrice] = useState(initialItem?.purchasePrice || "");
    const [invoiceNo, setInvoiceNo] = useState(initialItem?.invoiceNo || `INV-${Date.now()}`);
    const [invoiceDate, setInvoiceDate] = useState(initialItem?.invoiceDate || "");

    useEffect(() => {
        if (customerPO) {
            fetchItems();
        }
    }, [customerPO]);

    const fetchItems = async () => {
        try {
            const { data } = await axios.get(`/customer-pos/${customerPO}/items`);
            console.log("CustomerPO items", data);
            setItems(data || []);
        } catch (error) {
            toast.error("Failed to fetch CustomerPO items");
        }
    };

    const handleItemChange = (id) => {
        setItemId(id);
        const selected = items.find((i) => i._id === id);
        if (selected) {
            setAvailableQty(selected.qty || 0);
        } else {
            setAvailableQty(0);
        }
    };

    const handleSave = () => {
        if (!itemId || !allocatedQty || !unitCost || !purchasePrice || !invoiceNo || !invoiceDate) {
            toast.error("All required fields must be filled");
            return;
        }

        const selectedItem = items.find((i) => i._id === itemId);

        const newItem = {
            item: itemId,
            itemName: selectedItem?.name || "",
            availableQty: Number(availableQty),
            qty: Number(allocatedQty),
            remainingQty: Number(availableQty) - Number(allocatedQty),
            unitCost: Number(unitCost),
            purchasePrice: Number(purchasePrice),
            invoiceNo,
            invoiceDate,
            amount: Number(purchasePrice),
        };

        onSave(newItem);
        onClose();
    };

    return (
        <>

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                {/* <pre>{JSON.stringify(items,null,4)}</pre> */}
                <div className="bg-white rounded-xl w-full max-w-sm max-h-[90vh] p-4 shadow-lg relative border overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base font-bold text-teal-700">
                            {initialItem ? "Edit Purchase Item" : "Add Purchase Item"}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">
                            <CloseOutlined />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-3">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Item Name: <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={itemId}
                                onChange={(e) => handleItemChange(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            >
                                <option value="">Select an item</option>
                                {items.map((it) => (
                                    <option key={it._id} value={it._id}>
                                        {it.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Available Qty */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Available Qty:</label>
                            <p className="text-gray-700 text-sm">{availableQty}</p>
                        </div>

                        {/* Allocated Qty */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Allocated Qty: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={allocatedQty}
                                onChange={(e) => setAllocatedQty(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>

                        {/* Remaining Qty */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Remaining Qty:</label>
                            <p className="text-sm">{availableQty - (allocatedQty || 0)}</p>
                        </div>

                        {/* Unit Cost */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Unit Cost: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>

                        {/* Purchase Price */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Purchase Price: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>

                        {/* Invoice No */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Invoice No: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>

                        {/* Invoice Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Invoice Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-3 justify-end">
                        <button
                            onClick={handleSave}
                            className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                            style={{
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                            }}
                        >
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
