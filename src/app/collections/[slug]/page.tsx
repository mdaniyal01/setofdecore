import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

async function getCollection(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/collections/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const { collection } = await res.json();
  return collection;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.slug);
  if (!collection) return {};
  return {
    title: collection.seo?.title || collection.name,
    description: collection.seo?.description || collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = await getCollection(params.slug);
  if (!collection) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="border-b border-ink/10 pb-6">
        <h1 className="font-display text-3xl">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 max-w-2xl text-ink/70">{collection.description}</p>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {collection.products?.length === 0 && (
          <p className="col-span-full py-16 text-center text-taupe">
            No products in this collection yet.
          </p>
        )}
        {collection.products?.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
