
import React, { createContext, useContext, useState } from "react";

type CartItem = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // 🔥 ADD THIS
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export const CartProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ ADD TO CART (MERGE ITEMS + SIZE SAFE)
  const addToCart = (product: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id && item.size === product.size
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === product.size
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
              }
            : item
        );
      }

      return [...prev, product];
    });
  };

  // ✅ REMOVE (SIZE SAFE FIX)
  const removeFromCart = (id: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  // ✅ UPDATE QUANTITY (SIZE SAFE FIX)
  const updateQuantity = (
  id: string,
  size: string | undefined,
  quantity: number
) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item._id === id && item.size === size
        ? { ...item, quantity }
        : item
    )
  );
};

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};