"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string }[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-bgSecondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {current && (
              <Image
                src={current.url}
                alt={current.alt || productName}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border transition ${
                active === i ? "border-ink" : "border-ink/15 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt={img.alt || productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
