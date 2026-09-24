import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import BlogPost from "@/models/BlogPost";

const schema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "blog.manage");
    await connectDB();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ posts });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    requirePermission(req, "blog.manage");
    await connectDB();

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid post data." }, { status: 400 });

    const slug = slugify(parsed.data.title, { lower: true, strict: true });
    const post = await BlogPost.create({
      ...parsed.data,
      slug,
      publishedAt: parsed.data.status === "published" ? new Date() : undefined,
      seo: { title: parsed.data.title, description: parsed.data.excerpt },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.code === 11000) return NextResponse.json({ error: "A post with this title already exists." }, { status: 409 });
    throw err;
  }
}
