import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdminSession, AuthError } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";

export async function GET(req: NextRequest) {
  try {
    requireAdminSession(req);
    await connectDB();

    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      totalProducts,
      totalCustomers,
      revenueAgg,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ orderStatus: { $in: ["pending", "awaiting_confirmation", "confirmed", "processing"] } }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.countDocuments({ orderStatus: "returned" }),
      Product.countDocuments({}),
      Customer.countDocuments({}),
      Order.aggregate([
        { $match: { orderStatus: { $nin: ["cancelled", "refunded"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find({})
        .select("orderNumber shippingAddress.fullName guestInfo.name total paymentStatus orderStatus createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({
      cards: {
        totalRevenue: revenueAgg[0]?.total ?? 0,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        totalProducts,
        totalCustomers,
      },
      recentOrders,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
