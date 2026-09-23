import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const { post } = await res.json();
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    alternates: { canonical: post.seo?.canonicalUrl || `/blog/${post.slug}` },
    openGraph: {
      images: post.seo?.ogImage ? [post.seo.ogImage] : post.featuredImage ? [post.featuredImage.url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {post.category && <p className="text-xs text-taupe">{post.category}</p>}
      <h1 className="mt-2 font-display text-3xl">{post.title}</h1>
      <p className="mt-2 text-sm text-taupe">
        {post.author} · {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.featuredImage?.url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-bgSecondary">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-ink/85">
        {post.content}
      </div>
    </main>
  );
}
