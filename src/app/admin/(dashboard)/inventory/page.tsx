"use client";

import { useEffect, useState } from "react";

const FIELDS = ["available", "reserved", "procurementRequired", "incoming", "damaged", "returned", "unavailable"];

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((data) => setRows(data.inventory ?? []));
  }

  useEffect(load, []);

  async function updateField(id: string, field: string, value: number) {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, [field]: value } : r)));
    setSaving(id);
    await fetch(`/api/admin/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(null);
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Inventory</h1>
      <p className="mt-1 text-sm text-black/50">
        Track sourced-on-demand stock states per product/variant — not a traditional warehouse count.
      </p>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-3 py-3 font-normal">Product</th>
              {FIELDS.map((f) => (
                <th key={f} className="px-3 py-3 font-normal capitalize">{f.replace(/([A-Z])/g, " $1")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={FIELDS.length + 1} className="px-4 py-8 text-center text-black/40">No inventory rows yet.</td></tr>
            )}
            {rows.map((row) => {
              const variant = row.product?.variants?.find((v: any) => v._id === row.variantId);
              return (
                <tr key={row._id} className="border-b border-black/5 last:border-0">
                  <td className="px-3 py-2">
                    {row.product?.name}
                    {variant && <span className="text-black/50"> — {variant.name}</span>}
                  </td>
                  {FIELDS.map((f) => (
                    <td key={f} className="px-3 py-2">
                      <input
                        type="number"
                        value={row[f] ?? 0}
                        onChange={(e) => updateField(row._id, f, Number(e.target.value))}
                        className="w-16 border border-black/15 px-2 py-1 text-sm"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {saving && <p className="mt-2 text-xs text-black/40">Saving…</p>}
    </div>
  );
}
