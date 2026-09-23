import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Category from "@/models/Category";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "products.manage");
    await connectDB();
    const categories = await Category.find({}).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "products.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid category data." }, { status: 400 });

    const slug = slugify(parsed.data.name, { lower: true, strict: true });
    const category = await Category.create({
      ...parsed.data,
      slug,
      seo: { title: `${parsed.data.name} | Set of Decore`, description: parsed.data.description },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
    throw err;
  }
}
