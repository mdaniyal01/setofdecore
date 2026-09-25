import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Inventory from "@/models/Inventory";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "inventory.manage");
    await connectDB();

    // Ensure every published product has an inventory row so the page
    // always shows something to edit, without forcing a separate "create" step.
    const products = await Product.find({ status: "published" }).select("name sku variants").lean();
    const existing = await Inventory.find({}).lean();
    const existingKeys = new Set(existing.map((i) => `${i.product}-${i.variantId ?? "base"}`));

    const toCreate = [];
    for (const p of products) {
      if (p.variants?.length) {
        for (const v of p.variants) {
          const key = `${p._id}-${v._id}`;
          if (!existingKeys.has(key)) toCreate.push({ product: p._id, variantId: v._id });
        }
      } else {
        const key = `${p._id}-base`;
        if (!existingKeys.has(key)) toCreate.push({ product: p._id });
      }
    }
    if (toCreate.length) await Inventory.insertMany(toCreate);

    const inventory = await Inventory.find({}).populate("product", "name sku variants").sort({ updatedAt: -1 }).lean();

    return NextResponse.json({ inventory });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
