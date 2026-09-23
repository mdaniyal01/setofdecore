import { Schema, models, model } from "mongoose";

export interface IContactMessage {
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  orderNumber?: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true },
    subject: String,
    message: { type: String, required: true },
    orderNumber: String,
    status: { type: String, enum: ["new", "in_progress", "resolved", "closed"], default: "new" },
    adminNotes: String,
  },
  { timestamps: true }
);

export default models.ContactMessage || model<IContactMessage>("ContactMessage", ContactMessageSchema);
