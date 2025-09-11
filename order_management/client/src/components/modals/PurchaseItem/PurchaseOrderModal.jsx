import { useEffect, useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import useScrollLock from "../../../customhooks/useScrollLock";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseItemModal from "./PurchaseItemModal";

export default function PurchaseOrderModal({ onClose, onSave, purchaseOrder }) {
    useScrollLock(true);
    const isEditing = !!purchaseOrder;

    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState("");
    const [customerPOList, setCustomerPOList] = useState([]);
    const [filteredCPOList, setFilteredCPOList] = useState([]);

    const [customerPO, setCustomerPO] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);

    const [purchaseItems, setPurchaseItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [editingItemIndex, setEditingItemIndex] = useState(null)

    useEffect(() => {
        fetchCustomerPOs();
    }, []);

    // const fetchCustomers = async () => {
    //     try {
    //         const { data } = await axios.get("/customers");
    //         setCustomers(data || []);
    //     } catch {
    //         toast.error("Failed to fetch customers");
    //     }
    // };

    const fetchCustomerPOs = async () => {
        try {
            const { data } = await axios.get("/customer-pos");
            setCustomerPOList(data || []);
            console.log("customer-po", data);

            setCustomers(data)
        } catch {
            toast.error("Failed to fetch customer POs");
        }
    };

    useEffect(() => {
        const filtered = customerPOList.filter(cpo => cpo.customer?._id === customer);
        setFilteredCPOList(filtered);
    }, [customer, customerPOList]);

    useEffect(() => {
        if (isEditing && purchaseOrder) {
            setPoNumber(purchaseOrder.poNumber || "");
            setCustomerPO(purchaseOrder.customerPO?._id || "");
            setCustomer(purchaseOrder.customer?._id || "");
            setDate(purchaseOrder.date?.slice(0, 10) || "");
            setStatus(purchaseOrder.status || "Active");
            setPurchaseItems(purchaseOrder.items || []);
        } else {
            setPoNumber("");
            setCustomerPO("");
            setCustomer("");
            setDate("");
            setStatus("Active");
            setPurchaseItems([]);
        }
    }, [isEditing, purchaseOrder]);

    const handleAddItem = (item) => {
        setPurchaseItems(prev => [...prev, item]);
    };
    //edit Item
   const handleEditItem = async (index) => {
  const itemToEdit = purchaseItems[index];
  setEditingItemIndex(index);
  setShowItemModal(true); // open immediately

  if (itemToEdit?._id && purchaseOrder?._id) {
    try {
      const { data } = await axios.get(
        `/purchase-order/${purchaseOrder._id}/items/${itemToEdit._id}`
      );
      setEditingItem(data); // overwrite after load
      console.log("editing item",data);
      
      
    } catch (err) {
      console.error("Failed to fetch item details:", err);
      toast.error("Failed to load item details");
    }
  } else {
    setEditingItem(itemToEdit);
  }
};




    const handleSaveItem = (item) => {
        if (editingItemIndex !== null) {
            setPurchaseItems(prev => {
                const updated = [...prev];
                updated[editingItemIndex] = item;
                return updated;
            });
        } else {
            handleAddItem(item);
        }
        setEditingItemIndex(null);
    };


    const handleDeleteItem = (item) => {
        setPurchaseItems(prev =>
            prev.filter(i => i._id !== item._id)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!poNumber || !customerPO || !date || !status) {
            toast.error("All fields are required");
            return;
        }

        const totalPurchaseAmount = purchaseItems.reduce(
            (sum, item) => sum + (item.purchasePrice || 0),
            0
        );

        const formattedItems = purchaseItems.map((it) => ({
            item: it.item?._id || it.item,
            qty: it.qty,
            unitCost: it.unitCost,
            tax: it.tax || 0,
            purchasePrice: it.purchasePrice,
            invoiceNo: it.invoiceNo,
            invoiceDate: it.invoiceDate ? new Date(it.invoiceDate) : null,
        }));

        const payload = {
            customer,
            poNumber,
            customerPO,
            date: new Date(date),
            status,
            items: formattedItems,
            totalPurchaseAmount,
        };

        try {
            setLoading(true);
            if (isEditing) {
                await axios.put(`/purchase-order/${purchaseOrder._id}`, payload);
                toast.success("Purchase Order updated");
            } else {
                await axios.post("/purchase-order", payload);
                toast.success("Purchase Order added");
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Save error:", err.response?.data || err.message);

            // ✅ Show backend error (e.g. "PO Number must be unique")
            if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Failed to save Purchase Order");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            {!showItemModal && (
                <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-lg relative border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-teal-700">
                            {isEditing ? "Edit Purchase Order" : "Add Purchase Order"}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl cursor-pointer">
                            <CloseOutlined />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Fields */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Customer */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Customer: <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={customer}
                                    onChange={(e) => {
                                        setCustomer(e.target.value);
                                        setCustomerPO("");
                                    }}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Customer</option>
                                    {customers
                                        // filter by customer status if populated
                                        .filter((cpo) => cpo.customer && cpo.status === "Active")
                                        // get unique customers so same customer doesn't repeat
                                        .reduce((acc, cpo) => {
                                            if (!acc.find((x) => x._id === cpo.customer._id)) {
                                                acc.push(cpo.customer);
                                            }
                                            return acc;
                                        }, [])
                                        .map((cust) => (
                                            <option key={cust._id} value={cust._id}>
                                                {cust.name}
                                            </option>
                                        ))}
                                </select>

                            </div>

                            {/* Customer PO */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Customer PO: <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={customerPO}
                                    onChange={(e) => setCustomerPO(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select Customer PO</option>
                                    {filteredCPOList.map((cpo) => (
                                        <option key={cpo._id} value={cpo._id}>{cpo.poNumber}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Date: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* PO Number */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Purchase No.: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={poNumber}
                                    onChange={(e) => setPoNumber(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Status + Add Item */}
                            <div className="flex items-end justify-between gap-4 col-span-2">
                                <div className="w-1/3">
                                    <label className="block font-medium text-gray-700 mb-1">
                                        Status: <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingItem(null);
                                            setShowItemModal(true);
                                        }}
                                        className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                                        style={{
                                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                                            boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                                        }}
                                    >
                                        <PlusOutlined className="transition-transform duration-300 group-hover:rotate-180 text-sm" />
                                        Add Purchase Item
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <PurchaseItemsTable
                                items={purchaseItems}
                                onEditItem={handleEditItem}
                                onDeleteItem={handleDeleteItem}
                            />
                        )}

                        <div className="mt-6 flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                                style={{
                                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                                }}
                            >
                                {isEditing ? "Update" : "Save"}
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
            )}

            {showItemModal && (
                <PurchaseItemModal
                    onClose={() => {
                        setShowItemModal(false);
                        setEditingItemIndex(null);
                    }}
                    onSave={handleSaveItem}
                    initialItem={editingItem}
                    customerPO={customerPO}
                    purchaseOrderId={purchaseItems._id}
                />
            )}
        </div>
    );
}
