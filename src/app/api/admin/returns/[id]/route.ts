import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Return from "@/models/Return";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "returns.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const returnRequest = await Return.findByIdAndUpdate(id, body, { new: true });
    if (!returnRequest) return NextResponse.json({ error: "Return not found." }, { status: 404 });
    return NextResponse.json({ return: returnRequest });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
