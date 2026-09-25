import { Schema, models, model, Types } from "mongoose";

export interface IReturn {
  order: Types.ObjectId;
  orderNumber: string;
  product: Types.ObjectId;
  customer?: Types.ObjectId;
  type: "return" | "exchange" | "damaged" | "wrong_item";
  reason: string;
  description?: string;
  images?: string[];
  status: "requested" | "approved" | "rejected" | "info_requested" | "received" | "exchanged" | "refunded";
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReturnSchema = new Schema<IReturn>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    type: { type: String, enum: ["return", "exchange", "damaged", "wrong_item"], required: true },
    reason: { type: String, required: true },
    description: String,
    images: [String],
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "info_requested", "received", "exchanged", "refunded"],
      default: "requested",
      index: true,
    },
    adminNotes: String,
  },
  { timestamps: true }
);

export default models.Return || model<IReturn>("Return", ReturnSchema);
