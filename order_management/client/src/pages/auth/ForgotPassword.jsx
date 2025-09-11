// pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons"

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/forgot-password", { email });
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success("OTP sent to your email");
                navigate("/verify-otp", { state: { email } });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to send OTP. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Forgot Password</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>

                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <span className="absolute top-8  left-3 text-gray-500">
                            <MailOutlined />
                        </span>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-8 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded relative overflow-hidden group transition-all duration-500 cursor-pointer"
                    >
                        <span
                            className="inline-block transform transition-transform duration-500 group-hover:translate-x-1"
                        >
                            Send Otp
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
