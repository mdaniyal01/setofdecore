import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Return from "@/models/Return";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "returns.manage");
    await connectDB();
    const returns = await Return.find({})
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ returns });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
