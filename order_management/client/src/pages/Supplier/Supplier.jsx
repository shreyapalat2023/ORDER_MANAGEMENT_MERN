import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import SupplierModal from "../../components/modals/SupplierModal.jsx";
import SearchSupplier from "./SearchSupplier.jsx"
import SupplierTable from "./SupplierTable.jsx";
import Loading from "../../components/loading/LoadingCompo.jsx"

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // edit
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/suppliers/${id}`);
      toast.success("Supplier deleted");
      fetchSuppliers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setOpenModal(true);
  };



  const filtered = suppliers
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
        <h1 className="text-2xl font-bold text-teal-800">Manage Suppliers</h1>
      </div>
      <div className="flex justify-between items-center mb-6">

        <SearchSupplier search={search} setSearch={setSearch} />
        <button
          onClick={() => {
            setEditingSupplier(null);
            setOpenModal(true);
          }}
          className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
          }}
        >
          <PlusOutlined className="transform transition-transform duration-500 group-hover:rotate-180 text-sm" />
          Add Supplier
        </button>

      </div>

      <h1 className="text-2xl font-bold text-teal-800 mb-5">Supplier List</h1>

      {loading ? (
        <Loading />
      ) : (
        <>
          <SupplierTable
            filtered={filtered}
            handleEdit={handleEdit}
            handleDeleteCustomer={handleDelete}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        </>
      )}

      {openModal && (
        <SupplierModal
          onClose={() => {
            setOpenModal(false);
            setEditingSupplier(null);
          }}
          onSupplierSaved={fetchSuppliers}
          supplierToEdit={editingSupplier}
        />
      )}
    </div>
  );
}
