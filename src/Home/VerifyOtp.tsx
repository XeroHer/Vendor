import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return <p className="text-center mt-10">No email found. Please signup again.</p>;
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("✅ Email verified successfully!");

      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // backend should support resend logic
      });

      const data = await res.json();

      alert(data.message || "OTP resent");
    } catch (err: any) {
      alert("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit OTP sent to <br />
          <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="text-sm text-blue-600 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;