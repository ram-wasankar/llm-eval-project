import axios from "axios";

import { LogEntry } from "./types";

type LogsQuery = {
  min_score?: number;
  max_latency?: number;
  search?: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  timeout: 20000
});

export async function askPrompt(prompt: string): Promise<LogEntry> {
  const { data } = await api.post<LogEntry>("/ask", { prompt });
  return data;
}

export async function getLogs(query: LogsQuery = {}): Promise<LogEntry[]> {
  const { data } = await api.get<LogEntry[]>("/logs", { params: query });
  return data;
}

export async function replayLog(id: number): Promise<LogEntry> {
  const { data } = await api.post<LogEntry>(`/replay/${id}`);
  return data;
}
