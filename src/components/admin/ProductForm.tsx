"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    shortDescription: "",
    description: "",
    basePrice: 0,
    salePrice: undefined as number | undefined,
    costPrice: undefined as number | undefined,
    categories: [] as string[],
    material: "",
    careInstructions: "",
    supplierProductCode: "",
    supplierCost: undefined as number | undefined,
    internalNotes: "",
    featured: false,
    newArrival: false,
    status: "draft" as "draft" | "published" | "unpublished" | "scheduled",
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.product;
        setForm({
          name: p.name,
          sku: p.sku,
          shortDescription: p.shortDescription ?? "",
          description: p.description ?? "",
          basePrice: p.basePrice,
          salePrice: p.salePrice,
          costPrice: p.costPrice,
          categories: (p.categories ?? []).map((c: any) => c.toString?.() ?? c),
          material: p.material ?? "",
          careInstructions: p.careInstructions ?? "",
          supplierProductCode: p.supplierProductCode ?? "",
          supplierCost: p.supplierCost,
          internalNotes: p.internalNotes ?? "",
          featured: p.featured,
          newArrival: p.newArrival,
          status: p.status,
        });
      })
      .finally(() => setLoading(false));
  }, [productId]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
  }

  if (loading) return <p className="text-sm text-black/50">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Basic Information</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledInput label="Product Name" value={form.name} onChange={(v) => update("name", v)} required />
          <LabeledInput label="SKU" value={form.sku} onChange={(v) => update("sku", v)} required />
        </div>
        <LabeledInput label="Short Description" value={form.shortDescription} onChange={(v) => update("shortDescription", v)} />
        <div>
          <label className="text-sm text-black/60">Full Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Pricing</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledNumber label="Base Price (Rs.)" value={form.basePrice} onChange={(v) => update("basePrice", v)} required />
          <LabeledNumber label="Sale Price (optional)" value={form.salePrice} onChange={(v) => update("salePrice", v)} />
          <LabeledNumber label="Cost Price (internal)" value={form.costPrice} onChange={(v) => update("costPrice", v)} />
        </div>
      </section>

      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={form.categories.includes(c._id)}
                onChange={(e) =>
                  update(
                    "categories",
                    e.target.checked
                      ? [...form.categories, c._id]
                      : form.categories.filter((id) => id !== c._id)
                  )
                }
              />
              {c.name}
            </label>
          ))}
          {categories.length === 0 && <p className="text-sm text-black/40">No categories yet — add one first.</p>}
        </div>
      </section>

      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Product Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledInput label="Material" value={form.material} onChange={(v) => update("material", v)} />
          <LabeledInput label="Care Instructions" value={form.careInstructions} onChange={(v) => update("careInstructions", v)} />
        </div>
      </section>

      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Supplier (internal — never shown to customers)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledInput label="Supplier Product Code" value={form.supplierProductCode} onChange={(v) => update("supplierProductCode", v)} />
          <LabeledNumber label="Supplier Cost (Rs.)" value={form.supplierCost} onChange={(v) => update("supplierCost", v)} />
        </div>
        <div>
          <label className="text-sm text-black/60">Internal Notes</label>
          <textarea
            value={form.internalNotes}
            onChange={(e) => update("internalNotes", e.target.value)}
            rows={2}
            className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="space-y-4 border border-black/10 bg-white p-6">
        <p className="text-sm font-medium">Publishing</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.newArrival} onChange={(e) => update("newArrival", e.target.checked)} />
            New Arrival
          </label>
        </div>
        <div>
          <label className="text-sm text-black/60">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as typeof form.status)}
            className="mt-1 w-full max-w-xs border border-black/15 bg-white px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-black px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-black/60">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
      />
    </div>
  );
}

function LabeledNumber({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-black/60">{label}</label>
      <input
        type="number"
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
      />
    </div>
  );
}
