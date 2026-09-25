import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HomepageSettings from "@/models/HomepageSettings";

const SETTINGS_ID = "singleton";

export async function GET() {
  await connectDB();
  let settings = await HomepageSettings.findById(SETTINGS_ID).lean();
  if (!settings) {
    settings = await HomepageSettings.create({ _id: SETTINGS_ID }).then((s) => s.toObject());
  }
  return NextResponse.json({ settings });
}
