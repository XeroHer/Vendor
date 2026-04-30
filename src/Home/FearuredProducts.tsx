

import { Image as ImageIcon, ArrowRight } from "lucide-react";
import { useProductContext } from "./ProductContext";
import type { Product } from "../interface/interface";

const FeaturedProducts: React.FC = () => {
  const { products } = useProductContext() as { products: Product[] };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const renderRatingStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <span className="text-yellow-500">
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </span>
    );
  };

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="text-gray-500 col-span-full">
            No products available yet.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id} // or product._id if your backend uses MongoDB
              className="backdrop-blur-md bg-white/60 border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title || "Product image"}
                  className="h-36 w-full object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                  <ImageIcon size={32} />
                </div>
              )}

              <div className="text-lg font-bold mb-1">
                {product.title}
              </div>

              <div className="text-blue-600 font-semibold text-sm mb-1">
                {formatPrice(product.price)}
              </div>

              <div className="text-sm text-gray-600 mb-2">
                Stock: {product.stock} | Rating:{" "}
                {renderRatingStars(product.rating)}
              </div>

              <button className="mt-auto inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                View Details <ArrowRight size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;