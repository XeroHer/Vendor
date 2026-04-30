import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔥 PASSWORD STRENGTH LOGIC
  const getStrength = (pwd: string) => {
    let score = 0;

    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) return setError("Invalid reset link");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    if (strength.label === "Weak")
      return setError("Please choose a stronger password");

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage("Password updated successfully");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Create a strong password to secure your account
        </p>

        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full border rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* 🔥 STRENGTH BAR */}
            {password && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Strength:{" "}
                  <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full border rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>

          {/* RULE HINT */}
          <p className="text-xs text-gray-400">
            Use 8+ characters, uppercase, numbers & symbols for strong security.
          </p>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}