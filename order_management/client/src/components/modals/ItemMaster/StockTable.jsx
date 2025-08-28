import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip, Popconfirm } from "antd";
import Pagination from "../../pagination/Pagination.jsx"
import usePagination from "../../../customhooks/usePagination.js"

const StockTable = ({ stockList, handleDelete, handleEdit }) => {
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(stockList, 1);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full border text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-2">Price</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((s) => (
                            <tr key={s._id} className="border-t">
                                <td className="p-2">{s.price}</td>
                                <td className="p-2">{s.quantity}</td>
                                <td className="p-2">
                                    {s.date || s.Date
                                        ? new Date(s.date || s.Date).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="px-6 py-4 flex gap-5 items-center">
                                    <Tooltip title="Edit">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                            onClick={() => handleEdit(s)}
                                        >
                                            <EditOutlined style={{ fontSize: "20px" }} />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Delete">
                                        <Popconfirm
                                            title="Are you sure you want to delete this supplier?"
                                            onConfirm={() => handleDelete(s._id)}
                                            okText="Yes"
                                            cancelText="No"
                                            placement="topRight"
                                        >
                                            <button
                                                className="text-red-600 hover:text-red-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                            >
                                                <DeleteOutlined style={{ fontSize: "20px" }} />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
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

export default StockTable;
