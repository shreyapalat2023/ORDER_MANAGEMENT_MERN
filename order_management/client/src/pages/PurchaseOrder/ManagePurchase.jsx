import { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Select, DatePicker, message } from "antd";
import axios from "axios";
import PurchaseOrderTable from "./PurchaseOrderTable";
import Loading from "../../components/loading/LoadingCompo.jsx";
import PurchaseSearch from "./PurchaseSearch.jsx";
import PurchaseOrderModal from "../../components/modals/PurchaseItem/PurchaseOrderModal.jsx"

const { Option } = Select;

export default function ManagePurchases() {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(""); // ✅ selected customer
    const [date, setDate] = useState(null);
    const [po, setPo] = useState("");
    const [purchaseList, setPurchaseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    //modal
    const [showModal, setShowModal] = useState(false);
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
    useEffect(() => {
        fetchPurchaseOrders();
        fetchCustomers();
    }, []);

    const fetchPurchaseOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/purchase-orders");
            console.log("purchase-orders", data);
            setPurchaseList(data?.data || []);
            setFilteredList(data?.data || []);
        } catch (error) {
            console.error("Failed to fetch purchase orders", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const { data } = await axios.get("/customer-pos");
            console.log("customer-pos", data);
            setCustomers(data || []);
        } catch {
            message.error("Failed to load customers");
        }
    };

    const handleSearch = () => {
        const filtered = purchaseList.filter((order) => {
            const matchCustomer = customer ? order.customer?._id === customer : true;
            const matchPo = po ? order.poNumber?.toLowerCase().includes(po.toLowerCase()) : true;
            const matchDate = date ? new Date(order.date).toDateString() === new Date(date).toDateString() : true;

            return matchCustomer && matchPo && matchDate;
        });

        setFilteredList(filtered);
    };
    const handleEdit = (order) => {
        setSelectedPurchaseOrder(order);
        setShowModal(true);
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/purchase-order/${id}`);
            message.success("Purchase Order deleted successfully");
            fetchPurchaseOrders(); // refresh list
        } catch (error) {
            console.error("Delete failed", error);
            message.error("Failed to delete purchase order");
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-teal-800 mb-6">Manage Purchases</h2>
                {/* <pre>{JSON.stringify(purchaseList,null,4)}</pre> */}

                {/* Filters + Action Buttons */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-wrap">
                        <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full justify-start md:justify-between items-center">
                            {/* Filters */}
                            <PurchaseSearch
                                purchaseList={purchaseList}
                                customers={customers}
                                setCustomers={setCustomers}
                                customer={customer}
                                setCustomer={setCustomer}
                                po={po}
                                setPo={setPo}
                                date={date}
                                setDate={setDate}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="flex items-center gap-2 text-white px-4 py-1 rounded-md shadow-md border-none cursor-pointer"
                                    style={{
                                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                                    }}
                                >
                                    <SearchOutlined className="text-white" />
                                    Search
                                </button>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                                    style={{
                                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                                        boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                                    }}
                                >
                                    <PlusOutlined className="transition-transform duration-300 group-hover:rotate-180 text-sm" />
                                    Add Purchase Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <h4 className="text-xl font-bold text-teal-800 mb-6">Order List</h4>

                {loading ? (
                    <Loading />
                ) : (
                    <PurchaseOrderTable data={filteredList} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>
            {showModal && (
                <PurchaseOrderModal
                    onClose={() => {
                        setShowModal(false);
                        setSelectedPurchaseOrder(null);
                    }}
                    onSave={fetchPurchaseOrders}
                    purchaseOrder={selectedPurchaseOrder} // 👈 important
                />
            )}


        </>
    );
}
