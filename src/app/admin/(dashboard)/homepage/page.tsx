"use client";

import { useEffect, useState } from "react";

export default function AdminHomepagePage() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((data) => setForm(data.settings));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  if (!form) return <p className="text-sm text-black/50">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-medium">Homepage</h1>
      <p className="mt-1 text-sm text-black/50">Edit the announcement bar and hero section without touching code.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-6">
        <section className="space-y-3 border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Announcement Bar</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.announcementEnabled} onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })} />
            Enabled
          </label>
          <Field label="Text" value={form.announcementText} onChange={(v) => setForm({ ...form, announcementText: v })} />
          <Field label="Link (optional)" value={form.announcementLink} onChange={(v) => setForm({ ...form, announcementLink: v })} />
        </section>

        <section className="space-y-3 border border-black/10 bg-white p-5">
          <p className="text-sm font-medium">Hero Section</p>
          <Field label="Heading" value={form.heroHeading} onChange={(v) => setForm({ ...form, heroHeading: v })} />
          <div>
            <label className="text-sm text-black/60">Subtext</label>
            <textarea
              value={form.heroSubtext ?? ""}
              onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
              rows={2}
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary Button Text" value={form.heroPrimaryButtonText} onChange={(v) => setForm({ ...form, heroPrimaryButtonText: v })} />
            <Field label="Primary Button URL" value={form.heroPrimaryButtonUrl} onChange={(v) => setForm({ ...form, heroPrimaryButtonUrl: v })} />
            <Field label="Secondary Button Text" value={form.heroSecondaryButtonText} onChange={(v) => setForm({ ...form, heroSecondaryButtonText: v })} />
            <Field label="Secondary Button URL" value={form.heroSecondaryButtonUrl} onChange={(v) => setForm({ ...form, heroSecondaryButtonUrl: v })} />
          </div>
        </section>

        <button type="submit" disabled={saving} className="bg-black px-6 py-2.5 text-sm text-white hover:opacity-90">
          {saving ? "Saving…" : "Save Homepage"}
        </button>
        {saved && <span className="ml-3 text-sm text-green-700">Saved — refresh the homepage to see it live.</span>}
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
