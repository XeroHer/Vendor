import HeaderNav1 from "./header/HeaderNav";
import Footer from "./header/Footer";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useToggle } from "./Vendor/ThemeProvider";
import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "./category/AuthContext";
import { useCart } from "./MutipleCheckout/CartContext";

export default function MainLayout() {
  const { enabled } = useToggle();
  const { user, logout } = useAuth();
  const { cartItems = [] } = useCart();
  const navigate = useNavigate();

  const isVendor = user?.role === "vendor";

  return (
    <div className={enabled ? "dark" : "light min-h-screen"}>
      {/* HEADER */}
      <HeaderNav1 />

      {/* PAGE CONTENT */}
      <main className="pb-20 pt-[12px]">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

     {/* MOBILE BOTTOM NAV */}
<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t shadow-lg flex justify-around items-center md:hidden z-[9999]">

  {/* HOME */}
  <Link
    to="/"
    className="flex flex-col items-center text-blue-600"
  >
    <Home size={22} />
    <span className="text-xs">Home</span>
  </Link>

  {user ? (
    <>
      {/* DASHBOARD */}
      <Link
        to={isVendor ? "/Vendor" : "/oderpage"}
        className="flex flex-col items-center text-blue-600"
      >
        <LayoutDashboard size={22} />
        <span className="text-xs">
          {isVendor ? "Dashboard" : "Orders"}
        </span>
      </Link>

      {/* CART */}
      <Link
        to="/cart"
        className="relative flex flex-col items-center text-blue-600"
      >
        <ShoppingCart size={22} />

        {cartItems.length > 0 && (
          <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems.length}
          </span>
        )}

        <span className="text-xs">Cart</span>
      </Link>

      {/* LOGOUT */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex flex-col items-center text-red-500"
      >
        <LogOut size={22} />
        <span className="text-xs">Logout</span>
      </button>
    </>
  ) : (
    <>
      {/* CART */}
      <Link
        to="/cart"
        className="relative flex flex-col items-center text-blue-600"
      >
        <ShoppingCart size={22} />

        {cartItems.length > 0 && (
          <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems.length}
          </span>
        )}

        <span className="text-xs">Cart</span>
      </Link>

      {/* LOGIN */}
      <Link
        to="/new"
        className="flex flex-col items-center text-green-600"
      >
        <Sparkles size={22} />
        <span className="text-xs">New Arrival</span>
      </Link>
    </>
  )}
</div>
    </div>
  );
}