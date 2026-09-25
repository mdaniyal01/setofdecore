import { Schema, models, model } from "mongoose";

export interface IAuditLog {
  admin: string;
  adminName?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    admin: { type: String, required: true },
    adminName: String,
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
