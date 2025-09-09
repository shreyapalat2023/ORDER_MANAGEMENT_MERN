import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import usePagination from "../../customhooks/usePagination.js";
import Pagination from "../../components/pagination/Pagination.jsx";

import { Tooltip, Popconfirm } from "antd";
const SupplierTable = (
    { filtered,
        handleEdit,
        handleDelete,
        onSort,
        sortField,
        sortOrder, }
) => {
    //pagination
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(filtered, 4);

    console.log(paginatedData);


    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
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
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800 bg-white">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            {renderHeader("Name", "name")}
                            {renderHeader("Email", "email")}
                            {renderHeader("Phone", "phone")}
                            {renderHeader("Area", "address")}
                            {renderHeader("Status", "status")}
                            <th className="px-6 py-3 text-left whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length ? (
                            paginatedData.map((s, i) => (
                                <tr key={i} className="hover:bg-blue-50 transition-all duration-200">
                                    <td className="px-6 py-4">{s.name}</td>
                                    <td className="px-6 py-4">{s.email}</td>
                                    <td className="px-6 py-4">{s.phone}</td>
                                    <td className="px-6 py-4">{s.address}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${s.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {s.status}
                                        </span>
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
                                                title="Are you sure you want to delete this?"
                                                onConfirm={() => handleDelete(s._id)}
                                                okText="Yes"
                                                cancelText="No"
                                                okButtonProps={{ className: "bg-red-600 hover:bg-red-700 text-white" }}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No suppliers found.
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
    )
}

export default SupplierTable