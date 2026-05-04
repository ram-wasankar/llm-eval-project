"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import LoadingSpinner from "./LoadingSpinner";

type PromptFormProps = {
  onSubmit: (prompt: string) => Promise<void> | void;
  loading: boolean;
};

export default function PromptForm({ onSubmit, loading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }
    await onSubmit(trimmed);
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-slate-900">
          New prompt
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Gemini 1.5 Flash
        </span>
      </div>

      <textarea
        rows={6}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask anything. Logs will capture latency, estimated cost, and evaluation."
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Every request is stored with prompt versioning and a relevance score.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoadingSpinner className="border-white/40 border-t-white" /> : null}
          Send prompt
        </button>
      </div>
    </form>
  );
}
