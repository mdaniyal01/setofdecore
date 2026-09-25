"use client";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Fires a GA4 e-commerce event if analytics is configured (NEXT_PUBLIC_GA_ID
 * set) and gtag has loaded. Silently does nothing otherwise — analytics
 * should never break the shopping experience. Uses the standard GA4
 * e-commerce event names (spec section 76).
 */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackViewItem(product: { _id: string; name: string; basePrice: number; salePrice?: number }) {
  trackEvent("view_item", {
    currency: "PKR",
    value: product.salePrice ?? product.basePrice,
    items: [{ item_id: product._id, item_name: product.name, price: product.salePrice ?? product.basePrice }],
  });
}

export function trackAddToCart(item: { productId: string; name: string; unitPrice: number; quantity: number }) {
  trackEvent("add_to_cart", {
    currency: "PKR",
    value: item.unitPrice * item.quantity,
    items: [{ item_id: item.productId, item_name: item.name, price: item.unitPrice, quantity: item.quantity }],
  });
}

export function trackBeginCheckout(subtotal: number) {
  trackEvent("begin_checkout", { currency: "PKR", value: subtotal });
}

export function trackPurchase(orderNumber: string, total: number) {
  trackEvent("purchase", { transaction_id: orderNumber, currency: "PKR", value: total });
}

export function trackSearch(query: string) {
  trackEvent("search", { search_term: query });
}

export function trackAddToWishlist(productId: string) {
  trackEvent("add_to_wishlist", { item_id: productId });
}
