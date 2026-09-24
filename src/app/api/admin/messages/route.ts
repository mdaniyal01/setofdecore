import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import ContactMessage from "@/models/ContactMessage";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "messages.manage");
    await connectDB();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
