import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const SignUpForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "customer",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessName: "",
    vendorId: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔐 PASSWORD STRENGTH LOGIC (NO UI CHANGE)
  const getStrength = (password: string) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) return;

    if (formData.role === "vendor" && !formData.businessName) {
      alert("Business name is required for vendors");
      return;
    }

    // 🔐 BLOCK WEAK PASSWORDS (ONLY LOGIC ADDED)
    const strength = getStrength(formData.password);

    if (strength === "weak") {
      alert(
        "Password is too weak. Use at least 6+ chars, uppercase, number & symbol."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      localStorage.setItem('token', data.token);
      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("OTP sent to your email. Please verify.");

      navigate("/verify-otp", {
        state: { email: formData.email },
      });
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
          Create your account
        </h2>

        <p className="text-gray-500 text-center text-sm mb-6">
          Welcome! Please fill in the details to get started.
        </p>

        {/* Role Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["customer", "vendor"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, role }))
              }
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

        {/* Social Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Facebook
          </button>

          <button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="h-px bg-gray-300 flex-1" />
          <span className="mx-2 text-sm text-gray-400">or</span>
          <span className="h-px bg-gray-300 flex-1" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
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

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {formData.password && (
  <ul className="text-xs text-gray-600 mt-2 space-y-1">
    <li className={formData.password.length >= 6 ? "text-green-600" : "text-red-500"}>
      • At least 6 characters
    </li>

    <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-red-500"}>
      • At least 1 uppercase letter
    </li>

    <li className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-red-500"}>
      • At least 1 lowercase letter
    </li>

    <li className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-red-500"}>
      • At least 1 number
    </li>

    <li className={/[@$!%*?&]/.test(formData.password) ? "text-green-600" : "text-red-500"}>
      • At least 1 special character (@$!%*?&)
    </li>
  </ul>
)}

          {/* Vendor-only Fields */}
          {formData.role === "vendor" && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  placeholder="Vendor ID (optional)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>

        <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
          <span className="block">
            Secured by <strong>🧑‍💼Bikesh</strong>
          </span>
          <span className="text-orange-500 font-bold">
            Development mode
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;