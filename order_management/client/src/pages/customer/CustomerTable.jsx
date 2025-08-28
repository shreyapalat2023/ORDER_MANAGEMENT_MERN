import { Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import usePagination from "../../customhooks/usePagination.js";
import Pagination from "../../components/pagination/Pagination.jsx";

const CustomerTable = ({
    customers = [],
    onEditCustomer,
    onDeleteCustomer,
    onSort,
    sortField,
    sortOrder,
}) => {

    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(customers, 4);

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
            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
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
                        {paginatedData.length > 0 ? (
                            paginatedData.map((customer, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-all duration-200">
                                    <td className="px-6 py-4">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.email}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.address}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${customer.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-5 items-center">
                                        <Tooltip title="Edit">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 transform transition duration-200 hover:scale-125 hover:shadow-sm cursor-pointer"
                                                onClick={() => onEditCustomer(customer)}
                                            >
                                                <EditOutlined style={{ fontSize: "20px" }} />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <Popconfirm
                                                title="Are you sure you want to delete this customer?"
                                                onConfirm={() => onDeleteCustomer(customer._id)}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-6 text-center text-gray-400 italic">
                                    No customers found.
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

export default CustomerTable;
