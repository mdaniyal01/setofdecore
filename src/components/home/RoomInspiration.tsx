"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ROOMS = [
  {
    title: "Bedroom Refresh",
    description: "Small details. A completely different feeling.",
    href: "/category/bedsheets",
    cta: "Shop Bedsheets",
  },
  {
    title: "Living Room Layering",
    description: "New cushion covers change the whole room in a minute.",
    href: "/category/cushion-covers",
    cta: "Shop Cushion Covers",
  },
];

export default function RoomInspiration() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {ROOMS.map((room, i) => (
          <motion.div
            key={room.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative aspect-[4/3] overflow-hidden bg-bgSecondary"
          >
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 via-black/10 to-transparent p-8">
              <h3 className="font-display text-2xl text-white">{room.title}</h3>
              <p className="mt-1 text-sm text-white/85">{room.description}</p>
              <Link
                href={room.href}
                className="mt-4 inline-block w-fit border border-white px-5 py-2 text-sm text-white transition group-hover:bg-white group-hover:text-ink"
              >
                {room.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
