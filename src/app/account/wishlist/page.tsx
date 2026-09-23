"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/account/wishlist")
      .then(async (r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return { wishlist: [] };
        }
        return r.json();
      })
      .then((data) => setItems(data.wishlist ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (unauthorized) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-ink">Please log in to view your wishlist.</p>
        <Link href="/account" className="mt-4 inline-block underline">
          Go to account
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl">My Wishlist</h1>

      {items.length === 0 && <p className="mt-8 text-taupe">Your wishlist is empty.</p>}

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
