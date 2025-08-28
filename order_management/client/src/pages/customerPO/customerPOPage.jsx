import { useState, useEffect } from "react";
import Loading from "../../components/loading/LoadingCompo.jsx"
import axios from "axios";
import {
    Button,
    Modal,
    message
} from "antd";
import {
    PlusOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import CustomerPOTable from "./customerPOTable.jsx"; // your existing table
import CustomerPOModal from "../../components/modals/customerPO/CustomerPoModal.jsx";
import CustomerPOSearch from "./customerPOSearch.jsx";
import toast from "react-hot-toast";



export default function CustomerPOPage() {
    const [customerPOs, setCustomerPOs] = useState([]);
    const [filteredPOs, setFilteredPOs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [poNumber, setPoNumber] = useState("");
    const [searchText, setSearchText] = useState("");
    const [editingPO, setEditingPO] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCustomerPOs();
        fetchCustomers();
    }, []);

    const fetchCustomerPOs = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get("/customer-pos");
            setCustomerPOs(data);
            
            setFilteredPOs(data);
        } catch {
            message.error("Failed to load customer POs");
        }
        setLoading(false);
    };

    const fetchCustomers = async () => {
        try {
            const { data } = await axios.get("/customers");
            console.log(data);

            setCustomers(data || []);

        } catch {
            message.error("Failed to load customers");
        }
    };

    const handleSearch = () => {
        let filtered = [...customerPOs];

        if (selectedCustomer) {
            filtered = filtered.filter(po => po.customer?._id === selectedCustomer);
        }

        if (selectedDate) {
            const selected = dayjs(selectedDate).format("YYYY-MM-DD");
            filtered = filtered.filter(po => dayjs(po.date).format("YYYY-MM-DD") === selected);
        }

        if (poNumber) {
            filtered = filtered.filter(po =>
                po.poNumber?.toLowerCase().includes(poNumber.toLowerCase())
            );
        }

        if (searchText) {
            filtered = filtered.filter(po =>
                po.customer?.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredPOs(filtered);
    };

    const handleDelete = async (id) => {


        try {
            await axios.delete(`/customer-pos/${id}`);
            toast.success("Customer PO deleted");
            fetchCustomerPOs();
        } catch {
            message.error("Failed to delete PO");
        }

    };

    return (


        <div className="bg-white p-6 rounded-lg shadow">
        {/* <pre>{JSON.stringify(customerPOs,null,4)}</pre> */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-teal-800">Manage Customer PO</h2>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-4">

                <CustomerPOSearch
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    poNumber={poNumber}
                    setPoNumber={setPoNumber}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    handleSearch={handleSearch}
                />
                <button
                    onClick={() => setOpenModal(true)}
                    className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-[0_4px_14px_rgba(118,75,162,0.4)] bg-[linear-gradient(135deg,_#667eea,_#764ba2)]"
                >
                    <PlusOutlined className="transform transition-transform duration-500 group-hover:rotate-180" />
                    Add CPO
                </button>
            </div>

            <h2 className="text-xl font-bold text-teal-800 mb-5"> Customer PO List</h2>

            {/* Table with pagination + actions */}
            {
                loading ? <Loading /> :
                    <>
                        <CustomerPOTable
                            data={filteredPOs}
                            onEdit={(po) => {
                                setEditingPO(po);
                                setOpenModal(true);
                            }}
                            onDelete={handleDelete}
                        />
                    </>
            }

            {/* Modal for create/edit */}
            {openModal && (
                <CustomerPOModal
                    po={editingPO}
                    customerPOs= {customerPOs}
                    onClose={() => {
                        setOpenModal(false);
                        setEditingPO(null);
                    }}
                    onSave={() => {
                        fetchCustomerPOs();
                        setOpenModal(false);
                    }}
                />
            )}
        </div>
    );
}
