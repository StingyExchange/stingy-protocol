import { register } from "../register";

export interface TvlSnapshot {
  tvlUsd: number;
  fetchedAt: number;
}

export interface DexSnapshot {
  volume24h: number | null;
  volume7d: number | null;
  change1d: number | null;
  fetchedAt: number;
}

export interface StablecoinSnapshot {
  circulatingUsd: number;
  fetchedAt: number;
}

/** Fetches chain TVL from DefiLlama's public chains list. Returns null on any failure. */
export async function fetchChainTvl(): Promise<TvlSnapshot | null> {
  if (register.defiLlamaChainSlug.state !== "stated" || !register.defiLlamaChainSlug.value) return null;
  const slug = register.defiLlamaChainSlug.value;
  try {
    const res = await fetch("https://api.llama.fi/v2/chains");
    if (!res.ok) throw new Error(`DefiLlama HTTP ${res.status}`);
    const chains: Array<{ name: string; tvl: number }> = await res.json();
    const match = chains.find((c) => c.name === slug);
    if (!match || typeof match.tvl !== "number") return null;
    return { tvlUsd: match.tvl, fetchedAt: Date.now() };
  } catch {
    return null;
  }
}

/** Chain-wide DEX volume — fills the reference's "Trading" stat trio with chain-level numbers. */
export async function fetchDexVolume(): Promise<DexSnapshot | null> {
  if (register.defiLlamaChainSlug.state !== "stated" || !register.defiLlamaChainSlug.value) return null;
  try {
    const slug = encodeURIComponent(register.defiLlamaChainSlug.value);
    const res = await fetch(
      `https://api.llama.fi/overview/dexs/${slug}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`,
    );
    if (!res.ok) throw new Error(`DefiLlama HTTP ${res.status}`);
    const j = await res.json();
    const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
    return { volume24h: num(j.total24h), volume7d: num(j.total7d), change1d: num(j.change_1d), fetchedAt: Date.now() };
  } catch {
    return null;
  }
}

export async function fetchStablecoins(): Promise<StablecoinSnapshot | null> {
  if (register.defiLlamaChainSlug.state !== "stated" || !register.defiLlamaChainSlug.value) return null;
  const slug = register.defiLlamaChainSlug.value;
  try {
    const res = await fetch("https://stablecoins.llama.fi/stablecoinchains");
    if (!res.ok) throw new Error(`DefiLlama HTTP ${res.status}`);
    const rows: Array<{ name: string; totalCirculatingUSD?: { peggedUSD?: number } }> = await res.json();
    const match = rows.find((r) => r.name === slug);
    const v = match?.totalCirculatingUSD?.peggedUSD;
    return typeof v === "number" ? { circulatingUsd: v, fetchedAt: Date.now() } : null;
  } catch {
    return null;
  }
}
