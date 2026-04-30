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
};

export default function HotOffers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // 🔥 FETCH OFFERS
  const fetchOffers = async (pageNumber: number, append = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      setError(null);

      const res = await fetch(
        `${API_URL}/api/special/offer?page=${pageNumber}&limit=8`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch offers");

      const data = await res.json();
      const newProducts: Product[] = data.products || [];

      if (newProducts.length < 8) {
        setHasMore(false); // no more data
      }

      setProducts((prev) =>
        append ? [...prev, ...newProducts] : newProducts
      );

      setPage(pageNumber);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOffers(1);
  }, []);

  const getFinalPrice = (price?: number, discount?: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    return d > 0 ? p - (p * d) / 100 : p;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 mt-10">

      {/* HEADER */}
      

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600">
          🔥 Hot Offers
        </h1>
        <p className="text-sm text-gray-500">
          Best discounted deals for you
        </p>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading hot deals...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">
          No hot offers available right now
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const discount = product.discount || 0;
          const finalPrice = getFinalPrice(product.price, discount);

          return (
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
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}

                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  -{discount}%
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1 hover:text-blue-600">
                  {product.title || product.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>

                <div className="mt-3">
                  <p className="text-xs text-red-500 line-through">
                    £{Number(product.price || 0).toFixed(2)}
                  </p>

                  <span className="text-green-600 font-bold text-lg">
                    £{finalPrice.toFixed(2)}
                  </span>

                  <p className="text-xs text-green-600 mt-1">
                    You save {discount}%
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/view/${product._id}`);
                  }}
                  className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Grab Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 SEE MORE BUTTON */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchOffers(page + 1, true)}
            disabled={loadingMore}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loadingMore ? "Loading..." : "See More Offers"}
          </button>
        </div>
      )}

    </div>
  );
}