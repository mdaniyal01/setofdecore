import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">Privacy Policy</h1>
      <div className="mt-8 space-y-5 text-sm text-ink/80">
        <p>
          We collect the information needed to process your order — name, phone number, address,
          and email if you provide one — and use it only to fulfil, ship, and support your order.
        </p>
        <p>
          We do not sell your personal information. Order and account data is stored securely and
          accessed only by staff who need it to do their job.
        </p>
        <p>
          You can ask us to update or delete your account information at any time by contacting
          us.
        </p>
        <p className="text-xs text-taupe">
          [Placeholder content — have this reviewed against Pakistani data-protection
          requirements and your actual data practices (analytics, cookies, third-party services)
          before launch.]
        </p>
      </div>
    </main>
  );
}
