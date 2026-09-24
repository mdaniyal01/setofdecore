import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import FAQ from "@/models/FAQ";

const CATEGORIES = ["Ordering", "Delivery", "Payment", "Returns", "Product Care", "Sizing", "Packaging"] as const;

const schema = z.object({
  category: z.enum(CATEGORIES),
  question: z.string().min(3),
  answer: z.string().min(3),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "faqs.manage");
    await connectDB();
    const faqs = await FAQ.find({}).sort({ category: 1, displayOrder: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "faqs.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid FAQ data." }, { status: 400 });

    const count = await FAQ.countDocuments({ category: parsed.data.category });
    const faq = await FAQ.create({ ...parsed.data, displayOrder: count, isActive: true });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
