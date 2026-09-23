import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const { product } = await res.json();
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};

  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.shortDescription,
    alternates: { canonical: product.seo?.canonicalUrl || `/product/${product.slug}` },
    openGraph: {
      title: product.seo?.title || product.name,
      description: product.seo?.description || product.shortDescription,
      images: product.seo?.ogImage ? [product.seo.ogImage] : product.images?.map((i: any) => i.url),
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const primaryImage = product.images?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.images?.map((i: any) => i.url),
    brand: { "@type": "Brand", name: "Set of Decore" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.salePrice ?? product.basePrice,
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-bgSecondary">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-3 text-ink/70">{product.shortDescription}</p>
          )}

          <ProductActions
            productId={product._id}
            slug={product.slug}
            name={product.name}
            image={primaryImage?.url}
            basePrice={product.basePrice}
            salePrice={product.salePrice}
            variants={product.variants ?? []}
          />

          {(product.material || product.careInstructions) && (
            <div className="mt-10 space-y-4 border-t border-ink/10 pt-6 text-sm">
              {product.material && (
                <div>
                  <p className="font-medium">Material</p>
                  <p className="mt-1 text-ink/70">{product.material}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <p className="font-medium">Care Instructions</p>
                  <p className="mt-1 text-ink/70">{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}

          {product.description && (
            <div className="mt-8 border-t border-ink/10 pt-6 text-sm text-ink/80">
              <p className="font-medium">Description</p>
              <p className="mt-2 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
