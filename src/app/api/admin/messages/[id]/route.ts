import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import ContactMessage from "@/models/ContactMessage";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "messages.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const message = await ContactMessage.findByIdAndUpdate(id, body, { new: true });
    if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
    return NextResponse.json({ message });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
