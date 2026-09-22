import { Schema, models, model, Types } from "mongoose";

export interface IAddress {
  label?: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area?: string;
  addressLine: string;
  landmark?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface ICustomer {
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string; // omitted for guest customers
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  marketingConsent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: String,
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    area: String,
    addressLine: { type: String, required: true },
    landmark: String,
    postalCode: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, index: true },
    passwordHash: String,
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    marketingConsent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Customer || model<ICustomer>("Customer", CustomerSchema);
