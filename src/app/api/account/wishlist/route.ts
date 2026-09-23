import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getCustomerFromRequest } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const payload = getCustomerFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const customer = await Customer.findById(payload.customerId)
    .populate({
      path: "wishlist",
      match: { status: "published" },
      select: "name slug images basePrice salePrice",
    })
    .lean();

  return NextResponse.json({ wishlist: customer?.wishlist ?? [] });
}

const bodySchema = z.object({ productId: z.string() });

export async function POST(req: NextRequest) {
  await connectDB();
  const payload = getCustomerFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid product." }, { status: 400 });

  await Customer.updateOne(
    { _id: payload.customerId },
    { $addToSet: { wishlist: parsed.data.productId } }
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const payload = getCustomerFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing productId." }, { status: 400 });

  await Customer.updateOne({ _id: payload.customerId }, { $pull: { wishlist: productId } });
  return NextResponse.json({ success: true });
}
