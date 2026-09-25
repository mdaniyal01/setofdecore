"use client";

import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json();
          setError(data.error ?? "Could not load audit logs.");
          return { logs: [] };
        }
        return r.json();
      })
      .then((data) => setLogs(data.logs ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-medium">Audit Logs</h1>
      <p className="mt-1 text-sm text-black/50">Super Admin only. A record of important actions across the store.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/50">
            <tr>
              <th className="px-4 py-3 font-normal">Action</th>
              <th className="px-4 py-3 font-normal">Entity</th>
              <th className="px-4 py-3 font-normal">Details</th>
              <th className="px-4 py-3 font-normal">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !error && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-black/40">No activity logged yet.</td></tr>
            )}
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3 text-black/60">{log.entity} {log.entityId ? `#${log.entityId.slice(-6)}` : ""}</td>
                <td className="px-4 py-3 text-black/50 text-xs">
                  {log.metadata ? JSON.stringify(log.metadata) : "—"}
                </td>
                <td className="px-4 py-3 text-black/50">{new Date(log.createdAt).toLocaleString("en-PK")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
