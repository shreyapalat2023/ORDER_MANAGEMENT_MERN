import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip,Popconfirm } from "antd";
import Pagination from "../../components/pagination/Pagination.jsx";
import usePagination from "../../customhooks/usePagination.js";

const PurchaseOrderTable = ({ data = [], onEdit, onDelete }) => {
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(data, 4);

    return (
        <>
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 font-bold text-blue-800 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Customer Name</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Purchase Order</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Customer PO</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Total Purchase</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Date</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Status</th>
                            <th className="px-6 py-3 text-left whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length ? (
                            paginatedData.map((po, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4">{po.customer?.name || "N/A"}</td>
                                    <td className="px-6 py-4">{po.poNumber || "N/A"}</td>
                                    <td className="px-6 py-4">{po.customerPO?.poNumber || "N/A"}</td>
                                    <td className="px-6 py-4 font-medium">₹{(po.totalPurchaseAmount || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {po.date ? new Date(po.date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${po.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <Tooltip title="Edit">
                                            <button
                                                onClick={() => onEdit(po)}
                                                className="text-blue-600 hover:text-blue-800 transition hover:scale-110 cursor-pointer"
                                            >
                                                <EditOutlined style={{ fontSize: "18px" }} />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <Popconfirm
                                                title="Are you sure you want to delete this record?"
                                                okText="Yes"
                                                cancelText="No"
                                                onConfirm={() => onDelete(po._id)}
                                            >
                                                <button
                                                    className="text-red-600 hover:text-red-800 transition hover:scale-110 cursor-pointer"
                                                >
                                                    <DeleteOutlined style={{ fontSize: "18px" }} />
                                                </button>
                                            </Popconfirm>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-400 italic">
                                    No purchase orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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

export default PurchaseOrderTable;
