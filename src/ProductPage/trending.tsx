import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

type TrendingItem = {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  totalSold: number;
  totalRevenue: number;
  createdAt?: string;
};

export default function TrendingPage(): JSX.Element {
  const [products, setProducts] = useState<TrendingItem[]>([]);
  const [filtered, setFiltered] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // FETCH TRENDING
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);

      const res = await fetch(`${API_URL}/api/most-bought`);

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch trending");

        const items: TrendingItem[] = data?.results || data || [];

        setProducts(items);
        setFiltered(items);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // 🔎 SEARCH LOGIC (same as NewArrivals)
  useEffect(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
      setFiltered(products);
      return;
    }

    const result = products.filter((p) =>
      (p.title || p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, products]);

  // 💰 PRICE CALC
  const getPrice = (item: TrendingItem) => {
    if (item.price) return item.price;
    if (!item.totalSold) return 0;
    return item.totalRevenue / item.totalSold;
  };

  // 🖼 IMAGE FIX (handles all backend formats)
  const getImage = (item: TrendingItem) => {
    const img = item.image;

    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;

    return `http://localhost:5000${img}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 mt-10">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600">
          🔥 Trending Products
        </h1>
        <p className="text-sm text-gray-500">
          Most popular products based on sales
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trending products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading trending products...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500">
          No trending products found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const price = getPrice(item);

          return (
            <div
              key={item._id}
              onClick={() => navigate(`/view/${item._id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}

                {/* SOLD BADGE */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  🔥 {item.totalSold} sold
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1 hover:text-red-600">
                  {item.title || item.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {item.description || ""}
                </p>

                <div className="mt-3">
                  <span className="text-red-600 font-bold text-lg">
                    £{price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/view/${item._id}`);
                  }}
                  className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}