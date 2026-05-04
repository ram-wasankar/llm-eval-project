"use client";

import LoadingSpinner from "./LoadingSpinner";
import { LogEntry } from "../lib/types";
import { formatCost, formatLatency, scoreClass, truncate } from "../lib/utils";

type LogsTableProps = {
  logs: LogEntry[];
  loading: boolean;
  replayingId: number | null;
  onReplay: (id: number) => void;
  onView: (log: LogEntry) => void;
};

export default function LogsTable({
  logs,
  loading,
  replayingId,
  onReplay,
  onView
}: LogsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
        <span>Interaction logs</span>
        <span className="text-xs font-medium text-slate-400">
          {logs.length} total
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500">
          <LoadingSpinner />
          Loading logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="px-4 py-6 text-sm text-slate-500">
          No logs found. Send a prompt to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Prompt</th>
                <th className="px-4 py-3">Response</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Est. cost</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-100 hover:bg-slate-50/70"
                >
                  <td className="max-w-[220px] px-4 py-3">
                    {truncate(log.prompt, 80)}
                  </td>
                  <td className="max-w-[220px] px-4 py-3">
                    {truncate(log.response, 80)}
                  </td>
                  <td className={`px-4 py-3 font-semibold ${scoreClass(log.score)}`}>
                    {log.score.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">{formatLatency(log.latency)}</td>
                  <td className="px-4 py-3">{formatCost(log.estimated_cost)}</td>
                  <td className="px-4 py-3">v{log.version}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onReplay(log.id)}
                        disabled={replayingId === log.id}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {replayingId === log.id ? "Replaying..." : "Replay"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(log)}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        View details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
