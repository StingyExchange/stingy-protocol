import type { MarketToken, Major } from "../sources/coingecko";
import { fmtPercent, fmtUsd } from "../format";

export interface TickerItem {
  symbol: string;
  price: number | null;
  changePct24h: number | null;
  token?: string;
}

export function buildTickerItems(majors: Major[] | null, tokens: MarketToken[]): TickerItem[] {
  const items: TickerItem[] = (majors ?? []).map((m) => ({ symbol: m.symbol, price: m.price, changePct24h: m.changePct24h }));
  for (const t of tokens) items.push({ symbol: t.symbol, price: t.price, changePct24h: t.changePct24h, token: t.id });
  return items;
}

function itemHtml(t: TickerItem): string {
  const up = (t.changePct24h ?? 0) >= 0;
  const inner = `
      <span class="ticker-symbol">${t.symbol}</span>
      <span class="ticker-price">${fmtUsd(t.price)}</span>
      <span class="ticker-change ${t.changePct24h === null ? "" : up ? "is-up" : "is-down"}">${fmtPercent(t.changePct24h)}</span>`;
  return t.token
    ? `<button type="button" class="ticker-item" data-token="${t.token}" aria-label="${t.symbol} details">${inner}</button>`
    : `<span class="ticker-item">${inner}</span>`;
}

export function renderTicker(): string {
  return `
    <div class="ticker" aria-label="Live prices">
      <div class="ticker-track" id="ticker-track">
        <span class="ticker-item ticker-item--loading">Reading the markets…</span>
      </div>
    </div>`;
}

export function updateTicker(items: TickerItem[]): void {
  const track = document.getElementById("ticker-track");
  if (!track || items.length === 0) return;
  track.innerHTML = [...items, ...items].map(itemHtml).join("");
  track.classList.add("ticker-track--live");
}
