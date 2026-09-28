import { renderHeader, mountHeader } from "./components/header";
import { buildTickerItems, renderTicker, updateTicker } from "./components/ticker";
import { mountHero, renderCoinField, renderHero } from "./components/hero";
import { mountCaSlot } from "./components/caSlot";
import { mountRouteGraph } from "./components/routeGraph";
import {
  renderChainStatus,
  updateChainDex,
  updateChainStables,
  updateChainStatus,
  updateChainTvl,
} from "./components/chainStatus";
import { mountMarkets, renderStocksSection, renderTrendingSection, updateStocks, updateTrending } from "./components/markets";
import { renderAbout } from "./components/about";
import { renderFooter } from "./components/footer";
import { renderBottomBar, updateBottomBar } from "./components/bottomBar";
import { observeReveal } from "./dom";
import { schedulePoll } from "./poll";
import { fetchChainSnapshot } from "./sources/chain";
import { fetchChainTvl, fetchDexVolume, fetchStablecoins } from "./sources/defillama";
import { fetchMajors, fetchStockTokens, fetchTrendingTokens, type Major, type MarketToken } from "./sources/coingecko";

const RPC_REFRESH_MS = 15_000;
const TVL_REFRESH_MS = 10 * 60_000;
const MARKET_REFRESH_MS = 60_000;

function shell(): string {
  return `
    ${renderCoinField()}
    ${renderHeader()}
    ${renderTicker()}
    <main>
      ${renderHero()}
      <section class="panel" id="chain">${renderChainStatus()}</section>
      <section class="panel" id="stocks">${renderStocksSection()}</section>
      <section class="panel" id="trending">${renderTrendingSection()}</section>
      ${renderAbout()}
    </main>
    ${renderFooter()}
    ${renderBottomBar()}
  `;
}

async function pollRpc(): Promise<void> {
  const snapshot = await fetchChainSnapshot();
  updateChainStatus(snapshot);
  updateBottomBar(snapshot);
}

async function pollDefiLlama(): Promise<void> {
  const [tvl, dex, stables] = await Promise.all([fetchChainTvl(), fetchDexVolume(), fetchStablecoins()]);
  updateChainTvl(tvl);
  updateChainDex(dex);
  updateChainStables(stables);
}

let lastMajors: Major[] | null = null;
let lastTickerTokens: MarketToken[] = [];

async function pollMarkets(): Promise<void> {
  const [stocks, trending, majors] = await Promise.all([fetchStockTokens(), fetchTrendingTokens(), fetchMajors()]);
  updateStocks(stocks);
  updateTrending(trending);
  lastMajors = majors ?? lastMajors;
  if (stocks && trending) lastTickerTokens = [...stocks.tokens.slice(0, 6), ...trending.tokens.slice(0, 6)];
  updateTicker(buildTickerItems(lastMajors, lastTickerTokens));
}

export function mountApp(root: HTMLElement): void {
  root.innerHTML = shell();

  mountHeader(root);
  mountHero(root);
  mountCaSlot(root);
  mountRouteGraph(root);
  mountMarkets(document);
  observeReveal(root);

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  void pollRpc();
  void pollDefiLlama();
  void pollMarkets();

  schedulePoll(() => void pollRpc(), RPC_REFRESH_MS);
  schedulePoll(() => void pollDefiLlama(), TVL_REFRESH_MS);
  schedulePoll(() => void pollMarkets(), MARKET_REFRESH_MS);
}
