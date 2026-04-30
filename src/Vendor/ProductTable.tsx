import React, { useMemo } from "react";
import type { Product } from "../interface/interface";
import ProductImagePreview from "../ProductPreview/Image";

interface Props {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  itemsPerPage: number;
  onEdit: (id: string) => void; // use _id
  onDelete: (id: string) => void; // use _id
}

export default function ProductTable({
  products,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onEdit,
  onDelete,
}: Props) {
  // Filter products based on search
  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      {/* Search Input */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search products by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr>
              <th className="py-2">Image</th>
              <th>Title</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Description</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No products available.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td>
                    <ProductImagePreview image={product.image ?? null} />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.stock}</td>
                  <td>${product.price}</td>
                  <td>{product.description}</td>
                  <td>{product.rating}</td>
                  <td className="space-x-2">
                    <button
                      className="text-blue-600"
                      onClick={() => onEdit(product._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => onDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}