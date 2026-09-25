import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "audit.view");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 30;

    const [logs, total] = await Promise.all([
      AuditLog.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      AuditLog.countDocuments({}),
    ]);

    return NextResponse.json({ logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
