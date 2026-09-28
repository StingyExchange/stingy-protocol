/** Thin wrapper around setInterval so refresh cadence is testable with fake timers. */
export function schedulePoll(task: () => void, intervalMs: number): () => void {
  const id = window.setInterval(task, intervalMs);
  return () => window.clearInterval(id);
}
