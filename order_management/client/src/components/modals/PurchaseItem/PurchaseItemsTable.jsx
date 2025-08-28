import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import usePagination from "../../../customhooks/usePagination";
import Pagination from "../../pagination/Pagination.jsx";

export default function PurchaseItemsTable({ items = [], onEditItem, onDeleteItem }) {
    console.log("items", items);

    // calculate total purchase price
    const totalPurchasePrice = items.reduce(
        (sum, item) => sum + (item.purchasePrice || 0),
        0
    );

    // pagination hook
    const {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
    } = usePagination(items, 1);

    return (
        <>
            <div className="mt-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                    Purchase Items Details:
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr className="text-left text-gray-700">
                                <th className="px-4 py-2 border">Item</th>
                                <th className="px-4 py-2 border">Qty</th>
                                <th className="px-4 py-2 border">Unit Cost</th>
                                <th className="px-4 py-2 border">Purchase Price</th>
                                <th className="px-4 py-2 border">Invoice No</th>
                                <th className="px-4 py-2 border">Invoice Date</th>
                                <th className="px-4 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={item._id || `${currentPage}-${index}`}
                                        className="hover:bg-gray-50"
                                    >
                                        {/* Item name (support populated object or fallback) */}
                                        <td className="px-4 py-2 border">
                                            {item.item?.name || item.itemName || "N/A"}
                                        </td>

                                        <td className="px-4 py-2 border">{item.qty}</td>
                                        <td className="px-4 py-2 border">{item.unitCost}</td>

                                        <td className="px-4 py-2 border">
                                            {item.purchasePrice?.toFixed(2)}
                                        </td>

                                        <td className="px-4 py-2 border">{item.invoiceNo}</td>

                                        {/* Format invoice date */}
                                        <td className="px-4 py-2 border">
                                            {item.invoiceDate
                                                ? new Date(item.invoiceDate)
                                                    .toISOString()
                                                    .slice(0, 10)
                                                : ""}
                                        </td>

                                        <td className="px-4 py-2 border text-center">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={() => onEditItem(item)}
                                            >
                                                <EditOutlined />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => onDeleteItem(item)}
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No purchase items added.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total Purchase Price */}
                <div className="mt-2 font-semibold text-gray-800">
                    Total Purchase Price:{" "}
                    <span className="text-green-600">
                        ₹{totalPurchasePrice.toFixed(2)}
                    </span>
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
    );
}
