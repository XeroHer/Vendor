
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../MutipleCheckout/CartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../category/AuthContext";

export default function ProductInfo({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
}: any) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔥 FINAL PRICE CALCULATION
  const getFinalPrice = (price?: number, discount?: number) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    return d > 0 ? p - (p * d) / 100 : p;
  };

  // 🔥 CART QUANTITY CHECK
  const getQty = (id: string) => {
    const item = cartItems.find((i: any) => i._id === id);
    return item ? item.quantity : 0;
  };

  // 🔥 ADD TO CART (PROTECTED)
  const handleAdd = () => {
    // 🔐 LOGIN CHECK
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    // 🔐 SIZE CHECK
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    });

    toast.success("Added to cart 🛒");
  };

  return (
    <div className="space-y-5">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        {product.title || product.name}
      </h1>

      <p className="text-gray-500">
        Brand: {product.brand || "Generic"}
      </p>

      <p className="text-yellow-500">
        ⭐ {product.rating ?? 4.5}
      </p>

      {/* PRICE */}
      <div className="space-y-1">
        {product.discount > 0 && (
          <p className="text-sm text-gray-400 line-through">
            £{Number(product.price || 0).toFixed(2)}
          </p>
        )}

        <div className="text-3xl font-bold text-blue-600">
          £{getFinalPrice(product.price, product.discount).toFixed(2)}
        </div>

        {product.discount > 0 && (
          <p className="text-green-600 text-sm font-semibold">
            Save {product.discount}% 🎉
          </p>
        )}
      </div>

      {/* SIZE */}
      <SizeSelector
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      {/* QUANTITY */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* ADD TO CART BUTTON */}
      <button
        onClick={handleAdd}
        disabled={!user}
        className={`w-full py-3 rounded font-semibold transition-all duration-200 ${
          user
            ? "bg-black text-white hover:bg-gray-800 active:scale-95"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {user
          ? `Add to Cart (${getQty(product._id)})`
          : "Login to Add to Cart"}
      </button>

      {/* LOGIN WARNING */}
      {!user && (
        <p className="text-sm text-red-500 text-center">
          Please login to purchase this product
        </p>
      )}

      {/* DESCRIPTION */}
      {product.description && (
        <p className="text-sm text-gray-600 border-t pt-4">
          {product.description}
        </p>
      )}
      
    </div>
    
  );
}