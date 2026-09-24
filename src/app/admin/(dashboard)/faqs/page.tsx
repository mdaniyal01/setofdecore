"use client";

import { useEffect, useState } from "react";

const CATEGORIES = ["Ordering", "Delivery", "Payment", "Returns", "Product Care", "Sizing", "Packaging"];

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [form, setForm] = useState({ category: CATEGORIES[0], question: "", answer: "" });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function load() {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(data.faqs ?? []));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ category: CATEGORIES[0], question: "", answer: "" });
      setShowForm(false);
      load();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">FAQs</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Add FAQ"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 max-w-2xl space-y-3 border border-black/10 bg-white p-5">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-black/15 bg-white px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input required placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <textarea required placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
            {saving ? "Saving…" : "Save FAQ"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-2">
        {faqs.length === 0 && <p className="text-sm text-black/40">No FAQs yet.</p>}
        {faqs.map((f) => (
          <div key={f._id} className="flex items-start justify-between border border-black/10 bg-white p-4">
            <div>
              <p className="text-xs text-black/40">{f.category}</p>
              <p className="mt-1 text-sm font-medium">{f.question}</p>
              <p className="mt-1 text-sm text-black/60">{f.answer}</p>
            </div>
            <button onClick={() => toggleActive(f._id, f.isActive)} className="whitespace-nowrap text-sm text-black/60 hover:underline">
              {f.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
