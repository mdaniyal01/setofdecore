"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/category/bedsheets", label: "Bedsheets" },
  { href: "/category/sofa-covers", label: "Sofa Covers" },
  { href: "/category/curtains", label: "Curtains" },
  { href: "/category/cushion-covers", label: "Cushion Covers" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{ text?: string; enabled: boolean; link?: string } | null>(null);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setAnnouncement({
            text: data.settings.announcementText,
            enabled: data.settings.announcementEnabled,
            link: data.settings.announcementLink,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Utility strip: dark, dense, with a hairline accent rule beneath it */}
      {announcement?.enabled && announcement.text && (
        <div className="relative bg-ink py-2 text-center text-[11px] uppercase tracking-[0.2em] text-white/85">
          {announcement.link ? (
            <Link href={announcement.link}>{announcement.text}</Link>
          ) : (
            announcement.text
          )}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-bgSecondary/95 shadow-[0_1px_0_0_rgba(36,30,23,0.04)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <button
            className="text-ink md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo: layered ring + accent-colored inner border for a distinct mark */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-bg p-[3px] shadow-sm ring-1 ring-ink/10 transition group-hover:ring-accent/40">
              <span className="relative block h-full w-full overflow-hidden rounded-full ring-1 ring-accent/25">
                <Image src="/images/logo-header-round.png" alt="Set of Decore" fill sizes="48px" priority className="object-cover" />
              </span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[1.35rem] tracking-tight">Set of Decore</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-taupe">
                Home Textiles &amp; More
              </span>
            </span>
          </Link>

          <nav className="hidden gap-6 text-[13px] uppercase tracking-[0.08em] md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 text-ink/70 transition hover:text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/75 transition hover:bg-ink/5 hover:text-ink"
            >
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/75 transition hover:bg-ink/5 hover:text-ink md:flex"
            >
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3.25" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.5 16c1-3.5 4-5 6.5-5s5.5 1.5 6.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/75 transition hover:bg-ink/5 hover:text-ink"
            >
              <svg width="18" height="17" viewBox="0 0 19 18" fill="none">
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
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-ink/10 px-6 py-4 text-sm uppercase tracking-wide md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-ink/75"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
