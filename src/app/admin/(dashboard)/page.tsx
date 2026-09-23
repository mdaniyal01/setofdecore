"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-red-50 text-red-700",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-sm text-black/50">Loading…</p>;

  const cards = [
    { label: "Total Revenue", value: `Rs. ${data.cards.totalRevenue.toLocaleString()}` },
    { label: "Total Orders", value: data.cards.totalOrders },
    { label: "Pending Orders", value: data.cards.pendingOrders },
    { label: "Delivered", value: data.cards.deliveredOrders },
    { label: "Cancelled", value: data.cards.cancelledOrders },
    { label: "Returned", value: data.cards.returnedOrders },
    { label: "Products", value: data.cards.totalProducts },
    { label: "Customers", value: data.cards.totalCustomers },
  ];

  return (
    <div>
      <h1 className="text-xl font-medium">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-black/10 bg-white p-4">
            <p className="text-xs text-black/50">{card.label}</p>
            <p className="mt-1 text-2xl font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/admin/products" className="border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5">
          Add Product
        </Link>
        <Link href="/admin/orders" className="border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5">
          View Orders
        </Link>
        <Link href="/admin/coupons" className="border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5">
          Add Coupon
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-sm font-medium">Recent Orders</p>
        <div className="mt-3 overflow-x-auto border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/50">
              <tr>
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Amount</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-black/40">
                    No orders yet.
                  </td>
                </tr>
              )}
              {data.recentOrders.map((order: any) => (
                <tr key={order.orderNumber} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.orderNumber}`} className="hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.shippingAddress?.fullName || order.guestInfo?.name}
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {new Date(order.createdAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="px-4 py-3">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs capitalize ${
                        STATUS_STYLES[order.orderStatus] ?? "bg-black/5 text-black/60"
                      }`}
                    >
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
