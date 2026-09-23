import { Metadata } from "next";

export const metadata: Metadata = { title: "Return Policy" };

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">Return Policy</h1>
      <div className="mt-8 space-y-5 text-sm text-ink/80">
        <p>
          If a product arrives damaged, defective, or different from what you ordered, you can
          request a return or exchange from your account or by contacting us with your order
          number and photos of the issue.
        </p>
        <p>
          Once approved, we&apos;ll arrange for the product to be picked up or returned, and process
          an exchange or refund after it&apos;s received and checked.
        </p>
        <p className="text-xs text-taupe">
          [Placeholder content — replace with final return window (e.g. number of days),
          condition requirements, and refund timelines before launch.]
        </p>
      </div>
    </main>
  );
}
