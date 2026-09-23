import Coupon, { ICoupon } from "@/models/Coupon";
import { HydratedDocument } from "mongoose";

export interface PricedLine {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PricingResult {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponApplied?: { code: string; amount: number };
}

const FREE_SHIPPING_THRESHOLD = 3000; // Rs. — adjust from StoreSettings in a later phase
const STANDARD_SHIPPING_FEE = 200; // Rs.

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export class PricingError extends Error {}

/**
 * Validates a coupon code against current rules (active window, usage limits,
 * minimum order amount) and returns the discount amount in Rupees.
 * Throws PricingError with a customer-safe message on any invalid state.
 */
export async function validateAndPriceCoupon(
  code: string,
  subtotal: number,
  customerId?: string
): Promise<{ coupon: HydratedDocument<ICoupon>; amount: number }> {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon || !coupon.isActive) {
    throw new PricingError("This coupon is invalid or expired.");
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    throw new PricingError("This coupon is invalid or expired.");
  }
  if (coupon.endDate && now > coupon.endDate) {
    throw new PricingError("This coupon is invalid or expired.");
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new PricingError("This coupon is invalid or expired.");
  }
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    throw new PricingError(
      `This coupon requires a minimum order of Rs. ${coupon.minOrderAmount}.`
    );
  }
  // firstOrderOnly / perCustomerLimit checks require an Order lookup by
  // customerId — wired in once customer auth lands in the next phase.

  let amount = 0;
  if (coupon.type === "percentage") {
    amount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === "fixed") {
    amount = Math.min(coupon.value, subtotal);
  }
  // "free_delivery" type contributes 0 here; it zeroes shippingFee instead
  // (handled by the caller).

  return { coupon, amount };
}
