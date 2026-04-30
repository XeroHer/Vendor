import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

type Order = {
  orderId: string;
  status: "pending" | "processing" | "packed" | "shipped" | "delivered";
  totalPrice: number;
  paymentMethod: string;
  paymentId: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zip: string;
  };
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
};

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; color: string }
> = {
  pending: { label: "Order Placed", color: "bg-gray-400" },
  processing: { label: "Processing", color: "bg-blue-500" },
  packed: { label: "Packed", color: "bg-purple-500" },
  shipped: { label: "Shipped", color: "bg-orange-500" },
  delivered: { label: "Delivered", color: "bg-green-600" },
};

export default function TrackOrderPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps: Order["status"][] = useMemo(
    () => ["pending", "processing", "packed", "shipped", "delivered"],
    []
  );

  const fetchOrder = useCallback(async (signal?: AbortSignal) => {
    if (!orderId) return;

    try {
      const res = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        { signal }
      );

      if (!res.ok) throw new Error("Order not found");

      const data: Order = await res.json();
      setOrder(data);
      setError("");
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const controller = new AbortController();

    fetchOrder(controller.signal);

    const interval = setInterval(() => {
      fetchOrder(controller.signal);
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchOrder, orderId]);

  const currentIndex = useMemo(() => {
    if (!order) return 0;
    const idx = steps.indexOf(order.status);
    return idx === -1 ? 0 : idx;
  }, [order, steps]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  const statusMeta = STATUS_CONFIG[order.status];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-25">
      {/* HEADER */}
      <div className="bg-white shadow-sm rounded-2xl p-6 border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Track Order</h1>
            <p className="text-gray-500 text-sm">#{order.orderId}</p>
            <p className="text-gray-400 text-sm">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <span className={`px-3 py-1 text-white text-xs rounded-full ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* PROGRESS TIMELINE */}
      <div className="bg-white shadow-sm rounded-2xl p-6 border">
        <div className="flex justify-between text-xs mb-2">
          {steps.map((step, i) => (
            <span
              key={step}
              className={i <= currentIndex ? "text-black font-semibold" : "text-gray-400"}
            >
              {STATUS_CONFIG[step].label}
            </span>
          ))}
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* SHIPPING */}
        <div className="bg-white shadow-sm rounded-2xl p-6 border">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-black">
              {order.shippingAddress.fullName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city} {order.shippingAddress.zip}
            </p>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white shadow-sm rounded-2xl p-6 border">
          <h2 className="font-semibold mb-3">Payment</h2>
          <p className="text-sm">Method: {order.paymentMethod}</p>
          <p className="text-xs text-gray-500 break-all">
            {order.paymentId}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white shadow-sm rounded-2xl p-6 border">
        <h2 className="font-semibold mb-4">Items</h2>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t font-bold">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
