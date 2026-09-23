import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "orders.manage");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;

    const filter: Record<string, unknown> = {};
    if (status) filter.orderStatus = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.phone": { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({ data: orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
