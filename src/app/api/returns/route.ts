import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Return from "@/models/Return";
import { getCustomerFromRequest } from "@/lib/customerAuth";

const schema = z.object({
  orderNumber: z.string(),
  productId: z.string(),
  type: z.enum(["return", "exchange", "damaged", "wrong_item"]),
  reason: z.string().min(3),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const customerSession = getCustomerFromRequest(req);
  if (!customerSession) {
    return NextResponse.json({ error: "Please log in to request a return." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  // Verify the order actually belongs to this customer and contains this
  // product — never trust a client-supplied order/product pairing.
  const order = await Order.findOne({
    orderNumber: parsed.data.orderNumber.toUpperCase(),
    customer: customerSession.customerId,
    "items.product": parsed.data.productId,
  });

  if (!order) {
    return NextResponse.json({ error: "We couldn't match that order to your account." }, { status: 404 });
  }

  const returnRequest = await Return.create({
    order: order._id,
    orderNumber: order.orderNumber,
    product: parsed.data.productId,
    customer: customerSession.customerId,
    type: parsed.data.type,
    reason: parsed.data.reason,
    description: parsed.data.description,
    status: "requested",
  });

  return NextResponse.json({ return: returnRequest }, { status: 201 });
}
