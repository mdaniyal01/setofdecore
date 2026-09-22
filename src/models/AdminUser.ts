import { Schema, models, model } from "mongoose";

export type AdminRole =
  | "super_admin"
  | "store_manager"
  | "order_manager"
  | "content_manager"
  | "marketing_manager"
  | "support_agent";

export interface IAdminUser {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: string[]; // fine-grained overrides on top of role defaults
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "super_admin",
        "store_manager",
        "order_manager",
        "content_manager",
        "marketing_manager",
        "support_agent",
      ],
      required: true,
    },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default models.AdminUser || model<IAdminUser>("AdminUser", AdminUserSchema);
