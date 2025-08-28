import Pagination from "../../components/pagination/Pagination.jsx"
import usePagination from "../../customhooks/usePagination.js"
import { Tooltip, Popconfirm } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    DatabaseOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";

const ItemTable = ({
    items = [],
    onEditItem,
    onDeleteItem,
    onSort,
    setSelectedItem,
    sortField,
    sortOrder,
    setIsStockModalOpen,
    setIsDetailModalOpen
}) => {
    //pagination
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(items, 4);
    //sort
    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    };


    const handleStockUpdate = (item) => {
        setSelectedItem(item);
        setIsStockModalOpen(true);
    };

    const renderHeader = (label, field) => (
        <th
            className="px-6 py-3 text-left whitespace-nowrap cursor-pointer select-none"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                {label} {getSortIcon(field)}
            </div>
        </th>
    );

    return (
        <>

            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800 bg-white">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            {renderHeader("Item Name", "name")}
                            {renderHeader("Supplier", "supplier")}
                            {renderHeader("Category", "category")}
                            {renderHeader("Brand", "brand")}
                            {renderHeader("Stock", "stock")}
                            {renderHeader("Unit", "unit")}
                            {renderHeader("Status", "status")}
                            <th className="px-6 py-3 text-left whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length > 0 ? (
                            paginatedData
                                .filter(item => item.supplier?.status?.toLowerCase() === "active")
                                .map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition-all duration-200">
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.supplier?.name || "Unknown"}</td>
                                        <td className="px-6 py-4">{item.category}</td>
                                        <td className="px-6 py-4">{item.brand}</td>
                                        <td className="px-6 py-4">{item?.totalStock}</td>
                                        <td className="px-6 py-4">{item?.unit}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        {/* Action */}
                                        <td className="px-6 py-4 flex gap-4 items-center flex-wrap">
                                            <Tooltip title="Edit">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                                    onClick={() => onEditItem(item)}
                                                >
                                                    <EditOutlined style={{ fontSize: "18px" }} />
                                                </button>
                                            </Tooltip>



                                            <Tooltip title="Stock">
                                                <button
                                                    className="text-purple-600 hover:text-purple-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                                    onClick={() => handleStockUpdate(item)}
                                                >
                                                    <DatabaseOutlined style={{ fontSize: "18px" }} />
                                                </button>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <Popconfirm
                                                    title="Are you sure you want to delete this item?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={() => onDeleteItem(item._id)}
                                                >
                                                    <button
                                                        className="text-red-600 hover:text-red-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                                    >
                                                        <DeleteOutlined style={{ fontSize: "18px" }} />
                                                    </button>
                                                </Popconfirm>
                                            </Tooltip>

                                            <Tooltip title="Detail">
                                                <button
                                                    className="text-gray-600 hover:text-gray-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                >
                                                    <InfoCircleOutlined style={{ fontSize: "18px" }} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-6 text-center text-gray-400 italic">
                                    No items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                nextPage={nextPage}
                prevPage={prevPage}
            />
        </>

    );
};

export default ItemTable;
