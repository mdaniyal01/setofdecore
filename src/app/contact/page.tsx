"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", orderNumber: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) setForm({ name: "", email: "", phone: "", subject: "", message: "", orderNumber: "" });
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl">Contact Us</h1>
      <p className="mt-2 text-taupe">
        Have a question about an order or a product? Send us a message.
      </p>

      {status === "sent" ? (
        <p className="mt-8 border border-ink/10 p-6 text-sm">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-ink/20 bg-white px-4 py-3 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-ink/20 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-ink/20 bg-white px-4 py-3 text-sm"
            />
            <input
              placeholder="Order Number (optional)"
              value={form.orderNumber}
              onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
              className="border border-ink/20 bg-white px-4 py-3 text-sm"
            />
          </div>
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
          />
          <textarea
            required
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
          />
          {status === "error" && (
            <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </main>
  );
}
