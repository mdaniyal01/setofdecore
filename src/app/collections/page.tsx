import Link from "next/link";
import Image from "next/image";

async function getCollections() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/collections`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const { collections } = await res.json();
  return collections;
}

export default async function CollectionsIndexPage() {
  const collections = await getCollections();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl">Collections</h1>
      <p className="mt-2 text-taupe">Curated edits for specific rooms and moods.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {collections.length === 0 && (
          <p className="col-span-full py-16 text-center text-taupe">
            No collections published yet.
          </p>
        )}
        {collections.map((c: any) => (
          <Link key={c._id} href={`/collections/${c.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden bg-bgSecondary">
              {c.image?.url && (
                <Image
                  src={c.image.url}
                  alt={c.image.alt || c.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <h2 className="mt-3 font-display text-xl">{c.name}</h2>
            {c.description && <p className="mt-1 text-sm text-taupe">{c.description}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
