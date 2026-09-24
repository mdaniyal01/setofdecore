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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-5xl leading-[1.1] md:text-7xl">
            Make Space Beautiful.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-taupe md:text-lg">
            Thoughtfully selected home textiles designed to bring comfort and
            character to every corner of your home.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="/shop"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Shop Collection
            </a>
            <a
              href="/shop?sort=newest"
              className="rounded-full border border-ink px-7 py-3.5 text-sm font-medium transition hover:bg-ink hover:text-white"
            >
              Explore New Arrivals
            </a>
          </div>
        </motion.div>
      </section>

      <CategoryGrid />
      <FeaturedProducts />
      <RoomInspiration />
      <BrandBenefits />
      <NewsletterSection />
    </main>
  );
}
