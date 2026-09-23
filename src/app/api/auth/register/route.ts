import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { hashPassword } from "@/lib/auth";
import { signCustomerToken } from "@/lib/customerAuth";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  await connectDB();

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const { name, phone, email, password } = parsed.data;

  const existing = await Customer.findOne({ phone });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this phone number already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const customer = await Customer.create({ name, phone, email, passwordHash, addresses: [], wishlist: [] });

  const token = signCustomerToken({ customerId: customer._id.toString() });
  const res = NextResponse.json({ customer: { id: customer._id, name, phone, email } }, { status: 201 });
  res.cookies.set("customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
