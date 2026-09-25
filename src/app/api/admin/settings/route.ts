import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import StoreSettings from "@/models/StoreSettings";

const SETTINGS_ID = "singleton";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "settings.manage");
    await connectDB();
    let settings = await StoreSettings.findById(SETTINGS_ID).lean();
    if (!settings) {
      settings = await StoreSettings.create({ _id: SETTINGS_ID }).then((s) => s.toObject());
    }
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function PUT(req: NextRequest) {
  try {
    requirePermission(req, "settings.manage");
    await connectDB();
    const body = await req.json();
    const settings = await StoreSettings.findByIdAndUpdate(SETTINGS_ID, body, { new: true, upsert: true });
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
