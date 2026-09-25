import { Schema, models, model, Types } from "mongoose";

export interface ICampaign {
  name: string;
  description?: string;
  banner?: { url: string; alt: string };
  products: Types.ObjectId[];
  discountPercent?: number;
  startDate?: Date;
  endDate?: Date;
  landingSlug?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    description: String,
    banner: { url: String, alt: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    discountPercent: Number,
    startDate: Date,
    endDate: Date,
    landingSlug: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Campaign || model<ICampaign>("Campaign", CampaignSchema);
