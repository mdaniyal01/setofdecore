"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WORKFLOW_STATUSES = [
  "confirmed",
  "processing",
  "procurement",
  "quality_check",
  "packaging",
  "packed",
];

const NEXT_STATUS: Record<string, string> = {
  confirmed: "processing",
  processing: "procurement",
  procurement: "quality_check",
  quality_check: "packaging",
  packaging: "packed",
  packed: "shipped",
};

export default function ProcurementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    Promise.all(
      WORKFLOW_STATUSES.map((s) =>
        fetch(`/api/admin/orders?status=${s}`)
          .then((r) => r.json())
          .then((data) => data.data ?? [])
      )
    )
      .then((results) => setOrders(results.flat()))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function advance(orderNumber: string, currentStatus: string) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: next }),
    });
    load();
  }

  const grouped = WORKFLOW_STATUSES.map((status) => ({
    status,
    orders: orders.filter((o) => o.orderStatus === status),
  }));

  return (
    <div>
      <h1 className="text-xl font-medium">Procurement &amp; Packaging</h1>
      <p className="mt-1 text-sm text-black/50">
        Orders move left to right as you source, check, and pack each item.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-black/50">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {grouped.map((col) => (
            <div key={col.status} className="border border-black/10 bg-white">
              <p className="border-b border-black/10 px-3 py-2 text-xs font-medium capitalize text-black/60">
                {col.status.replace(/_/g, " ")} ({col.orders.length})
              </p>
              <div className="space-y-2 p-2">
                {col.orders.length === 0 && (
                  <p className="px-1 py-3 text-center text-xs text-black/30">Empty</p>
                )}
                {col.orders.map((o) => (
                  <div key={o.orderNumber} className="border border-black/10 p-2 text-xs">
                    <Link href={`/admin/orders/${o.orderNumber}`} className="font-medium hover:underline">
                      #{o.orderNumber}
                    </Link>
                    <p className="mt-0.5 text-black/50">
                      {o.shippingAddress?.fullName || o.guestInfo?.name}
                    </p>
                    {NEXT_STATUS[col.status] && (
                      <button
                        onClick={() => advance(o.orderNumber, col.status)}
                        className="mt-2 w-full border border-black/15 py-1 text-black/70 hover:bg-black/5"
                      >
                        Move to {NEXT_STATUS[col.status].replace(/_/g, " ")} →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
