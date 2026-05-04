"use client";

import { LogEntry } from "../lib/types";
import { formatCost, formatLatency, scoreClass } from "../lib/utils";

type DetailModalProps = {
  log: LogEntry | null;
  onClose: () => void;
};

export default function DetailModal({ log, onClose }: DetailModalProps) {
  if (!log) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-slate-900">
            Log details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Prompt
            </p>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              {log.prompt}
            </pre>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Response
            </p>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              {log.response}
            </pre>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Score
            </span>
            <div className={`mt-1 text-lg font-semibold ${scoreClass(log.score)}`}>
              {log.score.toFixed(1)}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Latency
            </span>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {formatLatency(log.latency)}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Est. cost
            </span>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {formatCost(log.estimated_cost)}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Version
            </span>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              v{log.version}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Timestamp
            </span>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Log ID
            </span>
            <div className="mt-1 text-sm font-semibold text-slate-900">{log.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
