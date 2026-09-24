import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Coupon from "@/models/Coupon";

const schema = z.object({
  code: z.string().min(3),
  type: z.enum(["percentage", "fixed", "free_delivery"]),
  value: z.number().min(0).default(0),
  minOrderAmount: z.number().optional(),
  usageLimit: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "coupons.manage");
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "coupons.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid coupon data." }, { status: 400 });

    const coupon = await Coupon.create({
      ...parsed.data,
      code: parsed.data.code.toUpperCase(),
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      isActive: true,
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    throw err;
  }
}
