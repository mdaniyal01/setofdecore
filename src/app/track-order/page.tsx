"use client";

import { useState } from "react";

const STATUS_TIMELINE = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  awaiting_confirmation: "Awaiting Confirmation",
  confirmed: "Order Confirmed",
  processing: "Preparing",
  procurement: "Procurement",
  quality_check: "Quality Check",
  packaging: "Packaging",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
  failed_delivery: "Failed Delivery",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const res = await fetch(
      `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
    );
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      setOrder(data.order);
    }
    setLoading(false);
  }

  const currentIndex = order ? STATUS_TIMELINE.indexOf(order.orderStatus) : -1;
  const isExceptionStatus =
    order && !STATUS_TIMELINE.includes(order.orderStatus);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-display text-3xl">Track Your Order</h1>
      <p className="mt-2 text-taupe">Enter your order number and phone number.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number (e.g. SD1001)"
          required
          className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
          className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {order && (
        <div className="mt-10 border-t border-ink/10 pt-8">
          <p className="text-sm text-taupe">Order #{order.orderNumber}</p>

          {isExceptionStatus ? (
            <p className="mt-4 text-ink">
              Current status: <span className="font-medium">{STATUS_LABELS[order.orderStatus]}</span>
            </p>
          ) : (
            <ol className="mt-6 space-y-4">
              {STATUS_TIMELINE.map((status, i) => (
                <li key={status} className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      i <= currentIndex ? "bg-ink" : "bg-ink/15"
                    }`}
                  />
                  <span className={i <= currentIndex ? "text-ink" : "text-taupe"}>
                    {STATUS_LABELS[status]}
                  </span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-8 space-y-1 text-sm text-ink/70">
            <p>Total: Rs. {order.total?.toLocaleString()}</p>
            <p>Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
          </div>
        </div>
      )}
    </main>
  );
}
