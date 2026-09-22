import { Schema, models, model } from "mongoose";

export interface ISupplier {
  supplierName: string;
  businessName?: string;
  phone: string;
  city?: string;
  address?: string;
  productCategories?: string[];
  paymentTerms?: string;
  wholesaleTerms?: string;
  notes?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    supplierName: { type: String, required: true },
    businessName: String,
    phone: { type: String, required: true },
    city: String,
    address: String,
    productCategories: [String],
    paymentTerms: String,
    wholesaleTerms: String,
    notes: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default models.Supplier || model<ISupplier>("Supplier", SupplierSchema);
