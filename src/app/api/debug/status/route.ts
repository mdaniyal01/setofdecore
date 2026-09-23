import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import Product from "@/models/Product";
import Category from "@/models/Category";

// TEMPORARY diagnostic route — DELETE before production. Returns no secrets,
// only counts and the connected database name, to help debug local setup.
export async function GET() {
  try {
    await connectDB();

    const [adminUsers, productCount, categoryCount] = await Promise.all([
      AdminUser.find({}).select("email role isActive createdAt").lean(),
      Product.countDocuments({}),
      Category.countDocuments({}),
    ]);

    return NextResponse.json({
      connectedDatabase: mongoose.connection.name,
      connectedHost: mongoose.connection.host,
      adminUserCount: adminUsers.length,
      adminUsers,
      productCount,
      categoryCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Could not connect to MongoDB.", details: err?.message },
      { status: 500 }
    );
  }
}
