import { Schema, models, model } from "mongoose";

export interface IFAQ {
  category: "Ordering" | "Delivery" | "Payment" | "Returns" | "Product Care" | "Sizing" | "Packaging";
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    category: {
      type: String,
      enum: ["Ordering", "Delivery", "Payment", "Returns", "Product Care", "Sizing", "Packaging"],
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.FAQ || model<IFAQ>("FAQ", FAQSchema);
