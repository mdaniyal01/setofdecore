import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Campaign from "@/models/Campaign";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  products: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "campaigns.manage");
    await connectDB();
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ campaigns });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "campaigns.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid campaign data." }, { status: 400 });

    const campaign = await Campaign.create({
      ...parsed.data,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      isActive: true,
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
