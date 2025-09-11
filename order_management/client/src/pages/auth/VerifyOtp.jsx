import { useState ,useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [timer, setTimer] = useState(60);
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
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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
      setTimer(60);
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
          className="mt-1 block w-full px-4 py-2  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-violet-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 mt-4 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded relative overflow-hidden group transition-all duration-500 cursor-pointer"
        >
          <span
            className="inline-block transform transition-transform duration-500 group-hover:translate-x-1"
          >
            Verify Otp
          </span>
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          OTP will expire in{" "}
          <span className="font-semibold text-red-600">{timer}s</span>
        </p>

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
