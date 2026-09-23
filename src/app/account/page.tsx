"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setCustomer(data.customer))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setCustomer(data.customer);
  }

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    setCustomer(null);
  }

  if (loading) return null;

  if (customer) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <h1 className="font-display text-3xl">Hi, {customer.name}</h1>
        <p className="mt-2 text-taupe">{customer.phone}</p>

        <div className="mt-8 flex gap-4">
          <Link href="/account/orders" className="border border-ink px-6 py-3 text-sm transition hover:bg-ink hover:text-white">
            My Orders
          </Link>
          <Link href="/account/wishlist" className="border border-ink px-6 py-3 text-sm transition hover:bg-ink hover:text-white">
            My Wishlist
          </Link>
        </div>

        <button onClick={handleLogout} className="mt-8 text-sm text-taupe hover:text-ink">
          Log out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl">{mode === "login" ? "Log In" : "Create Account"}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "register" && (
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
          />
        )}
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
        />
        {mode === "register" && (
          <input
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
          />
        )}
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
        />

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button type="submit" className="w-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">
          {mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-sm text-taupe hover:text-ink"
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
      </button>

      <p className="mt-8 text-xs text-taupe">
        You can also{" "}
        <Link href="/checkout" className="underline">
          checkout as a guest
        </Link>{" "}
        without an account.
      </p>
    </main>
  );
}
