import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import FAQ from "@/models/FAQ";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "faqs.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const faq = await FAQ.findByIdAndUpdate(id, body, { new: true });
    if (!faq) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    return NextResponse.json({ faq });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "faqs.manage");
    await connectDB();
    const { id } = await params;
    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
