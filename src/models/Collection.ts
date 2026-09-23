import { Schema, models, model, Types } from "mongoose";

export interface ICollection {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt: string };
  products: Types.ObjectId[];
  seo: { title?: string; description?: string; keywords?: string[] };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    image: { url: String, alt: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    seo: { title: String, description: String, keywords: [String] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Collection || model<ICollection>("Collection", CollectionSchema);
