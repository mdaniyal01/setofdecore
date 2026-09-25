import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Bundle from "@/models/Bundle";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  items: z.array(z.object({ product: z.string(), quantity: z.number().min(1) })).min(1),
  bundlePrice: z.number().min(0),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "bundles.manage");
    await connectDB();
    const bundles = await Bundle.find({}).populate("items.product", "name basePrice").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ bundles });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "bundles.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid bundle data." }, { status: 400 });

    const slug = slugify(parsed.data.name, { lower: true, strict: true });
    const bundle = await Bundle.create({ ...parsed.data, slug, isActive: true });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) return NextResponse.json({ error: "A bundle with this name already exists." }, { status: 409 });
    throw err;
  }
}
