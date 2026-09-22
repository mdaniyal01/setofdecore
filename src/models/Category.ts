import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; alt: string };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: {
      url: { type: String },
      alt: { type: String },
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
