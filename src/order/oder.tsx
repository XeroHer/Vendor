import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Order = {
  orderId: string;
  status: "pending" | "processing" | "packed" | "shipped" | "delivered";
  totalPrice: number;
  createdAt: string;
  imageUrl?: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
};

const STATUS_COLOR: Record<Order["status"], string> = {
  pending: "bg-gray-400",
  processing: "bg-blue-500",
  packed: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-600",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4 ">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex gap-4 animate-pulse"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!orders.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="text-center py-12 text-gray-500 border rounded-lg mt-4">
          No orders found.
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 mt-30">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.orderId}
            onClick={() => navigate(`/track/${order.orderId}`)}
            className="w-full border rounded-lg p-4 flex items-center gap-4
                       hover:shadow-md hover:bg-gray-50 active:scale-[0.99]
                       transition text-left cursor-pointer"
          >
            {/* IMAGE */}
            <img
              src={
                order.imageUrl || "https://via.placeholder.com/80?text=Order"
              }
              alt={`Order ${order.orderId}`}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/80?text=Order";
              }}
              className="w-14 h-14 object-cover rounded-md border"
            />

            {/* INFO */}
            <div className="flex-1">
              <p className="font-semibold">#{order.orderId}</p>
              <p className="text-sm text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Unknown date"}
              </p>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2 min-w-[120px] justify-center">
              <span
                className={`w-2 h-2 rounded-full ${STATUS_COLOR[order.status]}`}
              />
              <span className="capitalize text-sm">{order.status}</span>
            </div>

            {/* PRICE */}
            <div className="font-bold min-w-[80px] text-right">
              ${Number(order.totalPrice || 0).toFixed(2)}
            </div>

            {/* TRACK BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/track/${order.orderId}`);
              }}
              className="bg-black text-white px-3 py-1 rounded text-sm"
            >
              Track
            </button>

            {/* REVIEW BUTTON */}
            {order.status === "delivered" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const productId = order.items?.[0]?.productId;
                  if (productId) {
                    navigate(`/view/${productId}`);
                  }
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}