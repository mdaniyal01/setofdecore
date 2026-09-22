export default function HomePage() {
  return (
    <main>
      {/* Hero — content will come from HomepageSection CMS in a later phase */}
      <section className="relative flex min-h-[80vh] items-center justify-center bg-bgSecondary px-6 text-center">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Make Space Beautiful.
          </h1>
          <p className="mt-4 text-taupe md:text-lg">
            Thoughtfully selected home textiles designed to bring comfort and
            character to every corner of your home.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/shop"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Shop Collection
            </a>
            <a
              href="/shop?filter=new-arrivals"
              className="rounded-full border border-ink px-6 py-3 text-sm font-medium transition hover:bg-ink hover:text-white"
            >
              Explore New Arrivals
            </a>
          </div>
        </div>
      </section>

      {/* Category grid — placeholder until wired to /api/categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl md:text-3xl">Shop by Category</h2>
        <p className="mt-2 text-taupe">
          Bedsheets, sofa covers, curtains, and cushion covers — built out next.
        </p>
      </section>
    </main>
  );
}
