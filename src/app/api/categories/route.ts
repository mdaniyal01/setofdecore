import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  return NextResponse.json({ categories });
}
