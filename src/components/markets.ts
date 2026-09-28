import type { MarketPage, MarketToken } from "../sources/coingecko";
import { fmtCompactUsd, fmtPercent, fmtUsd, UNKNOWN } from "../format";
import { renderSparkline } from "./sparkline";
import { openTokenModal } from "./modal";

export type TrendMode = "volume" | "gainers" | "losers";

const state = {
  stocks: [] as MarketToken[],
  trending: [] as MarketToken[],
  query: "",
  mode: "volume" as TrendMode,
};

export function sortTrending(tokens: MarketToken[], mode: TrendMode): MarketToken[] {
  const list = [...tokens];
  if (mode === "volume") return list.sort((a, b) => (b.volume24h ?? -1) - (a.volume24h ?? -1));
  const withChange = list.filter((t) => t.changePct24h !== null);
  return withChange.sort((a, b) =>
    mode === "gainers" ? (b.changePct24h as number) - (a.changePct24h as number) : (a.changePct24h as number) - (b.changePct24h as number),
  );
}

export function filterTokens(tokens: MarketToken[], query: string): MarketToken[] {
  const q = query.trim().toLowerCase();
  if (!q) return tokens;
  return tokens.filter((t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
}

function change(token: MarketToken): string {
  const up = (token.changePct24h ?? 0) >= 0;
  const arrow = token.changePct24h === null ? "" : up ? "▲" : "▼";
  return `<span class="token-change ${token.changePct24h === null ? "" : up ? "is-up" : "is-down"}"><span class="token-change-arrow">${arrow}</span>${fmtPercent(token.changePct24h)}</span>`;
}

function railCard(token: MarketToken, i: number): string {
  return `
    <li class="rail-item" style="--stagger:${i}">
      <button type="button" class="token-card" data-token="${token.id}" aria-label="${token.symbol} details">
        <span class="token-card-top">
          <img class="token-icon" src="${token.image}" alt="" width="32" height="32" loading="lazy" />
          <span class="token-id"><span class="token-symbol">${token.symbol}</span><span class="token-name">${token.name}</span></span>
        </span>
        <span class="token-card-spark">${renderSparkline(token.spark, 120, 36)}</span>
        <span class="token-card-bottom"><span class="token-price">${fmtUsd(token.price)}</span>${change(token)}</span>
        <span class="token-card-meta"><span>Mkt cap ${fmtCompactUsd(token.marketCap)}</span><span>Vol ${fmtCompactUsd(token.volume24h)}</span></span>
      </button>
    </li>`;
}

function rankRow(token: MarketToken, i: number): string {
  return `
    <li class="rank-item" style="--stagger:${i}">
      <button type="button" class="rank-row" data-token="${token.id}" aria-label="${token.symbol} details">
        <span class="rank-n">${i + 1}</span>
        <img class="token-icon" src="${token.image}" alt="" width="32" height="32" loading="lazy" />
        <span class="token-id"><span class="token-symbol">${token.symbol}</span><span class="token-name">${token.name}</span></span>
        <span class="rank-spark">${renderSparkline(token.spark, 84, 28)}</span>
        <span class="rank-price"><span class="token-price">${fmtUsd(token.price)}</span>${change(token)}</span>
        <span class="rank-vol">${fmtCompactUsd(token.volume24h)} in 24 h</span>
      </button>
    </li>`;
}

function skeleton(n: number, cls: string): string {
  return Array.from({ length: n }, (_, i) => `<li class="${cls} token-card--skeleton" style="--stagger:${i}" aria-hidden="true"></li>`).join("");
}

function sectionHead(eyebrow: string, title: string, sub: string, id: string): string {
  return `
    <div class="section-head reveal">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        <p class="section-sub">${sub}</p>
      </div>
      <p class="data-note" data-role="note" id="${id}-note">Loading live prices…</p>
    </div>
    <div class="pill-row reveal" id="${id}-pills"></div>`;
}

export function renderStocksSection(): string {
  return `
    ${sectionHead("Stock Tokens", "Robinhood stock tokens", "Tokenized equities on Robinhood Chain, priced against the market.", "stocks")}
    <div class="rail-toolbar reveal">
      <label class="search"><span class="visually-hidden">Filter stock tokens</span><input id="stocks-search" type="search" placeholder="Filter by name or ticker" autocomplete="off" /></label>
      <div class="rail-arrows">
        <button type="button" class="icon-btn" data-rail="-1" aria-label="Scroll stock tokens left">&larr;</button>
        <button type="button" class="icon-btn" data-rail="1" aria-label="Scroll stock tokens right">&rarr;</button>
      </div>
    </div>
    <ul class="rail" id="stocks-grid">${skeleton(8, "rail-item")}</ul>`;
}

export function renderTrendingSection(): string {
  return `
    ${sectionHead("Trending", "What is moving on Robinhood Chain", "Memecoins on the chain, ranked live.", "trending")}
    <div class="tabs reveal" role="tablist" aria-label="Sort trending tokens">
      ${(["volume", "gainers", "losers"] as TrendMode[])
        .map((m, i) => `<button type="button" role="tab" class="tab ${i === 0 ? "is-active" : ""}" data-mode="${m}" aria-selected="${i === 0}">${m === "volume" ? "Volume" : m === "gainers" ? "Gainers" : "Losers"}</button>`)
        .join("")}
    </div>
    <ol class="rank-list" id="trending-list">${skeleton(8, "rank-item")}</ol>`;
}

function setPills(id: string, pills: string[]): void {
  const el = document.getElementById(`${id}-pills`);
  if (el) el.innerHTML = pills.map((p) => `<span class="pill">${p}</span>`).join("");
}

function setNote(id: string, text: string): void {
  const el = document.getElementById(`${id}-note`);
  if (el) el.textContent = text;
}

const sumVolume = (t: MarketToken[]): number | null => (t.length ? t.reduce((a, x) => a + (x.volume24h ?? 0), 0) : null);

function paintStocks(): void {
  const rail = document.getElementById("stocks-grid");
  if (!rail) return;
  const list = filterTokens(state.stocks, state.query);
  rail.innerHTML = list.length
    ? list.map(railCard).join("")
    : `<li class="token-grid-empty">${UNKNOWN} ${state.query ? "No stock token matches that filter" : "Token data unavailable"}</li>`;
}

function paintTrending(): void {
  const list = document.getElementById("trending-list");
  if (!list) return;
  const rows = sortTrending(state.trending, state.mode).slice(0, 10);
  list.innerHTML = rows.length ? rows.map(rankRow).join("") : `<li class="token-grid-empty">${UNKNOWN} Token data unavailable</li>`;
}

export function updateStocks(page: MarketPage | null): void {
  const rail = document.getElementById("stocks-grid");
  if (!rail) return;
  if (page === null) {
    setNote("stocks", "CoinGecko unavailable right now — showing last known state.");
    if (rail.dataset.hydrated !== "true") rail.innerHTML = `<li class="token-grid-empty">${UNKNOWN} Token data unavailable</li>`;
    return;
  }
  state.stocks = page.tokens;
  rail.dataset.hydrated = "true";
  setNote("stocks", "Live via CoinGecko, refreshed every 60s");
  setPills("stocks", [
    `<b>${page.total ?? UNKNOWN}</b> Stock Tokens`,
    `<b>${fmtCompactUsd(sumVolume(page.tokens))}</b> 24 h volume, top ${page.tokens.length}`,
  ]);
  paintStocks();
}

export function updateTrending(page: MarketPage | null): void {
  const list = document.getElementById("trending-list");
  if (!list) return;
  if (page === null) {
    setNote("trending", "CoinGecko unavailable right now — showing last known state.");
    if (list.dataset.hydrated !== "true") list.innerHTML = `<li class="token-grid-empty">${UNKNOWN} Token data unavailable</li>`;
    return;
  }
  state.trending = page.tokens;
  list.dataset.hydrated = "true";
  setNote("trending", "Live via CoinGecko, refreshed every 60s");
  const top = sortTrending(page.tokens, "volume").slice(0, 10);
  setPills("trending", [`<b>${fmtCompactUsd(sumVolume(top))}</b> traded by these ${top.length} in 24 h`]);
  paintTrending();
}

export function mountMarkets(root: ParentNode): void {
  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const tokenBtn = target.closest<HTMLElement>("[data-token]");
    if (tokenBtn) {
      const id = tokenBtn.dataset.token;
      const token = [...state.stocks, ...state.trending].find((t) => t.id === id);
      if (token) openTokenModal(token);
      return;
    }
    const tab = target.closest<HTMLButtonElement>(".tab");
    if (tab?.dataset.mode) {
      state.mode = tab.dataset.mode as TrendMode;
      root.querySelectorAll<HTMLElement>(".tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      paintTrending();
      return;
    }
    const arrow = target.closest<HTMLElement>("[data-rail]");
    if (arrow) {
      const rail = document.getElementById("stocks-grid");
      const dir = Number(arrow.dataset.rail);
      rail?.scrollBy({ left: dir * Math.max(240, (rail.clientWidth || 600) * 0.8), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  });
  root.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.id === "stocks-search") {
      state.query = t.value;
      paintStocks();
    }
  });
}
