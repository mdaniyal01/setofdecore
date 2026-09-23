import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/models/Collection";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();

  const collection = await Collection.findOne({ slug: params.slug, isActive: true })
    .populate({
      path: "products",
      match: { status: "published" },
      select:
        "-supplier -supplierProductCode -supplierCost -procurementTimeDays -internalNotes -costPrice -variants.costPrice",
    })
    .lean();

  if (!collection) {
    return NextResponse.json({ error: "Collection not found." }, { status: 404 });
  }

  return NextResponse.json({ collection });
}
