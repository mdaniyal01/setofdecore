import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { requireAdminSession, AuthError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = requireAdminSession(req);
    await connectDB();
    const admin = await AdminUser.findById(payload.adminId).select("-passwordHash").lean();
    if (!admin) return NextResponse.json({ admin: null });
    return NextResponse.json({ admin });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ admin: null }, { status: err.status });
    }
    throw err;
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
