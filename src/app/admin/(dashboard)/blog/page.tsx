"use client";

import { useEffect, useState } from "react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "" });

  function load() {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: "draft" }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ title: "", excerpt: "", content: "", category: "" });
      setShowForm(false);
      load();
    }
  }

  async function toggleStatus(id: string, status: string) {
    await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "published" ? "draft" : "published" }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Blog</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Write Post"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 max-w-2xl space-y-3 border border-black/10 bg-white p-5">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Category (e.g. Buying Guides)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <input placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <textarea required placeholder="Full article content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Save as Draft"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Title</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-black/40">No posts yet.</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 text-black/60">{p.category || "—"}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(p._id, p.status)} className="text-black/60 hover:underline">
                    {p.status === "published" ? "Unpublish" : "Publish"}
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
