import Link from "next/link";

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderNumber?: string };
}) {
  const orderNumber = searchParams.orderNumber;

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Thank you for your order.</h1>
      {orderNumber && (
        <p className="mt-4 text-lg">
          Order number <span className="font-medium">#{orderNumber}</span>
        </p>
      )}
      <p className="mt-3 text-taupe">
        We&apos;ll confirm your order shortly. You can track its progress anytime using your
        order number and phone number.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/track-order"
          className="border border-ink px-6 py-3 text-sm font-medium transition hover:bg-ink hover:text-white"
        >
          Track Order
        </Link>
        <Link
          href="/shop"
          className="bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
