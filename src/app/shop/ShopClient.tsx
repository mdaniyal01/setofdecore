"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedProductGrid from "@/components/AnimatedProductGrid";
import { ProductCardData } from "@/components/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default function ShopClient({
  initialProducts,
  initialSort,
}: {
  initialProducts: ProductCardData[];
  initialSort: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sort === initialSort) return;
    setLoading(true);
    fetch(`/api/products?sort=${sort}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data ?? []))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6"
      >
        <div>
          <h1 className="font-display text-3xl">Shop All</h1>
          <p className="mt-1 text-sm text-taupe">{products.length} products</p>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-ink/20 bg-white px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </motion.div>

      <div className="mt-10">
        {!loading && products.length === 0 && (
          <p className="col-span-full py-16 text-center text-taupe">
            No products to show yet — check back soon.
          </p>
        )}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-bgSecondary" />
                <div className="mt-3 h-3 w-3/4 bg-bgSecondary" />
                <div className="mt-2 h-3 w-1/3 bg-bgSecondary" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatedProductGrid products={products} />
        )}
      </div>
    </main>
  );
}
