import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    // fallback if user directly accesses this page
    toast.error("Email not found. Please go back.");
    navigate("/forgot-password");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/verify-otp", { email, otp });
      toast.success("OTP verified!");
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await axios.post("/resend-otp", { email });
      toast.success(data?.message || "OTP resent");
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Verify OTP</h2>

        <input
          type="text"
          maxLength={6}
          pattern="\d{6}"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Verify
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Didn't receive code?{" "}
          <span
            onClick={handleResend}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Resend OTP
          </span>
        </p>
      </form>
    </div>
  );
}
