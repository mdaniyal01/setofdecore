import { Metadata } from "next";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse bedsheets, sofa covers, curtains and cushion covers from Set of Decore, with nationwide delivery across Pakistan.",
};

async function getProducts(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  if (searchParams.page) params.set("page", searchParams.page);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products?${params}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { data: [] as ProductCardData[], pagination: null };
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { data: products } = await getProducts(searchParams);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-baseline justify-between border-b border-ink/10 pb-6">
        <h1 className="font-display text-3xl">Shop All</h1>
        <p className="text-sm text-taupe">{products.length} products</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {products.length === 0 && (
          <p className="col-span-full py-16 text-center text-taupe">
            No products to show yet — check back soon.
          </p>
        )}
        {products.map((product: ProductCardData) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
