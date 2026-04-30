// Homepage.tsx
import React from "react";
import { ShoppingCart, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../MutipleCheckout/CartContext";

// ----------------- Header -----------------
export const Header: React.FC = () => {
  const { cartItems } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 rounded-b-xl z-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Logo */}
        <div className="text-3xl font-extrabold tracking-tight text-center sm:text-left">
          SharK
        </div>

        {/* Search */}
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search for handmade goods..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 justify-center sm:justify-start">
          <Link
            to="/cart"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            aria-label="View Cart"
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Cart ({cartItems?.length || 0})</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            aria-label="Login"
          >
            <LogIn size={20} />
            <span className="font-medium">Login</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            aria-label="Register"
          >
            <UserPlus size={20} />
            <span className="font-medium">Register</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

