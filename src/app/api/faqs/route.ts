import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";

export async function GET() {
  await connectDB();
  const faqs = await FAQ.find({ isActive: true }).sort({ category: 1, displayOrder: 1 }).lean();
  return NextResponse.json({ faqs });
}
