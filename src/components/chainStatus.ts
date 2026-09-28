import { register } from "../register";
import type { ChainSnapshot } from "../sources/chain";
import type { DexSnapshot, StablecoinSnapshot, TvlSnapshot } from "../sources/defillama";
import { fmtAgeSeconds, fmtCompactUsd, fmtGwei, fmtNumber, UNKNOWN } from "../format";

const STAT_KEYS = [
  "chain",
  "chainId",
  "rpc",
  "block",
  "blockAge",
  "gasPrice",
  "baseFee",
  "gasUsed",
  "tvl",
  "stables",
  "dex24h",
  "dex7d",
] as const;

type StatKey = (typeof STAT_KEYS)[number];

function stat(key: StatKey, label: string, value: string): string {
  return `
    <div class="stat reveal" data-stat="${key}">
      <span class="stat-label">${label}</span>
      <span class="stat-value" data-role="value">${value}</span>
    </div>
  `;
}

export function renderChainStatus(): string {
  const chainName = register.chainName.state === "stated" ? register.chainName.value! : UNKNOWN;
  const chainIdDec = register.chainIdDec.state === "stated" ? register.chainIdDec.value! : null;
  const chainIdHex = register.chainIdHex.state === "stated" ? register.chainIdHex.value! : UNKNOWN;
  const rpcHost = register.rpcUrl.state === "stated" ? new URL(register.rpcUrl.value!).host : UNKNOWN;

  return `
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">Robinhood Chain</p>
        <h2>Chain status</h2>
        <p class="section-sub">Block data read straight from the RPC every 15 seconds; TVL, stablecoins and DEX volume from DefiLlama.</p>
      </div>
      <p class="data-note" data-role="chain-note">Connecting…</p>
    </div>
    <div class="stat-grid" id="chain-status-grid">
      ${stat("chain", "Chain", chainName)}
      ${stat("chainId", "Chain ID", chainIdDec ? `${chainIdDec} (${chainIdHex})` : UNKNOWN)}
      ${stat("rpc", "RPC endpoint", rpcHost)}
      ${stat("block", "Block", UNKNOWN)}
      ${stat("blockAge", "Block age", UNKNOWN)}
      ${stat("gasPrice", "Gas price", UNKNOWN)}
      ${stat("baseFee", "Base fee", UNKNOWN)}
      ${stat("gasUsed", "Gas used", UNKNOWN)}
      ${stat("tvl", "Chain TVL", UNKNOWN)}
      ${stat("stables", "Stablecoins", UNKNOWN)}
      ${stat("dex24h", "DEX volume 24 h", UNKNOWN)}
      ${stat("dex7d", "DEX volume 7 d", UNKNOWN)}
    </div>
  `;
}

function setStat(grid: HTMLElement, key: StatKey, value: string): void {
  const el = grid.querySelector<HTMLElement>(`[data-stat="${key}"] [data-role="value"]`);
  if (!el) return;
  if (el.textContent === value) return;
  el.textContent = value;
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

export function updateChainStatus(snapshot: ChainSnapshot | null): void {
  const grid = document.getElementById("chain-status-grid");
  const note = document.querySelector<HTMLElement>('[data-role="chain-note"]');
  if (!grid) return;

  if (snapshot === null) {
    if (note) note.textContent = "RPC unreachable right now — showing last known state.";
    return;
  }

  const ageSeconds = (Date.now() - snapshot.blockTimestamp * 1000) / 1000;
  const gasPct =
    snapshot.gasUsed !== null && snapshot.gasLimit
      ? Math.round((snapshot.gasUsed / snapshot.gasLimit) * 100)
      : null;

  setStat(grid, "block", `#${fmtNumber(snapshot.blockNumber)}`);
  setStat(grid, "blockAge", fmtAgeSeconds(ageSeconds));
  setStat(grid, "gasPrice", fmtGwei(snapshot.gasPriceWei));
  setStat(grid, "baseFee", fmtGwei(snapshot.baseFeeWei));
  setStat(grid, "gasUsed", gasPct !== null ? `${gasPct}% of limit` : UNKNOWN);
  if (note) note.textContent = `Live · last read ${fmtAgeSeconds((Date.now() - snapshot.fetchedAt) / 1000)}`;
}

export function updateChainTvl(snapshot: TvlSnapshot | null): void {
  const grid = document.getElementById("chain-status-grid");
  if (!grid) return;
  setStat(grid, "tvl", snapshot ? fmtCompactUsd(snapshot.tvlUsd) : UNKNOWN);
}

export function updateChainDex(snapshot: DexSnapshot | null): void {
  const grid = document.getElementById("chain-status-grid");
  if (!grid) return;
  setStat(grid, "dex24h", snapshot ? fmtCompactUsd(snapshot.volume24h) : UNKNOWN);
  setStat(grid, "dex7d", snapshot ? fmtCompactUsd(snapshot.volume7d) : UNKNOWN);
}

export function updateChainStables(snapshot: StablecoinSnapshot | null): void {
  const grid = document.getElementById("chain-status-grid");
  if (!grid) return;
  setStat(grid, "stables", snapshot ? fmtCompactUsd(snapshot.circulatingUsd) : UNKNOWN);
}
