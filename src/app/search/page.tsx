"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQ) return;
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(initialQ)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.data ?? []))
      .finally(() => setLoading(false));
  }, [initialQ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for bedsheets, curtains, sofa covers…"
          className="w-full border border-ink/20 bg-white px-4 py-3 text-sm"
          autoFocus
        />
      </form>

      <div className="mt-10">
        {loading && <p className="text-center text-taupe">Searching…</p>}

        {!loading && initialQ && results.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-ink">No results for &ldquo;{initialQ}&rdquo;.</p>
            <p className="mt-2 text-sm text-taupe">
              Try a different word, or browse{" "}
              <a href="/shop" className="underline">
                all products
              </a>
              .
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
