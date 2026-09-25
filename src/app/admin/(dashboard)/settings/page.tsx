"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json();
          setError(data.error);
          return { settings: null };
        }
        return r.json();
      })
      .then((data) => setForm(data.settings));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!form) return <p className="text-sm text-black/50">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-medium">Settings</h1>
      <p className="mt-1 text-sm text-black/50">Super Admin only. Store-wide configuration.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-6">
        <section className="space-y-3 border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">General</p>
          <Field label="Brand Name" value={form.brandName} onChange={(v) => setForm({ ...form, brandName: v })} />
          <Field label="WhatsApp Number (with country code)" value={form.whatsappNumber} onChange={(v) => setForm({ ...form, whatsappNumber: v })} />
          <Field label="Support Email" value={form.supportEmail} onChange={(v) => setForm({ ...form, supportEmail: v })} />
          <Field label="Support Phone" value={form.supportPhone} onChange={(v) => setForm({ ...form, supportPhone: v })} />
        </section>

        <section className="space-y-3 border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Social Links</p>
          <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => setForm({ ...form, instagramUrl: v })} />
          <Field label="Facebook URL" value={form.facebookUrl} onChange={(v) => setForm({ ...form, facebookUrl: v })} />
          <Field label="TikTok URL" value={form.tiktokUrl} onChange={(v) => setForm({ ...form, tiktokUrl: v })} />
        </section>

        <section className="space-y-3 border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Shipping &amp; Checkout</p>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Free Shipping Threshold (Rs.)" value={form.freeShippingThreshold} onChange={(v) => setForm({ ...form, freeShippingThreshold: v })} />
            <NumberField label="Standard Shipping Fee (Rs.)" value={form.standardShippingFee} onChange={(v) => setForm({ ...form, standardShippingFee: v })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.codEnabled} onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })} />
            Cash on Delivery enabled
          </label>
        </section>

        <button type="submit" disabled={saving} className="bg-black px-6 py-2.5 text-sm text-white hover:opacity-90">
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && <span className="ml-3 text-sm text-green-700">Saved.</span>}
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-black/60">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-black/15 px-3 py-2 text-sm" />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-sm text-black/60">{label}</label>
      <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full border border-black/15 px-3 py-2 text-sm" />
    </div>
  );
}
