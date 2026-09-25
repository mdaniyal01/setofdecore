"use client";

import { useEffect, useState } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  function load(q = "") {
    fetch(`/api/admin/customers?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers ?? []));
  }

  useEffect(() => load(), []);

  return (
    <div>
      <h1 className="text-xl font-medium">Customers</h1>

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          load(e.target.value);
        }}
        placeholder="Search by name, phone, or email…"
        className="mt-4 w-72 border border-black/15 bg-white px-3 py-2 text-sm"
      />

      <div className="mt-4 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Orders</th>
              <th className="px-4 py-3 font-normal">Total Spend</th>
              <th className="px-4 py-3 font-normal">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-black/40">No customers yet.</td></tr>
            )}
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-black/60">{c.phone}</td>
                <td className="px-4 py-3 text-black/60">{c.email || "—"}</td>
                <td className="px-4 py-3">{c.orderCount}</td>
                <td className="px-4 py-3">Rs. {c.totalSpend.toLocaleString()}</td>
                <td className="px-4 py-3 text-black/50">
                  {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-PK") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
