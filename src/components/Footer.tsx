import Link from "next/link";
import Image from "next/image";

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

const SOCIALS = [
  { label: "Instagram", href: "#", path: "M12 8.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6zM12 6a6 6 0 110 12 6 6 0 010-12zm6.4-.2a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM2 6.5A4.5 4.5 0 016.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11z" },
  { label: "Facebook", href: "#", path: "M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.2-1.5 1.6-1.5H17V3.6C16.5 3.5 15.3 3.4 14 3.4c-2.7 0-4.5 1.6-4.5 4.6v2h-3v3.1h3V21h4z" },
  { label: "TikTok", href: "#", path: "M14 3h2.3c.2 1.6 1.3 3 3 3.4V8.8c-1.1 0-2.1-.4-3-1v6.4a4.9 4.9 0 11-4.9-4.9c.2 0 .4 0 .6.1v2.2a2.7 2.7 0 102.1 2.6V3z" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bgSecondary">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-ink/10">
                <Image src="/images/logo-header-round.png" alt="Set of Decore" fill sizes="36px" className="object-cover" />
              </span>
              <p className="font-display text-xl">Set of Decore</p>
            </div>
            <p className="mt-2 text-sm text-taupe">Home Textiles &amp; More</p>

            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition hover:border-ink hover:text-ink"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
              <a
                href="https://wa.me/"
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition hover:border-ink hover:text-ink"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.2.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.6 2.8 1.7.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2 0 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.8-.1 1.5z" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-ink">
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
