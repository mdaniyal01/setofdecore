import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Inventory from "@/models/Inventory";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "inventory.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const row = await Inventory.findByIdAndUpdate(id, body, { new: true });
    if (!row) return NextResponse.json({ error: "Inventory row not found." }, { status: 404 });
    return NextResponse.json({ inventory: row });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
