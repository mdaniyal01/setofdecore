import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requirePermission, AuthError } from "@/lib/auth";
import HomepageSettings from "@/models/HomepageSettings";

const SETTINGS_ID = "singleton";

export async function GET(req: NextRequest) {
  try {
    requirePermission(req, "homepage.manage");
    await connectDB();
    let settings = await HomepageSettings.findById(SETTINGS_ID).lean();
    if (!settings) {
      settings = await HomepageSettings.create({ _id: SETTINGS_ID }).then((s) => s.toObject());
    }
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function PUT(req: NextRequest) {
  try {
    requirePermission(req, "homepage.manage");
    await connectDB();
    const body = await req.json();
    const settings = await HomepageSettings.findByIdAndUpdate(SETTINGS_ID, body, { new: true, upsert: true });
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
