import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;

  const product = await Product.findOne({ slug, status: "published" })
    .select(
      "-supplier -supplierProductCode -supplierCost -procurementTimeDays -internalNotes -costPrice -variants.costPrice"
    )
    .lean();

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}
