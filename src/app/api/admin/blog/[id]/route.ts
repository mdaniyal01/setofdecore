import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import BlogPost from "@/models/BlogPost";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "blog.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.status === "published") {
      const existing = await BlogPost.findById(id);
      if (existing && !existing.publishedAt) body.publishedAt = new Date();
    }

    const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "blog.manage");
    await connectDB();
    const { id } = await params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
