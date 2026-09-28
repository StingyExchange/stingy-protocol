import { register } from "../register";

export interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number | null;
  changePct24h: number | null;
  marketCap: number | null;
  volume24h: number | null;
  spark: number[];
}

export interface MarketPage {
  tokens: MarketToken[];
  total: number | null;
}

export interface Major {
  id: "ethereum" | "bitcoin";
  symbol: string;
  price: number | null;
  changePct24h: number | null;
}

export interface CoinDetail {
  id: string;
  contract: string | null;
  high24h: number | null;
  low24h: number | null;
  ath: number | null;
  circulating: number | null;
  pageUrl: string;
}

interface RawMarketRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  total_volume: number | null;
  sparkline_in_7d?: { price: number[] };
}

export function mapRow(row: RawMarketRow): MarketToken {
  return {
    id: row.id,
    symbol: row.symbol.toUpperCase(),
    name: row.name,
    image: row.image,
    price: row.current_price,
    changePct24h: row.price_change_percentage_24h,
    marketCap: row.market_cap,
    volume24h: row.total_volume,
    spark: row.sparkline_in_7d?.price ?? [],
  };
}

async function fetchMarketsByCategory(category: string, order: string, perPage: number): Promise<MarketPage | null> {
  try {
    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("category", category);
    url.searchParams.set("order", order);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "24h");
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const rows: RawMarketRow[] = await res.json();
    const totalHeader = Number(res.headers.get("total"));
    return { tokens: rows.map(mapRow), total: Number.isFinite(totalHeader) && totalHeader > 0 ? totalHeader : null };
  } catch {
    return null;
  }
}

/** Robinhood Chain tokenized stocks — fills the reference's "Stock Tokens" slot. */
export async function fetchStockTokens(limit = 24): Promise<MarketPage | null> {
  if (register.coingeckoStocksCategory.state !== "stated" || !register.coingeckoStocksCategory.value) return null;
  return fetchMarketsByCategory(register.coingeckoStocksCategory.value, "market_cap_desc", limit);
}

/** Robinhood Chain memecoins — fills the reference's "Trending now" slot. */
export async function fetchTrendingTokens(limit = 24): Promise<MarketPage | null> {
  if (register.coingeckoMemeCategory.state !== "stated" || !register.coingeckoMemeCategory.value) return null;
  return fetchMarketsByCategory(register.coingeckoMemeCategory.value, "volume_desc", limit);
}

/** ETH and BTC — fills the reference's "majors" slot. */
export async function fetchMajors(): Promise<Major[] | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true",
    );
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const json = await res.json();
    const pick = (id: "ethereum" | "bitcoin", symbol: string): Major => ({
      id,
      symbol,
      price: json?.[id]?.usd ?? null,
      changePct24h: json?.[id]?.usd_24h_change ?? null,
    });
    return [pick("ethereum", "ETH"), pick("bitcoin", "BTC")];
  } catch {
    return null;
  }
}

/** On-demand detail for the token modal. */
export async function fetchCoinDetail(id: string): Promise<CoinDetail | null> {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const j = await res.json();
    const platform = register.coingeckoPlatformId.value ?? "";
    return {
      id,
      contract: j?.platforms?.[platform] || null,
      high24h: j?.market_data?.high_24h?.usd ?? null,
      low24h: j?.market_data?.low_24h?.usd ?? null,
      ath: j?.market_data?.ath?.usd ?? null,
      circulating: j?.market_data?.circulating_supply ?? null,
      pageUrl: `https://www.coingecko.com/en/coins/${encodeURIComponent(id)}`,
    };
  } catch {
    return null;
  }
}
