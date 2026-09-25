import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import AdminUser from "@/models/AdminUser";
import { recordAuditLog } from "@/lib/auditLog";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = requirePermission(req, "admin_users.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const admin = await AdminUser.findByIdAndUpdate(id, body, { new: true }).select("-passwordHash");
    if (!admin) return NextResponse.json({ error: "Admin user not found." }, { status: 404 });

    await recordAuditLog({
      adminId: actor.adminId,
      action: "admin_user.permission_changed",
      entity: "AdminUser",
      entityId: id,
      metadata: body,
    });

    return NextResponse.json({ admin });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
