import React from "react";
import type { Order, Product } from "../interface/interface";

interface Props {
  products: Product[];
  orders: Order[];
  earnings: { totalEarnings: number; earningsThisMonth: number; earningsLastMonth: number };
}

export default function DashboardStats({ products, orders, earnings }: Props) {
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
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
          <p className="text-2xl font-bold">${earnings.totalEarnings.toFixed(2)}</p>
          <p className="text-sm mt-2 text-gray-600">
            This Month: ${earnings.earningsThisMonth.toFixed(2)}<br />
            Last Month: ${earnings.earningsLastMonth.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}