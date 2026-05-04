export function truncate(text: string, limit = 120): string {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit).trimEnd()}...`;
}

export function formatLatency(latency: number): string {
  return `${latency.toFixed(3)}s`;
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(6)} est.`;
}

export function scoreClass(score: number): string {
  if (score >= 8) {
    return "text-emerald-600";
  }
  if (score >= 5) {
    return "text-amber-600";
  }
  return "text-rose-600";
}
