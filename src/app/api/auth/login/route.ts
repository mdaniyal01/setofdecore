import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { verifyPassword } from "@/lib/auth";
import { signCustomerToken } from "@/lib/customerAuth";

const schema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }
  const { phone, password } = parsed.data;

  const customer = await Customer.findOne({ phone });
  if (!customer || !customer.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signCustomerToken({ customerId: customer._id.toString() });
  const res = NextResponse.json({
    customer: { id: customer._id, name: customer.name, phone: customer.phone, email: customer.email },
  });
  res.cookies.set("customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
