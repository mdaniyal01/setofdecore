import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const post = await BlogPost.findOne({ slug, status: "published" }).lean();
  if (!post) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }
  return NextResponse.json({ post });
}
