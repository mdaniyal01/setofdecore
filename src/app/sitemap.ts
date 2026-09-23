import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://setofdecore.store";

  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/track-order",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({ status: "published", "seo.noindex": { $ne: true } })
        .select("slug updatedAt")
        .lean(),
      Category.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    const productPages = products.map((p: any) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
    }));

    const categoryPages = categories.map((c: any) => ({
      url: `${siteUrl}/category/${c.slug}`,
      lastModified: c.updatedAt ?? new Date(),
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    // If the DB isn't reachable at build time, still emit the static pages.
    return staticPages;
  }
}
