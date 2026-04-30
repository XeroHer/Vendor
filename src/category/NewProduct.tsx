import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type Product = {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  discount?: number;
  createdAt?: string;
};

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/api/search/new`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch new arrivals");

        const data = await res.json();
        const allProducts: Product[] = data.products || data || [];

        setProducts(allProducts);
        setFiltered(allProducts);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // 🔎 SEARCH LOGIC
  useEffect(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
      setFiltered(products);
      return;
    }

    const result = products.filter((p) =>
      (p.title || p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, products]);

  // NEW badge logic (24h)
  const isNew = (date?: string) => {
    if (!date) return false;
    return new Date(date) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 mt-10">
      {/* HEADER */}
     

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-600">
          🆕 New Arrivals
        </h1>
        <p className="text-sm text-gray-500">
          Latest products added in last 24 hours
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading new products...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500">
          No products found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/view/${product._id}`)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer overflow-hidden group"
          >
            {/* IMAGE */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title || product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}

              {/* NEW BADGE */}
              {isNew(product.createdAt) && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-semibold line-clamp-1 hover:text-green-600">
                {product.title || product.name}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>

              <div className="mt-3">
                <span className="text-green-600 font-bold text-lg">
                  £{Number(product.price || 0).toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/view/${product._id}`);
                }}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}