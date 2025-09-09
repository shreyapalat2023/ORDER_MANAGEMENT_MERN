import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomerModal from "../../components/modals/AddCustomerModa.jsx"
import CustomerTable from "./CustomerTable.jsx";
import SearchCustomer from "./SearchCustomer.jsx";
import toast from "react-hot-toast";
import Loading from "../../components/loading/LoadingCompo.jsx";

export default function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    // Edit states
    const [editingCustomer, setEditingCustomer] = useState(null)

    // Sorting
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/customers");
            if (data?.error) toast.error(data.error);
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setOpenModal(true);
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            await axios.delete(`customers/${customerId}`);
            toast.success("Customer deleted successfully");
            fetchCustomers();
        } catch (error) {
            console.log(error);
            toast.error("Delete failed");
        }
    };

    const filtered = customers
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const fieldA = a[sortField]?.toLowerCase?.() || "";
            const fieldB = b[sortField]?.toLowerCase?.() || "";
            if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
            if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });


    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-800">Manage Customer</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
                <SearchCustomer search={search} setSearch={setSearch} />
                <button
                    onClick={() => setOpenModal(true)}
                    className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                    style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                    }}
                >
                    <PlusOutlined className="transform transition-transform duration-500 group-hover:rotate-180" />
                    Add Customer
                </button>

            </div>

            <h1 className="text-2xl font-bold text-teal-800 mb-5">Customer List</h1>

            {loading ? (
                <Loading />
            ) : (
                <>
                    <CustomerTable
                        customers={filtered}
                        onEditCustomer={handleEditCustomer}
                        onDeleteCustomer={handleDeleteCustomer}
                        onSort={handleSort}
                        sortField={sortField}
                        sortOrder={sortOrder}
                    />
                </>
            )}
            {/* Open Modal */}
            {openModal && (
                <CustomerModal
                    onClose={() => {
                        setOpenModal(false);
                        setEditingCustomer(null);
                    }}
                    onCustomerSaved={fetchCustomers}
                    customerToEdit={editingCustomer}
                />
            )}
        </div>
    );
}
