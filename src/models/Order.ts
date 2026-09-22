import { Schema, models, model, Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "processing"
  | "procurement"
  | "quality_check"
  | "packaging"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded"
  | "failed_delivery";

export interface IOrderItem {
  product: Types.ObjectId;
  variantId?: Types.ObjectId;
  name: string;
  sku: string;
  image?: string;
  unitPrice: number; // captured server-side at order time
  quantity: number;
  lineTotal: number;
}

export interface IStatusHistoryEntry {
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  changedBy: string; // admin id or "system"
  note?: string;
  changedAt: Date;
}

export interface IOrder {
  orderNumber: string; // e.g. SD1001
  customer?: Types.ObjectId;
  guestInfo?: { name: string; phone: string; email?: string };
  items: IOrderItem[];

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: { code: string; amount: number };

  paymentMethod: "cod" | "bank_transfer" | "easypaisa" | "jazzcash" | "card";
  paymentStatus: "unpaid" | "paid" | "refunded" | "partially_refunded";
  orderStatus: OrderStatus;

  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    area?: string;
    addressLine: string;
    landmark?: string;
    postalCode?: string;
  };

  customerNotes?: string;
  adminNotes?: string;

  // Internal cost tracking, never exposed to customer
  costBreakdown?: {
    supplierCost: number;
    packagingCost: number;
    courierCost: number;
    paymentFees: number;
    otherCost: number;
    estimatedProfit: number;
  };

  statusHistory: IStatusHistoryEntry[];

  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: Schema.Types.ObjectId,
    name: { type: String, required: true },
    sku: { type: String, required: true },
    image: String,
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    fromStatus: String,
    toStatus: { type: String, required: true },
    changedBy: { type: String, required: true },
    note: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    guestInfo: {
      name: String,
      phone: String,
      email: String,
    },
    items: [OrderItemSchema],

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    coupon: {
      code: String,
      amount: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "easypaisa", "jazzcash", "card"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "partially_refunded"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "awaiting_confirmation",
        "confirmed",
        "processing",
        "procurement",
        "quality_check",
        "packaging",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
        "failed_delivery",
      ],
      default: "pending",
      index: true,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      area: String,
      addressLine: { type: String, required: true },
      landmark: String,
      postalCode: String,
    },

    customerNotes: String,
    adminNotes: String,

    costBreakdown: {
      supplierCost: { type: Number, default: 0 },
      packagingCost: { type: Number, default: 0 },
      courierCost: { type: Number, default: 0 },
      paymentFees: { type: Number, default: 0 },
      otherCost: { type: Number, default: 0 },
      estimatedProfit: { type: Number, default: 0 },
    },

    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
