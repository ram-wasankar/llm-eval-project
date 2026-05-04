"use client";

type FiltersBarProps = {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
};

export type FiltersState = {
  minScore: string;
  maxLatency: string;
  search: string;
};

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-soft md:grid-cols-[1fr_auto_auto_auto] md:items-end">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Search prompt text
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Payments onboarding, summarization, compliance..."
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Min score
        </label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={filters.minScore}
          onChange={(event) =>
            onChange({ ...filters, minScore: event.target.value })
          }
          placeholder="6.5"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Max latency (s)
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={filters.maxLatency}
          onChange={(event) =>
            onChange({ ...filters, maxLatency: event.target.value })
          }
          placeholder="3.5"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({ minScore: "", maxLatency: "", search: "" })}
        className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        Clear
      </button>
    </div>
  );
}
