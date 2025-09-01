import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import useScrollLock from "../../../customhooks/useScrollLock.js";
import LoadingCompo from "../../loading/LoadingCompo.jsx"
import StockTable from "./StockTable.jsx";

export default function ItemStockModal({ onClose, itemName, itemId }) {
    useScrollLock(true);

    const [price, setPrice] = useState("");
    const [date, setDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stockList, setStockList] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch stocks
    useEffect(() => {
        const fetchStock = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/items/${itemId}/stock`);

                // handle both array and object formats
                setStockList(Array.isArray(data) ? data : data?.stocks || []);
                console.log("Fetched stock:", data);
            } catch (err) {
                console.error("Failed to fetch stock list:", err);
                toast.error("Failed to fetch stock list");
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchStock();
        }
    }, [itemId]);


    // Save or update stock
    const handleSaveOrUpdate = async () => {
        if (!price || !date || !quantity) {
            toast.error("Please fill all fields");
            return;
        }

        const payload = {
            item: itemId,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            date,
        };

        try {
            if (editId) {
                // ✅ Update existing stock
                const { data } = await axios.put(`/items/${itemId}/stock/${editId}`, payload);

                // Backend sends back full item, so extract updated stock entry
                console.log("stockdata", data);

                const updatedStock = data?.stock?.id
                    ? data.stock.id(editId)
                    : data?.stock?.find((s) => s._id === editId) ||
                    data?.stock?.[data.stock.length - 1];

                if (updatedStock) {
                    setStockList((prev) =>
                        prev.map((s) => (s._id === editId ? updatedStock : s))
                    );
                    toast.success("Stock updated");
                } else {
                    toast.error("Invalid response from update");
                }
                setEditId(null);
            } else {
                // ✅ Create new stock
                const { data } = await axios.post(`/items/${itemId}/stock`, payload);

                // Backend sends back full item, so get last pushed stock
                const newStock =
                    data?.stock?.[data.stock.length - 1] || data?.stock?.at?.(-1);

                if (newStock) {
                    setStockList((prev) => [...prev, newStock]);
                    toast.success("Stock saved");
                } else {
                    toast.error("Invalid response from create");
                }
            }

            // Reset form after save/update
            setPrice("");
            setDate("");
            setQuantity("");
        } catch (err) {
            console.error("Error saving/updating stock:", err);
            toast.error("Failed to save/update stock");
        }
    };

    // Populate form for edit
    const handleEdit = (stock) => {
        if (!stock) return;

        setEditId(stock._id);
        setPrice(String(stock.price ?? ""));
        setQuantity(String(stock.quantity ?? ""));
        setDate(stock.date ? stock.date.slice(0, 10) : "");
    };

    // Delete stock
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/items/${itemId}/stock/${id}`);
            setStockList((prev) => prev.filter((s) => s._id !== id));
            toast.success("Stock deleted");
        } catch (err) {
            console.error("Failed to delete stock:", err);
            toast.error("Failed to delete stock");
        }
    };

    const handleClear = () => {
        setPrice("");
        setDate("");
        setQuantity("");
        setEditId(null);
    };

    const totalQty = stockList.reduce(
        (sum, s) => sum + (s?.quantity ? parseInt(s.quantity) : 0),
        0
    );

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-full max-w-2xl p-5 rounded-xl shadow-xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black cursor-pointer"
                >
                    <CloseOutlined />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800 tracking-wide">
                    {editId ? "Edit Item Stock" : "Add Item Stock"}
                </h2>

                <div className="mb-4">
                    <label className="font-medium text-gray-700">Item Name:</label>
                    <span className="ml-2 font-bold text-blue-900">{itemName}</span>
                </div>

                {/* Form */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                    {[
                        { label: "Price", value: price, onChange: setPrice, type: "number" },
                        { label: "Date", value: date, onChange: setDate, type: "date" },
                        { label: "Quantity", value: quantity, onChange: setQuantity, type: "number" }
                    ].map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                {field.label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={`Enter ${field.label}`}
                                className="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-sm"
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleClear}
                        className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer hover:scale-105"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSaveOrUpdate}
                        className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                        style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                        }}
                    >
                        {editId ? "Update" : "Save"}
                    </button>
                </div>

                {/* Table */}
                <div className="mt-6">
                    <h3 className="text-blue-900 font-semibold mb-2">Stock List</h3>
                    {loading ? (
                        <LoadingCompo />
                    ) : (
                        <StockTable stockList={stockList} handleDelete={handleDelete} handleEdit={handleEdit} />
                    )}
                    <p className="mt-2 font-semibold text-sm text-blue-700">
                        Total Qty: {totalQty}
                    </p>
                </div>
            </div>
        </div>
    );
}
