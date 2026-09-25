"use client";

import { useEffect, useState } from "react";

const ROLES = ["super_admin", "store_manager", "order_manager", "content_manager", "marketing_manager", "support_agent"];

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "support_agent" });

  function load() {
    fetch("/api/admin/admin-users")
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json();
          setError(data.error);
          return { admins: [] };
        }
        return r.json();
      })
      .then((data) => setAdmins(data.admins ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ name: "", email: "", password: "", role: "support_agent" });
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/admin-users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Admin Users</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Add Admin"}
        </button>
      </div>
      <p className="mt-1 text-sm text-black/50">Super Admin only.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 grid max-w-xl gap-3 border border-black/10 bg-white p-5 sm:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border border-black/15 px-3 py-2 text-sm" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border border-black/15 bg-white px-3 py-2 text-sm">
            {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
          </select>
          <button type="submit" disabled={saving} className="sm:col-span-2 bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Create Admin User"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3 text-black/60">{a.email}</td>
                <td className="px-4 py-3 capitalize">{a.role.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">{a.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(a._id, a.isActive)} className="text-black/60 hover:underline">
                    {a.isActive ? "Deactivate" : "Activate"}
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
