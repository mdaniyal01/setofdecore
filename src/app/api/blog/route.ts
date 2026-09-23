import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export async function GET() {
  await connectDB();
  const posts = await BlogPost.find({ status: "published" })
    .select("title slug excerpt featuredImage category publishedAt")
    .sort({ publishedAt: -1 })
    .lean();
  return NextResponse.json({ posts });
}
