import { useEffect, useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Dashboard() {
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

    // Fetch customers on mount
    useEffect(() => {
        axios
            .get("/customers")
            .then((res) => setCustomers(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch ALL CPOs on mount
    useEffect(() => {
        axios
            .get("/customer-pos")
            .then((res) => setCpos(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch ALL POs on mount
    useEffect(() => {
        axios
            .get("/purchase-orders")
            .then((res) => setPos(res.data.data))
            .catch((err) => console.error(err));
    }, []);

    // Handle Search
    const handleSearch = () => {
        axios
            .get("/dashboard/profitloss", {
                params: {
                    customer,
                    cpo,
                    po,
                    fromDate: dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null,
                    toDate: dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null,
                },
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
            .catch((err) => console.error(err));
    };

    // Table Columns
    const columns = [
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Qty", dataIndex: "qty", key: "qty" },
        { title: "Price", dataIndex: "price", key: "price" },
    ];

    return (
        <>

            {/* <pre>{JSON.stringify(pos, null, 4)}</pre> */}
            <div className="p-1">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-teal-800 mb-6">
                        Dashboard - Profit & Loss
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 flex-wrap mb-6">
                        {/* Customer Dropdown */}
                        <Select
                            placeholder="Select Customer"
                            value={customer}
                            onChange={setCustomer}
                            className="w-full md:w-48"
                            allowClear
                        >
                            {customers.map((c) => (
                                <Option key={c._id} value={c._id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>

                        {/* CPO Dropdown */}
                        <Select
                            placeholder="Select CPO"
                            value={cpo}
                            onChange={setCpo}
                            className="w-full md:w-48"
                            allowClear
                        >
                            {cpos.map((cp) => (
                                <Option key={cp._id} value={cp._id}>
                                    {cp.poNumber} {/* note: your field is "poNumber", not "cpoNumber" */}
                                </Option>
                            ))}
                        </Select>

                        {/* PO Dropdown */}
                        <Select
                            placeholder="Select PO"
                            value={po}
                            onChange={setPo}
                            className="w-full md:w-48"
                            allowClear
                        >
                            {pos.map((p) => (
                                <Option key={p._id} value={p._id}>
                                    {p.poNumber}
                                </Option>
                            ))}
                        </Select>

                        {/* Date Range */}
                        <RangePicker
                            className="w-full md:w-64"
                            value={dateRange}
                            onChange={setDateRange}
                            format="DD-MM-YYYY"
                            allowClear
                        />

                        {/* Search Button */}
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
                        {/* Customer PO Details */}
                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-3">
                                Customer PO Details
                            </h3>
                            <Table
                                dataSource={customerPoDetails}
                                columns={columns}
                                pagination={false}
                                rowKey={(record, i) => i}
                                size="small"
                            />
                            <p className="mt-3 text-gray-700">
                                <span className="font-medium">CPO Order Amount:</span> ₹{cpoAmount}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Profit/Loss:</span> ₹{profitLoss}
                            </p>
                        </div>

                        {/* Purchase Order Details */}
                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-3">
                                Purchase Order Details
                            </h3>
                            <Table
                                dataSource={purchaseOrderDetails}
                                columns={columns}
                                pagination={false}
                                rowKey={(record, i) => i}
                                size="small"
                            />
                            <p className="mt-3 text-gray-700">
                                <span className="font-medium">Item Cost:</span> ₹{itemCost}
                            </p>
                        </div>

                        {/* Remaining Purchase Order */}
                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-3">
                                Remaining Purchase Order
                            </h3>
                            <Table
                                dataSource={remainingPurchaseOrder}
                                columns={columns}
                                pagination={false}
                                rowKey={(record, i) => i}
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
