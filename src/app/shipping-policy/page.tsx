import { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">Shipping Policy</h1>
      <div className="mt-8 space-y-5 text-sm text-ink/80">
        <p>
          Set of Decore delivers nationwide across Pakistan via courier. Orders are confirmed by
          phone, sourced from our supplier, quality checked, and packed with branded packaging
          before dispatch.
        </p>
        <p>
          Delivery times vary by city and product availability. You&apos;ll receive updates as your
          order moves through confirmation, packaging, and dispatch, and you can check progress
          anytime on the Track Order page.
        </p>
        <p>
          Delivery charges, where applicable, are shown at checkout before you place your order.
        </p>
        <p className="text-xs text-taupe">
          [Placeholder content — replace with final shipping terms, delivery timeframes per
          city/region, and courier partner details before launch.]
        </p>
      </div>
    </main>
  );
}
