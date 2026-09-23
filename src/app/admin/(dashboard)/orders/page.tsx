"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUSES = [
  "pending", "confirmed", "processing", "procurement", "quality_check",
  "packaging", "packed", "shipped", "out_for_delivery", "delivered",
  "cancelled", "returned", "refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  function load() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.data ?? []));
  }

  useEffect(load, [status]);

  return (
    <div>
      <h1 className="text-xl font-medium">Orders</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search order #, name, phone…"
          className="w-64 border border-black/15 bg-white px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-black/15 bg-white px-3 py-2 text-sm capitalize"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Order</th>
              <th className="px-4 py-3 font-normal">Customer</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">Amount</th>
              <th className="px-4 py-3 font-normal">Payment</th>
              <th className="px-4 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black/40">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.orderNumber} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.orderNumber}`} className="hover:underline">
                    #{o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.shippingAddress?.fullName || o.guestInfo?.name}</td>
                <td className="px-4 py-3 text-black/60">{o.shippingAddress?.phone || o.guestInfo?.phone}</td>
                <td className="px-4 py-3">Rs. {o.total.toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{o.paymentStatus}</td>
                <td className="px-4 py-3 capitalize">{o.orderStatus.replace(/_/g, " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
