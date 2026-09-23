import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/models/Collection";

export async function GET() {
  await connectDB();
  const collections = await Collection.find({ isActive: true }).lean();
  return NextResponse.json({ collections });
}
