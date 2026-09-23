import { Schema, models, model } from "mongoose";

export interface IBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: { url: string; alt: string };
  category?: string;
  author: string;
  status: "draft" | "published";
  publishedAt?: Date;
  seo: { title?: string; description?: string; ogImage?: string; canonicalUrl?: string };
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: String,
    featuredImage: { url: String, alt: String },
    category: String,
    author: { type: String, default: "Set of Decore" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: Date,
    seo: { title: String, description: String, ogImage: String, canonicalUrl: String },
  },
  { timestamps: true }
);

export default models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
