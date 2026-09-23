"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => (r.ok ? r.json() : { admin: null }))
      .then((data) => {
        if (!data.admin) {
          router.replace("/admin/login");
        } else {
          setAdmin(data.admin);
        }
      })
      .finally(() => setChecked(true));
  }, [router]);

  if (!checked || !admin) return null;

  async function handleLogout() {
    await fetch("/api/admin/auth/me", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F8] text-[#1A1A1A]">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-8 py-4">
          <p className="text-sm text-black/50">Signed in as {admin.name} · {admin.role.replace(/_/g, " ")}</p>
          <button onClick={handleLogout} className="text-sm text-black/50 hover:text-black">
            Log out
          </button>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
