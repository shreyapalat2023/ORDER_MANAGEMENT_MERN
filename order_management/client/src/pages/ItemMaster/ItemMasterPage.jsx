import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/loading/LoadingCompo.jsx"
import ItemTable from "./ItemTable.jsx";
import ItemModal from "../../components/modals/ItemMaster/ItemModal.jsx"
import ItemStockModal from "../../components/modals/ItemMaster/StockModal.jsx";
import ManageItems from "./ManageItems.jsx"
import ItemUtilizationModal from "../../components/modals/ItemMaster/ItemUtilizationModal.jsx";

export default function ItemMasterPage() {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    //loading
    const [loading, setLoading] = useState(false);
    //search
    const [search, setSearch] = useState("");
    //filter
    const [selectedSupplier, setSelectedSupplier] = useState("");

    //sort
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    //modal
    const [openModal, setOpenModal] = useState(false);

    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    //edit
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        try {
            const { data } = await axios.get("/items");
            setItems(data);


        } catch (err) {
            toast.error("Failed to fetch items");
        }
    };

    // useEffect(() => {
    //     const fetchItemsWithStock = async () => {
    //         try {
    //             const [itemsRes, stockRes] = await Promise.all([
    //                 axios.get("/items"),
    //                 axios.get("/stocks/summary"),
    //             ]);

    //             const stockMap = {};
    //             stockRes.data.forEach(stock => {
    //                 stockMap[stock._id] = stock.totalQty;
    //             });

    //             const itemsWithStock = itemsRes.data.map(item => ({
    //                 ...item,
    //                 stock: stockMap[item._id] || 0,
    //             }));

    //             setItems(itemsWithStock);
    //         } catch (err) {
    //             console.error("Error fetching items or stocks", err);
    //         }
    //     };

    //     fetchItemsWithStock();
    // }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/suppliers");
            setSuppliers(data);
        } catch (err) {
            toast.error("Failed to fetch suppliers");
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchItems();
        fetchSuppliers();

    }, []);

    const handleEdit = (item) => {
        setEditingItem(item);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/items/${id}`);
            toast.success("Item deleted");
            fetchItems();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const filtered = items
        .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedSupplier ? item.supplier?._id === selectedSupplier : true)
        )
        .sort((a, b) => {
            const fieldA = a[sortField]?.toLowerCase?.() || "";
            const fieldB = b[sortField]?.toLowerCase?.() || "";
            if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
            if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-800">Manage Items</h1>
            </div>

            {/* Filters */}
            <ManageItems
                suppliers={suppliers}
                selectedSupplier={selectedSupplier}
                setSelectedSupplier={setSelectedSupplier}
                setSearch={setSearch}
                setEditingItem={setEditingItem}
                setOpenModal={setOpenModal}
                search={search}

            />

            {/* Table */}
            <h2 className="text-xl font-bold text-teal-800 mb-4">Item List</h2>

            {loading ? <Loading /> : (
                <>

                    <ItemTable
                        items={filtered}
                        onEditItem={handleEdit}
                        onDeleteItem={handleDelete}
                        onSort={handleSort}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        setSelectedItem={setSelectedItem}
                        setIsStockModalOpen={setIsStockModalOpen}
                        setIsDetailModalOpen= {setIsDetailModalOpen}
                    />
                </>

            )}


            {/* Modal */}
            {openModal && (
                <ItemModal
                    itemToEdit={editingItem}
                    onClose={() => {
                        setOpenModal(false);
                        setEditingItem(null);
                    }}
                    onItemSaved={fetchItems}
                />
            )}
            {isStockModalOpen && selectedItem && (
                <ItemStockModal
                    itemName={selectedItem.name}
                    itemId={selectedItem._id}
                    items={items}
                    onClose={() => {
                        setIsStockModalOpen(false);
                        setSelectedItem(null);
                    }}
                />
            )}

            {isDetailModalOpen && selectedItem && (
                <ItemUtilizationModal
                    itemName={selectedItem.name}
                    itemId={selectedItem._id}
                    items={items}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedItem(null);
                    }}
                />
            )}

        </div>
    );
}
