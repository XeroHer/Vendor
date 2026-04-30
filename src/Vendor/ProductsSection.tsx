import { useState } from "react";
import ProductTable from "./ProductTable";
import EditProductForm from "./EditProductForm";
import type { Product } from "../interface/interface";
const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export default function ProductsSection({ products, setProducts }: Props) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // 🔹 Edit
  const handleEditProduct = (id: string) => {
    const index = products.findIndex((p) => p._id === id);
    if (index === -1) return;

    setEditingProduct({ ...products[index] });
    setEditingIndex(index);
  };

  // 🔹 Delete
  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  // 🔹 Save edit
  const handleSaveEdit = async () => {
    if (!editingProduct || editingIndex === null) return;

    try {
      const res = await fetch(
        `${API_URL}/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        }
      );

      const updated = [...products];
      updated[editingIndex] = await res.json();

      setProducts(updated);
      setEditingProduct(null);
      setEditingIndex(null);
    } catch {
      console.error("Update failed");
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  return (
    <>
      <ProductTable
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onChange={handleInputChange}
          onSave={handleSaveEdit}
          onCancel={() => {
            setEditingProduct(null);
            setEditingIndex(null);
          }}
        />
      )}
    </>
  );
}