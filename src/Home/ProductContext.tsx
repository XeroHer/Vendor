import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../Type/types.ts";

// Define the context shape
interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
}

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(()=>{
   try {
      const saved = localStorage.getItem("products");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

   useEffect(() => {
    // Save to localStorage on products change
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);
  
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook to use context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
