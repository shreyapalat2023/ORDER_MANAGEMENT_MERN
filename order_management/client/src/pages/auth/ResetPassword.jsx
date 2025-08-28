// pages/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/reset-password", {
                email, newPassword,
            });

            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success("Password reset successfully");
                navigate("/login");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Reset Password</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
                            placeholder="At least 6 characters"
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
                            Reset Password
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
