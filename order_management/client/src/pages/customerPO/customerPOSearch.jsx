import { SearchOutlined } from "@ant-design/icons";
import { Input, DatePicker, Space, Select, Button } from "antd";

const CustomerPOSearch = ({
    customers = [],
    selectedCustomer,
    setSelectedCustomer,
    selectedDate,
    setSelectedDate,
    poNumber,
    setPoNumber,
    searchText,
    setSearchText,
    handleSearch
}
) => {
    const { Option } = Select;
    return (
        <Space wrap>
            <Select
                allowClear
                style={{ width: 200 }}
                placeholder="Select Customer"
                value={selectedCustomer}
                onChange={setSelectedCustomer}
            >
                {customers.map((c) => (
                    <Option key={c._id} value={c._id}>
                        {c.name}
                    </Option>
                ))}
            </Select>

            <DatePicker
                placeholder="Order Date"
                value={selectedDate}
                onChange={setSelectedDate}
                format="DD-MM-YYYY"
            />

            <Input
                placeholder="Customer PO..."
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
            />

            <Input
                placeholder="Search by Customer Name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <Button
                onClick={handleSearch}
                icon={<SearchOutlined className="text-white" />}
                className="text-white px-4 py-2 rounded-md shadow transition duration-200 cursor-pointer border-none"
                style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white", // ensure inline override
                }}
            >
                Search
            </Button>

        </Space>
    );
};

export default CustomerPOSearch;
