"use client";

import { motion } from "framer-motion";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export default function AnimatedProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.05, ease: "easeOut" }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
