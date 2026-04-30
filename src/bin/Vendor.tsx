import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AddProductButton from "../Vendor/AddProduct/AddProductButton";
import type { Product, Order } from "../interface/interface";
import ProductImagePreview from '../ProductPreview/Image'




export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [orders, setOrders] = useState<Order[]>([]);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const calculateEarnings = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalEarnings = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const earningsThisMonth = orders
      .filter((order) => {
        const d = new Date(order.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, order) => acc + order.totalPrice, 0);

    const earningsLastMonth = orders
      .filter((order) => {
        const d = new Date(order.date);
        const lastMonth = (currentMonth - 1 + 12) % 12;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((acc, order) => acc + order.totalPrice, 0);

    return { totalEarnings, earningsThisMonth, earningsLastMonth };
  };

  const { totalEarnings, earningsThisMonth, earningsLastMonth } = calculateEarnings();

useEffect(() => {
  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/products"), // your backend URL
        fetch("http://localhost:5000/api/orders"),
      ]);

      const products: Product[] = await productsRes.json();
      const orders: Order[] = await ordersRes.json();

      setProducts(products);
      setOrders(orders);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load products or orders.");
    }
  };

  fetchData();
}, []);

 const handleAddProduct = async (product: Omit<Product, "id"> & { image: File | null }) => {
  try {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("stock", String(product.stock));
    formData.append("price", String(product.price));
    formData.append("description", product.description);
    formData.append("rating", String(product.rating));
    
    if (product.image) {
      formData.append("image", product.image); // File
    }

    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData, // ✅ no headers, browser sets it automatically
    });

    const newProduct = await response.json();
    setProducts((prev) => [...prev, newProduct]);
    toast.success("Product added!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add product.");
  }
};

  const handleSaveEdit = async () => {
  if (!editingProduct || editingIndex === null) return;

  try {
    const res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingProduct),
    });

    const updatedProduct = await res.json();
    const updated = [...products];
    updated[editingIndex] = updatedProduct;
    setProducts(updated);
    setEditingProduct(null);
    setEditingIndex(null);
    toast.success("Product updated!");
  } catch (err) {
    toast.error("Update failed.");
  }
};

const handleDeleteProduct = async (index: number) => {
  const product = products[index];
  try {
    await fetch(`http://localhost:5000/api/products/${product.id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((_, i) => i !== index));
    toast.success("Product deleted.");
  } catch (err) {
    toast.error("Delete failed.");
  }
};


  const handleEditProduct = (index: number) => {
    setEditingProduct({ ...products[index] });
    setEditingIndex(index);
  };


  const handleInputChange = (
    field: keyof Product,
    value: string | number | File | null
  ) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-green-300 p-4 shadow-md">
        <h1 className="text-xl font-bold mb-6 bg-white rounded-full">Vendor Dashboard</h1>
        <nav className="space-y-4" >
          <Link to="/products" className="block">
            Products
          </Link>
          <Link to="/orders" className="block">
            Orders
          </Link>
          <Link to="/profile" className="block">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Stats */}
        <div className="bg-white p-4 rounded shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-4 rounded text-center">
              <h3 className="font-semibold">Total Products</h3>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm mt-2 text-gray-600">
                In Stock: {products.filter((p) => p.stock > 0).length}<br />
                Out of Stock: {products.filter((p) => p.stock === 0).length}<br />
                Low Stock: {products.filter((p) => p.stock <= 5 && p.stock > 0).length}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded text-center">
              <h3 className="font-semibold">Orders</h3>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm mt-2 text-gray-600">
                Pending: {pendingOrders}<br />
                Shipped: {shippedOrders}<br />
                Delivered: {deliveredOrders}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
              <h3 className="font-semibold">Earnings</h3>
              <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              <p className="text-sm mt-2 text-gray-600">
                This Month: ${earningsThisMonth.toFixed(2)}<br />
                Last Month: ${earningsLastMonth.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <AddProductButton onAddProduct={handleAddProduct} />
        <div className="my-4">
          <input
            type="text"
            placeholder="Search products by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

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
                paginatedProducts.map((product, index) => (
                  <tr key={product.id} className="border-t">
                    <td><ProductImagePreview image={product.image} /></td>
                    <td>{product.title}</td>
                    <td>{product.stock}</td>
                    <td>${product.price}</td>
                    <td>{product.description}</td>
                    <td>{product.rating}</td>
                    <td className="space-x-2">
                      <button
                        className="text-blue-600"
                        onClick={() => handleEditProduct(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteProduct(index)}
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Edit Form */}
        {editingProduct && (
          <div className="bg-white p-6 mt-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm block">Title</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm block">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value))}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm block">Price</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm block">Rating</label>
                  <input
                    type="number"
                    value={editingProduct.rating}
                    onChange={(e) => handleInputChange("rating", parseFloat(e.target.value))}
                    className="border p-2 w-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm block">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-4">
                <label className="text-sm block">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleInputChange("image", e.target.files ? e.target.files[0] : null)
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setEditingProduct(null);
                    setEditingIndex(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          onClick={() => navigate("/products", { state: { products } })}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
        >
          View Products Page
        </button>
      </main>
    </div>
  );
}
