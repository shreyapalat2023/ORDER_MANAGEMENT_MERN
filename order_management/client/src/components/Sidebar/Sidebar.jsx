import { NavLink } from "react-router-dom";
import {
  DashboardFilled,
  UsergroupAddOutlined,
  ShopFilled,
  AppstoreFilled,
  FileTextFilled,
  ShoppingFilled,
} from "@ant-design/icons";


const menuItems = [
  { name: "Dashboard", path: "/admin/main/dashboard", icon: <DashboardFilled /> },
  { name: "Customers", path: "/admin/main/customers", icon: <UsergroupAddOutlined /> }, // closest filled style
  { name: "Suppliers", path: "/admin/main/suppliers", icon: <ShopFilled /> },
  { name: "Item Master", path:"/admin/main/item-master", icon: <AppstoreFilled /> },
  { name: "Customer PO", path: "/admin/main/customer-po", icon: <FileTextFilled /> },
  { name: "Purchase Order", path: "/admin/main/purchase-order", icon: <ShoppingFilled /> },
];


export default function Sidebar() {
  return (
    <aside
      className="h-screen w-64 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl flex flex-col"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div className="px-6 py-5 border-b border-white/20">
        <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
        <p className="text-sm text-white/70 mt-1">Order Management</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-300
               ${isActive
                ? "bg-white text-gray-800 shadow-md"
                : "hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
