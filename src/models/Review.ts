import { Schema, models, model, Types } from "mongoose";

export interface IReview {
  product: Types.ObjectId;
  customer?: Types.ObjectId;
  order?: Types.ObjectId; // used to verify purchase — never trust a client-sent flag
  customerName: string;
  rating: number;
  reviewText: string;
  images?: string[];
  verifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected" | "hidden";
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    images: [String],
    verifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected", "hidden"], default: "pending", index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Review || model<IReview>("Review", ReviewSchema);
