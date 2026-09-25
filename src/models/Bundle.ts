import { Schema, models, model, Types } from "mongoose";

export interface IBundleItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IBundle {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt: string };
  items: IBundleItem[];
  bundlePrice: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BundleSchema = new Schema<IBundle>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    image: { url: String, alt: String },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    bundlePrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Bundle || model<IBundle>("Bundle", BundleSchema);
