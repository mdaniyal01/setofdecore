import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { verifyPassword, signAdminToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const admin = await AdminUser.findOne({ email, isActive: true });
  // Constant-shaped response whether the user exists or not, to avoid
  // leaking which emails are registered.
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken({ adminId: admin._id.toString(), role: admin.role });

  const res = NextResponse.json({
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
