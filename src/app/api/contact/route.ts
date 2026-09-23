import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
  orderNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required fields correctly." }, { status: 400 });
  }

  await ContactMessage.create({ ...parsed.data, status: "new" });

  return NextResponse.json({ success: true }, { status: 201 });
}
