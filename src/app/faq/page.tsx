"use client";

import { useEffect, useState } from "react";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(data.faqs ?? []));
  }, []);

  const grouped: Record<string, any[]> = {};
  for (const faq of faqs) {
    grouped[faq.category] = grouped[faq.category] ? [...grouped[faq.category], faq] : [faq];
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl">Frequently Asked Questions</h1>

      {faqs.length === 0 && <p className="mt-8 text-taupe">No FAQs published yet.</p>}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mt-10">
          <h2 className="text-sm font-medium text-ink/60">{category}</h2>
          <div className="mt-3 divide-y divide-ink/10 border-t border-ink/10">
            {items.map((faq) => (
              <div key={faq._id}>
                <button
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm">{faq.question}</span>
                  <span className="text-ink/50">{openId === faq._id ? "−" : "+"}</span>
                </button>
                {openId === faq._id && (
                  <p className="pb-4 text-sm text-ink/70">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
