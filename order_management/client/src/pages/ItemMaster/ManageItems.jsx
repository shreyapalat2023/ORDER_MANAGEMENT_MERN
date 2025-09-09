import { PlusOutlined } from "@ant-design/icons";

const ManageItems = ({
    suppliers,
    setSearch,
    setEditingItem,
    selectedSupplier,
    setSelectedSupplier,
    setOpenModal,
    setSelectedItemName,
    items,
    selectedItemId,
    setSelectedItemId
}) => {
    return (
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            {/* Left Section: Filters */}
            <div className="flex items-center gap-2 flex-wrap">    

                {/* Supplier Dropdown */}
                <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300 w-[140px]"
                >
                    <option value="">All Suppliers</option>
                    {suppliers
                        .filter((s) => s.status?.toLowerCase() === "active")
                        .map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                </select>

                {/* Items Dropdown */}
                <select
                    value={selectedItemId}
                    onChange={(e) => {
                        selectedItemId(e.target.value);
                        setSelectedItemId(
                            e.target.value
                                ? items.find((i) => i._id === e.target.value)?.name || ""
                                : ""
                        );
                    }}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-violet-300 w-[140px]"
                >
                    <option value="">All Items</option>
                    {items
                        .filter((i) => i.status?.toLowerCase() === "active")
                        .map((i) => (
                            <option key={i._id} value={i._id}>
                                {i.name}
                            </option>
                        ))}
                </select>

                {/* Reset Button */}
                <button
                    onClick={() => {
                        setSearch("");
                        setSelectedSupplier("");
                        setSelectedItemId("");
                        setSelectedItemName("");
                    }}
                    className="px-3 py-1.5 text-sm text-white rounded transition duration-200 ease-in-out transform hover:scale-105 shadow-md cursor-pointer"
                    style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                    }}
                >
                    Reset
                </button>

            </div>

            {/* Right Section: Add Button */}
            <button
                onClick={() => {
                    setEditingItem(null);
                    setOpenModal(true);
                }}
                className="group text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    boxShadow: "0 4px 14px rgba(118, 75, 162, 0.4)",
                }}
            >
                <PlusOutlined className="transition-transform duration-300 group-hover:rotate-180 text-sm" />
                Add Item
            </button>

        </div>
    );
};

export default ManageItems;
