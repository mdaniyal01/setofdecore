"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ProductCardData {
  _id: string;
  slug: string;
  name: string;
  images: { url: string; alt: string }[];
  basePrice: number;
  salePrice?: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0];
  const onSale = product.salePrice && product.salePrice < product.basePrice;
  const discountPct = onSale
    ? Math.round((1 - product.salePrice! / product.basePrice) * 100)
    : 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bgSecondary shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-taupe">No image</div>
          )}
          {onSale && (
            <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 text-xs text-white">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="text-sm text-ink transition-colors group-hover:text-ink/70">{product.name}</h3>
        </div>
        <div className="mt-1 flex items-baseline gap-2 text-sm">
          {onSale ? (
            <>
              <span className="text-ink">Rs. {product.salePrice!.toLocaleString()}</span>
              <span className="text-taupe line-through">Rs. {product.basePrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-ink">Rs. {product.basePrice.toLocaleString()}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
