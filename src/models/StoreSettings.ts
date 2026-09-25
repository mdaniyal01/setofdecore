import { Schema, models, model } from "mongoose";

export interface IStoreSettings {
  brandName: string;
  whatsappNumber?: string;
  supportEmail?: string;
  supportPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codEnabled: boolean;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    brandName: { type: String, default: "Set of Decore" },
    whatsappNumber: String,
    supportEmail: String,
    supportPhone: String,
    instagramUrl: String,
    facebookUrl: String,
    tiktokUrl: String,
    freeShippingThreshold: { type: Number, default: 3000 },
    standardShippingFee: { type: Number, default: 200 },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.StoreSettings || model<IStoreSettings>("StoreSettings", StoreSettingsSchema);
