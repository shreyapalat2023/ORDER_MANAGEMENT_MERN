import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";


export default function Login() {
    //hooks
    const [email, setEmail] = useState("palatshreya@gmail.com");
    const [password, setPassword] = useState("shrgar@89");
    const [remember, setRemember] = useState(false);

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
        e.preventDefault();
        try {
            const { data } = await axios.post("/login", { email, password })

            if (data?.error) {
                toast.error(data.error)
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth({ ...auth, token: data.token, user: data.user });
                toast.success("Login successful");
                navigate("/dashboard/admin");
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
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Welcome to Order Management System</h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* email */}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    {/* password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                className="rounded"
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        <div>

                            <button
                                type="button"
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot Password?
                            </button>
                        </div>

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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
