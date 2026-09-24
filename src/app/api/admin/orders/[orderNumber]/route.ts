import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Order, { OrderStatus } from "@/models/Order";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    requirePermission(req, "orders.manage");
    await connectDB();
    const { orderNumber } = await params;
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

const STATUS_VALUES: OrderStatus[] = [
  "pending", "awaiting_confirmation", "confirmed", "processing", "procurement",
  "quality_check", "packaging", "packed", "shipped", "out_for_delivery",
  "delivered", "cancelled", "returned", "refunded", "failed_delivery",
];

const updateSchema = z.object({
  orderStatus: z.enum(STATUS_VALUES as [OrderStatus, ...OrderStatus[]]).optional(),
  adminNotes: z.string().optional(),
  note: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const admin = requirePermission(req, "orders.manage");
    await connectDB();
    const { orderNumber } = await params;

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });

    const order = await Order.findOne({ orderNumber });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (parsed.data.orderStatus && parsed.data.orderStatus !== order.orderStatus) {
      order.statusHistory.push({
        fromStatus: order.orderStatus,
        toStatus: parsed.data.orderStatus,
        changedBy: admin.adminId,
        note: parsed.data.note,
        changedAt: new Date(),
      });
      order.orderStatus = parsed.data.orderStatus;
    }

    if (parsed.data.adminNotes !== undefined) {
      order.adminNotes = parsed.data.adminNotes;
    }

    await order.save();
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
