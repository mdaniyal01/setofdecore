import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface CustomerTokenPayload {
  customerId: string;
}

export function signCustomerToken(payload: CustomerTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyCustomerToken(token: string): CustomerTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomerTokenPayload;
  } catch {
    return null;
  }
}

export function getCustomerFromRequest(req: NextRequest): CustomerTokenPayload | null {
  const token = req.cookies.get("customer_token")?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}
