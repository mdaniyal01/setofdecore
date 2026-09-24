"use client";

import { motion } from "framer-motion";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import RoomInspiration from "@/components/home/RoomInspiration";
import BrandBenefits from "@/components/home/BrandBenefits";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-bgSecondary px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.55), transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display text-5xl leading-[1.1] md:text-7xl"
          >
            Make Space Beautiful.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mx-auto mt-5 max-w-lg text-taupe md:text-lg"
          >
            Thoughtfully selected home textiles designed to bring comfort and
            character to every corner of your home.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-9 flex flex-wrap justify-center gap-4"
          >
            <a
              href="/shop"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition hover:scale-[1.03] hover:opacity-90"
            >
              Shop Collection
            </a>
            <a
              href="/shop?sort=newest"
              className="rounded-full border border-ink px-7 py-3.5 text-sm font-medium transition hover:scale-[1.03] hover:bg-ink hover:text-white"
            >
              Explore New Arrivals
            </a>
          </motion.div>
        </div>
      </section>

      <CategoryGrid />
      <FeaturedProducts />
      <RoomInspiration />
      <BrandBenefits />
      <NewsletterSection />
    </main>
  );
}
