"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [status, setStatus] = useState("pending");

  function load() {
    fetch(`/api/admin/reviews?status=${status}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []));
  }

  useEffect(load, [status]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Reviews</h1>

      <div className="mt-4 flex gap-2">
        {["pending", "approved", "rejected", "hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`border px-3 py-1.5 text-sm capitalize ${
              status === s ? "border-black bg-black text-white" : "border-black/15 text-black/60 hover:bg-black/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {reviews.length === 0 && <p className="text-sm text-black/40">No reviews here.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">
                  {r.customerName} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  {r.verifiedPurchase && (
                    <span className="ml-2 text-xs font-normal text-green-700">Verified Purchase</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-black/50">{r.product?.name}</p>
              </div>
              <p className="text-xs text-black/40">{new Date(r.createdAt).toLocaleDateString("en-PK")}</p>
            </div>
            <p className="mt-2 text-sm text-black/80">{r.reviewText}</p>

            <div className="mt-3 flex gap-3 text-sm">
              {r.status !== "approved" && (
                <button onClick={() => updateStatus(r._id, "approved")} className="text-green-700 hover:underline">
                  Approve
                </button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => updateStatus(r._id, "rejected")} className="text-red-700 hover:underline">
                  Reject
                </button>
              )}
              {r.status !== "hidden" && (
                <button onClick={() => updateStatus(r._id, "hidden")} className="text-black/60 hover:underline">
                  Hide
                </button>
              )}
              <button onClick={() => toggleFeatured(r._id, r.featured)} className="text-black/60 hover:underline">
                {r.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
