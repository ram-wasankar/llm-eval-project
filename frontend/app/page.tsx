"use client";

import { useEffect, useState } from "react";

import ChartsPanel from "../components/ChartsPanel";
import DetailModal from "../components/DetailModal";
import FiltersBar, { FiltersState } from "../components/FiltersBar";
import LogsTable from "../components/LogsTable";
import PromptForm from "../components/PromptForm";
import { askPrompt, getLogs, replayLog } from "../lib/api";
import { LogEntry } from "../lib/types";

const initialFilters: FiltersState = {
  minScore: "",
  maxLatency: "",
  search: ""
};

export default function HomePage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [selected, setSelected] = useState<LogEntry | null>(null);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replayingId, setReplayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoadingLogs(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {};
      if (filters.minScore) {
        params.min_score = Number(filters.minScore);
      }
      if (filters.maxLatency) {
        params.max_latency = Number(filters.maxLatency);
      }
      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const data = await getLogs(params);
      setLogs(data);
    } catch (err) {
      setError("Unable to load logs. Check backend connectivity.");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleAsk = async (prompt: string) => {
    setSubmitting(true);
    setError(null);

    try {
      await askPrompt(prompt);
      await loadLogs();
    } catch (err) {
      setError("Unable to send prompt. Check backend connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplay = async (id: number) => {
    setReplayingId(id);
    setError(null);

    try {
      await replayLog(id);
      await loadLogs();
    } catch (err) {
      setError("Replay failed. Please try again.");
    } finally {
      setReplayingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Live LLM observability
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 md:text-5xl">
            LLM Observability & Eval Platform
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Log prompts, evaluate relevance, and inspect latency and estimated cost
            trends with real Gemini traffic.
          </p>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <PromptForm onSubmit={handleAsk} loading={submitting} />
          <ChartsPanel logs={logs} loading={loadingLogs} />
        </div>

        <div className="mt-8">
          <FiltersBar filters={filters} onChange={setFilters} />
          <LogsTable
            logs={logs}
            loading={loadingLogs}
            replayingId={replayingId}
            onReplay={handleReplay}
            onView={(log) => setSelected(log)}
          />
        </div>
      </div>

      <DetailModal log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
