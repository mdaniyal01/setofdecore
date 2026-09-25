import AuditLog from "@/models/AuditLog";

/**
 * Records an admin action for the audit trail (spec section 54). Call this
 * after a mutation succeeds — never blocks the response on logging failure.
 */
export async function recordAuditLog(params: {
  adminId: string;
  adminName?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await AuditLog.create({
      admin: params.adminId,
      adminName: params.adminName,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      metadata: params.metadata,
    });
  } catch {
    // Audit logging must never break the primary action.
  }
}
