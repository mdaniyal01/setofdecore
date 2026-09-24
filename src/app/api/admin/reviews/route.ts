import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Review from "@/models/Review";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "reviews.manage");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = status ? { status } : {};

    const reviews = await Review.find(filter)
      .populate("product", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
