"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function load(q = "") {
    setLoading(true);
    fetch(`/api/admin/products?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Products</h1>
        <Link href="/admin/products/new" className="bg-black px-4 py-2 text-sm text-white hover:opacity-90">
          Add Product
        </Link>
      </div>

      <div className="mt-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            load(e.target.value);
          }}
          placeholder="Search by name or SKU…"
          className="w-72 border border-black/15 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-4 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">SKU</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Featured</th>
              <th className="px-4 py-3 font-normal">Updated</th>
            </tr>
          </thead>
          <tbody>
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black/40">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p._id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-black/60">{p.sku}</td>
                <td className="px-4 py-3">Rs. {(p.salePrice ?? p.basePrice).toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-black/60">
                  {new Date(p.updatedAt).toLocaleDateString("en-PK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
