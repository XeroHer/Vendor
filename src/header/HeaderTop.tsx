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

  const { user, setUser, logout } = useAuth();

  const isLoggedIn = !!user;
  const isVendor = user?.role === "vendor";

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

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setOpenAccount(false);

    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 md:gap-4 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 font-extrabold"
        >
          <img
            src="/Mithila store (1).png"
            alt="Mithila Store"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
          />

          <span className="text-lg sm:text-xl md:text-2xl whitespace-nowrap">
            <span className="text-blue-600">M</span>
            <span className="text-black">ithila</span>{" "}
            <span className="text-blue-600">S</span>
            <span className="text-black">tore</span>
          </span>
        </Link>

        {/* DESKTOP SEARCH */}
        <div
          ref={searchRef}
          className="relative flex-1 max-w-xl hidden md:block"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search products..."
            className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={item._id || item.title}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50"
                >
                  {item.title || item.name}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="absolute left-0 right-0 mt-2 bg-white p-2 border rounded-xl text-sm text-gray-500">
              Searching...
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* CART */}
          <Link
            to="/cart"
            className="relative hidden sm:flex p-2 text-blue-600 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart size={22} />

            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* ACCOUNT */}
          <div ref={accountRef} className="relative">
            {/* DESKTOP */}
            <button
              onClick={() => setOpenAccount((prev) => !prev)}
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full border bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {isLoggedIn ? <User size={16} /> : <LogIn size={16} />}
              </div>

              <div className="leading-tight text-left">
                <div className="text-[11px] text-gray-500 truncate max-w-[120px]">
                  {isLoggedIn
                    ? `Hi, ${user?.name || user?.firstName || "User"}`
                    : "Sign in or create account"}
                </div>

                <div className="text-sm font-semibold">
                  {isLoggedIn ? "My Account" : "Account & Orders"}
                </div>
              </div>
            </button>

            {/* MOBILE */}
            <button
              onClick={() => setOpenAccount((prev) => !prev)}
              className="sm:hidden p-2 rounded-full border bg-white shadow-sm"
            >
              {isLoggedIn ? (
                <User className="text-blue-600" size={20} />
              ) : (
                <LogIn className="text-blue-600" size={20} />
              )}
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-3 w-64 max-w-[90vw] bg-white rounded-2xl shadow-xl border overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                openAccount
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {!isLoggedIn ? (
                <div className="p-4">
                  <p className="font-semibold">Welcome 👋</p>

                  <p className="text-xs text-gray-500 mb-3">
                    Sign in to access your account
                  </p>

                  <Link
                    to="/login"
                    onClick={() => setOpenAccount(false)}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign In / Register
                  </Link>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <p className="font-semibold">
                      {user?.name || user?.firstName || "User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Manage your account
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setOpenAccount(false)}
                    className="block px-4 py-2 hover:bg-blue-50"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to={isVendor ? "/Vendor" : "/oderpage"}
                    onClick={() => setOpenAccount(false)}
                     className="hidden sm:block px-4 py-2 hover:bg-blue-50"
                  >
                    📦 {isVendor ? "Dashboard" : "Orders"}
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setOpenAccount(false)}
                    className="block px-4 py-2 hover:bg-blue-50"
                  >
                    ⚙️ Settings
                  </Link>

                  <div className="hidden sm:block border-t">
  <button
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
  >
    🚪 Logout
  </button>
</div>
                </>
              )}
            </div>
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div ref={searchRef} className="relative mt-3 md:hidden">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Search products..."
          className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            {suggestions.map((item) => (
              <button
                key={item._id || item.title}
                onClick={() => handleSuggestionClick(item)}
                className="w-full px-4 py-2 text-left hover:bg-blue-50"
              >
                {item.title || item.name}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl p-2 text-sm text-gray-500">
            Searching...
          </div>
        )}
      </div>
    </>
  );
}