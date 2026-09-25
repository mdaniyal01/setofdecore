import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import Campaign from "@/models/Campaign";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(req, "campaigns.manage");
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const campaign = await Campaign.findByIdAndUpdate(id, body, { new: true });
    if (!campaign) return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    return NextResponse.json({ campaign });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
