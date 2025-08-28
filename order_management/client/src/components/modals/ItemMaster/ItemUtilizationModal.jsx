import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../../components/loading/LoadingCompo.jsx"

export default function ItemUtilizationModal({ itemId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [utilizationData, setUtilizationData] = useState(null);

  // Fetch utilization when modal opens
  useEffect(() => {
    const fetchUtilization = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/${itemId}/utilization`);
        setUtilizationData(res.data);
        console.log("Utilization Data:", res.data);

      } catch (err) {
        console.error(err);
        toast.error("Failed to load item utilization");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchUtilization();
  }, [itemId]);

  if (loading) {
   <Loading/>
  }

  if (!utilizationData) return null;

const {
  item = {},
  purchases: stock = [],    // rename purchases → stock
  sales: utilization = [],  // rename sales → utilization
  utilization: {
    totalPurchased: totalStock = 0,
    totalSold: totalUtilization = 0,
    balance: availableStock = 0,
  } = {}
} = utilizationData || {};


  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 w-11/12 max-w-5xl p-6 rounded-xl shadow-xl border border-gray-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
        >
          <CloseOutlined />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800 tracking-wide">
          Item Stock Utilization
        </h2>

        {/* Item Info */}
        <div className="grid grid-cols-3 gap-4 text-sm font-medium mb-6">
          <p>
            Item Name:{" "}
            <span className="font-semibold text-gray-800">{item.name || "-"}</span>
          </p>
          <p>
            Item Category:{" "}
            <span className="font-semibold text-gray-800">
              {item.category || "-"}
            </span>
          </p>
          <p>
            Brand:{" "}
            <span className="font-semibold text-gray-800">{item.brand || "-"}</span>
          </p>
        </div>

        {/* Two Tables */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Item Stock */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-700">Item Stock:</h3>
            <div className="border rounded-md shadow-sm overflow-x-auto bg-white">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border">Date</th>
                    <th className="px-3 py-2 border">Qty</th>
                    <th className="px-3 py-2 border">Unit</th>
                    <th className="px-3 py-2 border">Purchase Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.length > 0 ? (
                    stock.map((s, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">
                          {new Date(s.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 border">{s.quantity}</td>
                        <td className="px-3 py-2 border">{s.unit}</td>
                        <td className="px-3 py-2 border">{s.purchasePrice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-3 text-gray-500">
                        No stock available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Item Utilization */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-700">Item Utilization:</h3>
            <div className="border rounded-md shadow-sm overflow-x-auto bg-white">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border">PO Date</th>
                    <th className="px-3 py-2 border">Qty</th>
                    <th className="px-3 py-2 border">Unit</th>
                    <th className="px-3 py-2 border">Purchase Order</th>
                  </tr>
                </thead>
                <tbody>
                  {utilization.length > 0 ? (
                    utilization.map((u, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">
                          {new Date(u.poDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 border">{u.qty}</td>
                        <td className="px-3 py-2 border">{u.unit}</td>
                        <td className="px-3 py-2 border">{u.poNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-3 text-gray-500">
                        No utilization yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-between text-sm font-medium mt-4 px-2 text-gray-700">
          <p>Total Item Stock: {totalStock}</p>
          <p>Item Utilization: {totalUtilization}</p>
          <p>Available Stock: {availableStock}</p>
        </div>
      </div>
    </div>
  );
}
