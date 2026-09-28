/** Pure path builder for a 7d price sparkline; returns "" when there is nothing real to draw. */
export function sparklinePath(values: number[], width: number, height: number, pad = 2): string {
  const pts = values.filter((v) => Number.isFinite(v));
  if (pts.length < 2) return "";
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const step = (width - pad * 2) / (pts.length - 1);
  return pts
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (height - pad * 2) * (1 - (v - min) / span);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
}

export function renderSparkline(values: number[], width = 96, height = 32, className = "spark"): string {
  const d = sparklinePath(values, width, height);
  if (!d) return `<span class="${className} ${className}--empty" aria-hidden="true">—</span>`;
  const up = values[values.length - 1] >= values[0];
  return `<svg class="${className} ${up ? "is-up" : "is-down"}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>`;
}
