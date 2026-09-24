"use client";

import { useEffect, useState } from "react";

const STATUSES = ["new", "in_progress", "resolved", "closed"];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  function load() {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Messages</h1>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && <p className="text-sm text-black/40">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m._id} className="border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{m.name} <span className="font-normal text-black/50">· {m.email}</span></p>
                {m.phone && <p className="text-xs text-black/40">{m.phone}</p>}
                {m.orderNumber && <p className="text-xs text-black/40">Order #{m.orderNumber}</p>}
              </div>
              <select
                value={m.status}
                onChange={(e) => updateStatus(m._id, e.target.value)}
                className="border border-black/15 bg-white px-2 py-1 text-xs capitalize"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
            <p className="mt-1 text-sm text-black/70">{m.message}</p>
            <p className="mt-2 text-xs text-black/40">{new Date(m.createdAt).toLocaleString("en-PK")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
