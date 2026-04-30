import React, { useEffect, useState } from "react";
import { Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  rating: number;
  image?: string | null;
  category: string;
  discount?: number;
};

export const Categories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  const categories = [
    "All",
    "clothes",
    "footwear",
    "jewellery",
    "cosmetics",
    "bags",
    "glasses",
    "perfumes",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data.products || data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/view/${id}`);
  };

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => p.category === filter);

  const getFinalPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <section className="mb-8 px-4 pt-20">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Browse Products</h2>
      </div>

      {/* CATEGORY PILLS (UX UPGRADE) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              filter === cat
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const discount = product.discount || 0;
            const finalPrice = getFinalPrice(product.price, discount);

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group"
              >
                {/* IMAGE */}
                <div
                  className="h-48 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
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
                  <h3
                    className="text-lg font-semibold flex items-center gap-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <Tags size={16} />
                    {product.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  {/* PRICE SECTION (UPGRADED) */}
                  <div className="mt-3">
                    {discount > 0 && (
                      <p className="text-xs text-red-500 line-through">
                        £{product.price.toFixed(2)}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold text-lg">
                        £{finalPrice.toFixed(2)}
                      </span>

                      <span className="text-yellow-500 text-sm">
                        ⭐ {product.rating}
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
                    onClick={() => handleProductClick(product._id)}
                    className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
                  >
                    View Product
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full">
            No products found
          </p>
        )}
      </div>
    </section>
  );
};