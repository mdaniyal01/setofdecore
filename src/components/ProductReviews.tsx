"use client";

import { useEffect, useState } from "react";

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, reviewText: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setAverageRating(data.averageRating ?? 0);
        setRatingCount(data.ratingCount ?? 0);
      });
  }

  useEffect(load, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(res.status === 401 ? "Please log in to leave a review." : data.error);
      return;
    }

    setMessage(data.message);
    setForm({ rating: 5, reviewText: "" });
    setShowForm(false);
  }

  return (
    <section className="mt-14 border-t border-ink/10 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Reviews</h2>
          {ratingCount > 0 ? (
            <p className="mt-1 text-sm text-ink/60">
              {"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}{" "}
              {averageRating} ({ratingCount} review{ratingCount === 1 ? "" : "s"})
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink/50">No reviews yet — be the first.</p>
          )}
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="border border-ink/20 px-4 py-2 text-sm hover:border-ink/60">
          Write a Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-3 border border-ink/10 p-5">
          <div>
            <label className="text-sm text-ink/70">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="mt-1 block border border-ink/20 bg-white px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)}</option>
              ))}
            </select>
          </div>
          <textarea
            required
            placeholder="Share your experience with this product…"
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            rows={3}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="bg-ink px-5 py-2 text-sm text-white hover:opacity-90">
            Submit Review
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}

      <div className="mt-8 divide-y divide-ink/10">
        {reviews.map((r) => (
          <div key={r._id} className="py-5">
            <p className="text-sm">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}{" "}
              <span className="ml-1 font-medium">{r.customerName}</span>
              {r.verifiedPurchase && (
                <span className="ml-2 text-xs text-green-700">Verified Purchase</span>
              )}
            </p>
            <p className="mt-1.5 text-sm text-ink/75">{r.reviewText}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
