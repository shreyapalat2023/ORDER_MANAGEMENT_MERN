import { PlusOutlined } from "@ant-design/icons";

const ManageItems = ({
    suppliers,
    setSearch,
    setEditingItem,
    selectedSupplier,
    setSelectedSupplier,
    setOpenModal,
    search,
    setSelectedItemName,
}) => {
    return (
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            {/* Left Section: Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.5a7.5 7.5 0 010 9.15z"
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search items"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 border border-blue-300 rounded-md text-sm w-[160px]"
                    />
                </div>

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

                {/* Reset Button */}
                <button
                    onClick={() => {
                        setSearch("");
                        setSelectedSupplier("");
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
