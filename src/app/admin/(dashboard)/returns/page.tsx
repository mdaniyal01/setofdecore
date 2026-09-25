"use client";

import { useEffect, useState } from "react";

const STATUSES = ["requested", "approved", "rejected", "info_requested", "received", "exchanged", "refunded"];

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);

  function load() {
    fetch("/api/admin/returns")
      .then((r) => r.json())
      .then((data) => setReturns(data.returns ?? []));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/returns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Returns &amp; Exchanges</h1>

      <div className="mt-6 space-y-3">
        {returns.length === 0 && <p className="text-sm text-black/40">No return requests yet.</p>}
        {returns.map((r) => (
          <div key={r._id} className="border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">Order #{r.orderNumber} — {r.product?.name}</p>
                <p className="mt-0.5 text-xs capitalize text-black/50">{r.type.replace("_", " ")} · {r.reason}</p>
                {r.description && <p className="mt-1 text-sm text-black/70">{r.description}</p>}
              </div>
              <select
                value={r.status}
                onChange={(e) => updateStatus(r._id, e.target.value)}
                className="border border-black/15 bg-white px-2 py-1 text-xs capitalize"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <p className="mt-2 text-xs text-black/40">{new Date(r.createdAt).toLocaleString("en-PK")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
