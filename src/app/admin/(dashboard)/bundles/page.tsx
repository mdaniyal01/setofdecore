"use client";

import { useEffect, useState } from "react";

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bundlePrice, setBundlePrice] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});

  function load() {
    fetch("/api/admin/bundles")
      .then((r) => r.json())
      .then((data) => setBundles(data.bundles ?? []));
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.data ?? []));
  }

  useEffect(load, []);

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const items = Object.entries(selected).map(([product, quantity]) => ({ product, quantity }));
    const res = await fetch("/api/admin/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bundlePrice, items }),
    });
    setSaving(false);
    if (res.ok) {
      setName("");
      setBundlePrice(0);
      setSelected({});
      setShowForm(false);
      load();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Bundles</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          {showForm ? "Cancel" : "Create Bundle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 max-w-xl space-y-3 border border-black/10 bg-white p-5">
          <input required placeholder="Bundle name (e.g. Bedroom Refresh Set)" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-black/15 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Bundle price (Rs.)" value={bundlePrice} onChange={(e) => setBundlePrice(Number(e.target.value))} className="w-full border border-black/15 px-3 py-2 text-sm" />

          <div>
            <p className="text-sm text-black/60">Select products to include</p>
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto border border-black/10 p-2">
              {products.map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!selected[p._id]} onChange={() => toggleProduct(p._id)} />
                  {p.name} — Rs. {p.basePrice}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving || Object.keys(selected).length === 0} className="bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving…" : "Create Bundle"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {bundles.length === 0 && <p className="text-sm text-black/40">No bundles yet.</p>}
        {bundles.map((b) => (
          <div key={b._id} className="border border-black/10 bg-white p-4">
            <p className="text-sm font-medium">{b.name} — Rs. {b.bundlePrice.toLocaleString()}</p>
            <p className="mt-1 text-sm text-black/60">
              {b.items.map((i: any) => `${i.quantity}× ${i.product?.name}`).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
