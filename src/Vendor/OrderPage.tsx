import {
  useState,
  useMemo,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
const API_URL = import.meta.env.VITE_API_URL;

interface OrderItem {
  id: string;
  orderId: string;
  productTitle: string;
  quantity: number;
  price: number;
  customerName: string;
  shippingAddress: string;
  shippingStatus: "Pending" | "Shipped" | "Delivered";
  isCompleted: boolean;
  date: string | null;
}

type Action =
  | { type: "SET_ORDERS"; orders: OrderItem[] }
  | { type: "updateShippingStatus"; id: string; status: OrderItem["shippingStatus"] }
  | { type: "toggleCompleted"; id: string };

function orderReducer(state: OrderItem[], action: Action): OrderItem[] {
  switch (action.type) {
    case "SET_ORDERS":
      return action.orders;

    case "updateShippingStatus":
      return state.map((o) =>
        o.id === action.id ? { ...o, shippingStatus: action.status } : o
      );

    case "toggleCompleted":
      return state.map((o) =>
        o.id === action.id ? { ...o, isCompleted: !o.isCompleted } : o
      );

    default:
      return state;
  }
}

const COLORS = ["#60a5fa", "#34d399", "#facc15"];

function StatusBadge({ status }: { status: OrderItem["shippingStatus"] }) {
  const base = "px-2 py-1 text-xs font-semibold rounded-full";

  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

function OrderCard({
  order,
  onUpdateStatus,
  onToggleCompleted,
}: {
  order: OrderItem;
  onUpdateStatus: (id: string, status: OrderItem["shippingStatus"]) => void;
  onToggleCompleted: (id: string) => void;
}) {
  const safeDate = order.date
    ? (() => {
        try {
          return format(parseISO(order.date), "MMM dd, yyyy");
        } catch {
          return "Invalid date";
        }
      })()
    : "No date";

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition flex justify-between items-start">
      {/* LEFT */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">
            {order.productTitle}
          </p>
          <StatusBadge status={order.shippingStatus} />
        </div>

        <p className="text-sm text-gray-600">
          Customer: <span className="text-gray-900">{order.customerName}</span>
        </p>

        <p className="text-sm text-gray-600">
          Qty: <span className="text-gray-900">{order.quantity}</span> • Price: <span className="text-gray-900">${order.price}</span>
        </p>

        <p className="text-sm text-gray-600">{order.shippingAddress}</p>

        <p className="text-xs text-gray-400">{safeDate}</p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">
        <select
          value={order.shippingStatus}
          onChange={(e) =>
            onUpdateStatus(order.id, e.target.value as OrderItem["shippingStatus"])
          }
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option>Pending</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>

        <button
          onClick={() => onToggleCompleted(order.id)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
            order.isCompleted
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-500"
          }`}
          disabled={order.isCompleted}
        >
          {order.isCompleted ? "Completed" : "Mark Done"}
        </button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, dispatch] = useReducer(orderReducer, []);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();

      const normalized: OrderItem[] = data.flatMap((o: any) =>
        o.items.map((item: any) => ({
          id: `${o._id}-${item._id}`,
          orderId: o._id,
          productTitle: item.productTitle ?? "Unknown",
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
          customerName: o.userEmail ?? "Customer",
          shippingAddress:
            typeof o.shippingAddress === "object"
              ? `${o.shippingAddress.street ?? ""}, ${o.shippingAddress.city ?? ""}`
              : o.shippingAddress ?? "N/A",
          shippingStatus: item.shippingStatus ?? "Pending",
          isCompleted: item.isCompleted ?? false,
          date: o.createdAt ?? null,
        }))
      );

      dispatch({ type: "SET_ORDERS", orders: normalized });
      setLoading(false);
    })();
  }, []);

  const updateShippingStatus = useCallback(async (id: string, status: any) => {
    dispatch({ type: "updateShippingStatus", id, status });

    await fetch(`${API_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingStatus: status }),
    });
  }, []);

  const toggleCompleted = useCallback(async (id: string) => {
    dispatch({ type: "toggleCompleted", id });

    await fetch(`${API_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: true }),
    });
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = status === "All" || o.shippingStatus === status;
      const matchesSearch =
        o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  const revenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.price * o.quantity, 0),
    [orders]
  );

  const statusData = useMemo(() => {
    const map = { Pending: 0, Shipped: 0, Delivered: 0 };
    orders.forEach((o) => map[o.shippingStatus]++);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      if (!o.date) return;
      map.set(o.date, (map.get(o.date) || 0) + o.price * o.quantity);
    });

    return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  if (loading)
    return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Orders Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          Orders: {orders.length}
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          Revenue: ${revenue}
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          Showing: {filtered.length}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-2">Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
          <h3 className="font-semibold mb-2">Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueByDate}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={updateShippingStatus}
            onToggleCompleted={toggleCompleted}
          />
        ))}
      </div>
    </div>
  );
}
