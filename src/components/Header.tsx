"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/category/bedsheets", label: "Bedsheets" },
  { href: "/category/sofa-covers", label: "Sofa Covers" },
  { href: "/category/curtains", label: "Curtains" },
  { href: "/category/cushion-covers", label: "Cushion Covers" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          className="text-ink md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <Link href="/" className="font-display text-xl tracking-tight">
          Set of Decore
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/80 transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/search" aria-label="Search" className="text-ink/80 hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 16l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/account" aria-label="Account" className="hidden text-ink/80 hover:text-ink md:block">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.5 16c1-3.5 4-5 6.5-5s5.5 1.5 6.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-ink/80 hover:text-ink">
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
              <path
                d="M2 2h2l1.6 9.6a1.5 1.5 0 0 0 1.48 1.25h7.24a1.5 1.5 0 0 0 1.48-1.25L17 5H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="16.5" r="1" fill="currentColor" />
              <circle cx="14" cy="16.5" r="1" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-ink/80"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
