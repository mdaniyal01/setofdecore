import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">Terms &amp; Conditions</h1>
      <div className="mt-8 space-y-5 text-sm text-ink/80">
        <p>
          By placing an order with Set of Decore, you agree to provide accurate delivery
          information and to be available to receive Cash on Delivery orders at the address
          provided.
        </p>
        <p>
          Product prices, availability, and delivery charges may change without prior notice, but
          any change will never affect an order you&apos;ve already placed.
        </p>
        <p>
          All product descriptions and images aim to represent items accurately; slight variation
          in color or print may occur due to screen display or fabric batch.
        </p>
        <p className="text-xs text-taupe">
          [Placeholder content — have this reviewed by a legal professional and finalized before
          launch.]
        </p>
      </div>
    </main>
  );
}
