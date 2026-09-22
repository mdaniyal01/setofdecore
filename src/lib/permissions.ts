import { AdminRole } from "@/models/AdminUser";

// Every admin API route must call requirePermission() — hiding buttons in the UI
// is not sufficient. See src/lib/auth.ts.

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ["*"],
  store_manager: [
    "products.manage",
    "orders.manage",
    "customers.view",
    "suppliers.manage",
    "inventory.manage",
    "packaging.manage",
  ],
  order_manager: ["orders.manage", "customers.view", "returns.manage"],
  content_manager: [
    "homepage.manage",
    "banners.manage",
    "blog.manage",
    "faqs.manage",
    "reviews.manage",
  ],
  marketing_manager: ["coupons.manage", "campaigns.manage", "bundles.manage", "reports.view"],
  support_agent: ["orders.view", "customers.view", "messages.manage"],
};

export function roleHasPermission(role: AdminRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}
