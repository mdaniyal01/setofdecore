"use client";

import { useEffect, useState } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed" | "free_delivery",
    value: 10,
    minOrderAmount: "",
    usageLimit: "",
    endDate: "",
  });

  function load() {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => setCoupons(data.coupons ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        endDate: form.endDate || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ code: "", type: "percentage", value: 10, minOrderAmount: "", usageLimit: "", endDate: "" });
      setShowForm(false);
      load();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Coupons</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Add Coupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 grid max-w-2xl gap-3 border border-black/10 bg-white p-5 sm:grid-cols-2">
          <input required placeholder="Code (e.g. WELCOME10)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border border-black/15 px-3 py-2 text-sm uppercase" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="border border-black/15 bg-white px-3 py-2 text-sm">
            <option value="percentage">Percentage off</option>
            <option value="fixed">Fixed amount off (Rs.)</option>
            <option value="free_delivery">Free delivery</option>
          </select>
          {form.type !== "free_delivery" && (
            <input type="number" placeholder={form.type === "percentage" ? "Percent (e.g. 10)" : "Amount (Rs.)"} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="border border-black/15 px-3 py-2 text-sm" />
          )}
          <input type="number" placeholder="Minimum order (Rs., optional)" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input type="number" placeholder="Usage limit (optional)" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input type="date" placeholder="Expiry date (optional)" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="sm:col-span-2 bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Save Coupon"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Code</th>
              <th className="px-4 py-3 font-normal">Type</th>
              <th className="px-4 py-3 font-normal">Value</th>
              <th className="px-4 py-3 font-normal">Used</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-black/40">No coupons yet.</td></tr>
            )}
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{c.code}</td>
                <td className="px-4 py-3 capitalize text-black/60">{c.type.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `Rs. ${c.value}` : "—"}
                </td>
                <td className="px-4 py-3 text-black/60">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="px-4 py-3">{c.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c._id, c.isActive)} className="text-black/60 hover:underline">
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
