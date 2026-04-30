import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../MutipleCheckout/CartContext";
import { categories as defaultCategories, supportCenter } from "../Type/types";
import HeaderTop from "./HeaderTop";
const API_URL = import.meta.env.VITE_API_URL;

export default function HeaderNav1() {
  const { cartItems = [] } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [categories] = useState(defaultCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
 
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Categories" },
    { name: "Mens", path: "/mens" },
    { name: "Womens", path: "/womens" },
    { name: "Hot Offers", path: "/offers" },
    { name: "New In", path: "/new" },
    { name: "Support" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const current = navItems.find(
      (item) => item.path && location.pathname.startsWith(item.path)
    );
    if (current) setActiveTab(current.name);
  }, [location.pathname]);

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
          { signal: controller.signal }
        );

        const data = await res.json();
        if (!res.ok) throw new Error("Search failed");

        setSuggestions(data?.results?.slice(0, 6) || []);
      } catch (err: any) {
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

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: any) => {
    if (e.key !== "Enter") return;

    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSuggestionClick = (item: any) => {
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

        <HeaderTop
          cartItems={cartItems}
          searchRef={searchRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchSubmit={handleSearchSubmit}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          loading={loading}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

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
              onMouseEnter={() => {
                if (item.name === "Categories") setIsCategoryOpen(true);
                if (item.name === "Support") setIsSupportOpen(true);
              }}
              onMouseLeave={() => {
                if (item.name === "Categories") setIsCategoryOpen(false);
                if (item.name === "Support") setIsSupportOpen(false);
              }}
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

              {/* SUPPORT DROPDOWN */}
              {item.name === "Support" && (
                <AnimatePresence>
                  {isSupportOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border p-3 z-50"
                    >
                      {supportCenter.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            // navigate(`/${item.value}`);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition w-full text-left"
                        >
                          <span>{item.icon}</span>
                          {item.label}
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