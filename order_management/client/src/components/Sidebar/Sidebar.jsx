// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  DashboardFilled,
  UsergroupAddOutlined,
  ShopFilled,
  AppstoreFilled,
  FileTextFilled,
  ShoppingFilled,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const menuItems = [
  { name: "Dashboard", path: "/admin/main/dashboard", icon: <DashboardFilled /> },
  { name: "Customers", path: "/admin/main/customers", icon: <UsergroupAddOutlined /> },
  { name: "Suppliers", path: "/admin/main/suppliers", icon: <ShopFilled /> },
  { name: "Item Master", path: "/admin/main/item-master", icon: <AppstoreFilled /> },
  { name: "Customer PO", path: "/admin/main/customer-po", icon: <FileTextFilled /> },
  { name: "Purchase Order", path: "/admin/main/purchase-order", icon: <ShoppingFilled /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar automatically on route change (so nav clicks close mobile drawer)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebarBase =
    "fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl flex flex-col z-50 transform transition-transform duration-300";
  // include both classes so Tailwind sees them in production builds
  const sidebarState = isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0";

  return (
    <div className="flex">
      {/* Mobile top bar (visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-3 flex items-center justify-between z-40 shadow-md">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button aria-label="Open menu" onClick={() => setIsOpen(true)}>
          <MenuOutlined className="text-2xl cursor-pointer" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${sidebarBase} ${sidebarState}`}
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        aria-hidden={!isOpen && "true"}
      >
        {/* Mobile close */}
        <div className="md:hidden flex justify-end p-4">
          <button aria-label="Close menu" onClick={() => setIsOpen(false)}>
            <CloseOutlined className="text-2xl text-white" />
          </button>
        </div>

        {/* Header (desktop) */}
        <div className="hidden md:block px-6 py-5 border-b border-white/20">
          <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
          <p className="text-sm text-white/70 mt-1">Order Management</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-300
                 ${isActive ? "bg-white text-gray-800 shadow-md" : "hover:bg-white/10 hover:text-white"}`
              }
              onClick={() => setIsOpen(false)} // close on mobile when a link is clicked
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
