import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { AdminRole } from "@/models/AdminUser";
import { roleHasPermission } from "@/lib/permissions";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export interface AdminTokenPayload {
  adminId: string;
  role: AdminRole;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN as string) ?? "7d",
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the admin JWT from the request's cookies/Authorization
 * header, then checks the role against the required permission. Every admin
 * API route must call this — hiding a button in the UI is never sufficient,
 * because the API route itself must reject unauthorized calls.
 */
export function requirePermission(req: NextRequest, permission: string): AdminTokenPayload {
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("admin_token")?.value;
  const token = authHeader?.replace("Bearer ", "") ?? cookieToken;

  if (!token) throw new AuthError("Not authenticated", 401);

  const payload = verifyAdminToken(token);
  if (!payload) throw new AuthError("Invalid or expired session", 401);

  if (!roleHasPermission(payload.role, permission)) {
    throw new AuthError("You do not have permission to perform this action", 403);
  }

  return payload;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
