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

export default function MenPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/api/search/products/mens`
        );

        if (!res.ok) throw new Error("Failed to fetch men products");

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenProducts();
  }, []);

  const getFinalPrice = (price?: number, discount?: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;

    return d > 0 ? p - (p * d) / 100 : p;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 mt-10">
   

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Men’s Collection</h1>
        <p className="text-sm text-gray-500">
          Premium picks curated for men
        </p>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading products...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">
          No men products found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.map((product) => {
          const discount = product.discount || 0;
          const finalPrice = getFinalPrice(product.price, discount);

          return (
            <div
              key={product._id}
              onClick={() => navigate(`/view/${product._id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden cursor-pointer group"
            >
              {/* IMAGE */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title || product.name || "Product"}
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
                  {product.title || product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}

                {/* PRICE */}
                <div className="mt-3">
                  {discount > 0 && (
                    <p className="text-xs text-red-500 line-through">
                      £{Number(product.price || 0).toFixed(2)}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/view/${product._id}`);
                  }}
                  className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
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