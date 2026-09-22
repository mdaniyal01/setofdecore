import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products?category=bedsheets&page=1&limit=24&sort=newest
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(48, Number(searchParams.get("limit") ?? 24));
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "newest";
  const q = searchParams.get("q");

  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.categories = category;
  if (q) filter.$text = { $search: q };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_low: { basePrice: 1 },
    price_high: { basePrice: -1 },
    featured: { featured: -1, createdAt: -1 },
  };

  const [items, total] = await Promise.all([
    Product.find(filter)
      // Never select internal/supplier/cost fields for the public API
      .select(
        "-supplier -supplierProductCode -supplierCost -procurementTimeDays -internalNotes -costPrice -variants.costPrice"
      )
      .sort(sortMap[sort] ?? sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
