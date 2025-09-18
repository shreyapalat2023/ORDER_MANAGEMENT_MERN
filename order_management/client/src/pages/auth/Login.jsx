import toast, { Toaster } from "react-hot-toast";
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    LockOutlined,
} from "@ant-design/icons";

import { Spin } from "antd";


import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";


export default function Login() {

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    //hooks
    const [email, setEmail] = useState("palatshreya@gmail.com");
    const [password, setPassword] = useState("shrgar@89");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    //error
    const [passwordError, setPasswordError] = useState("");

    //saving user login response in context
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const { data } = await axios.post("/login", { email, password })

            if (data?.error) {
                toast.error(data.error)
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth({ ...auth, token: data.token, user: data.user });
                toast.success("Login successful");
                navigate("/admin/main/dashboard");
            }

            //remember email
            if (remember) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail")
            }

            console.log(email, password);


        } catch (err) {
            console.log(err);
            toast.error("Login failed. Try Again");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                {loading && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50">
                        <Spin size="large" />
                    </div>
                )}
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Welcome to Order Management System</h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* email */}

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
                            className="mt-1 block w-full px-10 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                        />
                    </div>

                    {/* password */}
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
                    {/* Remember me */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                className="rounded cursor-pointer"
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        {/* forgot password  */}
                        <div>

                            <button
                                type="button"
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        {/* new user */}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => navigate("/register")}
                        >
                            New User?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded relative overflow-hidden group transition-all duration-500 cursor-pointer"
                    >
                        <span
                            className="inline-block transform transition-transform duration-500 group-hover:translate-x-1"
                        >
                            Login
                        </span>
                    </button>

                </form>
            </div>
        </div>
    );
}
