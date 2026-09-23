"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartLine {
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeLine: (productId: string, variantId?: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "setofdecore_cart";

function sameLine(a: { productId: string; variantId?: string }, b: { productId: string; variantId?: string }) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addLine(newLine: CartLine) {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, newLine));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, newLine) ? { ...l, quantity: l.quantity + newLine.quantity } : l
        );
      }
      return [...prev, newLine];
    });
  }

  function updateQuantity(productId: string, variantId: string | undefined, quantity: number) {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !sameLine(l, { productId, variantId }))
        : prev.map((l) => (sameLine(l, { productId, variantId }) ? { ...l, quantity } : l))
    );
  }

  function removeLine(productId: string, variantId?: string) {
    setLines((prev) => prev.filter((l) => !sameLine(l, { productId, variantId })));
  }

  function clear() {
    setLines([]);
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, addLine, updateQuantity, removeLine, clear, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
