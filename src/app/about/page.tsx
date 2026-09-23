import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Set of Decore is a home textiles and décor brand based in Lahore, Pakistan.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">About Set of Decore</h1>

      <div className="mt-8 space-y-5 text-ink/80">
        <p>
          Set of Decore is a home textiles brand built around a simple idea: small details can
          completely change how a room feels. We work with a trusted supplier network in Lahore
          to bring bedsheets, sofa covers, curtains, and cushion covers to homes across Pakistan.
        </p>
        <p>
          Every order is checked, packed with branded packaging, and dispatched with a thank-you
          card — because how something arrives matters just as much as what arrives.
        </p>
        <p>
          We&apos;re starting in Lahore and shipping nationwide, with plans to grow our collection
          of home accessories and décor over time.
        </p>
      </div>
    </main>
  );
}
