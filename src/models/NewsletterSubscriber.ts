import { Schema, models, model } from "mongoose";

export interface INewsletterSubscriber {
  email: string;
  isActive: boolean;
  createdAt?: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.NewsletterSubscriber ||
  model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
