import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getCustomerFromRequest } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  const reviews = await Review.find({ product: productId, status: "approved" })
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  const ratingCount = reviews.length;
  const averageRating = ratingCount
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10
    : 0;

  return NextResponse.json({ reviews, averageRating, ratingCount });
}

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(5),
  customerName: z.string().min(2).optional(),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a rating and review text." }, { status: 400 });
  }

  const customerSession = getCustomerFromRequest(req);
  if (!customerSession) {
    return NextResponse.json({ error: "Please log in to leave a review." }, { status: 401 });
  }

  // Verified Purchase is determined here, server-side, by checking for a
  // delivered order containing this product for this customer — a client
  // can never claim verification for itself (per spec section 16/47).
  const deliveredOrder = await Order.findOne({
    customer: customerSession.customerId,
    orderStatus: "delivered",
    "items.product": parsed.data.productId,
  }).lean();

  const Customer = (await import("@/models/Customer")).default;
  const customer = await Customer.findById(customerSession.customerId).select("name").lean();

  const review = await Review.create({
    product: parsed.data.productId,
    customer: customerSession.customerId,
    order: deliveredOrder?._id,
    customerName: parsed.data.customerName || customer?.name || "Customer",
    rating: parsed.data.rating,
    reviewText: parsed.data.reviewText,
    verifiedPurchase: !!deliveredOrder,
    status: "pending",
  });

  return NextResponse.json({ review, message: "Thanks — your review will appear once it's approved." }, { status: 201 });
}
