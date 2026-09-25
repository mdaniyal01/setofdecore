"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

export default function PurchaseTracker({ orderNumber, total }: { orderNumber: string; total: number }) {
  useEffect(() => {
    trackPurchase(orderNumber, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  return null;
}
