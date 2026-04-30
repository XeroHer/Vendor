
import { useLocation, useNavigate } from "react-router-dom";
import { useCart, type Product } from "./CartContext";
import { useMemo, useEffect } from "react";

const ProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const products: Product[] = location.state?.products || [];

  useEffect(() => {
    if (!products.length) navigate("/", { replace: true });
  }, [products, navigate]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex justify-between items-center">
        Product Details
        <button onClick={() => navigate("/cart")} className="bg-green-600 text-white px-3 py-1 rounded" type="button">
          Cart ({cartItems.length})
        </button>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const imageUrl = useMemo(() => (product.image instanceof File ? URL.createObjectURL(product.image) : product.image), [product.image]);
          useEffect(() => {
            return () => {
              if (product.image instanceof File && imageUrl) URL.revokeObjectURL(imageUrl);
            };
          }, [imageUrl, product.image]);

          return (
            <div key={product._id || `${product.title}-${index}`} className="bg-white rounded-lg shadow-md p-4 space-y-2">
              {imageUrl ? <img src={imageUrl} alt={product.title} className="w-full h-60 object-cover rounded" /> : <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded text-gray-400">No Image</div>}
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-700"><strong>Price:</strong> ${product.price}</p>
              <p className="text-sm text-gray-700"><strong>Rating:</strong> {product.rating} / 5</p>
              <button onClick={() => addToCart(product)} className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition focus:outline-none" type="button">
                Add to Cart ({cartItems.length})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPage;