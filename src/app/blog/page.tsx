import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Home décor guides, styling ideas, and product care tips from Set of Decore.",
};

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const { posts } = await res.json();
  return posts;
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl">Journal</h1>
      <p className="mt-2 text-taupe">Home styling guides and ideas.</p>

      <div className="mt-10 divide-y divide-ink/10">
        {posts.length === 0 && (
          <p className="py-16 text-center text-taupe">No articles published yet.</p>
        )}
        {posts.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-5 py-6">
            {post.featuredImage?.url && (
              <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden bg-bgSecondary">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {post.category && <p className="text-xs text-taupe">{post.category}</p>}
              <h2 className="mt-1 font-display text-lg">{post.title}</h2>
              {post.excerpt && <p className="mt-1 text-sm text-ink/70">{post.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
