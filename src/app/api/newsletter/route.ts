import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  await connectDB();
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  await NewsletterSubscriber.updateOne(
    { email: parsed.data.email.toLowerCase() },
    { $set: { isActive: true } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
