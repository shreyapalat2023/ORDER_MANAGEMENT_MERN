import { DatePicker, Select } from "antd";
const { Option } = Select;
export default function PurchaseSearch({ purchaseList, customers, setCustomer, customer, po, setPo, date, setDate }) {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                <Select
                    placeholder="Select PO number"
                    value={po}
                    onChange={setPo}
                    className="w-full md:w-48"
                    allowClear
                >
                    {purchaseList.map((p) => (
                        <Option key={p._id} value={p.poNumber}>
                            {p.poNumber}
                        </Option>
                    ))}
                </Select>

                <DatePicker
                    placeholder="Order Date"
                    className="w-full md:w-48"
                    value={date}
                    onChange={setDate}
                    format="DD-MM-YYYY"
                    allowClear
                />

                <Select
                    placeholder="Select Customer"
                    value={customer}
                    onChange={setCustomer}
                    className="w-full md:w-48"
                    allowClear
                >
                    {customers
                        .filter((c) => c.customer) // ✅ only include those with populated customer
                        .map((c) => (
                            <Option key={c.customer._id} value={c.customer._id}>
                                {c.customer.name}
                            </Option>
                        ))}
                </Select>
            </div>
        </>
    )
}