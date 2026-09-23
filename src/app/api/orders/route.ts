import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { nextOrderNumber } from "@/lib/orderNumber";
import { calculateShipping, validateAndPriceCoupon, PricingError } from "@/lib/pricing";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  couponCode: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    province: z.string().min(2),
    city: z.string().min(2),
    area: z.string().optional(),
    addressLine: z.string().min(5),
    landmark: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  guestInfo: z
    .object({
      name: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
    })
    .optional(),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["cod"]), // only COD is live in this phase
});

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the order details and try again.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items, couponCode, shippingAddress, guestInfo, customerNotes, paymentMethod } =
    parsed.data;

  // 1. Re-fetch every product/variant from the DB. The client only ever sends
  //    productId + quantity — price, name, SKU, image are always looked up
  //    server-side so a tampered request can never change what gets charged.
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await Product.find({
    _id: { $in: productIds },
    status: "published",
  }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "One of the items in your cart is no longer available." },
        { status: 409 }
      );
    }

    let unitPrice = product.salePrice ?? product.basePrice;
    let name = product.name;
    let sku = product.sku;
    let image = product.images?.[0]?.url;
    let availability: string = "in_stock";

    if (item.variantId) {
      const variant = product.variants?.find((v: any) => v._id.toString() === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `The selected option for "${product.name}" is no longer available.` },
          { status: 409 }
        );
      }
      unitPrice = variant.salePrice ?? variant.price;
      sku = variant.sku;
      name = `${product.name} — ${variant.name}`;
      if (variant.images?.[0]) image = variant.images[0];
      availability = variant.availability;
    }

    if (availability === "out_of_stock") {
      return NextResponse.json(
        { error: `"${name}" is currently unavailable.` },
        { status: 409 }
      );
    }

    const lineTotal = unitPrice * item.quantity;
    orderItems.push({
      product: product._id,
      variantId: item.variantId,
      name,
      sku,
      image,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.lineTotal, 0);

  // 2. Coupon — validated and priced server-side only.
  let discount = 0;
  let couponInfo: { code: string; amount: number } | undefined;
  let freeShipping = false;

  if (couponCode) {
    try {
      const { coupon, amount } = await validateAndPriceCoupon(couponCode, subtotal);
      discount = amount;
      freeShipping = coupon.type === "free_delivery";
      couponInfo = { code: coupon.code, amount };
    } catch (err) {
      if (err instanceof PricingError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }
  }

  // 3. Shipping + total — server-calculated.
  const shippingFee = freeShipping ? 0 : calculateShipping(subtotal - discount);
  const total = subtotal - discount + shippingFee;

  const orderNumber = await nextOrderNumber();

  const order = await Order.create({
    orderNumber,
    guestInfo,
    items: orderItems,
    subtotal,
    discount,
    shippingFee,
    total,
    coupon: couponInfo,
    paymentMethod,
    paymentStatus: "unpaid",
    orderStatus: "pending",
    shippingAddress,
    customerNotes,
    statusHistory: [
      {
        toStatus: "pending",
        changedBy: "system",
        note: "Order placed by customer.",
        changedAt: new Date(),
      },
    ],
  });

  // 4. Increment coupon usage count now that the order is confirmed to exist.
  if (couponInfo) {
    await (await import("@/models/Coupon")).default.updateOne(
      { code: couponInfo.code },
      { $inc: { usedCount: 1 } }
    );
  }

  return NextResponse.json(
    {
      orderNumber: order.orderNumber,
      total: order.total,
      orderStatus: order.orderStatus,
    },
    { status: 201 }
  );
}
