"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import LoadingSpinner from "./LoadingSpinner";
import { LogEntry } from "../lib/types";

type ChartsPanelProps = {
  logs: LogEntry[];
  loading: boolean;
};

export default function ChartsPanel({ logs, loading }: ChartsPanelProps) {
  const chartData = logs
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString(),
      latency: Number(log.latency.toFixed(3)),
      cost: Number(log.estimated_cost.toFixed(6))
    }));

  if (loading && logs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-slate-500">Loading charts...</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft">
      <div className="mb-4">
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Performance trends
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Latency and estimated cost over time.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No data yet. Send a prompt to populate charts.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Latency (s)
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#0ea5a4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Estimated cost ($)
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
