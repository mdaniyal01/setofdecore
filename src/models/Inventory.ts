import { Schema, models, model, Types } from "mongoose";

export interface IInventory {
  product: Types.ObjectId;
  variantId?: Types.ObjectId;
  available: number;
  reserved: number;
  procurementRequired: number;
  incoming: number;
  damaged: number;
  returned: number;
  unavailable: number;
  notes?: string;
  updatedAt?: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    variantId: Schema.Types.ObjectId,
    available: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    procurementRequired: { type: Number, default: 0 },
    incoming: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    returned: { type: Number, default: 0 },
    unavailable: { type: Number, default: 0 },
    notes: String,
  },
  { timestamps: true }
);

InventorySchema.index({ product: 1, variantId: 1 }, { unique: true });

export default models.Inventory || model<IInventory>("Inventory", InventorySchema);
