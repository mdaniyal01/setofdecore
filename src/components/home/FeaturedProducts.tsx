"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    fetch("/api/products?sort=featured&limit=8")
      .then((r) => r.json())
      .then((data) => setProducts((data.data ?? []).filter((p: any) => p.featured)));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-bgSecondary py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl">Featured</h2>
          <p className="mt-2 text-taupe">A few of our favourites right now.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
