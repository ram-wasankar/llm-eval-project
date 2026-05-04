export type LogEntry = {
  id: number;
  prompt: string;
  response: string;
  latency: number;
  estimated_cost: number;
  score: number;
  timestamp: string;
  version: number;
};
