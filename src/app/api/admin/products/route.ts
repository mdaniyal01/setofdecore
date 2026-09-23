import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Product from "@/models/Product";

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  categories: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).default([]),
  material: z.string().optional(),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  careInstructions: z.string().optional(),
  supplier: z.string().optional(),
  supplierProductCode: z.string().optional(),
  supplierCost: z.number().optional(),
  internalNotes: z.string().optional(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  status: z.enum(["draft", "published", "unpublished", "scheduled"]).default("draft"),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "products.manage");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = 20;
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "products.manage");
    await connectDB();

    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data.", details: parsed.error.flatten() }, { status: 400 });
    }

    const slug = slugify(parsed.data.name, { lower: true, strict: true });
    const product = await Product.create({
      ...parsed.data,
      slug,
      seo: {
        title: `${parsed.data.name} | Set of Decore`,
        description: parsed.data.shortDescription,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) {
      return NextResponse.json({ error: "A product with this name or SKU already exists." }, { status: 409 });
    }
    throw err;
  }
}
