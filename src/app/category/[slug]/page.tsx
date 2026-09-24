import { Metadata } from "next";
import { notFound } from "next/navigation";
import AnimatedProductGrid from "@/components/AnimatedProductGrid";

async function getCategory(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const { categories } = await res.json();
  return categories.find((c: any) => c.slug === slug) ?? null;
}

async function getProducts(categoryId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?category=${categoryId}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const { data } = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(params.slug);
  if (!category) return {};
  return {
    title: category.seo?.title || category.name,
    description: category.seo?.description || category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  const products = await getProducts(category._id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-ink/10 pb-6">
        <h1 className="font-display text-3xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-ink/70">{category.description}</p>
        )}
      </div>

      <div className="mt-10">
        {products.length === 0 ? (
          <p className="py-16 text-center text-taupe">No products in this category yet.</p>
        ) : (
          <AnimatedProductGrid products={products} />
        )}
      </div>
    </main>
  );
}
