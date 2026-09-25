"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

export default function ViewItemTracker({
  product,
}: {
  product: { _id: string; name: string; basePrice: number; salePrice?: number };
}) {
  useEffect(() => {
    trackViewItem(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id]);

  return null;
}
