import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import useScrollLock from "../../../customhooks/useScrollLock.js";
import SalesItemModal from "./SalesItemModal.jsx";
import SalesItemTable from "./SalesItemTable.jsx";

export default function CustomerPOModal({ onClose, onSave, po }) {
    useScrollLock(true);
    const isEditing = !!po;

    const [customerList, setCustomerList] = useState([]);
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");
    const [poNumber, setPONumber] = useState("");
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);
    const [salesItems, setSalesItems] = useState([]);
    //ItemModal
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [itemList, setItemList] = useState([]);
    //editItem
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingItem, setEditingItem] = useState(null);


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await axios.get("/items");
                setItemList(data || []);
            } catch {
                toast.error("Failed to fetch items");
            }
        };
        fetchItems();
    }, []);


    useEffect(() => {
        if (isEditing && po) {
            setCustomer(po.customer?._id || "");
            setDate(po.date?.slice(0, 10) || "");
            setPONumber(po.poNumber || "");
            setStatus(po.status || "Active");
            setSalesItems(po.items || []);
        } else {
            setCustomer("");
            setDate("");
            setPONumber("");
            setStatus("Active");
            setSalesItems([]);
        }
    }, [isEditing, po]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await axios.get("/customers");
                setCustomerList(data || []);
            } catch (error) {
                toast.error("Failed to load customers");
            }
        };

        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!customer || !date || !poNumber || !status) {
    toast.error("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      poNumber,
      customer,
      date,
      status,
      items: salesItems,
    };

    if (isEditing) {
      await axios.put(`/customer-pos/${po._id}`, payload);
      toast.success("Customer PO updated");
    } else {
      await axios.post("/customer-po", payload);
      toast.success("Customer PO added");
    }

    onSave();
    onClose();
  } catch (err) {
    console.error(err);

    // ✅ Show backend error if available
    if (err.response && err.response.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error("Failed to save Customer PO");
    }
  } finally {
    setLoading(false);
  }
};


    const handleEditItem = (index) => {
        setEditingIndex(index);
        console.log("index", index);

        setEditingItem(salesItems[index]);
        setItemModalOpen(true);
        // TODO: Show modal to edit this item
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...salesItems];
        updatedItems.splice(index, 1);
        setSalesItems(updatedItems);
    };

    return (
        <>

            {!itemModalOpen && (
                <>

                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-full max-w-xl p-6 rounded-xl shadow-xl border border-gray-200 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-teal-800">
                                    {isEditing ? "Edit Customer PO" : "Add Customer PO"}
                                </h2>
                                <button onClick={onClose} className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black cursor-pointer">
                                    <CloseOutlined />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-gray-700 mb-1">
                                            Customer: <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                        >
                                            <option value="">Select Customer</option>
                                            {customerList
                                                .filter((cust) => cust.status === "Active") // ✅ Only Active
                                                .map((cust) => (
                                                    <option key={cust._id} value={cust._id}>
                                                        {cust.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-gray-700 mb-1">
                                            Date: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-gray-700 mb-1">
                                            Customer PO: <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                            value={poNumber}
                                            onChange={(e) => setPONumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-gray-700 mb-1">
                                            Status: <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-violet-500"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                {isEditing ? <>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                                            onClick={() => setItemModalOpen(true)}
                                            style={{
                                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                                boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                                            }}
                                        >
                                            <PlusOutlined className="transition-transform duration-300 group-hover:rotate-180 text-sm" />
                                            Add SalesItem
                                        </button>
                                    </div>

                                    <SalesItemTable
                                        salesItems={salesItems}
                                        handleEditItem={handleEditItem}
                                        handleDeleteItem={handleDeleteItem}
                                    />
                                </> : ""}


                                <div className="mt-6 flex justify-start gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                                        style={{
                                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                                            boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                                        }}
                                    >
                                        {isEditing ? "Update" : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 cursor-pointer hover:scale-105"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                </>
            )
            }
            {
                itemModalOpen && (
                    <SalesItemModal
                        onClose={() => {
                            setItemModalOpen(false);
                            setEditingItem(null);
                            setEditingIndex(null);
                        }}
                        onSave={(item) => {
                            if (editingIndex !== null) {
                                const updatedItems = [...salesItems];
                                updatedItems[editingIndex] = item;
                                setSalesItems(updatedItems);
                            } else {
                                setSalesItems([...salesItems, item]);
                            }
                            setItemModalOpen(false);
                            setEditingItem(null);
                            setEditingIndex(null);
                        }}
                        itemList={itemList}
                        editItem={editingItem} // 👈 Pass item to modal
                    />

                )
            }
        </>




    );
}
