import { Metadata } from "next";
import ShopClient from "./ShopClient";

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
  if (!res.ok) return { data: [], pagination: null };
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { data: products } = await getProducts(resolvedSearchParams);

  return <ShopClient initialProducts={products} initialSort={resolvedSearchParams.sort ?? "newest"} />;
}
