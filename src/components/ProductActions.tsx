"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

interface Variant {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  color?: string;
  size?: string;
  availability: string;
}

export default function ProductActions({
  productId,
  slug,
  name,
  image,
  basePrice,
  salePrice,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  basePrice: number;
  salePrice?: number;
  variants: Variant[];
}) {
  const { addLine } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | undefined>(variants?.[0]?._id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants?.find((v) => v._id === variantId);
  const unitPrice = selectedVariant
    ? selectedVariant.salePrice ?? selectedVariant.price
    : salePrice ?? basePrice;
  const unavailable = selectedVariant?.availability === "out_of_stock";

  function buildLine() {
    return {
      productId,
      variantId,
      slug,
      name: selectedVariant ? `${name} — ${selectedVariant.name}` : name,
      image,
      unitPrice,
      quantity,
    };
  }

  function handleAddToCart() {
    addLine(buildLine());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addLine(buildLine());
    router.push("/cart");
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in the ${name} from Set of Decore.`
  );

  return (
    <div className="mt-6 space-y-5">
      {variants && variants.length > 0 && (
        <div>
          <p className="text-sm text-ink/70">Options</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v._id}
                onClick={() => setVariantId(v._id)}
                disabled={v.availability === "out_of_stock"}
                className={`rounded-full border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  variantId === v._id
                    ? "border-ink bg-ink text-white"
                    : "border-ink/20 text-ink hover:border-ink/60"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-ink/20">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-ink/70 hover:text-ink"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="px-3 py-2 text-ink/70 hover:text-ink"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <p className="text-sm text-taupe">Rs. {(unitPrice * quantity).toLocaleString()}</p>
      </div>

      {unavailable ? (
        <p className="text-sm text-ink/70">This option is currently unavailable.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            className="flex-1 border border-ink px-6 py-3 text-sm font-medium transition hover:bg-ink hover:text-white"
          >
            {added ? "Added to cart" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Buy Now
          </button>
        </div>
      )}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-ink/20 px-6 py-3 text-sm text-ink/80 transition hover:border-ink/60"
        >
          Ask about this on WhatsApp
        </a>
      )}
    </div>
  );
}
