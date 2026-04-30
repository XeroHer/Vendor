import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AddProductButton from "./AddProduct/AddProductButton";
import type { Product, Order } from "../interface/interface";
import DashboardStats from "./DashboardStats";

import ProductsSection from "./ProductsSection";
const API_URL = import.meta.env.VITE_API_URL;

export default function VendorDashboard1() {
  const [products, setProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  const calculateEarnings = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalEarnings = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const earningsThisMonth = orders
      .filter((o) => {
        const d = new Date(o.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, o) => acc + o.totalPrice, 0);
    const earningsLastMonth = orders
      .filter((o) => {
        const d = new Date(o.date);
        const lastMonth = (currentMonth - 1 + 12) % 12;
        const lastMonthYear =
          currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((acc, o) => acc + o.totalPrice, 0);
    return { totalEarnings, earningsThisMonth, earningsLastMonth };
  };

  const earnings = calculateEarnings();
 const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [productsRes, ordersRes] = await Promise.all([
  fetch(`${API_URL}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  fetch(`${API_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
]);
        setProducts(await productsRes.json());
        setOrders(await ordersRes.json());
      } catch {
        toast.error("Failed to load products or orders.");
      }
    };
    fetchData();
  }, []);

  // VendorDashboard.tsx
  const handleAddProduct = async (formData: FormData) => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans">
      <Toaster position="top-right" />
      <aside className="w-full md:w-60 bg-green-300 p-4 shadow-md">
        <h1 className="text-xl font-bold mb-6 bg-white rounded-full">
          Vendor Dashboard
        </h1>
        <nav className="space-y-4">
          <Link to="/" className="block">
            Home
          </Link>
          <Link to="/orders" className="block">
            Orders
          </Link>
          <Link to="/profile" className="block">
            Profile
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <DashboardStats
          products={products}
          orders={orders}
          earnings={earnings}
        />
        <AddProductButton onAddProduct={handleAddProduct} />
        <ProductsSection products={products} setProducts={setProducts} />
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
