import { useEffect, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

type SearchItem = {
  _id: string;
  image?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
};

export default function SearchPage(): JSX.Element {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query: string =
    new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    setResults([]);
    setError(null);

    const controller = new AbortController();
    const currentQuery = query;

    const fetchResults = async (): Promise<void> => {
      if (!currentQuery.trim()) return;

      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(currentQuery)}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (currentQuery !== query) return;

        if (!res.ok) {
          throw new Error(data?.message || "Search failed");
        }

        setResults(data?.results || []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
          setError("Something went wrong while searching.");
        }
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  const getFinalPrice = (price?: number, discount?: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;

    if (d > 0) return p - (p * d) / 100;
    return p;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 mt-10">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">Search results</h1>

      <p className="text-sm text-gray-500 mb-4">
        {query
          ? `Showing results for "${query}"`
          : "Enter a search term"}
      </p>

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 animate-pulse">Searching...</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && query && results.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {results.map((item) => {
          const discount = item.discount || 0;
          const finalPrice = getFinalPrice(item.price, discount);

          return (
            <div
              key={item._id}
              onClick={() => navigate(`/view/${item._id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden cursor-pointer group"
            >
              {/* IMAGE */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || item.name || "Product"}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1 hover:text-blue-600">
                  {item.title || item.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {item.description || ""}
                </p>

                {/* PRICE */}
                <div className="mt-3">
                  {discount > 0 && (
                    <p className="text-xs text-red-500 line-through">
                      £{Number(item.price || 0).toFixed(2)}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-lg">
                      £{finalPrice.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Save {discount}%
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <button className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition">
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