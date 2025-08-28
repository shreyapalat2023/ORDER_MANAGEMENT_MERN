import { UserOutlined, HomeFilled, PoweroffOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

export default function Header() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 shadow-md text-white bg-gradient-to-r from-indigo-500 to-purple-600"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-3 text-xl font-semibold tracking-wide">
        <HomeFilled className="text-white text-2xl" />
        <span>Order Management</span>
      </div>

      {/* Right: User and Logout */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 bg-white text-gray-800 px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transition duration-200">
          <span className="text-sm font-medium capitalize">
            {auth?.user?.username || "User"}
          </span>
          <UserOutlined className="text-blue-600" />
        </div>

        {/* Logout Icon */}
        {auth?.token && (
          <Tooltip title="logout">
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10 transition duration-200 cursor-pointer"
            >
              <PoweroffOutlined className="text-white text-lg" />
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
