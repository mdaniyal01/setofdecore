/**
 * Creates (or resets the password of) the first super_admin user.
 * Run with: npx tsx scripts/seed-admin.ts you@email.com yourPassword123
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../src/models/AdminUser";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function run() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: npx tsx scripts/seed-admin.ts you@email.com yourPassword123");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await AdminUser.findOneAndUpdate(
    { email },
    { name: "Store Owner", email, passwordHash, role: "super_admin", isActive: true },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${admin.email} (${admin.role})`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
