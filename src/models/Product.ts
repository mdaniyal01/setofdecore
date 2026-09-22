import { Schema, models, model, Types } from "mongoose";

export interface IVariant {
  name: string; // e.g. "King - Beige"
  sku: string;
  price: number;
  salePrice?: number;
  costPrice?: number; // internal only, never sent to client
  color?: string;
  size?: string;
  material?: string;
  weightGrams?: number;
  images?: string[];
  availability: "in_stock" | "out_of_stock" | "procurement_required";
}

export interface IProduct {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  sku: string;
  categories: Types.ObjectId[];
  collections: Types.ObjectId[];
  tags: string[];
  images: { url: string; alt: string; isPrimary?: boolean }[];
  videos?: string[];
  basePrice: number;
  salePrice?: number;
  costPrice?: number; // internal only
  variants: IVariant[];
  material?: string;
  colors?: string[];
  sizes?: string[];
  weightGrams?: number;
  careInstructions?: string;
  shippingInfo?: string;
  returnEligible: boolean;

  // Supplier fields - internal only, must never be exposed to customer-facing API
  supplier?: Types.ObjectId;
  supplierProductCode?: string;
  supplierCost?: number;
  procurementTimeDays?: number;
  internalNotes?: string;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  status: "draft" | "published" | "unpublished" | "scheduled";
  publishAt?: Date;

  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    noindex?: boolean;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: Number,
    costPrice: Number,
    color: String,
    size: String,
    material: String,
    weightGrams: Number,
    images: [String],
    availability: {
      type: String,
      enum: ["in_stock", "out_of_stock", "procurement_required"],
      default: "in_stock",
    },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: String,
    description: String,
    sku: { type: String, required: true, unique: true, index: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", index: true }],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    tags: { type: [String], index: true },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: Boolean,
      },
    ],
    videos: [String],
    basePrice: { type: Number, required: true },
    salePrice: Number,
    costPrice: Number,
    variants: [VariantSchema],
    material: String,
    colors: [String],
    sizes: [String],
    weightGrams: Number,
    careInstructions: String,
    shippingInfo: String,
    returnEligible: { type: Boolean, default: true },

    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    supplierProductCode: String,
    supplierCost: Number,
    procurementTimeDays: Number,
    internalNotes: String,

    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished", "scheduled"],
      default: "draft",
      index: true,
    },
    publishAt: Date,

    seo: {
      title: String,
      description: String,
      keywords: [String],
      canonicalUrl: String,
      ogImage: String,
      noindex: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Fields that must never reach customer-facing responses.
export const INTERNAL_ONLY_FIELDS = [
  "supplier",
  "supplierProductCode",
  "supplierCost",
  "procurementTimeDays",
  "internalNotes",
  "costPrice",
  "variants.costPrice",
] as const;

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default models.Product || model<IProduct>("Product", ProductSchema);
