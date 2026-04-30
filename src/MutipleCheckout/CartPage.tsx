import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0)
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Products
        </button>
      </div>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <ul className="space-y-4">
  {cartItems.map((item) => (
    <li
      key={item._id + item.size}
      className="flex justify-between bg-white p-4 rounded shadow"
    >
      <div className="flex items-center space-x-4">
        {item.image && (
          <img
            src={
              item.image instanceof File
                ? URL.createObjectURL(item.image)
                : item.image
            }
            className="w-20 h-20 object-cover rounded"
          />
        )}

        <div>
          <h2 className="font-semibold">{item.title}</h2>

          {/* 🔥 SIZE DISPLAY */}
          {item.size && (
            <p className="text-sm text-gray-500">
              Size: {item.size}
            </p>
          )}

          <p>Price: £{item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            updateQuantity(
              item._id,
              item.size,
              Math.max(1, Number(e.target.value))
            )
          }
          className="w-16 border rounded p-1 text-center"
        />

        <button
          onClick={() => removeFromCart(item._id, item.size)}
          className="text-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Total: £{totalPrice.toFixed(2)}
        </p>

        <div className="space-x-4">
          <button
            onClick={clearCart}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;