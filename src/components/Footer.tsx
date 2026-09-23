import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/category/bedsheets", label: "Bedsheets" },
      { href: "/category/sofa-covers", label: "Sofa Covers" },
      { href: "/category/curtains", label: "Curtains" },
      { href: "/category/cushion-covers", label: "Cushion Covers" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping-policy", label: "Shipping" },
      { href: "/return-policy", label: "Returns" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/terms-and-conditions", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bgSecondary">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl">Set of Decore</p>
            <p className="mt-2 text-sm text-taupe">Home Textiles &amp; More</p>
            <div className="mt-5 flex gap-4 text-sm text-ink/70">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="TikTok">TikTok</a>
              <a href="#" aria-label="WhatsApp">WhatsApp</a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-ink/10 pt-6 text-xs text-taupe">
          © {new Date().getFullYear()} Set of Decore. Nationwide delivery across Pakistan.
        </p>
      </div>
    </footer>
  );
}
