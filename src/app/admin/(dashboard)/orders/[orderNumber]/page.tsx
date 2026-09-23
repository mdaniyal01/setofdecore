"use client";

import { useEffect, useState } from "react";

const STATUSES = [
  "pending", "awaiting_confirmation", "confirmed", "processing", "procurement",
  "quality_check", "packaging", "packed", "shipped", "out_for_delivery",
  "delivered", "cancelled", "returned", "refunded", "failed_delivery",
];

export default function AdminOrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch(`/api/admin/orders/${params.orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setNewStatus(data.order?.orderStatus ?? "");
        setAdminNotes(data.order?.adminNotes ?? "");
      });
  }

  useEffect(load, [params.orderNumber]);

  async function handleUpdate() {
    setSaving(true);
    await fetch(`/api/admin/orders/${params.orderNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: newStatus, note, adminNotes }),
    });
    setNote("");
    setSaving(false);
    load();
  }

  if (!order) return <p className="text-sm text-black/50">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-medium">Order #{order.orderNumber}</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Items</p>
          <div className="mt-3 space-y-2">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.lineTotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-black/10 pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-Rs. {order.discount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Rs. {order.shippingFee.toLocaleString()}</span></div>
            <div className="flex justify-between font-medium"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
          </div>
        </section>

        <section className="border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Shipping Address</p>
          <div className="mt-3 space-y-1 text-sm text-black/70">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine}</p>
            {order.shippingAddress.area && <p>{order.shippingAddress.area}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
            {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
          </div>
          <p className="mt-4 text-sm font-medium">Payment</p>
          <p className="mt-1 text-sm text-black/70 capitalize">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod} — {order.paymentStatus}
          </p>
        </section>
      </div>

      <section className="mt-6 border border-black/10 bg-white p-5">
        <p className="text-sm font-medium">Update Status</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-black/50">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mt-1 block border border-black/15 bg-white px-3 py-2 text-sm capitalize"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-black/50">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Update"}
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs text-black/50">Admin Notes</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="mt-6 border border-black/10 bg-white p-5">
        <p className="text-sm font-medium">Status History</p>
        <div className="mt-3 space-y-2">
          {order.statusHistory.slice().reverse().map((h: any, i: number) => (
            <div key={i} className="flex justify-between text-sm text-black/70">
              <span className="capitalize">{h.toStatus.replace(/_/g, " ")}{h.note ? ` — ${h.note}` : ""}</span>
              <span className="text-black/40">{new Date(h.changedAt).toLocaleString("en-PK")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
