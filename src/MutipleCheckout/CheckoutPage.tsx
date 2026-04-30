import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { cartItems, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // ------------------------
  // FORM CHANGE
  // ------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------------
  // CONNECT WALLET
  // ------------------------
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWalletAddress(accounts[0]);
  };

  // ------------------------
  // GET ETH PRICE
  // ------------------------
  const getETHPrice = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    );
    const data = await res.json();
    return data.ethereum.usd;
  };

  // ------------------------
  // SUBMIT
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ======================
      // 🦊 CRYPTO PAYMENT
      // ======================
      if (paymentMethod === "crypto") {
        if (!walletAddress) {
          await connectWallet();
        }

        const { payWithCrypto } = await import("../blockchain/payment");

        const ethPrice = await getETHPrice();
        const ethAmount = totalPrice / ethPrice;

        const result = await payWithCrypto("ORDER_" + Date.now(), ethAmount);

        if (result?.error) {
          setError(result.message || "Crypto payment failed");
          setLoading(false);
          return;
        }

        if (result?.txHash) {
          await fetch(`${API_URL}/crypto/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              txHash: result.txHash,
              amount: ethAmount,
            }),
          });

          const orderRes = await fetch(
            `${API_URL}/api/orders/create`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: cartItems.map((item) => ({
                  productId: item._id || item.productId,
                  quantity: item.quantity,
                })),
                userEmail: formData.email,
                shippingAddress: {
                  fullName: formData.fullName,
                  address: formData.address,
                  city: formData.city,
                  zip: formData.zip,
                },
                totalPrice,
                paymentMethod: "crypto",
                paymentId: result.txHash,
                walletAddress,
              }),
            },
          );

          const order = await orderRes.json();

          clearCart();
          alert("Crypto payment successful 🎉");

          // window.location.href = `/track-order/${order.orderId
          // }`;
          // ✅ FIX: go to orders page + highlight new order
          navigate("/oderpage", {
            state: { newOrderId: order.orderId },
          });
        }

        setLoading(false);
        return;
      }

      // ======================
      // 💳 STRIPE PAYMENT
      // ======================
      if (!stripe || !elements) {
        throw new Error("Stripe not ready");
      }

      const res = await fetch(
        `${API_URL}/checkout/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalPrice * 100),
          }),
        },
      );

      const data = await res.json();

      if (!data.clientSecret) {
        throw new Error("Missing client secret");
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // ✅ FIXED STRIPE CONFIRMATION
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zip,
              },
            },
          },
        },
      );

      if (error) {
        setError(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // ======================
      // ORDER CREATION (FIXED)
      // ======================
      if (paymentIntent?.status === "succeeded") {
        const orderRes = await fetch(
          `${API_URL}/api/orders/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartItems.map((item) => ({
                productId: item._id || item.productId,
                quantity: item.quantity,
              })),
              userEmail: formData.email,
              shippingAddress: {
                fullName: formData.fullName,
                address: formData.address,
                city: formData.city,
                zip: formData.zip,
              },
              totalPrice,
              paymentMethod: "card",
              paymentId: paymentIntent.id,
            }),
          },
        );

        const order = await orderRes.json();

        clearCart();
        alert("Payment successful 🎉");

        // window.location.href = `/track-order/${order.orderId}`;
        // ✅ FIX: go to orders page + highlight new order
        navigate("/oderpage", {
          state: { newOrderId: order.orderId },
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // EMPTY CART
  // ------------------------
  if (cartItems.length === 0) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold">No items in your cart.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md border rounded-lg shadow-sm p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold border-b pb-2">Checkout</h2>

        {/* PRODUCTS */}
        <div className="border-b pb-4">
          {cartItems.map((item) => (
            <div key={item.title} className="flex justify-between">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <p className="mt-2 font-bold text-lg">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <h3 className="font-medium mb-2">Payment Method</h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 p-2 border rounded ${
                paymentMethod === "card" ? "bg-black text-white" : ""
              }`}
            >
              💳 Card
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("crypto")}
              className={`flex-1 p-2 border rounded ${
                paymentMethod === "crypto" ? "bg-black text-white" : ""
              }`}
            >
              🦊 Crypto
            </button>
          </div>
        </div>

        {/* WALLET */}
        {paymentMethod === "crypto" && (
          <div className="text-sm bg-gray-50 p-2 rounded border">
            {walletAddress ? (
              <p className="text-green-600">
                Connected: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </p>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                className="text-blue-600 underline"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}

        {/* BILLING */}
        <div className="space-y-2">
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex gap-2">
            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
            <input
              name="zip"
              placeholder="ZIP"
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* PAYMENT UI */}
        <div className="border p-3 rounded text-sm">
          {paymentMethod === "card" ? (
            <CardElement />
          ) : (
            <p>MetaMask will open to confirm payment</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading
            ? paymentMethod === "crypto"
              ? "Confirm in MetaMask..."
              : "Processing..."
            : paymentMethod === "crypto"
              ? "Pay with MetaMask"
              : "Place Order"}
        </button>

        {/* ERROR */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
