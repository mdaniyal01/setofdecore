/**
 * Demo seed data for local development. Clearly marked so it can be removed
 * before production (see README "Not yet built" / section 119 of the spec).
 * Run with: npx tsx scripts/seed.ts  (or ts-node)
 */
import "dotenv/config";
import mongoose from "mongoose";
import Category from "../src/models/Category";
import Product from "../src/models/Product";

const MONGODB_URI = process.env.MONGODB_URI as string;

const categories = [
  { name: "Bedsheets", slug: "bedsheets", description: "Cotton and blended bedsheets in solid, printed and floral designs.", displayOrder: 1 },
  { name: "Sofa Covers", slug: "sofa-covers", description: "Stretch and fitted sofa covers for 1 to 5 seater sofas.", displayOrder: 2 },
  { name: "Curtains", slug: "curtains", description: "Blackout and sheer curtains for living rooms and bedrooms.", displayOrder: 3 },
  { name: "Cushion Covers", slug: "cushion-covers", description: "Decorative cushion covers to layer and style any sofa or bed.", displayOrder: 4 },
  { name: "Pillow Covers", slug: "pillow-covers", description: "Soft, breathable pillow covers in matching bedsheet sets.", displayOrder: 5 },
];

const DEMO_IMAGE = {
  url: "https://res.cloudinary.com/demo/image/upload/v1690000000/samples/ecommerce/leather-bag-gray.jpg",
  alt: "Demo product image — replace before launch",
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected. Seeding demo data (DEMO CONTENT — remove before production)...");

  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(
    categories.map((c) => ({
      ...c,
      image: DEMO_IMAGE,
      seo: { title: `${c.name} | Set of Decore`, description: c.description },
      isActive: true,
    }))
  );

  const bedsheets = createdCategories.find((c) => c.slug === "bedsheets")!;
  const sofaCovers = createdCategories.find((c) => c.slug === "sofa-covers")!;

  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Floral Beige King Size Bedsheet",
      slug: "floral-beige-king-bedsheet",
      shortDescription: "A soft floral print in warm beige, sized for king beds.",
      description:
        "[DEMO CONTENT] Woven from breathable cotton blend fabric with a subtle floral print. Includes one bedsheet and two matching pillow covers.",
      sku: "SD-BED-001-K-BE",
      categories: [bedsheets._id],
      collections: [],
      tags: ["bedsheet", "king", "floral", "beige"],
      images: [DEMO_IMAGE],
      basePrice: 2999,
      salePrice: 2499,
      costPrice: 1400, // internal — never exposed to customer API
      variants: [
        { name: "King", sku: "SD-BED-001-K-BE", price: 2999, salePrice: 2499, costPrice: 1400, size: "King", color: "Beige", availability: "in_stock" },
        { name: "Double", sku: "SD-BED-001-D-BE", price: 2499, salePrice: 2199, costPrice: 1200, size: "Double", color: "Beige", availability: "in_stock" },
      ],
      material: "Cotton blend",
      colors: ["Beige"],
      sizes: ["King", "Double"],
      careInstructions: "Machine wash cold, do not bleach, tumble dry low.",
      returnEligible: true,
      supplierCost: 1400, // internal
      featured: true,
      newArrival: true,
      status: "published",
      seo: {
        title: "Floral Beige King Size Bedsheet | Set of Decore",
        description:
          "Shop the Floral Beige King Size Bedsheet from Set of Decore. Stylish home textiles with nationwide delivery in Pakistan.",
      },
    },
    {
      name: "Charcoal Grey Stretch Sofa Cover",
      slug: "charcoal-grey-stretch-sofa-cover",
      shortDescription: "A snug-fit stretch cover that instantly refreshes any sofa.",
      description: "[DEMO CONTENT] Elastic stretch fabric, machine washable, fits most 3-seater sofas.",
      sku: "SD-SOF-002-3S-CH",
      categories: [sofaCovers._id],
      collections: [],
      tags: ["sofa cover", "3 seater", "grey"],
      images: [DEMO_IMAGE],
      basePrice: 3499,
      variants: [
        { name: "3 Seater", sku: "SD-SOF-002-3S-CH", price: 3499, color: "Charcoal Grey", availability: "in_stock" },
        { name: "2 Seater", sku: "SD-SOF-002-2S-CH", price: 2799, color: "Charcoal Grey", availability: "in_stock" },
      ],
      material: "Polyester spandex blend",
      colors: ["Charcoal Grey"],
      careInstructions: "Machine wash cold, air dry.",
      returnEligible: true,
      featured: true,
      newArrival: true,
      status: "published",
      seo: {
        title: "Charcoal Grey Stretch Sofa Cover | Set of Decore",
        description: "Refresh your living room with the Charcoal Grey Stretch Sofa Cover from Set of Decore.",
      },
    },
  ]);

  console.log("Demo seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
