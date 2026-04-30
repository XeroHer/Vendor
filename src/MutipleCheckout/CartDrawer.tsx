import { useCart } from "./CartContext";

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={() => setIsCartOpen(false)}>✕</button>
      </div>

      <div className="p-4 space-y-4">
        {cartItems.length === 0 && <p>No items yet</p>}

        {cartItems.map((item) => (
          <div key={item._id + item.size} className="flex gap-3">
            <img
              src={item.image}
              className="w-14 h-14 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartDrawer;