// Central formatting helpers. Every "unknown" path renders the em dash —
// never a fabricated number, never an empty string that could be mistaken
// for zero.

export const UNKNOWN = "—"; // —

export function fmtNumber(value: number | null | undefined, opts: Intl.NumberFormatOptions = {}): string {
  if (value === null || value === undefined || Number.isNaN(value)) return UNKNOWN;
  return new Intl.NumberFormat("en-US", opts).format(value);
}

export function fmtCompactUsd(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return UNKNOWN;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function fmtUsd(value: number | null | undefined, maxDigits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return UNKNOWN;
  const digits = Math.abs(value) < 1 ? Math.min(6, Math.max(maxDigits, 4)) : maxDigits;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

export function fmtPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return UNKNOWN;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function fmtGwei(weiValue: bigint | null | undefined): string {
  if (weiValue === null || weiValue === undefined) return UNKNOWN;
  const gwei = Number(weiValue) / 1e9;
  const rounded = Number(gwei.toFixed(gwei < 10 ? 2 : 1));
  return `${rounded} gwei`;
}

export function fmtAgeSeconds(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds) || seconds < 0) return UNKNOWN;
  if (seconds < 60) return `${Math.round(seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export function truncateAddress(address: string | null | undefined, lead = 6, tail = 4): string {
  if (!address) return UNKNOWN;
  if (address.length <= lead + tail + 2) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}
