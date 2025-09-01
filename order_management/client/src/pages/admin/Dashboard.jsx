import { useEffect, useState } from "react";
import {
  DatePicker,
  Select,
  Button,
  Table,
  ConfigProvider,
  Card,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Dashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cpos, setCpos] = useState([]);
  const [pos, setPos] = useState([]);

  const [customer, setCustomer] = useState(null);
  const [cpo, setCpo] = useState(null);
  const [po, setPo] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const [customerPoDetails, setCustomerPoDetails] = useState([]);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);
  const [remainingPurchaseOrder, setRemainingPurchaseOrder] = useState([]);
  const [cpoAmount, setCpoAmount] = useState(0);
  const [itemCost, setItemCost] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  // ✅ Fetch all purchase orders once
  useEffect(() => {
    axios
      .get("/purchase-orders")
      .then((res) => {
        const orders = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setPurchaseOrders(orders);

        // Extract unique customers
        const seen = new Set();
        const uniqueCustomers = [];
        orders.forEach((po) => {
          if (po.customer && !seen.has(po.customer._id)) {
            seen.add(po.customer._id);
            uniqueCustomers.push(po.customer);
          }
        });
        setCustomers(uniqueCustomers);
      })
      .catch((err) =>
        console.error("Error fetching purchase orders:", err)
      );
  }, []);

  // ✅ When customer changes → filter CPOs + POs
  useEffect(() => {
    if (customer) {
      const filteredOrders = purchaseOrders.filter(
        (po) => po.customer?._id === customer
      );

      // Unique CPOs
      const seenCpos = new Set();
      const relatedCpos = [];
      filteredOrders.forEach((po) => {
        if (po.customerPO && !seenCpos.has(po.customerPO._id)) {
          seenCpos.add(po.customerPO._id);
          relatedCpos.push(po.customerPO);
        }
      });
      setCpos(relatedCpos);

      // POs belonging to this customer
      setPos(filteredOrders);

      // reset selections
      setCpo(null);
      setPo(null);
    } else {
      setCpos([]);
      setPos([]);
      setCpo(null);
      setPo(null);
    }
  }, [customer, purchaseOrders]);

  // ✅ Handle Search
  const handleSearch = () => {
    axios
      .post("/dashboard/profitloss", {
        customer,
        cpo,
        po,
        fromDate: dateRange
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : null,
        toDate: dateRange
          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
          : null,
      })
      .then((res) => {
        const data = res.data;
        setCustomerPoDetails(data.customerPoDetails || []);
        setPurchaseOrderDetails(data.purchaseOrderDetails || []);
        setRemainingPurchaseOrder(data.remainingPurchaseOrder || []);
        setCpoAmount(data.cpoAmount || 0);
        setItemCost(data.itemCost || 0);
        setProfitLoss(data.profitLoss || 0);
      })
      .catch((err) =>
        console.error("Error fetching profit/loss:", err)
      );
  };

  // ✅ Table Columns
  const customerPoColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Price", dataIndex: "price", key: "price" },
  ];

  const purchaseOrderColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Purchase Price", dataIndex: "purchasePrice", key: "purchasePrice" },
  ];

  const remainingPoColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Price", dataIndex: "price", key: "price" },
  ];

  // ✅ Selected objects for display
  const selectedCustomer = customers.find((c) => c._id === customer);
  const selectedCpo = cpos.find((cp) => cp._id === cpo);
  const selectedPo = pos.find((p) => p._id === po);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#eaf2ff",
            headerColor: "#1e3a8a",
            borderColor: "#f0f0f0",
            rowHoverBg: "#f5f7ff",
            borderRadius: 12,
            fontSize: 14,
          },
        },
      }}
    >
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-teal-800 mb-6">
            Dashboard - Profit & Loss
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              placeholder="Customer"
              value={customer}
              onChange={setCustomer}
              className="w-40"
              allowClear
            >
              {customers.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <RangePicker
              className="w-64"
              value={dateRange}
              onChange={setDateRange}
              format="DD-MM-YYYY"
              allowClear
            />

            <Select
              placeholder="Customer PO"
              value={cpo}
              onChange={setCpo}
              className="w-40"
              allowClear
              disabled={!customer}
            >
              {cpos.map((cp) => (
                <Option key={cp._id} value={cp._id}>
                  {cp.poNumber}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Purchase Order"
              value={po}
              onChange={setPo}
              className="w-40"
              allowClear
              disabled={!customer}
            >
              {pos.map((p) => (
                <Option key={p._id} value={p._id}>
                  {p.poNumber}
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              Search
            </Button>
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              title={`Customer PO Detail - ${selectedCpo?.poNumber || ""}`}
              className="shadow-sm rounded-lg"
            >
              <Table
                dataSource={customerPoDetails}
                columns={customerPoColumns}
                pagination={false}
                rowKey={(record, i) => i}
                size="small"
              />
              <p className="mt-3 text-gray-700">
                <span className="font-medium">Order Amount:</span> ₹{cpoAmount}
              </p>
            </Card>

            <Card
              title={`Purchase Order - ${selectedPo?.poNumber || ""}`}
              className="shadow-sm rounded-lg"
            >
              <Table
                dataSource={purchaseOrderDetails}
                columns={purchaseOrderColumns}
                pagination={false}
                rowKey={(record, i) => i}
                size="small"
              />
              <p className="mt-3 text-gray-700">
                <span className="font-medium">Item Cost:</span> ₹{itemCost}
              </p>
            </Card>

            <Card
              title={`Remaining Purchase Order - ${selectedPo?.poNumber || ""}`}
              className="shadow-sm rounded-lg"
            >
              <Table
                dataSource={remainingPurchaseOrder}
                columns={remainingPoColumns}
                pagination={false}
                rowKey={(record, i) => i}
                size="small"
              />
            </Card>
          </div>

          {/* Profit / Loss */}
          <div
            className={`text-center mt-6 font-bold text-lg ${
              profitLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {profitLoss >= 0
              ? `Profit: ₹${profitLoss}`
              : `Loss: ₹${Math.abs(profitLoss)}`}
          </div>

          {selectedCustomer && (
            <div className="text-center mt-2 text-gray-600">
              Customer: {selectedCustomer.name}
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
