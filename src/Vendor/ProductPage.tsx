
import { useLocation } from "react-router-dom";
import { useState } from "react";

import type { Product } from "../interface/interface";
import ProductsSection from "./ProductsSection";

export default function ProductsPage() {
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>(
    location.state?.products || []
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <ProductsSection 
        products={products} 
        setProducts={setProducts} 
      />
    </div>
  );
}