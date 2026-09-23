import { Schema, models, model, Types } from "mongoose";

export interface ICoupon {
  code: string;
  type: "percentage" | "fixed" | "free_delivery";
  value: number; // percentage (0-100) or fixed Rs amount; ignored for free_delivery
  minOrderAmount?: number;
  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];
  firstOrderOnly?: boolean;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit?: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["percentage", "fixed", "free_delivery"], required: true },
    value: { type: Number, default: 0 },
    minOrderAmount: Number,
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    firstOrderOnly: { type: Boolean, default: false },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    perCustomerLimit: Number,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Coupon || model<ICoupon>("Coupon", CouponSchema);
