import toast from "react-hot-toast";
import { useAuth } from "../../context/auth.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";


export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    //context
    const [auth, setAuth] = useAuth();

    //navigate
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/register", {
                username,
                email,
                password,
            });

            console.log(data);

            if (data?.error) {
                toast.error(data.error);
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth({ ...auth, token: data.token, user: data.user });
                toast.success("Registration successful!");
                navigate("/login");
            }
        } catch (error) {
            console.error("❌ Registration error:", error.response || error.message);
            toast.error("Registration Failed. Try Again");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Welcome to Order Management System</h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="relative">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <span className="absolute left-3 top-8 text-gray-500">
                            <UserOutlined />
                        </span>
                        <input
                            id="username"
                            name="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-10 py-2  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                        />
                    </div>
                    {/* Email */}
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <span className="absolute left-3 top-8 text-gray-500">
                            <MailOutlined />
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-10 py-2  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>

                        {/* Left Lock Icon */}
                        <span className="absolute left-3 top-8 text-gray-500">
                            <LockOutlined />
                        </span>

                        {/* Password Input */}
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-10 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                        />

                        {/* Right Eye Toggle */}
                        <span
                            className="absolute right-3 top-8 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Already Registered?
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded relative overflow-hidden group transition-all duration-500 cursor-pointer"
                    >
                        <span
                            className="inline-block transform transition-transform duration-500 group-hover:translate-x-1"
                        >
                            Register
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
