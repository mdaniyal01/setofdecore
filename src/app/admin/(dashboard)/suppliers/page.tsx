"use client";

import { useEffect, useState } from "react";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({
    supplierName: "",
    businessName: "",
    phone: "",
    city: "",
    address: "",
    paymentTerms: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function load() {
    fetch("/api/admin/suppliers")
      .then((r) => r.json())
      .then((data) => setSuppliers(data.suppliers ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ supplierName: "", businessName: "", phone: "", city: "", address: "", paymentTerms: "", notes: "" });
      setShowForm(false);
      load();
    }
  }

  async function toggleStatus(id: string, status: string) {
    await fetch(`/api/admin/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "active" ? "inactive" : "active" }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Suppliers</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Add Supplier"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 grid max-w-2xl gap-3 border border-black/10 bg-white p-5 sm:grid-cols-2">
          <input required placeholder="Supplier Name" value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Business Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="sm:col-span-2 border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="sm:col-span-2 bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Save Supplier"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Business</th>
              <th className="px-4 py-3 font-normal">Phone</th>
              <th className="px-4 py-3 font-normal">City</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-black/40">No suppliers yet.</td></tr>
            )}
            {suppliers.map((s) => (
              <tr key={s._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{s.supplierName}</td>
                <td className="px-4 py-3 text-black/60">{s.businessName || "—"}</td>
                <td className="px-4 py-3 text-black/60">{s.phone}</td>
                <td className="px-4 py-3 text-black/60">{s.city || "—"}</td>
                <td className="px-4 py-3 capitalize">{s.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(s._id, s.status)} className="text-black/60 hover:underline">
                    {s.status === "active" ? "Deactivate" : "Activate"}
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
