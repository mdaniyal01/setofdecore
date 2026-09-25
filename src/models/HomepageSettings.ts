import { Schema, models, model } from "mongoose";

export interface IHomepageSettings {
  announcementText?: string;
  announcementEnabled: boolean;
  announcementLink?: string;

  heroHeading: string;
  heroSubtext: string;
  heroImageDesktop?: string;
  heroImageMobile?: string;
  heroPrimaryButtonText: string;
  heroPrimaryButtonUrl: string;
  heroSecondaryButtonText: string;
  heroSecondaryButtonUrl: string;
}

const HomepageSettingsSchema = new Schema<IHomepageSettings>(
  {
    announcementText: { type: String, default: "Nationwide Delivery Across Pakistan · Cash on Delivery Available" },
    announcementEnabled: { type: Boolean, default: true },
    announcementLink: String,

    heroHeading: { type: String, default: "Make Space Beautiful." },
    heroSubtext: {
      type: String,
      default:
        "Thoughtfully selected home textiles designed to bring comfort and character to every corner of your home.",
    },
    heroImageDesktop: String,
    heroImageMobile: String,
    heroPrimaryButtonText: { type: String, default: "Shop Collection" },
    heroPrimaryButtonUrl: { type: String, default: "/shop" },
    heroSecondaryButtonText: { type: String, default: "Explore New Arrivals" },
    heroSecondaryButtonUrl: { type: String, default: "/shop?sort=newest" },
  },
  { timestamps: true }
);

export default models.HomepageSettings || model<IHomepageSettings>("HomepageSettings", HomepageSettingsSchema);
