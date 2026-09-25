import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, hashPassword, AuthError } from "@/lib/auth";
import AdminUser from "@/models/AdminUser";
import { recordAuditLog } from "@/lib/auditLog";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    "super_admin", "store_manager", "order_manager",
    "content_manager", "marketing_manager", "support_agent",
  ]),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "admin_users.manage");
    await connectDB();
    const admins = await AdminUser.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ admins });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = requirePermission(req, "admin_users.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid admin user data." }, { status: 400 });

    const passwordHash = await hashPassword(parsed.data.password);
    const admin = await AdminUser.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      isActive: true,
    });

    await recordAuditLog({
      adminId: actor.adminId,
      action: "admin_user.created",
      entity: "AdminUser",
      entityId: admin._id.toString(),
      metadata: { email: admin.email, role: admin.role },
    });

    return NextResponse.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    throw err;
  }
}
