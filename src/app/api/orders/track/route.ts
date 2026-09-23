import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/orders/track?orderNumber=SD1001&phone=03001234567
// Requires BOTH order number and the phone used at checkout, so a guessed
// order number alone can't reveal someone else's order details.
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Please provide both your order number and phone number." },
      { status: 400 }
    );
  }

  const order = await Order.findOne({
    orderNumber: orderNumber.toUpperCase(),
    $or: [{ "shippingAddress.phone": phone }, { "guestInfo.phone": phone }],
  })
    .select(
      "orderNumber items subtotal discount shippingFee total paymentMethod orderStatus statusHistory createdAt"
    )
    .lean();

  if (!order) {
    return NextResponse.json(
      { error: "We couldn't find an order matching those details." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
