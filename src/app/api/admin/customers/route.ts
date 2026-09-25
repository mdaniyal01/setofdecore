import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Customer from "@/models/Customer";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "customers.view");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(filter).select("-passwordHash").sort({ createdAt: -1 }).lean();

    const stats = await Order.aggregate([
      { $match: { customer: { $in: customers.map((c) => c._id) } } },
      { $group: { _id: "$customer", orderCount: { $sum: 1 }, totalSpend: { $sum: "$total" }, lastOrder: { $max: "$createdAt" } } },
    ]);
    const statsMap = new Map(stats.map((s) => [s._id.toString(), s]));

    const enriched = customers.map((c) => ({
      ...c,
      orderCount: statsMap.get(c._id.toString())?.orderCount ?? 0,
      totalSpend: statsMap.get(c._id.toString())?.totalSpend ?? 0,
      lastOrder: statsMap.get(c._id.toString())?.lastOrder ?? null,
    }));

    return NextResponse.json({ customers: enriched });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
