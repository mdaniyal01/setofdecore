import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCustomerFromRequest } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  await connectDB();

  const payload = getCustomerFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Please log in to view your orders." }, { status: 401 });
  }

  const orders = await Order.find({ customer: payload.customerId })
    .select("orderNumber items total orderStatus paymentMethod createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ orders });
}
