import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "../MutipleCheckout/CartContext";
import { categories as defaultCategories } from "../Type/types";
const API_URL = import.meta.env.VITE_API_URL;

export default function HeaderNav() {
  const { cartItems = [] } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [categories] = useState(defaultCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Categories" },
    { name: "Mens", path: "/mens" },
    { name: "Womens", path: "/womens" },
    { name: "Hot Offers", path: "/offers" },
    { name: "New In", path: "/new" },
    { name: "Support", path: "/support" },
  ];

  // 🔥 Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Active tab sync
  useEffect(() => {
    const current = navItems.find(
      (item) => item.path && location.pathname.startsWith(item.path),
    );
    if (current) setActiveTab(current.name);
  }, [location.pathname]);

  // 🔍 Search suggestions
  useEffect(() => {
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal },
        );

        const data = await res.json();
        if (!res.ok) throw new Error("Search failed");

        setSuggestions(data?.results?.slice(0, 6) || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [searchTerm]);

  // 🔥 Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔍 Submit search
  const handleSearchSubmit = (e) => {
    if (e.key !== "Enter") return;

    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // 🔍 Click suggestion
  const handleSuggestionClick = (item) => {
    const name = item.title || item.name || "product";
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition ${
        scrolled ? "bg-white shadow-md" : "bg-white/70"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold"
          >
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
          <div
            ref={searchRef}
            className="relative w-full max-w-xl hidden md:block"
          >
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

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                {suggestions.map((item) => (
                  <button
                    key={item._id || item.title}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                  >
                    {item.title || item.name}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="absolute left-0 right-0 mt-2 bg-white p-2 text-sm text-gray-500 border rounded-xl">
                Searching...
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            {/* CART */}
            <Link
              to="/cart"
              className="relative flex items-center text-blue-600"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/login"
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full 
             bg-white border border-gray-200 shadow-sm 
             hover:shadow-md hover:bg-gray-50 
             transition-all duration-200"
            >
              {/* ICON CONTAINER */}
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <LogIn size={16} />
              </div>

              {/* TEXT */}
              <div className="leading-tight text-left">
                <div className="text-[11px] text-gray-500">
                  Sign in or create account
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  Account & Orders
                </div>
              </div>
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav
          className={`md:flex items-center justify-center gap-8 py-3 border-t ${
            isMobileMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() =>
                item.name === "Categories" && setIsCategoryOpen(true)
              }
              onMouseLeave={() =>
                item.name === "Categories" && setIsCategoryOpen(false)
              }
            >
              <Link
                to={item.path || "#"}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition"
              >
                {item.name}

                {activeTab === item.name && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-2 right-2 -bottom-1 h-[2px] bg-black rounded-full"
                  />
                )}
              </Link>

              {/* CATEGORY DROPDOWN */}
              {item.name === "Categories" && (
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 top-full mt-3 w-72 bg-white rounded-xl shadow-xl border p-4 grid grid-cols-2 gap-3 z-50"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            navigate(`/category/${cat.value}`);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition"
                        >
                          <span>{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
