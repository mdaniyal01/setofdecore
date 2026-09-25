"use client";

import { useEffect, useState } from "react";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", discountPercent: "", startDate: "", endDate: "" });

  function load() {
    fetch("/api/admin/campaigns")
      .then((r) => r.json())
      .then((data) => setCampaigns(data.campaigns ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ name: "", description: "", discountPercent: "", startDate: "", endDate: "" });
      setShowForm(false);
      load();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Campaigns</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Add Campaign"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 grid max-w-2xl gap-3 border border-black/10 bg-white p-5 sm:grid-cols-2">
          <input required placeholder="Name (e.g. Eid Collection)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
          <input type="number" placeholder="Discount % (optional)" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <div />
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="sm:col-span-2 bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Save Campaign"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Discount</th>
              <th className="px-4 py-3 font-normal">Window</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-black/40">No campaigns yet.</td></tr>
            )}
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-black/60">{c.discountPercent ? `${c.discountPercent}%` : "—"}</td>
                <td className="px-4 py-3 text-black/50 text-xs">
                  {c.startDate ? new Date(c.startDate).toLocaleDateString("en-PK") : "—"} – {c.endDate ? new Date(c.endDate).toLocaleDateString("en-PK") : "—"}
                </td>
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
