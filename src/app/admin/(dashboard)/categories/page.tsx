"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, displayOrder: categories.length }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ name: "", description: "" });
      load();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Categories</h1>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-xl gap-3 border border-black/10 bg-white p-4">
        <input
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 border border-black/15 px-3 py-2 text-sm"
        />
        <input
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex-1 border border-black/15 px-3 py-2 text-sm"
        />
        <button type="submit" disabled={saving} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          Add
        </button>
      </form>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Slug</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-black/50">/{c.slug}</td>
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
