import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getCustomerFromRequest } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  await connectDB();

  const payload = getCustomerFromRequest(req);
  if (!payload) {
    return NextResponse.json({ customer: null });
  }

  const customer = await Customer.findById(payload.customerId).select("-passwordHash").lean();
  return NextResponse.json({ customer });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("customer_token");
  return res;
}
