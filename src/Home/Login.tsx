import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../category/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "customer",
    email: "",
    password: "",
    vendorId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 const { login } = useAuth();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { email, password, role } = formData;

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
  
    // 🔐 SAVE AUTH
   login(data.user, data.token);

   

    // redirect
    navigate(data.user.role === "vendor" ? "/Vendor" : "/");

  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Sign in to your account
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Welcome back! Please enter your credentials.
        </p>

        {/* Social Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            aria-label="Sign in with Facebook"
            className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Facebook
          </button>
          <button
            type="button"
            aria-label="Sign in with Google"
            className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <span className="h-px bg-gray-300 flex-1" />
          <span className="mx-2 text-sm text-gray-400">or</span>
          <span className="h-px bg-gray-300 flex-1" />
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["customer", "vendor"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role }))}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                formData.role === role
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300"
              } hover:bg-purple-50 transition`}
            >
              {role === "customer" ? "Customer" : "Vendor"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-sm text-blue-500 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Vendor-only Field */}
          {formData.role === "vendor" && (
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium text-gray-700">
                Vendor ID (optional)
              </label>
              <input
                type="text"
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                placeholder="Enter your Vendor ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
  Forgot password?
</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
    
        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
            <span className="block">
              Secured by <strong>🧑‍💼Bikesh</strong>
            </span>
            <span className="text-orange-500  font-bold">Development mode</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInForm;
