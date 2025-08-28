import usePagination from "../../../customhooks/usePagination.js"
import Pagination from "../../pagination/Pagination.jsx"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Tooltip, Popconfirm } from "antd";
export default function SalesItemTable({ salesItems, handleEditItem, handleDeleteItem }) {
    // pagination hook
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(salesItems, 1);
    return (
        <>
            <div className="mt-4">
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Sales Item Table</h3>
                <table className="w-full border text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2 border">Item</th>
                            <th className="p-2 border">Qty</th>
                            <th className="p-2 border">Unit Cost</th>
                            <th className="p-2 border">Tax</th>
                            <th className="p-2 border">Sales Price</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2 border">{item.item?.name || "N/A"}</td>
                                <td className="p-2 border">{item.qty}</td>
                                <td className="p-2 border">{item.unitCost}</td>
                                <td className="p-2 border">{item.tax}%</td>
                                <td className="p-2 border">{item.salesPrice}</td>
                                <td className="p-2 border space-x-2">
                                    <Tooltip title="Edit">
                                        <button
                                            type="button"
                                            onClick={() => handleEditItem(idx)}
                                            className="text-blue-600 hover:text-blue-800 transition hover:scale-110 cursor-pointer"
                                        >
                                            <EditOutlined />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <Popconfirm
                                            title="Are you sure you want to delete this item?"
                                            onConfirm={() => handleDeleteItem(idx)}
                                            okText="Yes"
                                            cancelText="No"
                                            placement="topRight"
                                        >
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800 transition hover:scale-110 cursor-pointer"
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-2 font-medium">
                    Total Sales Price: ₹
                    {salesItems.reduce((total, item) => total + (item.salesPrice || 0), 0).toFixed(2)}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
            )}
        </>
    )


}