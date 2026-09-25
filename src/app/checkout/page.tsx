"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { trackBeginCheckout } from "@/lib/analytics";

const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"];

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "Punjab",
    city: "",
    area: "",
    addressLine: "",
    landmark: "",
    postalCode: "",
    customerNotes: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lines.length > 0) trackBeginCheckout(subtotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
          couponCode: couponCode || undefined,
          paymentMethod: "cod",
          guestInfo: { name: form.fullName, phone: form.phone, email: form.email || undefined },
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            province: form.province,
            city: form.city,
            area: form.area || undefined,
            addressLine: form.addressLine,
            landmark: form.landmark || undefined,
            postalCode: form.postalCode || undefined,
          },
          customerNotes: form.customerNotes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong while placing your order. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}&total=${data.total}`);
    } catch {
      setError("Something went wrong while placing your order. Please try again.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-taupe">Add something to your cart before checking out.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl">Checkout</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required type="tel" />
          </div>
          <Field label="Email (optional)" value={form.email} onChange={(v) => update("email", v)} type="email" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink/70">Province</label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="mt-1 w-full border border-ink/20 bg-white px-3 py-2 text-sm"
              >
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Area" value={form.area} onChange={(v) => update("area", v)} />
            <Field label="Postal Code" value={form.postalCode} onChange={(v) => update("postalCode", v)} />
          </div>

          <Field label="Complete Address" value={form.addressLine} onChange={(v) => update("addressLine", v)} required />
          <Field label="Landmark" value={form.landmark} onChange={(v) => update("landmark", v)} />

          <div>
            <label className="text-sm text-ink/70">Delivery Notes (optional)</label>
            <textarea
              value={form.customerNotes}
              onChange={(e) => update("customerNotes", e.target.value)}
              rows={3}
              className="mt-1 w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="border border-ink/10 p-4">
            <p className="text-sm font-medium">Payment Method</p>
            <p className="mt-1 text-sm text-ink/70">Cash on Delivery</p>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
        </form>

        <aside className="h-fit border border-ink/10 p-6">
          <p className="text-sm font-medium">Order Summary</p>
          <div className="mt-4 space-y-2">
            {lines.map((l) => (
              <div key={`${l.productId}-${l.variantId ?? "base"}`} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {l.name} × {l.quantity}
                </span>
                <span>Rs. {(l.unitPrice * l.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border border-ink/20 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 text-sm">
            <span className="text-ink/70">Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-xs text-taupe">
            Final total (with delivery fee and any coupon) is confirmed on the next screen.
          </p>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-ink/70">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-ink/20 bg-white px-3 py-2 text-sm"
      />
    </div>
  );
}
