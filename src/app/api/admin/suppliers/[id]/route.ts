import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Supplier from "@/models/Supplier";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "suppliers.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const supplier = await Supplier.findByIdAndUpdate(id, body, { new: true });
    if (!supplier) return NextResponse.json({ error: "Supplier not found." }, { status: 404 });
    return NextResponse.json({ supplier });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
