"use client";

import { motion } from "framer-motion";

const BENEFITS = [
  { title: "Thoughtfully Selected", description: "Products chosen to complement everyday spaces." },
  { title: "Comfort Meets Style", description: "Beautiful home textiles for everyday living." },
  { title: "Carefully Packed", description: "Every order receives thoughtful preparation and branded packaging." },
  { title: "Easy Ordering", description: "A simple experience from discovery to delivery." },
];

export default function BrandBenefits() {
  return (
    <section className="border-y border-ink/10 bg-bgSecondary">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="font-display text-lg">{b.title}</p>
              <p className="mt-2 text-sm text-ink/70">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
