import { ContactsFilled, HomeFilled, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setAuth({ user: null, token: "" }); // clear context
    localStorage.removeItem("auth");    // clear storage
    toast.success("Logged out successfully");
    navigate("/login");                 // redirect
  };
  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 shadow-md border-b border-blue-700 text-white">
      {/* Logo and Title */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <HomeFilled className="text-white text-xl" />
        <span className="">Order Management</span>
      </div>

      {/* Search + User Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* User Info */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:shadow-md transition duration-200">
          <span className="text-gray-800 font-medium">{auth?.user?.username ? `${auth.user.username}` : "user"}</span>
          <ContactsFilled style={{ color: '#2563eb' }} />
        </div>
        {auth?.token ?
          <LogoutOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleLogout} /> : ""
        }

      </div>
    </header>
  );
}

