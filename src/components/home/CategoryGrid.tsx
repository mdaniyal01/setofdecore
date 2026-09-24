"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl">Shop by Category</h2>
        <p className="mt-2 text-taupe">Find exactly what your room needs.</p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link href={`/category/${c.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden bg-bgSecondary">
                {c.image?.url && (
                  <Image
                    src={c.image.url}
                    alt={c.image.alt || c.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-4">
                  <span className="font-display text-lg text-white">{c.name}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
