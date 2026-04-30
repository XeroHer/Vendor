import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogIn, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../category/AuthContext";

interface HeaderTopProps {
  cartItems: any[];
  searchRef: React.RefObject<HTMLDivElement | null>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions: any[];
  handleSuggestionClick: (item: any) => void;
  loading: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderTop({
  cartItems,
  searchRef,
  searchTerm,
  setSearchTerm,
  handleSearchSubmit,
  suggestions,
  handleSuggestionClick,
  loading,
  setIsMobileMenuOpen,
}: HeaderTopProps) {
  const [openAccount, setOpenAccount] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  // ✅ ONLY AUTH SOURCE (NO localStorage DUPLICATION)
  const { user, loading: authLoading, setUser, logout } = useAuth();

  const isLoggedIn = !!user;

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setOpenAccount(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null); // update context instantly
    setOpenAccount(false);

    navigate("/login");
  };
  const isVendor = user?.role === "vendor";

  return (
    <div className="flex items-center justify-between py-3 gap-4">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
        <img
          src="/Mithila store (1).png"
          alt="Mithila Store"
          className="w-16 h-16 object-contain"
        />
        <span>
          <span className="text-blue-600">M</span>
          <span className="text-black">ithila</span>{" "}
          <span className="text-blue-600">S</span>
          <span className="text-black">tore</span>
        </span>
      </Link>

      {/* SEARCH */}
      <div ref={searchRef} className="relative w-full max-w-xl hidden md:block">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Search products..."
          className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            {suggestions.map((item) => (
              <button
                key={item._id || item.title}
                onClick={() => handleSuggestionClick(item)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50"
              >
                {item.title || item.name}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute left-0 right-0 mt-2 bg-white p-2 text-sm text-gray-500 border rounded-xl">
            Searching...
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-5">
        {/* CART */}
        <Link to="/cart" className="relative flex items-center text-blue-600">
          <ShoppingCart size={22} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>

        {/* ACCOUNT DROPDOWN */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setOpenAccount((p) => !p)}
            className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full 
            bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {isLoggedIn ? <User size={16} /> : <LogIn size={16} />}
            </div>

            <div className="text-left leading-tight">
              <div className="text-[11px] text-gray-500">
                {isLoggedIn
                  ? `Hi, ${user?.name || user?.firstName || "User"}`
                  : "Sign in or create account"}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {isLoggedIn ? "My Account" : "Account & Orders"}
              </div>
            </div>
          </button>

          {/* DROPDOWN */}
          <div
            className={`
              absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border
              overflow-hidden z-50 transition-all duration-200 origin-top-right
              ${
                openAccount
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            {/* NOT LOGGED IN */}
            {!isLoggedIn && (
              <div className="p-4">
                <p className="font-semibold text-gray-800">Welcome 👋</p>
                <p className="text-xs text-gray-500 mb-3">
                  Sign in to access your account
                </p>

                <Link
                  to="/login"
                  onClick={() => setOpenAccount(false)}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Sign In / Register
                </Link>
              </div>
            )}

            {/* LOGGED IN */}
            {isLoggedIn && (
              <>
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <p className="text-sm font-semibold">
                    {user?.name || user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setOpenAccount(false)}
                  className="block px-4 py-2 text-sm hover:bg-blue-50"
                >
                  👤 Profile
                </Link>

                <Link
                  to={isVendor ? "/Vendor" : "/oderpage"}
                  onClick={() => setOpenAccount(false)}
                  className="block px-4 py-2 text-sm hover:bg-blue-50"
                >
                  📦 {isVendor ? "Dashboard" : "Orders"}
                </Link>

                <Link
                  to="/reset-password/:token"
                  onClick={() => setOpenAccount(false)}
                  className="block px-4 py-2 text-sm hover:bg-blue-50"
                >
                  ⚙️ Settings
                </Link>

                <div className="border-t">
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <button
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
