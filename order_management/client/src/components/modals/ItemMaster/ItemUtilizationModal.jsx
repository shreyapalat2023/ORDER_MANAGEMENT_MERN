import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../../components/loading/LoadingCompo.jsx";

export default function ItemUtilizationModal({
  itemId,
  onClose,
  itemName,
  itemCategory,
  itemBrand,
}) {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);

  useEffect(() => {
    if (itemId) {
      setLoading(true);
      Promise.all([fetchStock(), fetchPurchaseOrders()]).finally(() =>
        setLoading(false)
      );
    }
  }, [itemId]);

  const fetchStock = async () => {
    try {
      const { data } = await axios.get(`/items/${itemId}/stock`);
      setStockList(Array.isArray(data) ? data : data?.stocks || []);
    } catch (err) {
      console.error("Failed to fetch stock list:", err);
      toast.error("Failed to fetch stock list");
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const { data } = await axios.get(`/purchase-orders/item/${itemId}`);

      const formatted = (data?.data || []).flatMap((po) =>
        (po.items || [])
          .filter((i) => i.item?._id === itemId || i.item === itemId)
          .map((i) => ({
            poDate: po.date,
            qty: i.qty,
            unit: i.unit || "-",
            poNumber: po.poNumber,
          }))
      );

      setPurchaseList(formatted);
    } catch (error) {
      console.error("Failed to fetch purchase orders", error);
      toast.error("Failed to fetch purchase orders");
    }
  };

  const totalQty = stockList.reduce(
    (sum, s) => sum + (s?.quantity ? parseInt(s.quantity) : 0),
    0
  );
  const totalUtilization = purchaseList.reduce(
    (sum, p) => sum + (p?.qty ? parseInt(p.qty) : 0),
    0
  );
  const availableStock = totalQty - totalUtilization;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-11/12 max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-red-500 transition"
        >
          <CloseOutlined className="text-lg" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900 tracking-wide">
          📦 Item Stock Utilization
        </h2>

        {/* Item Info */}
        <div className="grid grid-cols-3 gap-6 text-sm font-medium mb-8 bg-gray-50 p-4 rounded-lg shadow-inner">
          <p>
            Item Name:{" "}
            <span className="font-semibold text-gray-900">{itemName}</span>
          </p>
          <p>
            Item Category:{" "}
            <span className="font-semibold text-gray-900">{itemCategory}</span>
          </p>
          <p>
            Brand:{" "}
            <span className="font-semibold text-gray-900">{itemBrand}</span>
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Two Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Item Stock */}
              <div className="bg-white rounded-xl border shadow hover:shadow-lg transition overflow-hidden">
                <h3 className="font-semibold text-lg px-4 py-3 bg-blue-50 text-blue-900 border-b">
                  Item Stock
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Qty</th>
                        <th className="px-4 py-2 border">Unit</th>
                        <th className="px-4 py-2 border">Purchase Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockList.length > 0 ? (
                        stockList.map((s, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50 transition text-center"
                          >
                            <td className="px-4 py-2 border">
                              {s.date || s.Date
                                ? new Date(
                                    s.date || s.Date
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="px-4 py-2 border">{s.quantity}</td>
                            <td className="px-4 py-2 border">{s.unit}</td>
                            <td className="px-4 py-2 border">{s.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-gray-500"
                          >
                            No stock available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Item Utilization */}
              <div className="bg-white rounded-xl border shadow hover:shadow-lg transition overflow-hidden">
                <h3 className="font-semibold text-lg px-4 py-3 bg-indigo-50 text-indigo-900 border-b">
                  Item Utilization
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 border">PO Date</th>
                        <th className="px-4 py-2 border">Qty</th>
                        <th className="px-4 py-2 border">Unit</th>
                        <th className="px-4 py-2 border">Purchase Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseList.length > 0 ? (
                        purchaseList.map((u, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-indigo-50 transition text-center"
                          >
                            <td className="px-4 py-2 border">
                              {u.poDate
                                ? new Date(u.poDate).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="px-4 py-2 border">{u.qty}</td>
                            <td className="px-4 py-2 border">{u.unit}</td>
                            <td className="px-4 py-2 border">{u.poNumber}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-gray-500"
                          >
                            No utilization yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Totals */}
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm font-medium mt-6 px-2 text-gray-800">
          <p className="bg-green-50 px-4 py-2 rounded-md border border-green-200 shadow-sm">
            ✅ Total Item Stock:{" "}
            <span className="font-bold text-green-700">{totalQty}</span>
          </p>
          <p className="bg-yellow-50 px-4 py-2 rounded-md border border-yellow-200 shadow-sm">
            📊 Item Utilization:{" "}
            <span className="font-bold text-yellow-700">{totalUtilization}</span>
          </p>
          <p className="bg-blue-50 px-4 py-2 rounded-md border border-blue-200 shadow-sm">
            📦 Available Stock:{" "}
            <span className="font-bold text-blue-700">{availableStock}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
