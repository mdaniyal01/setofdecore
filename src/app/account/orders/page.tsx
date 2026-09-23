"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/account/orders")
      .then(async (r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return { orders: [] };
        }
        return r.json();
      })
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (unauthorized) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-ink">Please log in to view your orders.</p>
        <Link href="/account" className="mt-4 inline-block underline">
          Go to account
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl">My Orders</h1>

      {orders.length === 0 && <p className="mt-8 text-taupe">You haven&apos;t placed any orders yet.</p>}

      <div className="mt-8 divide-y divide-ink/10">
        {orders.map((order) => (
          <div key={order.orderNumber} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm">#{order.orderNumber}</p>
              <p className="text-xs text-taupe">
                {new Date(order.createdAt).toLocaleDateString("en-PK")}
              </p>
            </div>
            <p className="text-sm capitalize">{order.orderStatus.replace(/_/g, " ")}</p>
            <p className="text-sm">Rs. {order.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
