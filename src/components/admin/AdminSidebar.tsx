"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/collections", label: "Collections" },
    ],
  },
  {
    title: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" },
      { href: "/admin/coupons", label: "Coupons" },
    ],
  },
  {
    title: "Sourcing",
    items: [
      { href: "/admin/suppliers", label: "Suppliers" },
      { href: "/admin/procurement", label: "Procurement" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/reviews", label: "Reviews" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/admin-users", label: "Admin Users" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 border-r border-black/10 bg-white px-4 py-6">
      <p className="px-2 font-display text-lg">Set of Decore</p>
      <p className="px-2 text-xs text-black/40">Admin</p>

      <nav className="mt-8 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-[11px] font-medium uppercase tracking-wide text-black/35">
              {section.title}
            </p>
            <div className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded px-2 py-1.5 text-sm transition ${
                      active ? "bg-black/5 text-black" : "text-black/65 hover:bg-black/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
