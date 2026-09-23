import { Schema, models, model } from "mongoose";
import { connectDB } from "@/lib/mongodb";

interface ICounter {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const Counter = models.Counter || model<ICounter>("Counter", CounterSchema);

/** Generates order numbers like SD1001, SD1002, ... using an atomic increment
 * so two simultaneous checkouts can never receive the same number. */
export async function nextOrderNumber(): Promise<string> {
  await connectDB();
  const counter = await Counter.findByIdAndUpdate(
    "orderNumber",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `SD${counter.seq}`;
}
