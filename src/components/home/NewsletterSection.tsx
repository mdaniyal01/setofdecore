"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-2xl">Join the Set of Decore</h2>
        <p className="mt-2 text-taupe">New arrivals and styling ideas, occasionally in your inbox.</p>

        {status === "done" ? (
          <p className="mt-6 text-sm">You&apos;re on the list — thank you.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm gap-2">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-ink/20 bg-white px-4 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending" ? "…" : "Join"}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-sm text-red-700">Something went wrong. Try again.</p>}
      </motion.div>
    </section>
  );
}
