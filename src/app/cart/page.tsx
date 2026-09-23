"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-taupe">Nothing here yet — go find something you like.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-ink px-6 py-3 text-sm font-medium transition hover:bg-ink hover:text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl">Your Cart</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="divide-y divide-ink/10">
          {lines.map((line) => (
            <div key={`${line.productId}-${line.variantId ?? "base"}`} className="flex gap-4 py-6">
              <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-bgSecondary">
                {line.image && (
                  <Image src={line.image} alt={line.name} fill className="object-cover" />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/product/${line.slug}`} className="text-sm">
                    {line.name}
                  </Link>
                  <button
                    onClick={() => removeLine(line.productId, line.variantId)}
                    className="text-xs text-taupe hover:text-ink"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-ink/20">
                    <button
                      onClick={() => updateQuantity(line.productId, line.variantId, line.quantity - 1)}
                      className="px-2.5 py-1 text-ink/70 hover:text-ink"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.productId, line.variantId, line.quantity + 1)}
                      className="px-2.5 py-1 text-ink/70 hover:text-ink"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm">
                    Rs. {(line.unitPrice * line.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-ink/10 p-6">
          <div className="flex justify-between text-sm">
            <span className="text-ink/70">Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-xs text-taupe">
            Delivery fee and any coupon discount are calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-6 block bg-ink px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
          >
            Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
